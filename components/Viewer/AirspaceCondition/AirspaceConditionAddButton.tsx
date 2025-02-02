'use client';
import React, {useState} from 'react';
import {AirspaceContainerWithConditions} from "@/components/Viewer/AirspaceViewer";
import {IconButton, Tooltip} from "@mui/material";
import {Add} from "@mui/icons-material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import AirspaceConditionDialog from "@/components/Viewer/AirspaceCondition/AirspaceConditionDialog";

export default function AirspaceConditionAddButton({allContainers,}: {
    allContainers: AirspaceContainerWithConditions[],
}) {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeConditionIds = searchParams.get('conditions')?.split(',') ?? [];
    const [open, setOpen] = useState(false);

    const conditionedAirports = allContainers.flatMap(airport => airport.conditions).filter(condition => activeConditionIds.includes(condition.id));

    const disabled = conditionedAirports.length === allContainers.length;

    const submit = (conditionId: string) => {

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('conditions', [...activeConditionIds, conditionId].join(','));

        router.push(`${pathname}?${newSearchParams.toString()}`);
        close();
    }

    const close = () => {
        setOpen(false);
    }

    return (
        <>
            <Tooltip title="Add Airport Condition">
                <IconButton onClick={() => setOpen(true)} disabled={disabled}>
                    <Add/>
                </IconButton>
            </Tooltip>
            <AirspaceConditionDialog open={open} onClose={close}
                                     containerOptions={allContainers.filter(container => !conditionedAirports.some(condition => condition.containerId === container.id))}
                                     onSubmit={submit}/>
        </>
    );
}