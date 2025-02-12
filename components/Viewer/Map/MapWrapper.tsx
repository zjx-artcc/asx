'use client';
import React, {useEffect} from 'react';
import {
    AirspaceConditionWithContainer,
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
    allConditions: AirspaceConditionWithContainer[],
    allVideoMaps: VideoMapWithMappings[],
    allFacilities: RadarFacilityWithSectors[],
    idsConsolidations?: IdsConsolidation[],
}) {

    const searchParams = useSearchParams();
    const [videoMaps, setVideoMaps] = React.useState<VideoMapWithMappings[]>([]);
    const [sectors, setSectors] = React.useState<SectorMappingWithConditions[]>([]);
    const [conditions, setConditions] = React.useState<AirspaceConditionWithContainer[]>([]);

    useEffect(() => {


        const videoMapIds = searchParams.get('videoMaps')?.split(',').filter(Boolean) ?? [];
        setVideoMaps(allVideoMaps.filter(videoMap => videoMapIds.includes(videoMap.id)));

        const sectorIds = searchParams.get('sectors')?.split(',').filter((i) => !!i) ?? [];

        if (!searchParams.get('sectors')) {
            setSectors([]);
        } else {
            const allSectors = allFacilities.flatMap(facility => facility.sectors);
            let sectors = allSectors.filter(sector => sectorIds.includes(sector.id));

            if (idsConsolidations && idsConsolidations.length > 0) {

                idsConsolidations
                    .forEach(idsConsolidation => {

                        const primarySector = allSectors.find(sector => sector.idsRadarSectorId === idsConsolidation.primarySectorId);

                        if (!sectors.map(sector => sector.idsRadarSectorId).includes(idsConsolidation.primarySectorId)
                            || !sectorIds.includes(primarySector?.id || '')) {
                            const sectorsIdsToRemove = allSectors
                                .filter(sector => sector.idsRadarSectorId === idsConsolidation.primarySectorId)
                                .map(sector => sector.id);
                            sectors = sectors.filter(sector => !sectorsIdsToRemove.includes(sector.id));
                            return;
                        }
                        const secondarySectors = [idsConsolidations[0], ...idsConsolidation.secondarySectorIds];
                        const consolidatedSectors = allSectors
                            .filter(sector => secondarySectors.includes(sector.idsRadarSectorId))
                            .filter(sector => !sectors.includes(sector));
                        sectors.push(...consolidatedSectors);
                    });
            }

            setSectors(sectors);
        }


        const conditionIds = searchParams.get('conditions')?.split(',') ?? [];
        setConditions(allConditions.filter(condition => conditionIds.includes(condition.id)));


    }, [allConditions, allFacilities, allVideoMaps, idsConsolidations, searchParams]);

    if (videoMaps.length === 0) {
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

    const jsons = getJsons(videoMaps, sectors, conditions);

    if (jsons.errors) {
        return (
            <Card>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1,}}>
                        <Info color="error"/>
                        <Typography variant="h5">Unable to Render Map</Typography>
                    </Stack>
                    <Typography variant="subtitle1" gutterBottom>The map could not be rendered for the following
                        reasons:</Typography>
                    {jsons.errors.map((error, idx) => <Typography key={idx} variant="subtitle2"
                                                                  gutterBottom>{error}</Typography>)}
                </CardContent>
            </Card>
        );
    }

    const colors: { [key: string]: string, } = {};

    const convertedConsolidations: { [key: string]: string } = {};
    const colorLegend: { color: string, name: string, order: number, frequency: string, }[] = [];


    for (const idsConsolidation of idsConsolidations || []) {
        const uniqueColors = Object.values(colors).filter((value, index, self) => self.indexOf(value) === index);
        const color = getRandomSharpHexColor(uniqueColors.length);
        const primarySector = sectors.find((s) => s.idsRadarSectorId === idsConsolidation.primarySectorId);
        const primaryMap = jsons?.sectorJsons?.find((j) => j.sectorMappingId === sectors.find((s) => s.idsRadarSectorId === idsConsolidation.primarySectorId)?.id);

        if (!primaryMap || !primarySector) continue;

        colors[primaryMap.jsonKey] = color;
        colorLegend.push({
            color,
            name: primarySector?.name || 'UNK',
            order: allFacilities.find(f => f.id === primarySector?.radarFacilityId)?.order || 0,
            frequency: primarySector?.frequency || '199.998'
        });
        convertedConsolidations[primaryMap.jsonKey] = primaryMap.jsonKey;
        for (const secondarySectorId of idsConsolidation.secondarySectorIds) {
            const secondaryMap = jsons?.sectorJsons?.find(
                (j) =>
                    j.sectorMappingId === sectors
                        .find((s) => s.idsRadarSectorId === secondarySectorId)?.id);

            if (!secondaryMap) continue;

            colors[secondaryMap.jsonKey] = color;
            convertedConsolidations[secondaryMap.jsonKey] = primaryMap.jsonKey;
        }
    }

    return jsons?.videoJsons && jsons?.sectorJsons && (
        <Map videoMapKeys={jsons.videoJsons.map((j) => j.jsonKey)} sectorKeys={jsons.sectorJsons.map(sj => sj.jsonKey)}
             colors={colors} ownedBy={convertedConsolidations} colorLegend={
            colorLegend.sort((a, b) => a.name.localeCompare(b.name))
        }/>
    );

}

