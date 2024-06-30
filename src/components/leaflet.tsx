/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Leaflet = (geoJsonData: any) => {
  const countryStyle = {
    fillColor: "grey",
    color: "orange",
    weight: 0.5,
  };
  return (
    <div>
      <div className="">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={6}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON style={countryStyle} data={geoJsonData.data.features} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Leaflet;
