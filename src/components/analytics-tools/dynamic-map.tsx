import { useEffect, useState } from "react";
import OpenLayersMap from "../openlayers";
import {
  BASE_URL,
  countries,
  ElNinoToolDataIndicators,
  monthsList,
  requestStatus,
  toolType,
} from "@/constants";
import {
  cn,
  formatTitle,
  getAnalyticsToolType,
  getMetricUnit,
  transformObject,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { MapFilterData, MapFormData } from "@/types";
import { grid } from "ldrs";
import axios from "axios";
import MapOverlay from "./map-overlay";
import { useLocation } from "react-router-dom";
grid.register("l-grid");

const DynamicMap = ({ filterData, loadAnalysisData }) => {
  const location = useLocation();
  const climatePattern = getAnalyticsToolType(location.pathname);
  const [mapFilter, setMapFilter] = useState<MapFilterData>({
    dataVariable: "",
    chosenMonth: "1",
  });
  const [anomalyYear, setAnomalyYear] = useState<any>({
    firstAnomalyMap: "",
    secondAnomalyMap: "",
  });
  const [previousFormData, setPreviousFormData] = useState<any>({});
  const [mapFormData, setMapFormData] = useState<MapFormData>({
    fromYear: "",
    toYear: "",
    countryValue: "",
  });
  const yearList = [];
  for (
    let i: any = parseInt(mapFormData.fromYear);
    i <= parseInt(mapFormData.toYear);
    i++
  ) {
    yearList.push({ value: i.toString(), label: i.toString() });
  }
  const [geoJsonData, setGeoJsonData] = useState<any>({});
  const [firstAnomalyMapData, setFirstAnomalyMapData] = useState<any>({});
  const [secondAnomalyMapData, setSecondAnomalyMapData] = useState<any>({});
  const [normalMapData, setNormalMapData] = useState<any>({});
  const [geoJsonStatus, setGeoJsonStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [normalMapStatus, setNormalMapStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [firstAnomalyMapStatus, setFirstAnomalyMapStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [secondAnomalyMapStatus, setSecondAnomalyMapStatus] =
    useState<requestStatus>(requestStatus.idle);

  const handleMapFilterChange = (name: string, value: string) => {
    setMapFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnomalyYearChange = (name: string, value: string) => {
    setAnomalyYear((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!loadAnalysisData) {
      fetchNormalMapData(previousFormData);
      fetchAnomalyMapData(
        previousFormData,
        setFirstAnomalyMapData,
        setFirstAnomalyMapStatus,
        parseInt(anomalyYear.firstAnomalyMap) || parseInt(mapFormData.fromYear)
      );
      fetchAnomalyMapData(
        previousFormData,
        setSecondAnomalyMapData,
        setSecondAnomalyMapStatus,
        parseInt(anomalyYear.secondAnomalyMap) || parseInt(mapFormData.fromYear)
      );
    }
  }, [mapFilter]);

  useEffect(() => {
    if (anomalyYear.firstAnomalyMap) {
      fetchAnomalyMapData(
        previousFormData,
        setFirstAnomalyMapData,
        setFirstAnomalyMapStatus,
        parseInt(anomalyYear.firstAnomalyMap)
      );
    }
  }, [anomalyYear.firstAnomalyMap]);

  useEffect(() => {
    if (anomalyYear.secondAnomalyMap) {
      fetchAnomalyMapData(
        previousFormData,
        setSecondAnomalyMapData,
        setSecondAnomalyMapStatus,
        parseInt(anomalyYear.secondAnomalyMap)
      );
    }
  }, [anomalyYear.secondAnomalyMap]);

  useEffect(() => {
    setMapFormData({
      fromYear: filterData.fromYear,
      toYear: filterData.toYear,
      countryValue: filterData.countryValue,
    });

    (async () => {
      if (loadAnalysisData) {
        const requestBody = {
          indic: `${filterData.dataVariable[0]}`,
          area: [`${filterData.districtValue}`],
          crop: filterData.cropValue,
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
          country: filterData.countryValue,
          months: 1,
          year: filterData.fromYear,
          multipleSources:
            filterData.source === "multipleSources"
              ? JSON.stringify(filterData.multipleSources)
              : "",
        };
        const formData = new FormData();
        Object.keys(requestBody).map((key) => {
          formData.append(key, requestBody[key]);
        });
        formData.append(
          `source`,
          filterData.source === "customDataset"
            ? filterData.customDataset
            : filterData.source
        );
        handleMapFilterChange("dataVariable", filterData.dataVariable[0]);
        setPreviousFormData(formData);

        fetchGeoJson();
        fetchNormalMapData(formData, true);
        fetchAnomalyMapData(
          formData,
          setFirstAnomalyMapData,
          setFirstAnomalyMapStatus,
          filterData.fromYear,
          true
        );
        fetchAnomalyMapData(
          formData,
          setSecondAnomalyMapData,
          setSecondAnomalyMapStatus,
          filterData.fromYear,
          true
        );
      }
    })();
  }, [loadAnalysisData]);

  const fetchGeoJson = async () => {
    try {
      setGeoJsonStatus(requestStatus.isLoading);
      const geoJson = await axios.post(
        `${BASE_URL}/${climatePattern}map_geojson`,
        { country: filterData.countryValue },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setGeoJsonData(geoJson.data);
      setGeoJsonStatus(requestStatus.isFinished);
    } catch (error) {
      setGeoJsonStatus(requestStatus.isError);
    }
  };

  const fetchNormalMapData = async (formData, isFirstAnalysis = false) => {
    formData.set(`months`, mapFilter.chosenMonth);
    formData.set(
      `indic`,
      isFirstAnalysis ? filterData.dataVariable[0] : mapFilter.dataVariable
    );
    try {
      setNormalMapStatus(requestStatus.isLoading);
      const response = await axios.post(
        `${BASE_URL}/${climatePattern}map_normal`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNormalMapData(response.data);
      setNormalMapStatus(requestStatus.isFinished);
    } catch (error) {
      setNormalMapStatus(requestStatus.isError);
    }
  };

  const fetchAnomalyMapData = async (
    formData,
    setAnomalyMapData,
    setStatus,
    year,
    isFirstAnalysis = false
  ) => {
    formData.set(`months`, mapFilter.chosenMonth);
    formData.set(
      `indic`,
      isFirstAnalysis ? filterData.dataVariable[0] : mapFilter.dataVariable
    );
    formData.set(`year`, year);
    try {
      setStatus(requestStatus.isLoading);
      const response = await axios.post(
        `${BASE_URL}/${climatePattern}map_anomaly`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAnomalyMapData(response.data);
      setStatus(requestStatus.isFinished);
    } catch (error) {
      setStatus(requestStatus.isError);
    }
  };

  return (
    <div className="rounded-lg bg-white p-1 pb-2 shadow-md">
      <div className="grid xl:grid-cols-3 grid-cols-1">
        <div className="relative z-0">
          <div className="p-1 ">
            <p className="text-sm mb-2 font-medium flex justify-center">
              Normal {formatTitle(mapFilter.dataVariable || "rainfall")}{" "}
              {getMetricUnit(mapFilter.dataVariable)} for{" "}
              {
                countries?.find((e) => e.value === mapFormData.countryValue)
                  ?.label
              }{" "}
            </p>
            <div className="flex flex-col ">
              <OpenLayersMap
                country={mapFormData.countryValue || "NPL"}
                geoJsonData={geoJsonData}
                mapData={normalMapData}
                mapType={"normal"}
                chosenYear={filterData.anomalyYear1}
                chosenDistrict={filterData.districtValue}
                preferredZoomScale={6}
                mapFilter={mapFilter}
              />
            </div>

            <div className="w-full z-10 mt-2">
              <div
                className={cn(
                  climatePattern === toolType.mjo
                    ? "grid-cols-1"
                    : "grid-cols-2",
                  "grid gap-5 "
                )}
              >
                {climatePattern !== toolType.mjo && (
                  <div className="">
                    <div className="flex gap-2 ">
                      <Label className="text-xs font-semibold">
                        Data Variable
                      </Label>
                      <HelpHoverCard
                        title={"Data Variable"}
                        content={` The Data Variable you would like to compare against each El Nino category. `}
                      />
                    </div>
                    <Combobox
                      name="dataVariable"
                      label={"Data Variable"}
                      array={transformObject(ElNinoToolDataIndicators).filter(
                        (e) => filterData.dataVariable.includes(e.value)
                      )}
                      state={{
                        value: mapFilter.dataVariable,
                        setValue: handleMapFilterChange,
                      }}
                    />
                  </div>
                )}

                <div className="">
                  <div className="flex gap-2 ">
                    <Label className="text-xs font-semibold">Month</Label>
                    <HelpHoverCard
                      title={"Months"}
                      content={`The month used to compare against the El Nino
              variable.`}
                    />
                  </div>
                  <Combobox
                    name="chosenMonth"
                    label={"Month"}
                    array={monthsList}
                    state={{
                      value: mapFilter.chosenMonth,
                      setValue: handleMapFilterChange,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <MapOverlay
            geoJsonStatus={geoJsonStatus}
            anomalyMapStatus={normalMapStatus}
          />
        </div>

        <div className="relative z-0">
          <div className="p-1">
            <p className="text-sm mb-2 font-medium flex justify-center">
              {formatTitle(mapFilter.dataVariable || "rainfall")} Anomaly{" "}
              {getMetricUnit(mapFilter.dataVariable)} for{" "}
              {
                countries.find((e) => e.value === mapFormData?.countryValue)
                  ?.label
              }{" "}
              {
                yearList.find((e) => e.value === filterData?.anomalyYear1)
                  ?.label
              }
            </p>

            <div className="w-full">
              <OpenLayersMap
                country={mapFormData.countryValue || "PAK"}
                geoJsonData={geoJsonData}
                mapData={firstAnomalyMapData}
                mapType={"anomaly"}
                chosenYear={filterData.anomalyYear1}
                chosenDistrict={filterData.districtValue}
                preferredZoomScale={6}
                mapFilter={mapFilter}
              />
            </div>

            <div className="w-full z-10 mt-2">
              <div className="flex gap-2 ">
                <Label className="text-xs font-semibold"> Anomaly Year </Label>
                <HelpHoverCard
                  title={" Anomaly Year "}
                  content={` The year of anomaly that you would like to view `}
                />
              </div>
              <Combobox
                name="firstAnomalyMap"
                label={"Year"}
                array={yearList}
                state={{
                  value: anomalyYear.firstAnomalyMap,
                  setValue: handleAnomalyYearChange,
                }}
              />
            </div>
          </div>
          <MapOverlay
            geoJsonStatus={geoJsonStatus}
            anomalyMapStatus={firstAnomalyMapStatus}
          />
        </div>

        <div className="relative z-0">
          <div className="p-1">
            <p className="text-sm mb-2 font-medium flex justify-center">
              {formatTitle(mapFilter.dataVariable || "rainfall")} Anomaly{" "}
              {getMetricUnit(mapFilter.dataVariable)} for{" "}
              {
                countries.find((e) => e.value === mapFormData?.countryValue)
                  ?.label
              }{" "}
              {
                yearList.find((e) => e.value === filterData?.anomalyYear2)
                  ?.label
              }
            </p>

            <div className="w-full">
              <OpenLayersMap
                country={mapFormData.countryValue || "BGD"}
                geoJsonData={geoJsonData}
                mapData={secondAnomalyMapData}
                mapType={"anomaly"}
                chosenYear={filterData.anomalyYear2}
                chosenDistrict={filterData.districtValue}
                preferredZoomScale={6}
                mapFilter={mapFilter}
              />
            </div>

            <div className="w-full z-10 mt-2">
              <div className="flex gap-2 ">
                <Label className=" text-xs font-semibold"> Anomaly Year </Label>
                <HelpHoverCard
                  title={" Anomaly Year "}
                  content={` The year of anomaly that you would like to view `}
                />
              </div>
              <Combobox
                name="secondAnomalyMap"
                label={"Year"}
                array={yearList}
                state={{
                  value: anomalyYear.secondAnomalyMap,
                  setValue: handleAnomalyYearChange,
                }}
              />
            </div>
          </div>
          <MapOverlay
            geoJsonStatus={geoJsonStatus}
            anomalyMapStatus={secondAnomalyMapStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicMap;
