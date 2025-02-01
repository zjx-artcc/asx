'use client';
import React, {useEffect, useState} from 'react';
import {
    AirportConditionWithAirport,
    MappingJsonWithConditions,
    RadarFacilityWithSectors,
    SectorMappingWithConditions,
    VideoMapWithMappings
} from "@/components/Viewer/AirspaceViewer";
import {useSearchParams} from "next/navigation";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";
import Map from "@/components/Viewer/Map/Map";
import {IdsConsolidation} from "@/app/active-consolidations/page";

export default function MapWrapper({allConditions, allVideoMaps, allFacilities, idsConsolidations,}: {
    allConditions: AirportConditionWithAirport[],
    allVideoMaps: VideoMapWithMappings[],
    allFacilities: RadarFacilityWithSectors[],
    idsConsolidations?: IdsConsolidation[],
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
        const allSectors = allFacilities.flatMap(facility => facility.sectors);
        const sectors = allSectors.filter(sector => sectorIds.includes(sector.id));
        if (idsConsolidations) {
            idsConsolidations
                .forEach(idsConsolidation => {
                    if (!sectors.map(sector => sector.idsRadarSectorId).includes(idsConsolidation.primarySectorId)) {
                        return;
                    }
                    const secondarySectors = [idsConsolidations[0], ...idsConsolidation.secondarySectorIds];
                    const consolidatedSectors = allSectors
                        .filter(sector => secondarySectors.includes(sector.idsRadarSectorId))
                        .filter(sector => !sectors.includes(sector));
                    sectors.push(...consolidatedSectors);
                });
        }
        setActiveSectors(sectors);

        const conditionIds = searchParams.get('conditions')?.split(',') ?? [];
        const conditions = allConditions.filter(condition => conditionIds.includes(condition.id));
        setActiveConditions(conditions);
    }, [searchParams, allVideoMaps, allFacilities, allConditions, idsConsolidations]);

    if (!activeVideoMap) {
        return (
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1,}}>
                        <Info color="info"/>
                        <Typography variant="h5">Welcome to the Airspace Map!</Typography>
                    </Stack>
                    <Typography gutterBottom>Select a video map and start adding facilities to visualize the
                        airspace.</Typography>
                    <Typography variant="subtitle2">NOTE: A majority of TRACON/RAPCON sectors and video maps require an
                        airspace
                        condition to be set prior to enabling them. Add an airspace condition above by pressing the +
                        button.</Typography>
                </CardContent>
            </Card>
        )
    }

    const {errors, videoJson, sectorJsons,} = getJsons(activeVideoMap, activeSectors, activeConditions);

    if (errors) {
        return (
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1,}}>
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

    return videoJson && sectorJsons && (
        <Map videoMapKey={videoJson.jsonKey} sectorKeys={sectorJsons.map(sj => sj.jsonKey)}/>
    );

}

const getJsons = (videoMap: VideoMapWithMappings | null, sectors: SectorMappingWithConditions[], conditions: AirportConditionWithAirport[]): {
    errors?: string[],
    videoJson?: MappingJsonWithConditions,
    sectorJsons?: MappingJsonWithConditions[],
} => {

    const errors: string[] = [];

    if (!videoMap) {
        return {errors: ['No video map selected']};
    }

    const videoJson = getBestMapping(videoMap.mappings, conditions);

    if (Array.isArray(videoJson)) {
        errors.push(`Video map ${videoMap.name} requires an airspace condition to be set for ONE the following: ${videoJson.join(', ')}`);
    }

    const sectorJsons: MappingJsonWithConditions[] = [];

    for (const sector of sectors) {

        if (sector.mappings.length === 0) {
            errors.push(`Sector ${sector.name} has no GEOJSON mappings.`);
            continue;
        }

        const sectorJson = getBestMapping(sector.mappings, conditions);

        if (Array.isArray(sectorJson)) {
            errors.push(`Sector ${sector.name} requires an airspace condition to be set for ONE the following: ${sectorJson.join(', ')}`);
            continue;
        }

        sectorJsons.push(sectorJson);
    }

    if (errors.length > 0) {
        return {errors};
    }

    return {videoJson: videoJson as MappingJsonWithConditions, sectorJsons};
}

const getBestMapping = (availableMappings: MappingJsonWithConditions[], conditions: AirportConditionWithAirport[]): MappingJsonWithConditions | string[] => {

    const conditionIds = conditions.map(c => c.id);
    let undefinedMapping: MappingJsonWithConditions | null = null;

    for (const mapping of availableMappings) {

        if (!mapping.airportConditionId) {
            undefinedMapping = mapping;
            continue;
        }

        if (conditionIds.includes(mapping.airportConditionId)) {
            return mapping;
        }
    }

    if (undefinedMapping) {
        return undefinedMapping;
    }

    return availableMappings
        .map(m => m.airportCondition?.airport)
        .filter(a => !!a).map(a => a.icao)
        .filter((airport, index, self) => self.indexOf(airport) === index);
}