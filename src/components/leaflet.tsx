/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoJson from "@/data/new.json";
import { countries } from "@/constants";
import "@/leaflet.css";
import { formatTitle } from "@/lib/utils";

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
    const districtName = district.properties.District;
    const provinceName = district.properties.Province;
    layer.bindPopup(`
      ${formatTitle(
        districtName
      )} District,                                              
      ${provinceName}`);

    // if (district.properties.data_value ) {
    //   layer.options.fillColor = "greenyellow";
    //   layer.options.fillOpacity = 1;
    // }

    switch (district.properties.data_value) {
      case district.properties.data_value < 300:
        layer.options.fillColor = "greenyellow";
        layer.options.fillOpacity = 1;
        break;
      case district.properties.data_value < 600:
        layer.options.fillColor = "green";
        layer.options.fillOpacity = 1;
        break;
      case district.properties.data_value < 900:
        layer.options.fillColor = "brown";
        layer.options.fillOpacity = 1;
        break;

      // default:
      //   layer.options.fillColor = "red";
      //   layer.options.fillOpacity = 1;
      //   break;
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
          center={subjectCountry?.coordinates}
          zoom={subjectCountry?.zoom}
          scrollWheelZoom={true}
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
