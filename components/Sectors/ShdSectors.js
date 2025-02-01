import * as React from "react";
import { GeoJSON } from "react-leaflet";

import { shdJSON } from "./sectorJSON";
import { shdPalette } from "@/theme/palette";

const shdKeyMapPair = {
  "4LL8Da7DF6qX3CXkHGzOwbc6VHX8fTNyrS70i9a2oDWnzZhY": shdJSON.mulrrNorth,
  "4LL8Da7DF6qXukInHVEEL01VT6rgH5tnjs7BlAICbvJ9RhQm": shdJSON.mulrrSouth,
  "4LL8Da7DF6qXO0f5ZQ9Ukylx3WduMS8YRrH2jvInmhbgGP0w": shdJSON.asperNorth,
  "4LL8Da7DF6qXhGXCidbUb7CVMZ2O1PvQnxLjRtHg9zXIfG3q": shdJSON.asperSouth,
  "4LL8Da7DF6qXOrrgLmu9Ukylx3WduMS8YRrH2jvInmhbgGP0": shdJSON.barinNorth,
  "4LL8Da7DF6qXm0IkvyeCoylBzOIRqaDNg5miY2WvHfuXFdxT": shdJSON.barinSouth,
  "4LL8Da7DF6qXVWi4Wwh4gY8xlr01XofkeThcybALwStQvBG3": shdJSON.iadfeNorth,
  "4LL8Da7DF6qXecmCgb3LxXtfypR734KE9zHT5nWBuSiwDsmV": shdJSON.iadfeSouth,
  "4LL8Da7DF6qXsll0TjqrPO4plEXj0imWYIeQGSA2hvCUFtx1": shdJSON.iadfwNorth,
  "4LL8Da7DF6qXuxR32pEEL01VT6rgH5tnjs7BlAICbvJ9RhQm": shdJSON.iadfwSouth,
  "4LL8Da7DF6qX4iTBAK7DF6qXlbNcQ0k8n5GWroESpTxLVBCe": shdJSON.manneNorth,
  "4LL8Da7DF6qXPT1BWwmz5uLOVqD2sf61PvR4eX9FlmhxyjCp": shdJSON.manneSouth
};

// const NorthShdSectors = (params) => {
//   //   console.log(params.region)
//   return (
//     <>
//       {params.sectors.showASPER && (
//         <GeoJSON
//           data={shdJSON.asperNorth}
//           style={{ weight: 1, color: shdPalette[0] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showBARIN && (
//         <GeoJSON
//           data={shdJSON.barinNorth}
//           style={{ weight: 1, color: shdPalette[1] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showIADFE && (
//         <GeoJSON
//           data={shdJSON.iadfeNorth}
//           style={{ weight: 1, color: shdPalette[2] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showIADFW && (
//         <GeoJSON
//           data={shdJSON.iadfwNorth}
//           style={{ weight: 1, color: shdPalette[3] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showMANNE && (
//         <GeoJSON
//           data={shdJSON.manneNorth}
//           style={{ weight: 1, color: shdPalette[4] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showMULRR && (
//         <GeoJSON
//           data={shdJSON.mulrrNorth}
//           style={{ weight: 1, color: shdPalette[5] }}
//           interactive={false}
//         />
//       )}
//     </>
//   );
// };

// const SouthShdSectors = (params) => {
//   // console.log(params.region)
//   return (
//     <>
//       {params.sectors.showASPER && (
//         <GeoJSON
//           data={shdJSON.asperSouth}
//           style={{ weight: 1, color: shdPalette[0] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showBARIN && (
//         <GeoJSON
//           data={shdJSON.barinSouth}
//           style={{ weight: 1, color: shdPalette[1] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showIADFE && (
//         <GeoJSON
//           data={shdJSON.iadfeSouth}
//           style={{ weight: 1, color: shdPalette[2] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showIADFW && (
//         <GeoJSON
//           data={shdJSON.iadfwSouth}
//           style={{ weight: 1, color: shdPalette[3] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showMANNE && (
//         <GeoJSON
//           data={shdJSON.manneSouth}
//           style={{ weight: 1, color: shdPalette[4] }}
//           interactive={false}
//         />
//       )}

//       {params.sectors.showMULRR && (
//         <GeoJSON
//           data={shdJSON.mulrrSouth}
//           style={{ weight: 1, color: shdPalette[5] }}
//           interactive={false}
//         />
//       )}
//     </>
//   );
// };


const shdSectors = (params) => {
  const [activeShdSectors, setActiveShdSectors] = React.useState([]);

  React.useEffect(()=>{
    setActiveShdSectors([]);

    params.sectorKeys.map((item)=>{
      console.log('map')
      console.log(item);

      fetch(`https://utfs.io/f/${item}`)
      .then((res) => res.json())
      .then((geojson) => {
        setActiveShdSectors(prevState => [...prevState,geojson]);
      })
      .catch(setActiveShdSectors([]))
    })

  },[params.sectorKeys])

  return (
    <>
      {

        activeShdSectors.map((item, index)=>{

            return (<GeoJSON
              key={index}
              data={item}
              style={{weight: 1, color: shdPalette[index]}}
              interactive={false}
            />)
          
        })
      }

      {/* {params.sectors.showASPER && (
        <GeoJSON
          data={shdJSON.asperSouth}
          style={{ weight: 1, color: shdPalette[0] }}
          interactive={false}
        />
      )}

      {params.sectors.showBARIN && (
        <GeoJSON
          data={shdJSON.barinSouth}
          style={{ weight: 1, color: shdPalette[1] }}
          interactive={false}
        />
      )}

      {params.sectors.showIADFE && (
        <GeoJSON
          data={shdJSON.iadfeSouth}
          style={{ weight: 1, color: shdPalette[2] }}
          interactive={false}
        />
      )}

      {params.sectors.showIADFW && (
        <GeoJSON
          data={shdJSON.iadfwSouth}
          style={{ weight: 1, color: shdPalette[3] }}
          interactive={false}
        />
      )}

      {params.sectors.showMANNE && (
        <GeoJSON
          data={shdJSON.manneSouth}
          style={{ weight: 1, color: shdPalette[4] }}
          interactive={false}
        />
      )}

      {params.sectors.showMULRR && (
        <GeoJSON
          data={shdJSON.mulrrSouth}
          style={{ weight: 1, color: shdPalette[5] }}
          interactive={false}
        />
      )} */}
    </>
  )
};

export default shdSectors;
