'use server';

import prisma from "@/lib/db";
import {after} from "next/server";
import {log} from "@/actions/log";

export const updateDefaults = async (ids: string[]) => {

    await prisma.activeConsolidationsDefaultConditions.deleteMany();

    await prisma.activeConsolidationsDefaultConditions.create({
        data: {
            conditions: {
                connect: ids.map((id) => ({id})),
            },
        },
    });

    after(async () => {
        await log('UPDATE', 'AIRSPACE_CONDITION', 'Updated default active airspace conditions.');
    });

}