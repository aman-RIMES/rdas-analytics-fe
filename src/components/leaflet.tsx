/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countries } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";
import MapLegend from "./map-legend";
import { useEffect, useState } from "react";
import geoJson from "@/data/new.json";

const Leaflet = ({ geoJsonData = geoJson, country = "IND" }: any) => {
  const subjectCountry = countries.find((e) => e.value === country);

  const countryStyle = {
    fillColor: "grey",
    fillOpacity: 0.7,
    color: "black",
    weight: 0.5,
    // dashArray: 5,
  };

  const [map, setMap] = useState(null);

  const onEachDistrict = (district: any, layer: any) => {
    const districtName = district.properties.District;
    const provinceName = district.properties.Province;
    const value = district.properties.data_value;
    layer.bindPopup(`
      ${formatTitle(
        districtName
      )} District,                                              
      ${provinceName} : ${parseInt(value).toFixed(2)}`);

    layer.options.fillColor = "green";

    district.properties.data_value < 250
      ? (layer.options.fillOpacity = 0.2)
      : district.properties.data_value < 500
      ? (layer.options.fillOpacity = 0.4)
      : district.properties.data_value < 750
      ? (layer.options.fillOpacity = 0.6)
      : district.properties.data_value < 1000
      ? (layer.options.fillOpacity = 0.8)
      : (layer.options.fillOpacity = 1);

    // layer.on({
    //   click: (event) => {
    //     event.target.setStyle({ fillColor: "red" });
    //   },
    //   mouseover: (event) => {
    //     event.target.setStyle({ fillColor: "blue" });
    //   },
    // });
  };
  return (
    <div>
      <div className="">
        <MapContainer
          //@ts-ignore
          center={subjectCountry?.coordinates}
          zoom={subjectCountry?.zoom}
          scrollWheelZoom={false}
          whenReady={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapLegend map={map} />

          {/* <GeoJSON
            style={countryStyle}
            data={geoJsonData.features}
            onEachFeature={onEachDistrict}
          /> */}
        </MapContainer>
      </div>
    </div>
  );
};

export default Leaflet;
