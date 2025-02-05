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
    manualOwnedBy: { // noinspection JSUnusedLocalSymbols
        [key: string]: string,
    }
}) {

    const [displayedAltitudes, setDisplayedAltitudes] = useState<{
        name: string,
        key: string,
        ownedBy: string,
        altitude: string,
    }[]>([]);
    const [lat, setLat] = useState<number>();
    const [lng, setLng] = useState<number>();
    const map = useMap();

    const getOwnerSector = useCallback((sector: GeoJSONWithColor, ownedBy?: string) => {
        if (!ownedBy) return sector;

        const ownedSector = sectors.find(s => s.key === ownedBy);

        return ownedSector || sector;
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
            const polygons = getPolygonsContaining(sector.json as unknown as GeoJsonObject);
            const ownerSector = getOwnerSector(sector, manualOwnedBy[sector.key]);

            if (polygons.length > 0) {
                const altitudes: string[] = Object.entries(polygons[0].feature.properties).filter(([k, v]) => k !== 'fid' && !!v).map(([v]) => v);
                let firstNonNullAltitude = altitudes.find(Boolean);

                if (!firstNonNullAltitude) continue;

                const splitShelves = firstNonNullAltitude.split(' - ');

                for (const shelf of splitShelves) {
                    let altitudeComponents = shelf.replace('FL', '').replace('SFC', '000').split(' ');

                    if (altitudeComponents.length !== 2) continue;

                    const allNumbers = altitudeComponents.every(c => !isNaN(Number(c)));

                    if (!allNumbers) continue;

                    if (Number(altitudeComponents[1]) < Number(altitudeComponents[0])) {
                        altitudeComponents.reverse();
                    }

                    altitudeComponents = altitudeComponents.map(c => Number(c) >= 180 ? `FL${c}` : c).map(c => Number(c) === 0 ? 'SFC' : c);

                    const newShelf = altitudeComponents.join('-');

                    const shelfIdx = splitShelves.indexOf(shelf);
                    splitShelves[shelfIdx] = newShelf;
                }

                firstNonNullAltitude = splitShelves.join(' / ');

                setDisplayedAltitudes((prev) => {
                    if (!prev) prev = [];

                    const existingSectorAlt = prev.find(a => a.key === sector.key);

                    if (existingSectorAlt && existingSectorAlt.altitude === firstNonNullAltitude) {
                        return prev;
                    }

                    const name = ownerSector.json?.name || ownerSector.key;

                    return [...prev, {name, altitude: firstNonNullAltitude, key: sector.key, ownedBy: ownerSector.key}];
                });
            } else {
                setDisplayedAltitudes((prev) => {
                    const uniqueSectors = new Map<string, typeof prev[0]>();
                    for (let i = prev.length - 1; i >= 0; i--) {
                        if (!uniqueSectors.has(prev[i].key) && prev[i].key !== sector.key) {
                            uniqueSectors.set(prev[i].key, prev[i]);
                        }
                    }
                    return Array.from(uniqueSectors.values());
                });
            }
        }

        return () => {
            map.removeEventListener('mousemove');
        };
    }, [map, updateCoords, getPolygonsContaining, sectors, getOwnerSector, manualOwnedBy]);

    return displayedAltitudes.length > 0 && (
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
            <Typography variant="subtitle2" textAlign="center" gutterBottom>Sector Altitudes</Typography>
            {displayedAltitudes
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => a.altitude.localeCompare(b.altitude))
                .map((a, idx) => (
                <Typography key={a.key + idx} variant="body2">{a.name}: <b>{a.altitude}</b></Typography>
            ))}
        </Paper>
    );
}