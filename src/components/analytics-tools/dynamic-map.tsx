import React, { useEffect, useState } from "react";
import Leaflet from "../leaflet";
import MapLegend from "../map-legend";
import OpenLayersMap from "../openlayers";
import {
  countries,
  DYNAMIC_MAP_ERROR_MESSAGE,
  ElNinoCategories,
  ElNinoToolDataIndicators,
  ElNinoYears,
  IDLE_ANALYTICS_CHART_MESSAGE,
  mapDataType,
  monthsList,
  requestStatus,
} from "@/constants";
import {
  formatTitle,
  isError,
  isFinished,
  isIdle,
  isLoading,
  transformObject,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { MapFilterData } from "@/types";
import { grid } from "ldrs";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
grid.register("l-grid");

const DynamicMap = ({
  mapFormData,
  filterData,
  dynamicMapData,
  yearList,
  firstAnomalyMapStatus,
  secondAnomalyMapStatus,
  handleChange,
  dynamicMapStatus,
  setDynamicMapStatus,
}) => {
  const [mapFilter, setMapFilter] = useState<MapFilterData>({
    dataVariable: "rainfall",
    chosenMonth: "1",
  });

  const [mapLoadingStatus, setMapLoadingStatus] = useState(
    requestStatus.isFinished
  );

  const handleMapFilterChange = (name: string, value: string) => {
    setMapFilter((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    reloadAnomalyMap();
  }, [mapFilter]);

  const reloadAnomalyMap = async () => {
    try {
      setMapLoadingStatus(requestStatus.isLoading);
      setTimeout(() => {
        setMapLoadingStatus(requestStatus.isFinished);
      }, 0);
    } catch (error) {
      setMapLoadingStatus(requestStatus.isError);
    }
  };

  const getMetricUnit = () => {
    return mapFilter.dataVariable === "rainfall" ? "(mm)" : "(°C)";
  };

  return (
    <div className="rounded-lg bg-white p-1 pb-2 shadow-md">
      {isFinished(mapLoadingStatus) && (
        <>
          <div className="grid xl:grid-cols-3 grid-cols-1">
            <div className="relative z-0">
              <div className="p-1 ">
                <p className="text-sm mb-2 font-medium flex justify-center">
                  Normal {formatTitle(mapFilter.dataVariable)} {getMetricUnit()}{" "}
                  for{" "}
                  {
                    countries?.find((e) => e.value === mapFormData.countryValue)
                      ?.label
                  }{" "}
                </p>
                <div className="flex flex-col ">
                  {(isLoading(dynamicMapStatus) ||
                    isIdle(dynamicMapStatus) ||
                    isError(dynamicMapStatus)) && (
                    <OpenLayersMap
                      country={mapFormData.countryValue || "NPL"}
                      geoJsonData={dynamicMapData}
                    />
                  )}
                  {isFinished(dynamicMapStatus) && (
                    <OpenLayersMap
                      country={mapFormData.countryValue || "NPL"}
                      geoJsonData={dynamicMapData}
                      mapType={"normal"}
                      chosenYear={filterData.anomalyYear1}
                      chosenDistrict={filterData.districtValue}
                      preferredZoomScale={6}
                      mapFilter={mapFilter}
                    />
                  )}
                </div>

                <div className="w-full z-10 mt-2">
                  <div className="grid grid-cols-2 gap-5 ">
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
                        array={transformObject(ElNinoToolDataIndicators)}
                        state={{
                          value: mapFilter.dataVariable,
                          setValue: handleMapFilterChange,
                        }}
                      />
                    </div>

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

              {!isFinished(dynamicMapStatus) && (
                <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                  {isIdle(dynamicMapStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(dynamicMapStatus) ? (
                    <ErrorMessage errorMessage={DYNAMIC_MAP_ERROR_MESSAGE} />
                  ) : (
                    <Loading
                      animation={
                        // @ts-ignore
                        <l-grid color="green" stroke={8} size="60"></l-grid>
                      }
                    />
                  )}
                </div>
              )}
            </div>

            <div className="relative z-0">
              <div className="p-1">
                <p className="text-sm mb-2 font-medium flex justify-center">
                  {formatTitle(mapFilter.dataVariable)} Anomaly{" "}
                  {getMetricUnit()} for{" "}
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
                  {isLoading(firstAnomalyMapStatus) && (
                    <div className=" mb-[217px] flex flex-col items-center justify-center mt-40">
                      {/* @ts-ignore */}
                      <l-loader color="green" size="50"></l-loader>
                    </div>
                  )}
                  {isFinished(firstAnomalyMapStatus) && (
                    <div className="flex flex-col">
                      {(isLoading(dynamicMapStatus) ||
                        isIdle(dynamicMapStatus) ||
                        isError(dynamicMapStatus)) && (
                        <OpenLayersMap
                          country={mapFormData.countryValue || "PAK"}
                          geoJsonData={dynamicMapData}
                        />
                      )}
                      {isFinished(dynamicMapStatus) && (
                        <OpenLayersMap
                          country={mapFormData.countryValue || "PAK"}
                          geoJsonData={dynamicMapData}
                          mapType={"anomaly"}
                          chosenYear={filterData.anomalyYear1}
                          chosenDistrict={filterData.districtValue}
                          preferredZoomScale={6}
                          mapFilter={mapFilter}
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full z-10 mt-2">
                  <div className="flex gap-2 ">
                    <Label className="text-xs font-semibold">
                      {" "}
                      Anomaly Year{" "}
                    </Label>
                    <HelpHoverCard
                      title={" Anomaly Year "}
                      content={` The year of anomaly that you would like to view `}
                    />
                  </div>
                  <Combobox
                    name="anomalyYear1"
                    label={"Year"}
                    array={yearList}
                    state={{
                      value: filterData.anomalyYear1,
                      setValue: handleChange,
                    }}
                  />
                </div>
              </div>
              {!isFinished(dynamicMapStatus) && (
                <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                  {isIdle(dynamicMapStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(dynamicMapStatus) ? (
                    <ErrorMessage errorMessage={DYNAMIC_MAP_ERROR_MESSAGE} />
                  ) : (
                    <Loading
                      animation={
                        // @ts-ignore
                        <l-grid color="green" stroke={8} size="60"></l-grid>
                      }
                    />
                  )}
                </div>
              )}
            </div>

            <div className="relative z-0">
              <div className="p-1">
                <p className="text-sm mb-2 font-medium flex justify-center">
                  {formatTitle(mapFilter.dataVariable)} Anomaly{" "}
                  {getMetricUnit()} for{" "}
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
                  {isLoading(secondAnomalyMapStatus) && (
                    <div className="mb-[217px] flex flex-col items-center justify-center mt-40">
                      {/* @ts-ignore */}
                      <l-loader color="green" size="50"></l-loader>
                    </div>
                  )}
                  {isFinished(secondAnomalyMapStatus) && (
                    <div className="flex flex-col">
                      {(isLoading(dynamicMapStatus) ||
                        isIdle(dynamicMapStatus) ||
                        isError(dynamicMapStatus)) && (
                        <OpenLayersMap
                          country={mapFormData.countryValue || "BGD"}
                          geoJsonData={dynamicMapData}
                        />
                      )}
                      {isFinished(dynamicMapStatus) && (
                        <OpenLayersMap
                          country={mapFormData.countryValue || "BGD"}
                          geoJsonData={dynamicMapData}
                          mapType={"anomaly"}
                          chosenYear={filterData.anomalyYear2}
                          chosenDistrict={filterData.districtValue}
                          mapFilter={mapFilter}
                        />
                      )}

                    </div>
                  )}
                </div>

                <div className="w-full z-10 mt-2">
                  <div className="flex gap-2 ">
                    <Label className=" text-xs font-semibold">
                      {" "}
                      Anomaly Year{" "}
                    </Label>
                    <HelpHoverCard
                      title={" Anomaly Year "}
                      content={` The year of anomaly that you would like to view `}
                    />
                  </div>
                  <Combobox
                    name="anomalyYear2"
                    label={"Year"}
                    array={yearList}
                    state={{
                      value: filterData.anomalyYear2,
                      setValue: handleChange,
                    }}
                  />
                </div>
              </div>
              {!isFinished(dynamicMapStatus) && (
                <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                  {isIdle(dynamicMapStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(dynamicMapStatus) ? (
                    <ErrorMessage errorMessage={DYNAMIC_MAP_ERROR_MESSAGE} />
                  ) : (
                    <Loading
                      animation={
                        // @ts-ignore
                        <l-grid color="green" stroke={8} size="60"></l-grid>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicMap;
