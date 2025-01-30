import React from 'react';
import {Airport, AirportCondition, MappingJson, SectorMapping, VideoMap} from "@prisma/client";
import prisma from "@/lib/db";
import AirportConditionSelector from "@/components/Viewer/AirportConditionSelector";

export type MappingJsonWithConditions = MappingJson & { airportCondition: AirportCondition, };
export type AirportWithConditions = Airport & { conditions: AirportCondition[], };
export type VideoMapWithMappings = VideoMap & { mappings: MappingJsonWithConditions[], };
export type SectorMappingWithConditions = SectorMapping & { mappings: MappingJsonWithConditions, };

export default async function AirspaceViewer() {

    const allAirports = await prisma.airport.findMany({
        include: {
            conditions: true,
        },
        orderBy: {
            order: 'asc',
        },
    });

    const allVideoMaps = await prisma.videoMap.findMany({
        include: {
            mappings: {
                include: {
                    airportCondition: true,
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    const allSectorMappings = await prisma.sectorMapping.findMany({
        include: {
            mappings: {
                include: {
                    airportCondition: true,
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <>
            <AirportConditionSelector airports={allAirports as AirportWithConditions[]}/>
        </>
    );
}