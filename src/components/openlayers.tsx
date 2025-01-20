/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import { countries, geoJsonStructure, mapDataType } from "@/constants";
import { formatTitle } from "@/lib/utils";
import MapLegend from "./map-legend";
import { format } from "path";

const OpenLayersMap = ({
  geoJsonData,
  mapData,
  country,
  mapType,
  chosenYear,
  chosenDistrict,
  preferredZoomScale,
  mapFilter,
}: any) => {
  const mapRef = useRef<any>();
  const mapElement = useRef<any>();
  const popupElement = useRef<any>();

  const subjectCountry = countries.find((e) => e.name === country);

  useEffect(() => {
    if (!mapElement.current) return;

    // Create vector source from GeoJSON if available
    let vectorSource;
    let vectorLayer;

    if (geoJsonData && geoJsonData.features) {
      try {
        vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(geoJsonData, {
            featureProjection: "EPSG:3857",
          }),
        });

        // Style function for features
        const styleFunction = (feature: any) => {
          const districtCode =
            feature.get(geoJsonStructure[country]?.district_code) || "";
          let value;
          try {
            value =
              mapType === mapDataType.normal
                ? mapData?.find((e) => e.code === districtCode)?.mean_rainfall
                : mapData?.find((e) => e.code === districtCode)
                    ?.rainfall_anomaly;
          } catch (error) {
            value = 0; // Default value if data structure is invalid
          }

          let fillColor = "#fff";

          if (mapFilter?.dataVariable === "rainfall") {
            if (value < -1100) fillColor = "#450A0A";
            else if (value < -900) fillColor = "#7F1D1D";
            else if (value < -600) fillColor = "#991B1B";
            else if (value < -300) fillColor = "#B91C1C";
            else if (value < -150) fillColor = "#DC2626";
            else if (value < -100) fillColor = "#EF4444";
            else if (value < -75) fillColor = "#f87171";
            else if (value < -50) fillColor = "#fca5a5";
            else if (value < -25) fillColor = "#fecaca";
            else if (value < 0) fillColor = "#fee2e2";
            else if (value === 0) fillColor = "#fff";
            else if (value < 25) fillColor = "#dcfce7";
            else if (value < 50) fillColor = "#bbf7d0";
            else if (value < 75) fillColor = "#86efac";
            else if (value < 100) fillColor = "#4ade80";
            else if (value < 150) fillColor = "#22c55e";
            else if (value < 300) fillColor = "#16a34a";
            else if (value < 450) fillColor = "#16a34a";
            else if (value < 600) fillColor = "#15803d";
            else if (value < 900) fillColor = "#166534";
            else if (value < 1100) fillColor = "#14532d";
          } else if (mapFilter?.dataVariable === "temperature") {
            if (value < -40) fillColor = "#1e3a8a";
            else if (value < -25) fillColor = "#1e40af";
            else if (value < -20) fillColor = "#1d4ed8";
            else if (value < -15) fillColor = "#2563eb";
            else if (value < -10) fillColor = "#3b82f6";
            else if (value < -5) fillColor = "#60a5fa";
            else if (value < 0) fillColor = "#93c5fd";
            else if (value === 0) fillColor = "#fff";
            else if (value < 2.5) fillColor = "#fde68a";
            else if (value < 5) fillColor = "#fcd34d";
            else if (value < 10) fillColor = "#fbbf24";
            else if (value < 15) fillColor = "#f59e0b";
            else if (value < 20) fillColor = "#d97706";
            else if (value < 25) fillColor = "#b45309";
            else if (value < 30) fillColor = "#92400e";
            else if (value < 50) fillColor = "#78350f";
          }

          return new Style({
            fill: new Fill({
              color: fillColor,
            }),
            stroke: new Stroke({
              color: districtCode === chosenDistrict ? "blue" : "black",
              width: districtCode === chosenDistrict ? 3 : 0.2,
            }),
          });
        };

        vectorLayer = new VectorLayer({
          source: vectorSource,
          style: styleFunction,
        });
      } catch (error) {
        console.warn("Error processing GeoJSON data:", error);
        // Create empty vector layer if GeoJSON processing fails
        vectorSource = new VectorSource();
        vectorLayer = new VectorLayer({
          source: vectorSource,
        });
      }
    } else {
      // Create empty vector layer if no GeoJSON data
      vectorSource = new VectorSource();
      vectorLayer = new VectorLayer({
        source: vectorSource,
      });
    }

    // Create map
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: subjectCountry?.coordinates
          ? fromLonLat([
              subjectCountry.coordinates[1],
              subjectCountry.coordinates[0],
            ])
          : fromLonLat([0, 0]),
        zoom: preferredZoomScale || subjectCountry?.zoom || 2,
      }),
    });

    // Create popup overlay
    const popup = new Overlay({
      element: popupElement.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });
    map.addOverlay(popup);

    // Add popup on hover only if we have valid GeoJSON data
    if (vectorSource && vectorSource.getFeatures().length > 0) {
      map.on("pointermove", (evt) => {
        const feature = map.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );

        if (feature) {
          try {
            const districtName =
              feature.get(geoJsonStructure[country]?.district_name) || "";
            const districtCode =
              feature.get(geoJsonStructure[country]?.district_code) || "";
            const provinceName =
              feature.get(geoJsonStructure[country]?.province_name) || "";
            const value =
              mapType === mapDataType.normal
                ? mapData?.find((e) => e.code === districtCode)?.mean_rainfall
                : mapData?.find((e) => e.code === districtCode)
                    ?.rainfall_anomaly;

            const coordinate = evt.coordinate;
            popup.setPosition(coordinate);

            if (popupElement.current) {
              popupElement.current.innerHTML = `
                ${formatTitle(districtName) || "--"} District,
                ${provinceName || "--"} : ${
                parseFloat(value)?.toFixed(2) || "--"
              } mm
              `;
              popupElement.current.style.display = "block";
            }
          } catch (error) {
            console.warn("Error displaying popup:", error);
            if (popupElement.current) {
              popupElement.current.style.display = "none";
            }
          }
        } else if (popupElement.current) {
          popupElement.current.style.display = "none";
        }
      });
    }

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, [
    geoJsonData,
    country,
    mapType,
    chosenYear,
    chosenDistrict,
    preferredZoomScale,
    mapFilter,
  ]);

  return (
    <div className="relative">
      <div ref={mapElement} className="w-full h-[400px] z-1" />
      <div
        ref={popupElement}
        className="bg-white p-3 rounded-sm shadow-lg text-sm z-2"
      />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[97%] bg-white/80 p-1 rounded-lg z-10">
        <MapLegend
          mapType={mapType || "normal"}
          variable={mapFilter?.dataVariable || "rainfall"}
        />
        <p className="text-center text-xs">{`${formatTitle(
          mapType || ""
        )} ${formatTitle(mapFilter?.dataVariable || "rainfall")} ${
          mapFilter?.dataVariable === "rainfall" ? "(mm)" : "(°C)"
        }`}</p>
      </div>
    </div>
  );
};

export default OpenLayersMap;
