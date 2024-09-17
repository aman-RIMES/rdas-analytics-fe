/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countries, mapDataType } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";
import { useEffect } from "react";

const Leaflet = ({ geoJsonData, country, mapType }: any) => {
  const subjectCountry = countries.find((e) => e.value === country);

  const countryStyle = {
    fillColor: "grey",
    fillOpacity: 0.7,
    color: "black",
    weight: 0.5,
    // dashArray: 5,
  };

  const onEachDistrict = (district: any, layer: any) => {
    const districtName = district?.properties?.District;
    const provinceName = district?.properties?.Province;
    const value =
      mapType === mapDataType.normal
        ? district?.properties?.normal_rainfall
        : district?.properties?.rainfall_anomaly[0];

    layer.bindPopup(`
      ${
        districtName ? formatTitle(districtName) : "--"
      } District,                                              
      ${provinceName ? provinceName : "--"} : ${parseInt(value)?.toFixed(2)}`);

    layer.options.fillColor = value > 0 ? "green" : "red";

    value < 300
      ? (layer.options.fillOpacity = 0.2)
      : value < 600
      ? (layer.options.fillOpacity = 0.4)
      : value < 1200
      ? (layer.options.fillOpacity = 0.4)
      : value < 1800
      ? (layer.options.fillOpacity = 0.4)
      : value < 2500
      ? (layer.options.fillOpacity = 0.6)
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
        >
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}

          <GeoJSON
            style={countryStyle}
            data={geoJsonData.features}
            onEachFeature={onEachDistrict}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Leaflet;
