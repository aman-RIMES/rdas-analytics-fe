/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countries } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";
import { useEffect } from "react";

const Leaflet = ({ geoJsonData, country }: any) => {
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
    const value = district?.properties?.data_value;
    layer.bindPopup(`
      ${
        districtName ? formatTitle(districtName) : "--"
      } District,                                              
      ${provinceName ? provinceName : "--"} : ${parseInt(value)?.toFixed(2)}`);

    layer.options.fillColor = "green";

    district.properties.data_value < 300
      ? (layer.options.fillOpacity = 0.2)
      : district.properties.data_value < 600
      ? (layer.options.fillOpacity = 0.4)
      : district.properties.data_value < 900
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
