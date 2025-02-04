import * as React from "react";
import {useEffect, useState} from "react";
import {Typography} from "@mui/material";

import {useMap,} from "react-leaflet";

import L from "leaflet";

import * as leafletPip from "@mapbox/leaflet-pip";


const Tooltips = (params) => {

    const map = useMap();
    const [coords, setCoords] = useState({});
    const [tooltip,] = useState([]);

    useEffect(() => {
        if (!map) return;

        map.addEventListener("mousemove", (e) => {
            setCoords({lat: e.latlng.lat, lng: e.latlng.lng});
        });
    }, [map]);

    const {lat, lng} = coords;

    useEffect(() => {
        if (!lat) return;

        for (const i in params.sectors) {
            var hover = leafletPip.pointInLayer([lng, lat], L.geoJson(params.sectors[i].json))

            if (hover.length) {
                const altitudeShelves = Object.entries(hover[0]?.feature.properties).filter(([k, v]) => v !== null && k !== "fid");

                let lowAlt = altitudeShelves[0][0]
                    .split(" ")
                    .reverse()[0];

                let highAlt = Object.entries(hover[0]?.feature.properties)
                    .filter(([k, v]) => v !== null && k !== "fid")[0][0]
                    .split(" ")
                    .reverse()[1]?.replace('FL', '');

                if (highAlt === 'AOA') {
                    highAlt = lowAlt;
                    lowAlt = 'AOA';
                } else if (highAlt === 'AOB') {
                    highAlt = lowAlt;
                    lowAlt = 'AOB';
                }


                if (Number(lowAlt) && Number(highAlt) && Number(highAlt) < Number(lowAlt)) {
                    const temp = lowAlt;
                    lowAlt = highAlt;
                    highAlt = temp;
                }

                const sectorKey = params.sectors[i].key;

                let name = params.sectors[i].json.name;

                if (params.consolidations[sectorKey]) {
                    const referencedSector = params.sectors.find((sector) => sector.key === sectorKey);
                    if (referencedSector?.json?.name) {
                        name = referencedSector.json.name;
                    }
                }


                var data = hover[0] ? {
                    sector: name,
                    lowAltitude: lowAlt,
                    highAltitude: highAlt,
                    mixedAltitude: altitudeShelves.length > 1 ? altitudeShelves[0][1].split(" ").reverse().join(" ") : null
                } : '';


                var index = tooltip.findIndex((item) => item.sector === params.sectors[i].json.name);
                if (index === -1) {
                    tooltip.push(data);
                } else {
                    tooltip[index] = data;
                }

            } else {
                var index = tooltip.findIndex((item) => item.sector === params.sectors[i].json.name);
                if (index > -1) {
                    tooltip.splice(index, 1)
                }
            }
        }


    }, [params.consolidations, lat, lng, params.sectors, tooltip]);

    tooltip.sort((a, b) => b.lowAltitude - a.lowAltitude)


    return (
        <>
            {lat && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: "1vw",
                        maxWidth: "350px",
                        minHeight: "1vw",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        backgroundColor: "#272727",
                        color: "#fff",
                        zIndex: 800,
                        borderRadius: "10px",
                        margin: "1rem",
                        padding: "1rem",

                    }}
                >
                    {Array.from(tooltip).map((item) => {
                        return (
                            <>
                                {item.mixedAltitude ? <Typography key={item.sector}>
                                    {item.sector}: {item.mixedAltitude}
                                </Typography> : <Typography key={item.sector + "a"}>
                                    {item.sector}: {item.lowAltitude === 0 ? "SFC" : item.lowAltitude} {item.highAltitude ? item.highAltitude : ''}
                                </Typography>}
                            </>
                        );

                    })}

                </div>
            )}
        </>
    );
};

export default Tooltips;
