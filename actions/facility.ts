'use server';
import { OrderItem } from "@/components/Admin/Order/OrderList";
import prisma from "@/lib/db";
import { after } from "next/server";
import { log } from "./log";
import { GridPaginationModel, GridSortModel, GridFilterItem } from "@mui/x-data-grid";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const ut = new UTApi();

export const fetchFacilities = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {

    const orderBy: Prisma.RadarFacilityOrderByWithRelationInput = {};
    if (sort.length > 0) {
        orderBy[sort[0].field as keyof Prisma.RadarFacilityOrderByWithRelationInput] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.radarFacility.count({
            where: getWhere(filter),
        }),
        prisma.radarFacility.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
        }),
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.RadarFacilityWhereInput => {
    if (!filter) {
        return {};
    }

    switch (filter.field) {
        case 'name':
            return {
                name: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                }
            };
        default:
            return {};
    }
}

export const updateFacilityOrder = async (items: OrderItem[]) => {
    for (const item of items) {
        await prisma.radarFacility.update({
            where: {
                id: item.id,
            },
            data: {
                order: item.order,
            },
        });
    }

    after(async () => {
        await log('UPDATE', 'RADAR_FACILITY', 'Updated facility order');
    }); 
}

export const deleteFacility = async (id: string) => {
    const facility = await prisma.radarFacility.delete({
        where: {
            id,
        },
        include: {
            sectors: {
                include: {
                    mappings: true,
                },
            },
        },
    });

    
    revalidatePath(`/admin/facilities`);

    after(async () => {

        for (const sector of facility.sectors) {
            await ut.deleteFiles(sector.mappings.map(mj => mj.jsonKey));
        }
    
        await log('DELETE', 'RADAR_FACILITY', `Deleted facility ${facility.name}`);
    });
}

export const createOrUpdateFacility = async (formData: FormData) => {

    const facilityZ = z.object({
        id: z.string().optional(),
        name: z.string().nonempty("Name is required"),
    });

    const result = facilityZ.safeParse({
        id: formData.get('id') as string,
        name: formData.get('name') as string,
    });

    if (!result.success) {
        return { errors: result.error.errors, };
    }

    if (result.data.id) {
        const facility = await prisma.radarFacility.update({
            where: {
                id: result.data.id,
            },
            data: {
                name: result.data.name,
            },
        });


        revalidatePath(`/admin/facilities/${facility.id}`);

        after(async () => {
            await log('UPDATE', 'RADAR_FACILITY', `Updated facility ${facility.name}`);
        });

        return { facility };
    } else {
        const facility = await prisma.radarFacility.create({
            data: {
                name: result.data.name,
            },
        });

        after(async () => {
            await log('CREATE', 'RADAR_FACILITY', `Created facility ${facility.name}`);
        });

        return { facility };
    }
}