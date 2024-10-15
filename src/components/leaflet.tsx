/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countries, mapDataType } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";
import { useEffect } from "react";

const Leaflet = ({
  geoJsonData,
  country,
  mapType,
  chosenYear,
  chosenDistrict,
  preferredZoomScale,
  mapFilter,
}: any) => {
  const subjectCountry = countries.find((e) => e.value === country);

  const countryStyle = {
    fillOpacity: 0.7,
    // color: "blue",
    // weight: 0.1,
    // dashArray: 5,
  };

  const onEachDistrict = (district: any, layer: any) => {
    const districtCode =
      country === "PAK"
        ? district?.properties?.ADM2_PCODE
        : district?.properties?.SA_Code;
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
        ? district?.properties[mapFilter.dataVariable][mapType][
            mapFilter.chosenMonth - 1
          ]
        : district?.properties[mapFilter.dataVariable][mapType][
            mapFilter.chosenMonth - 1
          ][chosenYear];
    layer.bindPopup(`
      ${
        districtName ? formatTitle(districtName) : "--"
      } District,                                              
      ${provinceName ? provinceName : "--"} : ${parseFloat(value)?.toFixed(
      2
    )} mm`);

    chosenDistrict === districtCode
      ? ((layer.options.weight = 3), (layer.options.color = "orange"))
      : ((layer.options.weight = 0.2), (layer.options.color = "black"));

    if (mapFilter.dataVariable === "rainfall") {
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
        : value === 0
        ? (layer.options.fillColor = "#fff")
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
        : (layer.options.fillColor = "#fff");
    } else if (mapFilter.dataVariable === "temperature") {
      value < -40
        ? (layer.options.fillColor = "#064e3b")
        : value < -35
        ? (layer.options.fillColor = "#065f46")
        : value < -30
        ? (layer.options.fillColor = "#047857")
        : value < -25
        ? (layer.options.fillColor = "#059669")
        : value < -20
        ? (layer.options.fillColor = "#10b981")
        : value < -15
        ? (layer.options.fillColor = "#34d399")
        : value < -10
        ? (layer.options.fillColor = "#6ee7b7")
        : value < -5
        ? (layer.options.fillColor = "#a7f3d0")
        : value < 0
        ? (layer.options.fillColor = "#ecfdf5")
        : value < 5
        ? (layer.options.fillColor = "#fffbeb")
        : value < 10
        ? (layer.options.fillColor = "#fef3c7")
        : value < 15
        ? (layer.options.fillColor = "#fde68a")
        : value < 20
        ? (layer.options.fillColor = "#fcd34d")
        : value < 25
        ? (layer.options.fillColor = "#fbbf24")
        : value < 30
        ? (layer.options.fillColor = "#f59e0b")
        : value < 35
        ? (layer.options.fillColor = "#d97706")
        : value < 40
        ? (layer.options.fillColor = "#b45309")
        : value < 45
        ? (layer.options.fillColor = "#92400e")
        : value < 50
        ? (layer.options.fillColor = "#78350f")
        : (layer.options.fillColor = "#fff");
    }

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
          zoom={preferredZoomScale ? preferredZoomScale : subjectCountry?.zoom}
          scrollWheelZoom={false}
          style={{
            zIndex: 1,
          }}
        >
          {/* <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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
