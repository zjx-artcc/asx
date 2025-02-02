import * as React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

import {
  useMap,
} from "react-leaflet";

import L from "leaflet";

import * as leafletPip from "@mapbox/leaflet-pip";


const Tooltips = (params) => {
  const map = useMap();
  const [coords, setCoords] = useState({});
  const [tooltip, ] = useState([]);

  useEffect(() => {
    if (!map) return;

    map.addEventListener("mousemove", (e) => {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }, [map]);

  const { lat, lng } = coords;

  useEffect(() => {
    if (!lat) return;

    for (const i in params.sectors){
      var hover = leafletPip.pointInLayer([lng,lat],L.geoJson(params.sectors[i].json))

      if (hover.length) {
          // console.log(hover[0]?.feature.properties)
          // console.log(Object.entries(hover[0]?.feature.properties).filter(([k, v]) => v !== null && k !== "fid"))
          const altitudeShelves = Object.entries(hover[0]?.feature.properties).filter(([k, v]) => v !== null && k !== "fid");

            var lowAlt = Object.entries(hover[0]?.feature.properties)
            .filter(([k, v]) => v !== null && k !== "fid")[0][0]
            .split(" ")
            .reverse()[0];
            
      
            var data = hover[0] ? {
              sector: params.sectors[i].json.name,
              lowAltitude: lowAlt === "SFC" ? 0 : Number(lowAlt),
              highAltitude: Number(Object.entries(hover[0]?.feature.properties)
                .filter(([k, v]) => v !== null && k !== "fid")[0][0]
                .split(" ")
                .reverse()[1]),
              mixedAltitude: altitudeShelves.length > 1 ? altitudeShelves[0][1].split(" ").reverse().join(" ") : null
            } : '';

            var index = tooltip.findIndex((item) => item.sector === params.sectors[i].json.name);
            if (index === -1) {
              tooltip.push(data);
            } else {
              tooltip[index] = data;
            }

        }else{
          var index = tooltip.findIndex((item) => item.sector === params.sectors[i].json.name);
          if (index > -1){
            tooltip.splice(index,1)
          }
        }
    }
    

    // console.log("tooltip", Array.from(tooltip));
  }, [lat]);

  tooltip.sort((a,b)=> b.lowAltitude - a.lowAltitude)


  return (
    <>
      {lat && (
        <div
          style={{
            display: "flex",
            flexDirection:"column",
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
                </Typography>: <Typography key={item.sector+"a"}>
                  {item.sector}: {item.lowAltitude===0 ? "SFC" : item.lowAltitude} {item.highAltitude ? item.highAltitude : ''}
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
