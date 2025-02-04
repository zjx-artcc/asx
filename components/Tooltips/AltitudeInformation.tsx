'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {useMap} from "react-leaflet";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as leafletPip from "@mapbox/leaflet-pip";
import L from "leaflet";
import {GeoJSONWithColor} from "@/components/Viewer/Map/Map";
import {GeoJsonObject} from "geojson";
import {Paper, Typography} from "@mui/material";

export default function AltitudeInformation({sectors, manualOwnedBy}: {
    sectors: GeoJSONWithColor[],
    manualOwnedBy: { [key: string]: string, }
}) {

    const [displayedAltitudes, setDisplayedAltitudes] = useState<string[]>([]);
    const [lat, setLat] = useState<number>();
    const [lng, setLng] = useState<number>();
    const map = useMap();

    const getSectorName = useCallback((sector: GeoJSONWithColor, ownedBy?: string) => {
        if (!ownedBy) return sector.json.name;

        const ownedSector = sectors.find(s => s.key === ownedBy);

        if (!ownedSector) return sector.json.name;

        return ownedSector.json.name;
    }, [sectors]);

    const updateCoords = useCallback(() => {
        if (!map) return;

        map.addEventListener('mousemove', (e) => {
            setLat(e.latlng.lat);
            setLng(e.latlng.lng);
        });
    }, [map]);

    const getPolygonsContaining = useCallback((geoJson: GeoJsonObject) => {
        if (!lat || !lng) return [];

        const polygon = L.geoJSON(geoJson);

        return leafletPip.pointInLayer([lng, lat], polygon);
    }, [lat, lng]);

    useEffect(() => {

        updateCoords();

        for (const sector of sectors) {

            // can be at most 1 polygon
            const polygons = getPolygonsContaining(sector.json as unknown as GeoJsonObject);

            if (polygons.length > 0) {

                const altitudes: string[] = Object.entries(polygons[0].feature.properties).filter(([k, v]) => k !== 'fid' && !!v).map(([v]) => v);

                const firstNonNullAltitude = altitudes.find(a => !!a);

                if (!firstNonNullAltitude) continue;

                const name = getSectorName(sector, manualOwnedBy[sector.key]);


                setDisplayedAltitudes((prev) => {
                    if (!prev) prev = [];

                    const idx = prev.findIndex(a => a.split(": ")[0] === name);

                    if (idx !== -1 && (!manualOwnedBy[sector.key] || manualOwnedBy[sector.key] === sector.key)) {
                        return prev;
                    }

                    return [...prev, `${name}: ${firstNonNullAltitude}`];
                });
            } else {
                setDisplayedAltitudes((prev) => {
                    if (!prev) prev = [];

                    const name = getSectorName(sector, manualOwnedBy[sector.key]);

                    const idx = prev.findIndex(a => a.startsWith(name));

                    if (idx !== -1 && (!manualOwnedBy[sector.key] || manualOwnedBy[sector.key] === sector.key)) {
                        return prev.filter(a => !a.startsWith(name));
                    }

                    return prev;
                });
            }
        }

        return () => {
            map.removeEventListener('mousemove');
        };
    }, [map, updateCoords, getPolygonsContaining, sectors, getSectorName, manualOwnedBy]);

    return (
        <Paper
            sx={{
                minWidth: "1vw",
                maxWidth: "350px",
                minHeight: "1vw",
                position: "absolute",
                right: 0,
                top: 0,
                zIndex: 999,
                m: 2,
                p: 2,
            }}
        >
            {displayedAltitudes.map((a, idx) => (
                <Typography key={idx}>{a}</Typography>
            ))}
        </Paper>
    );
}