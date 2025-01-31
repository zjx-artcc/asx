import {AirportConditionWithAirport} from "@/components/Viewer/AirspaceViewer";
import {Chip} from "@mui/material";
import React from "react";

export const getConditionChips = (conditions: AirportConditionWithAirport[]) => {
    const airports = conditions.map(condition => condition.airport);
    // do the filtering by icao
    const uniqueAirportIcaos = Array.from(new Set(airports.map(airport => airport.icao)));
    return uniqueAirportIcaos.map((icao, idx) => (
        <Chip key={idx} color="primary" size="small" label={icao}/>
));
}