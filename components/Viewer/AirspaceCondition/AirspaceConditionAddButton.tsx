'use client';
import React, {useState} from 'react';
import {AirspaceContainerWithConditions} from "@/components/Viewer/AirspaceViewer";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {AirspaceCondition} from "@prisma/client";

export default function AirspaceConditionAddButton({allContainers,}: {
    allContainers: AirspaceContainerWithConditions[],
}) {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeConditionIds = searchParams.get('conditions')?.split(',') ?? [];
    const [open, setOpen] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState<AirspaceContainerWithConditions | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<AirspaceCondition | null>(null);

    const conditionedAirports = allContainers.flatMap(airport => airport.conditions).filter(condition => activeConditionIds.includes(condition.id));

    const disabled = conditionedAirports.length === allContainers.length;

    const close = () => {
        setOpen(false);
        setSelectedAirport(null);
        setSelectedCondition(null);
    }

    const submit = () => {
        if (!selectedAirport || !selectedCondition) return;

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('conditions', [...activeConditionIds, selectedCondition.id].join(','));

        close();
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    return (
        <>
            <Tooltip title="Add Airport Condition">
                <IconButton onClick={() => setOpen(true)} disabled={disabled}>
                    <Add/>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={close}>
                <DialogTitle>Add Airspace Condition</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <Autocomplete
                            options={allContainers.filter(airport => !conditionedAirports.some(condition => condition.containerId === airport.id))}
                            getOptionLabel={(option) => `${option.name}`}
                            onChange={(e, value) => {
                                setSelectedAirport(value);
                            }}
                            value={selectedAirport}
                            renderInput={(params) => <TextField {...params} label="Airspace/Airport" variant="filled"/>}
                        />

                        <Autocomplete
                            options={selectedAirport?.conditions || []}
                            disabled={!selectedAirport}
                            getOptionLabel={(option) => `${option.name}`}
                            onChange={(e, value) => {
                                setSelectedCondition(value);
                            }}
                            value={selectedCondition}
                            renderInput={(params) => <TextField {...params}
                                                                helperText="You must select an airport first."
                                                                label="Condition" variant="filled"/>}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} variant="outlined" color="inherit">Cancel</Button>
                    <Button onClick={submit} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}