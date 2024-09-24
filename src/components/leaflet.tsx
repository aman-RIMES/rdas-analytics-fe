/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countries, mapDataType } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";
import { useEffect } from "react";

const Leaflet = ({ geoJsonData, country, mapType, chosenYear }: any) => {
  const subjectCountry = countries.find((e) => e.value === country);

  const countryStyle = {
    fillOpacity: 0.7,
    color: "black",
    weight: 0.1,
    // dashArray: 5,
  };

  const onEachDistrict = (district: any, layer: any) => {
    const districtName =
      country === "PAK"
        ? district?.properties?.ADM2_EN
        : district?.properties?.District;
    const provinceName =
      country === "PAK"
        ? district?.properties?.ADM1_EN
        : district?.properties?.Province;
    const value =
      mapType === mapDataType.normal
        ? district?.properties?.normal_rainfall
        : district?.properties?.rainfall_anomaly[chosenYear - 1];

    layer.bindPopup(`
      ${
        districtName ? formatTitle(districtName) : "--"
      } District,                                              
      ${provinceName ? provinceName : "--"} : ${parseInt(value)?.toFixed(
      2
    )} mm`);

    value < -1600
      ? (layer.options.fillColor = "#7f1d1d")
      : value < -1400
      ? (layer.options.fillColor = "#991b1b")
      : value < -1200
      ? (layer.options.fillColor = "#b91c1c")
      : value < -1000
      ? (layer.options.fillColor = "#dc2626")
      : value < -800
      ? (layer.options.fillColor = "#ef4444")
      : value < -600
      ? (layer.options.fillColor = "#f87171")
      : value < -400
      ? (layer.options.fillColor = "#fca5a5")
      : value < -200
      ? (layer.options.fillColor = "#fecaca")
      : value < 0
      ? (layer.options.fillColor = "#fee2e2")
      : value < 350
      ? (layer.options.fillColor = "#f0fdf4")
      : value < 700
      ? (layer.options.fillColor = "#dcfce7")
      : value < 1400
      ? (layer.options.fillColor = "#bbf7d0")
      : value < 2100
      ? (layer.options.fillColor = "#86efac")
      : value < 2800
      ? (layer.options.fillColor = "#4ade80")
      : value < 3500
      ? (layer.options.fillColor = "#22c55e")
      : value < 4200
      ? (layer.options.fillColor = "#15803d")
      : (layer.options.fillColor = "#166534");

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
          style={{
            zIndex: 1,
          }}
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
