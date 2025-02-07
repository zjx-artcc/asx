'use client';
import React from 'react';
import {
    AirspaceConditionWithContainer,
    MappingJsonWithConditions,
    RadarFacilityWithSectors,
    SectorMappingWithConditions,
    VideoMapWithMappings
} from "@/components/Viewer/AirspaceViewer";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
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

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const videoMapIds = searchParams.get('videoMaps')?.split(',').filter(Boolean) ?? [];
    const videoMaps = allVideoMaps.filter(videoMap => videoMapIds.includes(videoMap.id));


    const sectorIds = searchParams.get('sectors')?.split(',').filter((i) => !!i) ?? [];

    let sectors: SectorMappingWithConditions[] = [];

    const allSectors = allFacilities.flatMap(facility => facility.sectors);

    if (sectorIds.length > 0) {
        sectors = allSectors.filter(sector => sectorIds.includes(sector.id));
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
    }

    if (idsConsolidations && !sectorIds
        .every((si) =>
            allSectors.filter((s) =>
                idsConsolidations.map((i) => i.primarySectorId)
                    .includes(s.idsRadarSectorId))
                .map((s) => s.id)
                .includes(si))) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('sectors');
        router.push(`${pathname}?${newSearchParams.toString()}`);
        // toast.warning('The active split has changed to something that makes your configuration invalid.  The page has refreshed.')
    }

    const conditionIds = searchParams.get('conditions')?.split(',') ?? [];
    const conditions = allConditions.filter(condition => conditionIds.includes(condition.id));

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

    let colors: { [key: string]: string, } = {};

    const convertedConsolidations: { [key: string]: string } = {};
    const colorLegend: { color: string, name: string, frequency: string, }[] = [];

    if (idsConsolidations) {
        for (const idsConsolidation of idsConsolidations) {
            const color = getRandomSharpHexColor(Object.values(colors));
            const primarySector = sectors.find((s) => s.idsRadarSectorId === idsConsolidation.primarySectorId);
            const primaryMap = jsons?.sectorJsons?.find((j) => j.sectorMappingId === sectors.find((s) => s.idsRadarSectorId === idsConsolidation.primarySectorId)?.id);

            if (!primaryMap || !primarySector) continue;

            colors[primaryMap.jsonKey] = color;
            // colorLegend.push({color, name: primarySector?.name || 'UNK', frequency: primarySector?.frequency || 'test' });
            convertedConsolidations[primaryMap.jsonKey] = primaryMap.jsonKey;
            for (const secondarySectorId of idsConsolidation.secondarySectorIds) {
                const secondaryMap = jsons?.sectorJsons?.find((j) => j.sectorMappingId === sectors.find((s) => s.idsRadarSectorId === secondarySectorId)?.id);

                if (!secondaryMap) continue;

                colors[secondaryMap.jsonKey] = color;
                convertedConsolidations[secondaryMap.jsonKey] = primaryMap.jsonKey;
            }
        }

        if (!searchParams.get('colors') || Object.keys(JSON.parse(searchParams.get('colors') || '{}')).length < Object.keys(convertedConsolidations).length) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('colors', JSON.stringify(colors));
            router.push(`${pathname}?${newSearchParams.toString()}`);
        } else if (idsConsolidations) {
            colors = JSON.parse(searchParams.get('colors') || '{}');
            for (const [jsonKey, color] of Object.entries(colors)) {
                const sector = sectors.filter(s => idsConsolidations.map(i => i.primarySectorId).includes(s.idsRadarSectorId)).find((s) => s.mappings.map(m => m.jsonKey).includes(jsonKey));
                if (!sector) continue;
                colorLegend.push({color, name: sector.name || 'UNK', frequency: sector.frequency || '199.998'});
            }
        }

    }


    return jsons?.videoJsons && jsons?.sectorJsons && (
        <Map videoMapKeys={jsons.videoJsons.map((j) => j.jsonKey)} sectorKeys={jsons.sectorJsons.map(sj => sj.jsonKey)}
             colors={colors} ownedBy={convertedConsolidations} colorLegend={colorLegend}/>
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
            // errors.push(`Sector ${sector.name} has no GEOJSON mappings.`);
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

function getRandomSharpHexColor(previousColors: string[]): string {
    const distinctColors = [
        "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
        "#800000", "#808000", "#008000", "#800080", "#808080", "#008080",
        "#C0C0C0", "#FFA500", "#A52A2A", "#7FFF00", "#D2691E", "#DC143C",
        "#FF1493", "#00BFFF", "#4B0082", "#32CD32", "#FFD700", "#20B2AA",
        "#FF4500", "#DA70D6", "#B0C4DE", "#9370DB", "#3CB371", "#7B68EE",
        "#ADFF2F", "#BA55D3", "#F08080", "#E6E6FA", "#90EE90", "#FF6347",
        "#4682B4", "#9ACD32", "#EE82EE", "#6A5ACD", "#708090", "#2E8B57",
        "#9932CC", "#8B0000", "#556B2F", "#9400D3", "#696969", "#8B008B",
        "#B22222", "#5F9EA0"
    ];

    return distinctColors[previousColors.length % distinctColors.length];
}
