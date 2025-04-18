import React from "react";
import {
    AirspaceCondition,
    AirspaceConditionContainer,
    MappingJson,
    RadarFacility,
    SectorMapping,
    VideoMap,
} from "@prisma/client";
import prisma from "@/lib/db";
import AirspaceConditionSelector from "@/components/Viewer/AirspaceCondition/AirspaceConditionSelector";
import {Box, Card, CardContent, Divider, Grid2, Typography} from "@mui/material";
import VideoMapSelector from "@/components/Viewer/VideoMapSelector/VideoMapSelector";
import FacilitySelector from "@/components/Viewer/FacilitySelector/FacilitySelector";
import MapWrapper from "@/components/Viewer/Map/MapWrapper";
import {IdsConsolidation} from "@/app/active-consolidations/page";

export type AirspaceConditionWithContainer = AirspaceCondition & {
    container: AirspaceConditionContainer;
};
export type MappingJsonWithConditions = MappingJson & {
    airspaceCondition?: AirspaceConditionWithContainer;
};
export type AirspaceContainerWithConditions = AirspaceConditionContainer & {
    conditions: AirspaceCondition[];
};
export type VideoMapWithMappings = VideoMap & {
    mappings: MappingJsonWithConditions[];
};
export type RadarFacilityWithSectors = RadarFacility & {
    sectors: SectorMappingWithConditions[];
};
export type SectorMappingWithConditions = SectorMapping & {
    mappings: MappingJsonWithConditions[];
};

export default async function AirspaceViewer({idsConsolidations, defaultConditions}: {
    idsConsolidations?: IdsConsolidation[],
    defaultConditions?: AirspaceCondition[],
}) {

    const allContainers = await prisma.airspaceConditionContainer.findMany({
        include: {
            conditions: true,
        },
        orderBy: {
            order: "asc",
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
                    airspaceCondition: {
                        include: {
                            container: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    const allFacilities = await prisma.radarFacility.findMany({
        include: {
            sectors: {
                include: {
                    mappings: {
                        include: {
                            airspaceCondition: {
                                include: {
                                    container: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return (
        <Box>
            <Grid2 container columns={10} spacing={2} sx={{my: 2, mx: 2,}}>
                <Grid2 size={10}>
                    <AirspaceConditionSelector containers={allContainers as AirspaceContainerWithConditions[]}
                                               defaultActiveIds={defaultConditions?.map((c) => c.id)}/>
                </Grid2>
                <Grid2 size={{xs: 10, md: 3, xl: 2,}} sx={{height: {xs: '300px', md: 'calc(100vh - 64px - 96px)',},}}>
                    <Card sx={{height: '100%', overflow: 'auto',}}>
                        <CardContent>
                            <Box sx={{height: '100%',}}>
                                <Typography variant="h6" textAlign="center" gutterBottom>Map
                                    Settings</Typography>

                                <Divider sx={{my: 2,}}/>
                                <VideoMapSelector allVideoMaps={allVideoMaps as VideoMapWithMappings[]}/>
                                <Divider sx={{my: 2,}}/>
                                <FacilitySelector allFacilities={allFacilities as RadarFacilityWithSectors[]}
                                                  idsConsolidations={idsConsolidations}/>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={{xs: 10, md: 7, xl: 8,}}
                       sx={{height: {xs: '100vh', md: 'calc(100vh - 64px - 96px)',},}}>
                    <MapWrapper
                        allConditions={allContainers.flatMap((a) => a.conditions) as AirspaceConditionWithContainer[]}
                        allVideoMaps={allVideoMaps as VideoMapWithMappings[]}
                        allFacilities={allFacilities as RadarFacilityWithSectors[]}
                        idsConsolidations={idsConsolidations}
                    />
                </Grid2>
            </Grid2>
        </Box>

    );
}