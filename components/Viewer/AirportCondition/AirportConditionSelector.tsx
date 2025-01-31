'use client';
import React from 'react';
import {AirportWithConditions} from "@/components/Viewer/AirspaceViewer";
import {AppBar, Chip, Stack, Toolbar, Typography} from "@mui/material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import AirportConditionAddButton from "@/components/Viewer/AirportCondition/AirportConditionAddButton";
import {AirportCondition} from "@prisma/client";

export default function AirportConditionSelector({airports}: { airports: AirportWithConditions[], }) {

    const router = useRouter();
    const pathname = usePathname();
    const conditions = airports.flatMap(airport => airport.conditions);
    const searchParams = useSearchParams();
    const activeConditions = conditions.filter(condition => searchParams.get('conditions')?.split(',').includes(condition.id.toString()));

    const getAirport = (conditionId: string) => {
        return airports.find(airport => airport.conditions.some(condition => condition.id.toString() === conditionId));
    }

    const deleteCondition = (condition: AirportCondition) => {
        const newSearchParams = new URLSearchParams(searchParams);
        const activeConditionIds = newSearchParams.get('conditions')?.split(',') ?? [];
        newSearchParams.set('conditions', activeConditionIds.filter(id => id !== condition.id.toString()).join(','));
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    return (
        <AppBar position="static" elevation={1} sx={{ borderBottom: 1, }}>
            <Toolbar variant="dense">
                <AirportConditionAddButton allAirports={airports}/>
                <Stack direction="row" spacing={1} sx={{overflowX: 'auto', ml: 2,}}>
                    {activeConditions.map(condition => (
                        <Chip key={condition.id} color="success" size="small"
                              label={`${getAirport(condition.id)?.icao || ''}/${condition.name}`}
                              onDelete={() => deleteCondition(condition)}/>
                    ))}
                    {activeConditions.length === 0 &&
                        <Typography variant="subtitle1">No airport conditions set.</Typography>}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}