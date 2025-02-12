'use client';
import React, {useCallback, useEffect} from 'react';
import {Box, Card, CardContent} from "@mui/material";
import LeafletMap from "@/components/Viewer/LeafletMap/Map";
import Geojson from "@/components/GeoJSON/GeoJSON";
import "leaflet/dist/leaflet.css";
import {useColorScheme} from "@mui/material/styles";
import AltitudeInformationWrapper from "@/components/Viewer/Tooltips/AltitudeInformationWrapper";
import ColorLegendWrapper from "@/components/Viewer/Tooltips/ColorLegendWrapper";
import {useSearchParams} from "next/navigation";

export type GeoJSONWithColor = {
    key: string,
    json: {
        name: string,
        crs: {
            properties: {
                name: string,
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

export default function Map({videoMapKeys, sectorKeys, colors, ownedBy, colorLegend}: {
    videoMapKeys: string[],
    sectorKeys: string[],
    colors: { // noinspection JSUnusedLocalSymbols
        [key: string]: string,
    },
    ownedBy?: { [key: string]: string, },
    colorLegend: { color: string, name: string, frequency: string, }[],
}) {

    const searchParams = useSearchParams();
    const {colorScheme} = useColorScheme();
    const [files, setFiles] = React.useState<GeoJSONWithColor[]>([]);

    const fetchJson = async (key: string) => {
        const res = await fetch(`https://utfs.io/f/${key}`);
        return await res.json();
    }

    const fetchAll = useCallback(async () => {

        const videoFiles = [];
        const sectorFiles = [];

        for (const key of videoMapKeys) {
            videoFiles.push(await fetchJson(key));
        }

        for (const key of sectorKeys) {
            sectorFiles.push(await fetchJson(key));
        }

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
    }, [colors, sectorKeys, videoMapKeys]);

    useEffect(() => {

        const videoMaps = (searchParams.get('videoMaps')?.split(',') || []).filter(Boolean);
        const sectorMaps = (searchParams.get('sectors')?.split(',') || []).filter(Boolean);

        if (files.length > videoMaps.length + sectorMaps.length) {
            fetchAll().then(setFiles);
        } else {
            fetchAll().then(setFiles);
        }

    }, [fetchAll, files.length, searchParams]);

    return (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column',}}>
            <CardContent sx={{
                p: '0 !important',
                flex: '1 1 auto',
                backgroundColor: colorScheme === 'dark' ? '#4e4e4e' : 'lightgray',
            }}>
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
                            background: 'transparent',
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

                        <AltitudeInformationWrapper sectors={files} ownedBy={ownedBy || {}}/>
                        <ColorLegendWrapper colorLegend={colorLegend}/>
                    </LeafletMap>
                </Box>
            </CardContent>
        </Card>
    );

}