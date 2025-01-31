import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const { GeoJSON } = ReactLeaflet;

const Geojson = ({ children, ...props }) => {
  

  return (
    <GeoJSON {...props}>
      {children}
    </GeoJSON>
  )
}

export default Geojson;
