'use client';
import React from 'react';
import {Box, Card, CardContent} from "@mui/material";
import LeafletMap from "@/components/Map/Map";
import Geojson from "@/components/GeoJSON/GeoJSON";
import northPCT from "@/public/northMerged.json";
import southPCT from "@/public/southMerged.json";
import centerMap from "@/public/center_boundary.json";

import {ShdSectors} from "@/components/Sectors/Sectors";

export default function Map({videoMapKey, sectorKeys}: { videoMapKey: string, sectorKeys: string[] }) {

    console.log('videoMapKey', videoMapKey);
    console.log('sectorKeys', sectorKeys);
    const [baseMap, setBaseMap] = React.useState(southPCT);
    const [center, setCenter] = React.useState([39,-77]);
    const [zoom, setZoom] = React.useState(9);


    React.useEffect(()=>{
        // console.log(videoMapKey==="4LL8Da7DF6qX7DZRcSOUvlGudXZqJxVeFnNSW365izyDp0tw");
        if(videoMapKey==="4LL8Da7DF6qX7DZRcSOUvlGudXZqJxVeFnNSW365izyDp0tw"){
            setBaseMap(southPCT);
        }else if(videoMapKey==="4LL8Da7DF6qXQSgakmj1UxQM3i9Ks04othLf7anjYIvWF6Rd"){
            setBaseMap(northPCT);
        }else if(videoMapKey==="4LL8Da7DF6qXiO17sUY4NbGeRqUMgc3PBKV8EuwpHSh0Xs6D"){
            setBaseMap(centerMap);
            setZoom(7.5);
            setCenter([38, -76]);
        }
    },[videoMapKey])

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
                        center={center}
                        zoom={zoom}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Geojson
                            key={videoMapKey}
                            data={baseMap}
                            style={{ weight: 1 }}
                            interactive={false}
                        />

                        <ShdSectors sectorKeys={sectorKeys}/>

                    </LeafletMap>
                </Box>
            </CardContent>
        </Card>
    );

}