const getJsons = (videoMaps: VideoMapWithMappings[], sectors: SectorMappingWithConditions[], conditions: AirspaceConditionWithContainer[]): {
    errors?: string[],
    videoJsons?: MappingJsonWithConditions[],
    sectorJsons?: MappingJsonWithConditions[],
} => {

    const errors: string[] = [];

    if (videoMaps.length === 0) {
        return {errors: ['No video map selected']};
    }

    const videoJsons = [];

    for (const videoMap of videoMaps) {
        const videoJson = getBestMapping(videoMap.mappings, conditions);

        if (Array.isArray(videoJson)) {
            errors.push(`Video map ${videoMap.name} requires an airspace condition to be set for ONE the following: ${videoJson.join(', ')}`);
            continue;
        }

        videoJsons.push(videoJson);
    }

    const sectorJsons: MappingJsonWithConditions[] = [];

    for (const sector of sectors) {

        if (sector.mappings.length === 0) {
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

    return {videoJsons, sectorJsons};
}

const getBestMapping = (availableMappings: MappingJsonWithConditions[], conditions: AirspaceConditionWithContainer[]): MappingJsonWithConditions | string[] => {

    const conditionIds = conditions.map(c => c.id);
    let undefinedMapping: MappingJsonWithConditions | null = null;

    for (const mapping of availableMappings) {

        if (!mapping.airspaceConditionId) {
            undefinedMapping = mapping;
            continue;
        }

        if (conditionIds.includes(mapping.airspaceConditionId)) {
            return mapping;
        }
    }

    if (undefinedMapping) {
        return undefinedMapping;
    }

    return availableMappings
        .map(m => m.airspaceCondition?.container)
        .filter(a => !!a).map(a => a.name)
        .filter((airport, index, self) => self.indexOf(airport) === index);
}

function getRandomSharpHexColor(existingColors: number): string {
    const distinctColors = [
        "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF4500", "#32CD32", "#8A2BE2",
        "#FFD700", "#DC143C", "#1E90FF", "#ADFF2F", "#FF1493", "#00FA9A", "#FF6347", "#7B68EE", "#FF8C00",
        "#40E0D0", "#FF69B4", "#2E8B57", "#DAA520", "#BA55D3", "#4169E1", "#008B8B", "#B22222", "#FF7F50",
        "#4682B4", "#9932CC", "#3CB371", "#FF4500", "#8B0000", "#556B2F", "#E9967A", "#8B008B", "#20B2AA",
        "#FFD700", "#6495ED", "#DC143C", "#00CED1", "#C71585", "#808000", "#FF00FF", "#008000", "#483D8B",
        "#FFA500", "#008080", "#B8860B", "#191970", "#D2691E",
    ];

    if (existingColors >= distinctColors.length) {
        return distinctColors[existingColors % distinctColors.length];
    }

    return distinctColors[existingColors];
}