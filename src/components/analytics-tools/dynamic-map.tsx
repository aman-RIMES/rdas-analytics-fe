import React, { useEffect, useState } from "react";
import Leaflet from "../leaflet";
import MapLegend from "../map-legend";
import {
  countries,
  ElNinoCategories,
  ElNinoToolDataIndicators,
  ElNinoYears,
  mapDataType,
  monthsList,
  requestStatus,
} from "@/constants";
import {
  formatTitle,
  isFinished,
  isLoading,
  transformObject,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { MapFilterData } from "@/types";
import { grid } from "ldrs";
grid.register("l-loader");

const DynamicMap = ({
  mapFormData,
  filterData,
  dynamicMapData,
  yearList,
  firstAnomalyMapStatus,
  secondAnomalyMapStatus,
  handleChange,
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
      {/* <div className="flex justify-start p-3">
        <div className="grid grid-cols-2 gap-5 w-2/5 ">
          <div className="">
            <div className="flex gap-2 ">
              <Label className="text-xs font-semibold">Data Variable</Label>
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
      </div> */}

      {isLoading(mapLoadingStatus) && (
        <div className="my-[190px]  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-loader color="green" size="50"></l-loader>
            <p className="text-2xl text-lime-700 font-medium">Reloading Map</p>
          </div>
        </div>
      )}

      {isFinished(mapLoadingStatus) && (
        <>
          {/* <div className="px-10 mt-5">
            <p className="text-lg mb-2 font-medium flex justify-center">
              Normal {formatTitle(mapFilter.dataVariable)} {getMetricUnit()} for{" "}
              {
                countries?.find((e) => e.value === mapFormData.countryValue)
                  .label
              }{" "}
            </p>
            <div className="flex flex-col ">
              <Leaflet
                country={mapFormData.countryValue}
                geoJsonData={dynamicMapData}
                mapType={"normal"}
                chosenYear={filterData.anomalyYear1}
                chosenDistrict={filterData.districtValue}
                preferredZoomScale={6}
                mapFilter={mapFilter}
              />
              <MapLegend
                mapType={mapDataType.normal}
                variable={mapFilter.dataVariable}
              />
              <p className="text-center text-xs">
                Normal Rainfall {getMetricUnit()}
              </p>
            </div>
          </div> */}

          <div className="grid xl:grid-cols-3 grid-cols-1">
            <div className="p-1 ">
              <p className="text-sm mb-2 font-medium flex justify-center">
                Normal {formatTitle(mapFilter.dataVariable)} {getMetricUnit()}{" "}
                for{" "}
                {
                  countries?.find((e) => e.value === mapFormData.countryValue)
                    .label
                }{" "}
              </p>
              <div className="flex flex-col ">
                <Leaflet
                  country={mapFormData.countryValue}
                  geoJsonData={dynamicMapData}
                  mapType={"normal"}
                  chosenYear={filterData.anomalyYear1}
                  chosenDistrict={filterData.districtValue}
                  preferredZoomScale={6}
                  mapFilter={mapFilter}
                />
                <MapLegend
                  mapType={mapDataType.normal}
                  variable={mapFilter.dataVariable}
                />
                <p className="text-center text-xs">
                  Normal Rainfall {getMetricUnit()}
                </p>
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

            <div className="p-1">
              <p className="text-sm mb-2 font-medium flex justify-center">
                {formatTitle(mapFilter.dataVariable)} {getMetricUnit()} in{" "}
                Anomaly for{" "}
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
                  <div className=" mb-[188px] flex flex-col items-center justify-center mt-40">
                    {/* @ts-ignore */}
                    <l-loader color="green" size="50"></l-loader>
                  </div>
                )}
                {isFinished(firstAnomalyMapStatus) && (
                  <div className="flex flex-col">
                    <Leaflet
                      country={mapFormData.countryValue}
                      geoJsonData={dynamicMapData}
                      mapType={"anomaly"}
                      chosenYear={filterData.anomalyYear1}
                      chosenDistrict={filterData.districtValue}
                      mapFilter={mapFilter}
                    />
                    <MapLegend
                      mapType={mapDataType.anomaly}
                      variable={mapFilter.dataVariable}
                    />
                    <p className="text-center text-xs">
                      {formatTitle(mapFilter.dataVariable)} Anomaly{" "}
                      {getMetricUnit()}
                    </p>
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

            <div className="p-1">
              <p className="text-sm mb-2 font-medium flex justify-center">
                {formatTitle(mapFilter.dataVariable)} Anomaly {getMetricUnit()}{" "}
                for{" "}
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
                  <div className="mb-[188px] flex flex-col items-center justify-center mt-40">
                    {/* @ts-ignore */}
                    <l-loader color="green" size="50"></l-loader>
                  </div>
                )}
                {isFinished(secondAnomalyMapStatus) && (
                  <div className="flex flex-col">
                    <Leaflet
                      country={mapFormData.countryValue}
                      geoJsonData={dynamicMapData}
                      mapType={"anomaly"}
                      chosenYear={filterData.anomalyYear2}
                      chosenDistrict={filterData.districtValue}
                      mapFilter={mapFilter}
                    />
                    <MapLegend
                      mapType={mapDataType.anomaly}
                      variable={mapFilter.dataVariable}
                    />
                    <p className="text-center text-xs">
                      {formatTitle(mapFilter.dataVariable)} Anomaly{" "}
                      {getMetricUnit()}
                    </p>
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
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicMap;
