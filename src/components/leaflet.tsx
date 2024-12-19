/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { countries, geoJsonStructure, mapDataType } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";

const Leaflet = ({
  geoJsonData,
  country,
  mapType,
  chosenYear,
  chosenDistrict,
  preferredZoomScale,
  mapFilter,
}: any) => {
  const subjectCountry = countries.find((e) => e.name === country);

  const countryStyle = {
    fillOpacity: 1,
    // color: "blue",
    // weight: 0.1,
    // dashArray: 5,
  };

  const onEachDistrict = (district: any, layer: any) => {
    const districtCode =
      district?.properties[geoJsonStructure[country]?.district_code] || "";
    const districtName =
      district?.properties[geoJsonStructure[country]?.district_name] || "";
    const provinceName =
      district?.properties[geoJsonStructure[country]?.province_name] || "";

    const value =
      mapType === mapDataType.normal
        ? district?.properties[mapFilter.dataVariable]?.normal[
            mapFilter.chosenMonth - 1
          ]
        : district?.properties[mapFilter.dataVariable]?.anomaly[
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
      ? ((layer.options.weight = 3), (layer.options.color = "blue"))
      : ((layer.options.weight = 0.2), (layer.options.color = "black"));

    if (mapFilter.dataVariable === "rainfall") {
      value < -1100
        ? (layer.options.fillColor = "#450A0A")
        : value < -900
        ? (layer.options.fillColor = "#7F1D1D")
        : value < -600
        ? (layer.options.fillColor = "#991B1B")
        : value < -300
        ? (layer.options.fillColor = "#B91C1C")
        : value < -150
        ? (layer.options.fillColor = "#DC2626")
        : value < -100
        ? (layer.options.fillColor = "#EF4444")
        : value < -75
        ? (layer.options.fillColor = "#f87171")
        : value < -50
        ? (layer.options.fillColor = "#fca5a5")
        : value < -25
        ? (layer.options.fillColor = "#fecaca")
        : value < 0
        ? (layer.options.fillColor = "#fee2e2")
        : value == 0
        ? (layer.options.fillColor = "#fff")
        : value < 25
        ? (layer.options.fillColor = "#dcfce7")
        : value < 50
        ? (layer.options.fillColor = "#bbf7d0")
        : value < 75
        ? (layer.options.fillColor = "#86efac")
        : value < 100
        ? (layer.options.fillColor = "#4ade80")
        : value < 150
        ? (layer.options.fillColor = "#22c55e")
        : value < 300
        ? (layer.options.fillColor = "#16a34a")
        : value < 450
        ? (layer.options.fillColor = "#16a34a")
        : value < 600
        ? (layer.options.fillColor = "#15803d")
        : value < 900
        ? (layer.options.fillColor = "#166534")
        : value < 1100
        ? (layer.options.fillColor = "#14532d")
        : (layer.options.fillColor = "#fff");
    } else if (mapFilter.dataVariable === "temperature") {
      value < -40
        ? (layer.options.fillColor = "#1e3a8a")
        : value < -25
        ? (layer.options.fillColor = "#1e40af")
        : value < -20
        ? (layer.options.fillColor = "#1d4ed8")
        : value < -15
        ? (layer.options.fillColor = "#2563eb")
        : value < -10
        ? (layer.options.fillColor = "#3b82f6")
        : value < -5
        ? (layer.options.fillColor = "#60a5fa")
        : value < 0
        ? (layer.options.fillColor = "#93c5fd")
        : value == 0
        ? (layer.options.fillColor = "#fff")
        : value < 2.5
        ? (layer.options.fillColor = "#fde68a")
        : value < 5
        ? (layer.options.fillColor = "#fcd34d")
        : value < 10
        ? (layer.options.fillColor = "#fbbf24")
        : value < 15
        ? (layer.options.fillColor = "#f59e0b")
        : value < 20
        ? (layer.options.fillColor = "#d97706")
        : value < 25
        ? (layer.options.fillColor = "#b45309")
        : value < 30
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
          scrollWheelZoom={true}
          style={{
            zIndex: 1,
          }}
        >
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

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
