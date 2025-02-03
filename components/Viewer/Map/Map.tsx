'use client';
import React, {useEffect} from 'react';
import {Box, Card, CardContent} from "@mui/material";
import LeafletMap from "@/components/Map/Map";
import Geojson from "@/components/GeoJSON/GeoJSON";
import "leaflet/dist/leaflet.css";
import {useColorScheme} from "@mui/material/styles";
import Tooltips from "@/components/Tooltips/Tooltips";

type GeoJSONWithColor = {
    key: string,
    json: {
        crs: {
            properties: {
                color: string,
            },
        },
    },
    color: string,
    videoMap: boolean,
};

const CENTER_LAT = Number(process.env['NEXT_PUBLIC_MAP_DEFAULT_CENTER_LAT']) || 36.5;
const CENTER_LONG = Number(process.env['NEXT_PUBLIC_MAP_DEFAULT_CENTER_LONG']) || -77;
const ZOOM = Number(process.env['NEXT_PUBLIC_MAP_DEFAULT_ZOOM']) || 6.5;

export default function Map({videoMapKeys, sectorKeys, colors}: {
    videoMapKeys: string[],
    sectorKeys: string[],
    colors: { // noinspection JSUnusedLocalSymbols
        [key: string]: string,
    },
}) {

    const {colorScheme} = useColorScheme();
    const [files, setFiles] = React.useState<GeoJSONWithColor[]>([]);

    const fetchJson = async (key: string) => {
        const res = await fetch(`https://utfs.io/f/${key}`);
        return await res.json();
    }

    useEffect(() => {
        const fetchAll = async () => {
            const videoFiles = await Promise.all(videoMapKeys.map(fetchJson));
            const sectorFiles = await Promise.all(sectorKeys.map(fetchJson));
            return [
                ...videoFiles.map((json, index) => ({
                    key: videoMapKeys[index],
                    json,
                    color: json?.crs?.properties?.color || 'black',
                    videoMap: true,
                })),
                ...sectorFiles.map((json, index) => ({
                    key: sectorKeys[index],
                    json,
                    color: colors[sectorKeys[index]] || json?.crs?.properties?.color || 'black',
                    videoMap: false,
                }))
            ] satisfies GeoJSONWithColor[];
        }

        fetchAll().then(setFiles);

    }, [videoMapKeys, sectorKeys, colors]);

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
                        center={[CENTER_LAT, CENTER_LONG]}
                        zoom={ZOOM}
                        style={{
                            position: 'absolute',
                            background: colorScheme === 'dark' ? '#4e4e4e' : 'lightgray',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {files.map((file) => (
                            <Geojson
                                key={file.key}
                                data={file.json}
                                style={{weight: 1, color: file.color}}
                                interactive={false}
                            />
                        ))}

                        <Tooltips sectors={files}/>
                    </LeafletMap>
                </Box>
            </CardContent>
        </Card>
    );

}