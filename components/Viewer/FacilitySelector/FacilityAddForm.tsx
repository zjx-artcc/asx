'use client';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {RadarFacility} from "@prisma/client";
import {Autocomplete, Box, IconButton, Stack, TextField,} from "@mui/material";
import Form from "next/form";
import {Add} from "@mui/icons-material";
import {toast} from "react-toastify";
import {useSearchParams} from "next/navigation";

export default function FacilityAddForm({facilities, onSubmit}: {
    facilities: RadarFacility[],
    onSubmit: (facilityId: string) => void,
}) {

    const searchParams = useSearchParams();
    const [availableFacilities, setAvailableFacilities] = useState<RadarFacility[]>(facilities);
    const [selectedFacility, setSelectedFacility] = useState<RadarFacility | null>(null);

    useEffect(() => {
        const activeFacilityIds = searchParams.get('facilities')?.split(',') ?? [];
        const availableFacilities = facilities.filter(facility => !activeFacilityIds.includes(facility.id));
        setAvailableFacilities(availableFacilities);
    }, [facilities, searchParams]);

    const handleChange = (event: SyntheticEvent, value: RadarFacility | null) => {
        setSelectedFacility(value);
    }

    const handleSubmit = () => {
        if (!selectedFacility || !availableFacilities.flatMap((f) => f.id).includes(selectedFacility.id)) {
            toast.error('You must select a valid facility.');
            return;
        }

        onSubmit(selectedFacility.id);
        toast.success(`${facilities.find(f => f.id === selectedFacility.id)?.name} added to explorer!`);
        setSelectedFacility(null);
    }

    return (
        <Form action={handleSubmit}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Autocomplete
                    size="small"
                    disabled={availableFacilities.length === 0}
                    fullWidth
                    options={availableFacilities}
                    onChange={handleChange}
                    value={selectedFacility}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Add Facility" variant="outlined"/>}
                />
                <Box>
                    <IconButton onClick={handleSubmit} disabled={availableFacilities.length === 0}>
                        <Add/>
                    </IconButton>
                </Box>
            </Stack>
        </Form>

    );

}