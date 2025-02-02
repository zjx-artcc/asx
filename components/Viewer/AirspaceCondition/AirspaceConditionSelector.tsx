'use client';
import React from 'react';
import {AirspaceContainerWithConditions} from "@/components/Viewer/AirspaceViewer";
import {Chip, Paper, Stack, Typography} from "@mui/material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import AirspaceConditionAddButton from "@/components/Viewer/AirspaceCondition/AirspaceConditionAddButton";
import {AirspaceCondition} from "@prisma/client";

export default function AirspaceConditionSelector({airports}: { airports: AirspaceContainerWithConditions[], }) {

    const router = useRouter();
    const pathname = usePathname();
    const conditions = airports.flatMap(airport => airport.conditions);
    const searchParams = useSearchParams();
    const activeConditions = conditions.filter(condition => searchParams.get('conditions')?.split(',').includes(condition.id.toString()));

    const getAirport = (conditionId: string) => {
        return airports.find(airport => airport.conditions.some(condition => condition.id.toString() === conditionId));
    }

    const deleteCondition = (condition: AirspaceCondition) => {
        const newSearchParams = new URLSearchParams(searchParams);
        const activeConditionIds = newSearchParams.get('conditions')?.split(',') ?? [];
        newSearchParams.set('conditions', activeConditionIds.filter(id => id !== condition.id.toString()).join(','));
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    return (
        <Paper sx={{p: 0.5,}}>
            <Stack direction="row" spacing={1} alignItems="center">
                <AirspaceConditionAddButton allContainers={airports}/>
                <Stack direction="row" spacing={1} sx={{overflowX: 'auto',}}>
                    {activeConditions.map(condition => (
                        <Chip key={condition.id} size="small"
                              label={`${getAirport(condition.id)?.name || ''}/${condition.name}`}
                              onDelete={() => deleteCondition(condition)}/>
                    ))}
                    {activeConditions.length === 0 &&
                        <Typography variant="subtitle1">Add airspace conditions here.</Typography>}
                </Stack>
            </Stack>
        </Paper>

    );
}