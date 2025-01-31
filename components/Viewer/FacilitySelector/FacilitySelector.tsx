'use client';
import React, {useEffect} from 'react';
import {RadarFacilityWithSectors} from "@/components/Viewer/AirspaceViewer";
import {Box, Divider, Typography} from "@mui/material";
import FacilityAddForm from "@/components/Viewer/FacilitySelector/FacilityAddForm";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import FacilityAccordion from "@/components/Viewer/FacilitySelector/FacilityAccordion";
import {toast} from "react-toastify";

export default function FacilitySelector({allFacilities}: { allFacilities: RadarFacilityWithSectors[] }) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [activeFacilities, setActiveFacilities] = React.useState<RadarFacilityWithSectors[]>([]);

    useEffect(() => {
        const activeFacilityIds = searchParams.get('facilities')?.split(',') ?? [];
        const activeFacilities = allFacilities.filter(facility => activeFacilityIds.includes(facility.id));
        setActiveFacilities(activeFacilities);
    }, [allFacilities, searchParams])

    const onAddFacility = (facilityId: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        const activeFacilityIds = newSearchParams.get('facilities')?.split(',') ?? [];
        newSearchParams.set('facilities', [...activeFacilityIds, facilityId].join(','));
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }

    const onDeleteFacility = (facilityId: string) => {
        const newSearchParams = new URLSearchParams(searchParams);

        const activeFacilityIds = newSearchParams.get('facilities')?.split(',') ?? [];
        newSearchParams.set('facilities', activeFacilityIds.filter(id => id !== facilityId).join(','));

        const activeSectorIds = newSearchParams.get('sectors')?.split(',') ?? [];
        const facility = allFacilities.find(facility => facility.id === facilityId);
        const sectorIds = facility?.sectors.map(sector => sector.id) ?? [];
        newSearchParams.set('sectors', activeSectorIds.filter(id => !sectorIds.includes(id)).join(','));

        router.push(`${pathname}?${newSearchParams.toString()}`);
        toast.success(`${facility?.name} removed from explorer!`);
    }

    return (
        <Box>
            <FacilityAddForm facilities={allFacilities} onSubmit={onAddFacility}/>
            <Divider sx={{my: 1,}}/>
            <Typography variant="subtitle2" textAlign="center" gutterBottom>Selected Facilities</Typography>
            {activeFacilities.length === 0 &&
                <Typography variant="subtitle1" textAlign="center">No facilities selected</Typography>}
            {activeFacilities.map(facility => (
                <FacilityAccordion key={facility.id} facility={facility} onDelete={onDeleteFacility}/>
            ))}
        </Box>
    );
}