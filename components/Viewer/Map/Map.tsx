'use client';
import React from 'react';
import {Box, Card, CardContent, Typography} from "@mui/material";

import LeafletMap from "@/components/Map/Map";
import Geojson from "@/components/GeoJSON/GeoJSON";
import northPCT from "@/public/northMerged.json";

export default function Map({videoMapKey, sectorKeys}: { videoMapKey: string, sectorKeys: string[] }) {


    return (
        <Card sx={{height: '100%', position: "relative"}}>
            <CardContent>
                <Typography variant="h5" gutterBottom>RENDER MAP HERE</Typography>
                <Typography variant="subtitle1">VIDEO MAP KEY: {videoMapKey}</Typography>
                <Typography variant="subtitle2">SECTOR KEY(S): {sectorKeys.join('\n')}</Typography>
                <Box>
                    <LeafletMap
                        style={{
                            // display: "flex",
                            width: "100%",
                            height: "100%",
                            position:"absolute"
                        }}
                        zoomSnap={0.1}
                        center={[39, -77]}
                        zoom={9.5}
                    >
                        <Geojson
                            key={videoMapKey}
                            data={northPCT}
                            style={{ weight: 1 }}
                            interactive={false}
                        />
                </LeafletMap>
                </Box>
            </CardContent>
        </Card>
    );

}