'use client';
import React, {useCallback, useEffect, useRef} from 'react';
import {RadarFacilityWithSectors, SectorMappingWithConditions} from "@/components/Viewer/AirspaceViewer";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import {Delete, ExpandMore} from "@mui/icons-material";
import SectorCheckboxes from "@/components/Viewer/FacilitySelector/SectorCheckboxes";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function FacilityAccordion({facility, onDelete, disableDelete, defaultAllSelected}: {
    facility: RadarFacilityWithSectors,
    onDelete: (facilityId: string) => void,
    disableDelete?: boolean,
    defaultAllSelected?: boolean,
}) {

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [activeSectors, setActiveSectors] = React.useState<SectorMappingWithConditions[]>([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const initialSelectionMade = useRef(false);

    const selectAllSectors = useCallback((checked: boolean) => {
        setSelectAll(checked);

        const newSearchParams = new URLSearchParams(searchParams);
        const sectorIds = facility.sectors.map(sector => sector.id);

        if (checked) {
            const activeSectorIds = newSearchParams.get('sectors')?.split(',') ?? [];
            newSearchParams.set('sectors', [...new Set([...activeSectorIds, ...sectorIds])].join(','));
        } else {
            const activeSectorIds = newSearchParams.get('sectors')?.split(',') ?? [];
            newSearchParams.set('sectors', activeSectorIds.filter(id => !sectorIds.includes(id)).join(','));
        }

        router.push(`${pathname}?${newSearchParams.toString()}`);
    }, [facility.sectors, pathname, router, searchParams]);

    useEffect(() => {
        const activeSectorIds = searchParams.get('sectors')?.split(',') ?? [];
        const activeSectors = facility.sectors.filter(sector => activeSectorIds.includes(sector.id) && sector.radarFacilityId === facility.id);
        setActiveSectors(activeSectors);
        setSelectAll(activeSectors.length === facility.sectors.length);
    }, [facility, searchParams]);

    useEffect(() => {
        if (defaultAllSelected && !initialSelectionMade.current) {
            selectAllSectors(true);
            initialSelectionMade.current = true;
        }
    }, [defaultAllSelected, selectAllSectors]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        selectAllSectors(event.target.checked);
    }

    return (
        <Accordion variant="outlined">
            <AccordionSummary expandIcon={<ExpandMore/>}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                    <Typography>{facility.name} ({activeSectors.length}/{facility.sectors.length})</Typography>
                    <Box>
                        <IconButton disabled={disableDelete} onClick={() => onDelete(facility.id)} size="small">
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