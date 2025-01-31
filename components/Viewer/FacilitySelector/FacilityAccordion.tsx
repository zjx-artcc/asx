'use client';
import React, {useEffect} from 'react';
import {RadarFacilityWithSectors, SectorMappingWithConditions} from "@/components/Viewer/AirspaceViewer";
import {Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Stack, Typography} from "@mui/material";
import {Delete, ExpandMore} from "@mui/icons-material";
import SectorCheckboxes from "@/components/Viewer/FacilitySelector/SectorCheckboxes";
import {useSearchParams} from "next/navigation";

export default function FacilityAccordion({facility, onDelete}: {
    facility: RadarFacilityWithSectors,
    onDelete: (facilityId: string) => void,
}) {

    const searchParams = useSearchParams();
    const [activeSectors, setActiveSectors] = React.useState<SectorMappingWithConditions[]>([]);

    useEffect(() => {
        const activeSectorIds = searchParams.get('sectors')?.split(',') ?? [];
        const activeSectors = facility.sectors.filter(sector => activeSectorIds.includes(sector.id) && sector.radarFacilityId === facility.id);
        setActiveSectors(activeSectors);
    }, [facility, searchParams]);

    return (
        <Accordion variant="outlined">
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{facility.name} ({activeSectors.length}/{facility.sectors.length})</Typography>
                    <Box>
                        <IconButton onClick={() => onDelete(facility.id)} size="small">
                            <Delete/>
                        </IconButton>
                    </Box>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <SectorCheckboxes sectors={facility.sectors}/>
            </AccordionDetails>
        </Accordion>
    );

}