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

    if (sectorIds.length > 0) {
        const allSectors = allFacilities.flatMap(facility => facility.sectors);
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

    if (idsConsolidations) {
        for (const idsConsolidation of idsConsolidations) {
            const color = getRandomSharpHexColor(Object.values(colors));
            const primaryMap = jsons?.sectorJsons?.find((j) => j.sectorMappingId === sectors.find((s) => s.idsRadarSectorId === idsConsolidation.primarySectorId)?.id);

            if (!primaryMap) continue;

            colors[primaryMap.jsonKey] = color;
            convertedConsolidations[primaryMap.jsonKey] = primaryMap.jsonKey;
            for (const secondarySectorId of idsConsolidation.secondarySectorIds) {
                const secondaryMap = jsons?.sectorJsons?.find((j) => j.sectorMappingId === sectors.find((s) => s.idsRadarSectorId === secondarySectorId)?.id);

                if (!secondaryMap) continue;

                colors[secondaryMap.jsonKey] = color;
                convertedConsolidations[secondaryMap.jsonKey] = primaryMap.jsonKey;
            }
        }

        if (!searchParams.get('colors')) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('colors', JSON.stringify(colors));
            router.push(`${pathname}?${newSearchParams.toString()}`);
        } else {
            colors = JSON.parse(searchParams.get('colors') || '{}');
        }

    }

    return jsons?.videoJsons && jsons?.sectorJsons && (
        <Map videoMapKeys={jsons.videoJsons.map((j) => j.jsonKey)} sectorKeys={jsons.sectorJsons.map(sj => sj.jsonKey)}
             colors={colors} ownedBy={convertedConsolidations}/>
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

function getRandomSharpHexColor(previousColors: string[] = []): string {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
    const saturation = 90 + Math.random() * 10; // High saturation (90-100%)
    const lightness = 50 + Math.random() * 10; // Moderate brightness (50-60%)

    const hslToHex = (h: number, s: number, l: number): string => {
        s /= 100;
        l /= 100;

        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');

        return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    };

    let newColor;
    do {
        newColor = hslToHex(hue, saturation, lightness);
    } while (previousColors.includes(newColor));

    return newColor;
}