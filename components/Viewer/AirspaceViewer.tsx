import React from "react";
import {Airport, AirportCondition, MappingJson, RadarFacility, SectorMapping, VideoMap,} from "@prisma/client";
import prisma from "@/lib/db";
import AirspaceConditionSelector from "@/components/Viewer/AirspaceCondition/AirspaceConditionSelector";
import {Box, Card, CardContent, Divider, Grid2, Typography} from "@mui/material";
import VideoMapSelector from "@/components/Viewer/VideoMapSelector/VideoMapSelector";
import FacilitySelector from "@/components/Viewer/FacilitySelector/FacilitySelector";
import MapWrapper from "@/components/Viewer/Map/MapWrapper";
import {IdsConsolidation} from "@/app/active-consolidations/page";

export type AirportConditionWithAirport = AirportCondition & {
  airport: Airport;
};
export type MappingJsonWithConditions = MappingJson & {
  airportCondition?: AirportConditionWithAirport;
};
export type AirportWithConditions = Airport & {
  conditions: AirportCondition[];
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

export default async function AirspaceViewer({idsConsolidations}: { idsConsolidations?: IdsConsolidation[], }) {
  const allAirports = await prisma.airport.findMany({
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
          airportCondition: {
            include: {
              airport: true,
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
      order: "asc",
    },
  });

    return (
        <Box>
            <Grid2 container columns={10} spacing={2} sx={{my: 2, mx: 2,}}>
                <Grid2 size={10}>
                    <AirspaceConditionSelector airports={allAirports as AirportWithConditions[]}/>
                </Grid2>
                <Grid2 size={2} sx={{minHeight: 'calc(100vh - 64px - 96px)',}}>
                    <Card sx={{height: '100%',}}>
                        <CardContent>
                            <Typography variant="h6" textAlign="center" gutterBottom>Airspace Explorer</Typography>
                            <Divider sx={{my: 2,}}/>
                            <VideoMapSelector allVideoMaps={allVideoMaps as VideoMapWithMappings[]}/>
                            <Divider sx={{my: 2,}}/>
                            <FacilitySelector allFacilities={allFacilities as RadarFacilityWithSectors[]}
                                              idsConsolidations={idsConsolidations}/>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2 size={8} sx={{minHeight: 'calc(100vh - 64px - 96px)',}}>
                    <MapWrapper
                        allConditions={allAirports.flatMap((a) => a.conditions) as AirportConditionWithAirport[]}
                        allVideoMaps={allVideoMaps as VideoMapWithMappings[]}
                        allFacilities={allFacilities as RadarFacilityWithSectors[]}
                        idsConsolidations={idsConsolidations}
                    />
                </Grid2>
            </Grid2>
        </Box>

    );
}
