import * as ReactLeaflet from "react-leaflet";
import {AttributionControl} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

const {MapContainer} = ReactLeaflet;

const Map = ({children, ...rest}) => {

    // useEffect(() => {
    //   (async function init() {
    //     delete Leaflet.Icon.Default.prototype._getIconUrl;
    //     Leaflet.Icon.Default.mergeOptions({
    //       iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
    //       iconUrl: "leaflet/images/marker-icon.png",
    //       shadowUrl: "leaflet/images/marker-shadow.png",
    //     });
    //   })();
    // }, []);

    return (
        <MapContainer {...rest}>
            <AttributionControl position="bottomleft" prefix={false}>

            </AttributionControl>
            <div className="leaflet-control-container">
                <div className=" leaflet-bottom leaflet-left">
                    <div className="leaflet-control-attribution leaflet-control">
                        &copy; 2025&nbsp;
                        <Link href="https://zjxartcc.org">
                            Virtual Jacksonville ARTCC
                        </Link>
                    </div>
                </div>
            </div>

            {children}
        </MapContainer>
    );
};

export default Map;
