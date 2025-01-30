'use server';

import { NewMapping } from "@/components/Admin/MappingJson/MappingJsonForm";
import prisma from "@/lib/db";
import { after } from "next/server";
import { UTApi } from "uploadthing/server";
import { log } from "./log";
import { Prisma, SectorMapping } from "@prisma/client";
import { z } from "zod";
import { GridPaginationModel, GridSortModel, GridFilterItem } from "@mui/x-data-grid";
import { revalidatePath } from "next/cache";

const ut = new UTApi();

export const updateSectorMappingJsons = async (deleteIds: string[], newMappings: NewMapping[]) => {

    for (const id of deleteIds) {
        const mj = await prisma.mappingJson.delete({
            where: {
                id,
            },
        });

        if (mj) {
            await ut.deleteFiles(mj.jsonKey);
        }
    }

    let sectorMapping: SectorMapping | undefined;

    for (const mapping of newMappings) {

        const res = await ut.uploadFiles(mapping.file);
        
        if (res.error) {
            return false;
        }

        const mj = await prisma.mappingJson.create({
            data: {
                airportConditionId: mapping.airportConditionId,
                sectorMappingId: mapping.sectorMappingId,
                jsonKey: res.data.key,
            },
            include: {
                sectorMapping: true,
            },
        });

        if (!sectorMapping) {
            sectorMapping = mj.sectorMapping as SectorMapping;
        }
    }

    after(async () => {
        if (sectorMapping) {
            await log('UPDATE', 'SECTOR_MAPPING', `Updated sector mapping '${sectorMapping.name}' JSON files.`);
        }
    });

    if (sectorMapping) {
        revalidatePath(`/admin/facilities/${sectorMapping.radarFacilityId}/sectors/${sectorMapping.id}`);
    }

    return true;
}

export const createOrUpdateSectorMapping = async (formData: FormData) => {
    
    const smZ = z.object({
        id: z.string().optional(),
        radarFacilityId: z.string().nonempty("Radar Facility ID is required."),
        name: z.string().nonempty("Name is required."),
        idsRadarSectorId: z.string().nonempty("IDS Radar Sector ID is required."),
    });

    const result = smZ.safeParse({
        id: formData.get('id') as string,
        radarFacilityId: formData.get('radarFacilityId') as string,
        name: formData.get('name') as string,
        idsRadarSectorId: formData.get('idsRadarSectorId') as string,
    });

    if (!result.success) {
        return {errors: result.error.errors};
    }

    if (result.data.id) {
        const sm = await prisma.sectorMapping.update({
            where: {
                id: result.data.id,
            },
            data: {
                name: result.data.name,
                idsRadarSectorId: result.data.idsRadarSectorId,
            },
        });

        after(async () => {
            await log('UPDATE', 'SECTOR_MAPPING', `Updated sector mapping '${sm.name}'.`);
        });

        revalidatePath(`/admin/facilities/${sm.radarFacilityId}/sectors/${sm.id}`);

        return {sectorMapping: sm};
    } else {
        const sm = await prisma.sectorMapping.create({
            data: {
                radarFacilityId: result.data.radarFacilityId,
                name: result.data.name,
                idsRadarSectorId: result.data.idsRadarSectorId,
            },
        });

        after(async () => {
            await log('CREATE', 'SECTOR_MAPPING', `Created sector mapping '${sm.name}'.`);
        });

        return {sectorMapping: sm};
    }
}

export const fetchSectorMappings = async (pagination: GridPaginationModel, sort: GridSortModel, filter?: GridFilterItem) => {

    const orderBy: Prisma.SectorMappingOrderByWithRelationInput = {};

    if (sort.length > 0) {
        orderBy[sort[0].field as keyof Prisma.SectorMappingOrderByWithRelationInput] = sort[0].sort === 'asc' ? 'asc' : 'desc';
    }
    
    return prisma.$transaction([
        prisma.sectorMapping.count({
            where: getWhere(filter),
        }),
        prisma.sectorMapping.findMany({
            orderBy,
            where: getWhere(filter),
            take: pagination.pageSize,
            skip: pagination.page * pagination.pageSize,
        })
    ]);
}

const getWhere = (filter?: GridFilterItem): Prisma.SectorMappingWhereInput => {
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
        case 'idsRadarSectorId':
            return {
                idsRadarSectorId: {
                    [filter.operator]: filter.value as string,
                    mode: 'insensitive',
                }
            };
        default:
            return {};
    }
}

export const deleteSectorMapping = async (id: string) => {
    
    const sm = await prisma.sectorMapping.delete({
        where: {
            id,
        },
        include: {
            mappings: true,
        },
    });


    revalidatePath(`/admin/facilities/${sm.radarFacilityId}/sectors`);

    after(async () => {
        await ut.deleteFiles(sm.mappings.map(mj => mj.jsonKey));

        await log('DELETE', 'SECTOR_MAPPING', `Deleted sector mapping '${sm.name}'.`);
    });

}