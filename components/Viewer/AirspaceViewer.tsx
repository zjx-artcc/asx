import React from 'react';
import {Airport, AirportCondition, MappingJson, RadarFacility, SectorMapping, VideoMap} from "@prisma/client";
import prisma from "@/lib/db";
import AirportConditionSelector from "@/components/Viewer/AirportCondition/AirportConditionSelector";
import {Card, CardContent, Divider, Grid2, Typography} from "@mui/material";
import VideoMapSelector from "@/components/Viewer/VideoMapSelector/VideoMapSelector";
import FacilitySelector from "@/components/Viewer/FacilitySelector/FacilitySelector";
import RenderMap from "@/components/Viewer/Map/RenderMap";

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
                            <VideoMapSelector allVideoMaps={allVideoMaps as VideoMapWithMappings[]}/>
                            <Divider sx={{my: 2,}}/>
                            <FacilitySelector allFacilities={allFacilities as RadarFacilityWithSectors[]}/>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={8}>
                    <RenderMap allConditions={allAirports.flatMap((a) => a.conditions) as AirportConditionWithAirport[]}
                               allVideoMaps={allVideoMaps as VideoMapWithMappings[]}
                               allFacilities={allFacilities as RadarFacilityWithSectors[]}/>
                </Grid2>
            </Grid2>
        </>
    );
}