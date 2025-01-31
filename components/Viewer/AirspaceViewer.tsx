import React from 'react';
import {Airport, AirportCondition, MappingJson, RadarFacility, SectorMapping, VideoMap} from "@prisma/client";
import prisma from "@/lib/db";
import AirportConditionSelector from "@/components/Viewer/AirportConditionSelector";
import {Card, CardContent, Grid2, Typography} from "@mui/material";

export type AirportConditionWithAirport = AirportCondition & { airport: Airport, };
export type MappingJsonWithConditions = MappingJson & { airportCondition?: AirportConditionWithAirport, };
export type AirportWithConditions = Airport & { conditions: AirportCondition[], };
export type VideoMapWithMappings = VideoMap & { mappings: MappingJsonWithConditions[], };
export type RadarFacilityWithSectors = RadarFacility & { sectors: SectorMappingWithConditions[], };
export type SectorMappingWithConditions = SectorMapping & { mappings: MappingJsonWithConditions[], };

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
        where: {
            NOT: {
                mappings: {
                    none: {},
                },
            },
        },
        include: {
            mappings: {
                include: {
                    airportCondition: {
                        include: {
                            airport: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    const allFacilities = await prisma.radarFacility.findMany({
        include: {
            sectors: {
                include: {
                    mappings: {
                        include: {
                            airportCondition: {
                                include: {
                                    airport: true,
                                },
                            },
                        },
                    },
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
            <Grid2 container columns={10}>
                <Grid2 size={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" textAlign="center" gutterBottom>Airspace Explorer</Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </>
    );
}