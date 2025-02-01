'use client';
import React from 'react';
import {Box, Card, CardContent} from "@mui/material";
import LeafletMap from "@/components/Map/Map";
import Geojson from "@/components/GeoJSON/GeoJSON";
import northPCT from "@/public/northMerged.json";

export default function Map({videoMapKey, sectorKeys}: { videoMapKey: string, sectorKeys: string[] }) {

    console.log('videoMapKey', videoMapKey);
    console.log('sectorKeys', sectorKeys);

    return (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flex: '1 1 auto',}}>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    flex: '1 1 auto',
                }}>
                    <LeafletMap
                        zoomSnap={0.1}
                        center={[0, 0]}
                        zoom={9.5}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}
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