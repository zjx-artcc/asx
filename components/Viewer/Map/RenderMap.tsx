'use client';
import React, {useEffect, useState} from 'react';
import {
    AirportConditionWithAirport,
    RadarFacilityWithSectors,
    SectorMappingWithConditions,
    VideoMapWithMappings
} from "@/components/Viewer/AirspaceViewer";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";

export default function RenderMap({allConditions, allVideoMaps, allFacilities}: {
    allConditions: AirportConditionWithAirport[],
    allVideoMaps: VideoMapWithMappings[],
    allFacilities: RadarFacilityWithSectors[],
}) {

    const searchParams = useSearchParams();
    const [activeVideoMap, setActiveVideoMap] = useState<VideoMapWithMappings | null>(null);
    const [activeSectors, setActiveSectors] = useState<SectorMappingWithConditions[]>([]);
    const [activeConditions, setActiveConditions] = useState<AirportConditionWithAirport[]>([]);

    useEffect(() => {
        const videoMapId = searchParams.get('videoMap');
        if (!videoMapId) {
            setActiveVideoMap(null);
            return;
        }
        const videoMap = allVideoMaps.find(videoMap => videoMap.id === videoMapId);
        if (!videoMap) {
            setActiveVideoMap(null);
            return;
        }
        setActiveVideoMap(videoMap);

        const sectorIds = searchParams.get('sectors')?.split(',') ?? [];
        const sectors = allFacilities.flatMap(facility => facility.sectors).filter(sector => sectorIds.includes(sector.id));
        setActiveSectors(sectors);

        const conditionIds = searchParams.get('conditions')?.split(',') ?? [];
        const conditions = allConditions.filter(condition => conditionIds.includes(condition.id));
        setActiveConditions(conditions);
    }, [searchParams, allVideoMaps, allFacilities, allConditions]);

    const {errors, videoMapKey, sectorKeys,} = getKeys(activeVideoMap, activeSectors, activeConditions);

    if (errors.length > 0) {
        return (
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Info color="error"/>
                        <Typography variant="h5">Unable to Render Map</Typography>
                    </Stack>
                    <Typography variant="subtitle1" gutterBottom>The map could not be rendered for the following
                        reasons:</Typography>
                    {errors.map((error, idx) => <Typography key={idx} variant="subtitle2"
                                                            gutterBottom>{error}</Typography>)}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography>Map</Typography>
            </CardContent>
        </Card>
    );

}

const getKeys = (videoMap: VideoMapWithMappings | null, sectors: SectorMappingWithConditions[], conditions: AirportConditionWithAirport[]): {
    errors?: string[],
    videoMapKey?: string,
    sectorKeys?: string[],
} => {

    if (!videoMap) {
        return {errors: ['No video map selected']};
    }

    const videoMapConditions = videoMap.mappings.flatMap(mapping => mapping.airportCondition);
    const meetsAnyOneCondition = videoMapConditions.includes(undefined) || conditions.some(condition => videoMapConditions.includes(condition));

    if (!meetsAnyOneCondition) {
        let airports = videoMapConditions.map(condition => `${condition?.airport.icao}`);
        airports = airports.filter((item, index) => airports.indexOf(item) === index);
        return {errors: [`Video map ${videoMap.name} requires an airport condition to be defined from the following airport(s): ${airports.join(', ')}`]};
    }

    const errors: string[] = [];
    const sectorKeys: string[] = [];

    for (const sector of sectors) {
        const mappings = sector.mappings;
        const sectorConditions = mappings.flatMap(mapping => mapping.airportCondition);
        const meetsAnyOneCondition = sectorConditions.includes(undefined) || conditions.some(condition => sectorConditions.includes(condition));

        if (!meetsAnyOneCondition) {
            let airports = sectorConditions.map(condition => `${condition?.airport.icao}`);
            airports = airports.filter((item, index) => airports.indexOf(item) === index);
            errors.push(`Sector ${sector.name} requires an airport condition to be defined from the following airport(s): ${airports.join(', ')}`);
        }


        const sortedMappings = mappings.sort((a) => a.airportCondition !== undefined ? -1 : 1);
        let setKeyFromCondition = false;
        for (const mapping of sortedMappings) {
            if (conditions.map((c) => c.id).includes(mapping.airportCondition?.id || '')) {
                if (mapping.videoMapId) {
                    setKeyFromCondition = true;
                    break;
                }
                sectorKeys.push(mapping.jsonKey);
                setKeyFromCondition = true;
                break;
            }
        }

        if (!setKeyFromCondition && sectorConditions.includes(undefined)) {
            sectorKeys.push(sortedMappings[sortedMappings.length - 1].jsonKey);
        }
    }

    if (errors.length > 0) {
        return {errors};
    }
    return {};
}