'use server';

import prisma from "@/lib/db";
import { GridPaginationModel, GridSortModel, GridFilterItem } from "@mui/x-data-grid";
import { Prisma } from "@prisma/client";
import { after } from "next/server";
import { log } from "./log";
import { OrderItem } from "@/components/Admin/Order/OrderList";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const fetchAirports = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {
    const orderBy: Prisma.AirportOrderByWithRelationInput = {};

    if (sort.length > 0) {
        orderBy[sort[0].field as keyof Prisma.AirportOrderByWithRelationInput] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }

    return prisma.$transaction([
        prisma.airport.count({
            where: getWhere(filter),
        }),
        prisma.airport.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
            include: {
                conditions: true,
            },
        }),
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.AirportWhereInput => {
    if (!filter) {
        return {};
    }

    switch (filter.field) {
        case 'icao':
            return {
                icao: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                }
            };
        case 'conditions':
            return {
                conditions: {
                    some: {
                        name: {
                            [filter.operator]: filter.value as string,
                            mode: 'insensitive',
                        }
                    }
                }
            };
        default:
            return {};
    }
}

export const deleteAirport = async (id: string) => {
    const airport = await prisma.airport.delete({
        where: {
            id,
        },
    });

    after(async () => {
        await log('DELETE', 'AIRPORT', `Deleted airport ${airport.icao}`);
    });
}

export const updateAirportOrder = async (items: OrderItem[]) => {
    for (const item of items) {
        await prisma.airport.update({
            where: {
                id: item.id,
            },
            data: {
                order: item.order,
            },
        });
    }

    after(async () => {
        await log('UPDATE', 'AIRPORT', 'Updated airport order');
    });
}

export const createOrUpdateAirport = async (data: FormData) => {

    const airportZ = z.object({
        id: z.string().optional(),
        icao: z.string().nonempty("ICAO is required"),
        conditions: z.array(z.string()).nonempty("Conditions are required"),
    });

    const result = airportZ.safeParse({
        id: data.get('id') as string,
        icao: data.get('icao') as string,
        conditions: (data.get('conditions') as string)?.split(',').map((c) => c.trim()) || [],
    });

    if (!result.success) {
        return { errors: result.error.errors, };
    }

    if (result.data.id) {

        // Get current conditions
        const currentConditions = await prisma.airportCondition.findMany({
            where: {
                airportId: result.data.id,
            },
        });

        // Delete only conditions that are not in the new list
        await prisma.airportCondition.deleteMany({
            where: {
                AND: [
                    { airportId: result.data.id },
                    { name: { notIn: result.data.conditions } }
                ]
            },
        });

        // Get existing condition names to avoid duplicates
        const existingConditionNames = currentConditions.map(c => c.name);
        
        const airport = await prisma.airport.update({
            where: {
                id: result.data.id,
            },
            data: {
                icao: result.data.icao,
                conditions: {
                    create: result.data.conditions
                        .filter(name => !existingConditionNames.includes(name))
                        .map((c) => ({ name: c })),
                },
            },
            include: {
                conditions: true,
            },
        });

        after(async () => {
            await log('UPDATE', 'AIRPORT', `Updated airport ${airport.icao}`);
        });

        revalidatePath(`/admin/airports/${airport.id}`);

        return { airport };
    } else {
        const airport = await prisma.airport.create({
            data: {
                icao: result.data.icao,
                conditions: {
                    create: result.data.conditions.map((c) => ({ name: c })),
                },
            },
            include: {
                conditions: true,
            },
        });

        after(async () => {
            await log('CREATE', 'AIRPORT', `Created airport ${airport.icao}`);
        });

        return { airport };
    }

}