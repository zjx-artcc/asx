import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";



import { TileLayer } from "react-leaflet/TileLayer";

const { MapContainer } = ReactLeaflet;

const Map = ({ children, ...rest }) => {

//   useEffect(() => {
//     (async function init() {
//       delete Leaflet.Icon.Default.prototype._getIconUrl;
//       Leaflet.Icon.Default.mergeOptions({
//         iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
//         iconUrl: "leaflet/images/marker-icon.png",
//         shadowUrl: "leaflet/images/marker-shadow.png",
//       });
//     })();
//   }, []);

  return (
    <MapContainer {...rest}>        
      {children}
    </MapContainer>
  );
};

export default Map;
