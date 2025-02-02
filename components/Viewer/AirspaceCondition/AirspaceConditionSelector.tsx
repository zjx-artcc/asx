'use client';
import React, {useState} from 'react';
import {AirspaceContainerWithConditions} from "@/components/Viewer/AirspaceViewer";
import {Chip, Paper, Stack, Typography} from "@mui/material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import AirspaceConditionAddButton from "@/components/Viewer/AirspaceCondition/AirspaceConditionAddButton";
import {AirspaceCondition} from "@prisma/client";
import AirspaceConditionDialog from "@/components/Viewer/AirspaceCondition/AirspaceConditionDialog";

export default function AirspaceConditionSelector({containers}: { containers: AirspaceContainerWithConditions[], }) {

    const router = useRouter();
    const pathname = usePathname();
    const conditions = containers.flatMap(airport => airport.conditions);
    const searchParams = useSearchParams();
    const activeConditions = conditions.filter(condition => searchParams.get('conditions')?.split(',').includes(condition.id));

    const [editOpen, setEditOpen] = useState(false);
    const [editCondition, setEditCondition] = useState<AirspaceCondition | null>(null);

    const getAirport = (conditionId: string) => {
        return containers.find(airport => airport.conditions.some(condition => condition.id.toString() === conditionId));
    }

    const deleteCondition = (condition: AirspaceCondition) => {
        const newSearchParams = new URLSearchParams(searchParams);
        const activeConditionIds = newSearchParams.get('conditions')?.split(',') ?? [];
        newSearchParams.set('conditions', activeConditionIds.filter(id => id !== condition.id.toString()).join(','));
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    const closeEdit = () => {
        setEditOpen(false);
        setEditCondition(null);
    }

    const submitEdit = (conditionId: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        const activeConditionIds = newSearchParams.get('conditions')?.split(',') ?? [];
        newSearchParams.set('conditions', activeConditionIds.map(id => id === editCondition?.id ? conditionId : id).join(','));
        router.push(`${pathname}?${newSearchParams.toString()}`);
        closeEdit();
    }

    const getContainer = (conditionId?: string) => {
        return containers.find(container => container.conditions.some(condition => condition.id === conditionId));
    }

    return (
        <>
            <AirspaceConditionDialog open={editOpen} onClose={closeEdit} containerOptions={containers}
                                     defaultSelectedCondition={editCondition || undefined}
                                     defaultSelectedContainer={getContainer(editCondition?.id)} onSubmit={submitEdit}/>
            <Paper sx={{p: 0.5,}}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <AirspaceConditionAddButton allContainers={containers}/>
                    <Stack direction="row" spacing={1} sx={{overflowX: 'auto',}}>
                        {activeConditions.map(condition => (
                            <Chip key={condition.id}
                                  onClick={() => {
                                      setEditCondition(condition);
                                      setEditOpen(true);
                                  }}
                                  label={`${getAirport(condition.id)?.name || ''}/${condition.name}`}
                                  onDelete={() => deleteCondition(condition)}/>
                        ))}
                        {activeConditions.length === 0 &&
                            <Typography variant="subtitle1">Add airspace conditions here.</Typography>}
                    </Stack>
                </Stack>
            </Paper>
        </>


    );
}