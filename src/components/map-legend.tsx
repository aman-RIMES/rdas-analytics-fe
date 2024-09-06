import L from "leaflet";
import { useEffect } from "react";
// import "./Legend.css";

function MapLegend({ map }) {
  console.log(map);
  useEffect(() => {
    if (map) {
      //   const legend = L.Routin({ position: "bottomright" });
      const legend = L.Routing.control({ position: "bottomright" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML =
          "<h4>This is the legend</h4>" +
          "<b>Lorem ipsum dolor sit amet consectetur adipiscing</b>";
        return div;
      };

      legend.addTo(map);
    }
  }, [map]);
  return null;
}

export default MapLegend;
