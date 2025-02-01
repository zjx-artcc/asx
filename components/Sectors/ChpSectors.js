import * as React from "react";
import { GeoJSON } from "react-leaflet";

import { chpJSON } from "./sectorJSON";
import { chpPalette } from "@/theme/palette";
// import { geoJson, latLng, marker } from "leaflet";

const EastChpSectors = (params) => {
  console.log(params.region);
  return (
    <>
      {params.sectors.showBUFFR && (
        <GeoJSON
          data={chpJSON.buffr}
          style={{ weight: 1, color: chpPalette[0] }}
          interactive={false}
        />
      )}

      {params.sectors.showBWIFS && (
        <GeoJSON
          data={chpJSON.bwifsEast}
          style={{ weight: 1, color: chpPalette[1] }}
          interactive={false}
        />
      )}

      {params.sectors.showGRACO && (
        <GeoJSON
          data={chpJSON.gracoEast}
          style={{ weight: 1, color: chpPalette[2] }}
          interactive={false}
        />
      )}

      {params.sectors.showWOOLY && (
        <GeoJSON
          data={chpJSON.woolyEast}
          style={{ weight: 1, color: chpPalette[3] }}
          interactive={false}
        />
      )}
    </>
  );
};

const WestChpSectors = (params) => {
  // console.log(params.region)
  return (
    <>
      {params.sectors.showBUFFR && (
        <GeoJSON
          data={chpJSON.buffr}
          style={{ weight: 1, color: chpPalette[0] }}
          interactive={false}
        />
      )}

      {params.sectors.showBWIFS && (
        <GeoJSON
          data={chpJSON.bwifsWest}
          style={{ weight: 1, color: chpPalette[1] }}
          interactive={false}
        />
      )}

      {params.sectors.showGRACO && (
        <GeoJSON
          data={chpJSON.gracoWest}
          style={{ weight: 1, color: chpPalette[2] }}
          interactive={false}
        />
      )}

      {params.sectors.showWOOLY && (
        <GeoJSON
          data={chpJSON.woolyWest}
          style={{ weight: 1, color: chpPalette[3] }}
          interactive={false}
        />
      )}
    </>
  );
};


const chpSectors = (params) => {
  switch (params.region) {
    case "CHP_EAST":
      return <EastChpSectors {...params} />;
    case "CHP_WEST":
      return <WestChpSectors {...params} />;
  }
};

export default chpSectors;
