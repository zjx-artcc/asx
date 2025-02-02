'use client';
import React, {useCallback, useEffect} from 'react';
import {Box, Card, CardContent} from "@mui/material";
import LeafletMap from "@/components/Map/Map";
import Geojson from "@/components/GeoJSON/GeoJSON";

type GeoJSONWithColor = {
    key: string,
    // noinspection @typescript-eslint/ no-explicit-any
    json: {
        crs: {
            properties: {
                color: string,
            },
        },
    },
    color: string,
};

export default function Map({videoMapKey, sectorKeys, colorProviders,}: {
    videoMapKey: string,
    sectorKeys: string[],
    colorProviders: { // noinspection JSUnusedLocalSymbols
        [key: string]: string,
    },
}) {

    const [files, setFiles] = React.useState<GeoJSONWithColor[]>([]);

    const fetchJson = async (key: string) => {
        const res = await fetch(`https://utfs.io/f/${key}`);
        return await res.json();
    }

    const getColor = useCallback((file: GeoJSONWithColor, all: GeoJSONWithColor[]): string => {
        const colorProviderKey = colorProviders[file.key];

        if (colorProviderKey === file.key) {
            return file.json?.crs?.properties?.color || 'black';
        }

        let color = file.json?.crs?.properties?.color;

        if (colorProviderKey) {
            const colorProviderFile = all.find((file) => file.key === colorProviderKey);
            color = colorProviderFile?.json?.crs?.properties?.color || 'black';
        }

        return color || 'black';
    }, [colorProviders]);

    useEffect(() => {
        const fetchAll = async () => {
            if (sectorKeys.length === 0) {
                const videoFile = await fetchJson(videoMapKey);
                return [{
                    key: videoMapKey,
                    json: videoFile,
                    color: videoFile?.crs?.properties?.color || 'black'
                }] satisfies GeoJSONWithColor[];
            }

            const files = await Promise.all(sectorKeys.map(fetchJson));
            const videoFile = await fetchJson(videoMapKey);
            return [{
                key: videoMapKey,
                json: videoFile,
                color: videoFile?.crs?.properties?.color || 'black'
            }, ...files.map((json, index) => ({
                key: sectorKeys[index],
                json,
                color: json.crs.properties.color || 'black'
            }))] satisfies GeoJSONWithColor[];
        }

        fetchAll().then((files) => {
            setFiles(files.map((file) => ({...file, color: getColor(file, files)})));
        });

    }, [videoMapKey, sectorKeys, getColor]);

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
                        zoom={9}
                        style={{
                            position: 'absolute',
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
                    </LeafletMap>
                </Box>
            </CardContent>
        </Card>
    );

}