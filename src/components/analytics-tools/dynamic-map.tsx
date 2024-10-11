import React, { useEffect, useState } from "react";
import Leaflet from "../leaflet";
import MapLegend from "../map-legend";
import {
  countries,
  ElNinoCategories,
  ElNinoToolDataIndicators,
  ElNinoYears,
  mapDataType,
  requestStatus,
} from "@/constants";
import { isFinished, isLoading, transformObject } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";

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
  const [chosenCategory, seChosenCategory] = useState("moderate");
  const [chosenVariable, setChosenVariable] = useState("rainfall");

  const [mapLoadingStatus, setMapLoadingStatus] = useState(
    requestStatus.isFinished
  );

  const handleCategoryChange = (name: string, value: string) => {
    seChosenCategory(value);
  };
  const handleVariableChange = (name: string, value: string) => {
    setChosenVariable(value);
  };

  useEffect(() => {
    reloadAnomalyMap();
  }, [chosenCategory, chosenVariable]);

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

  return (
    <div className=" my-16 rounded-lg bg-white p-1 pb-10 shadow-md">
      {/* <div className="flex justify-center gap-8 ">
        <div className="flex justify-center mt-8">
          <div className="">
            <div className="flex gap-2 ">
              <Label className="mb-2 font-semibold">El Nino category</Label>
              <HelpHoverCard
                title={"El Nino category"}
                content={` The El Nino category you would like to view the the maps for. `}
              />
            </div>
            <Combobox
              name="elNinoCategory"
              label={"El Nino Category"}
              array={ElNinoCategories.filter((e) => e.value !== "veryStrong")}
              state={{
                value: chosenCategory,
                setValue: handleCategoryChange,
              }}
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="">
            <div className="flex gap-2 ">
              <Label className="mb-2 font-semibold">Month</Label>
              <HelpHoverCard
                title={"Months"}
                content={` The month you would like to view the charts for. `}
              />
            </div>
            <Combobox
              name="month"
              label={"Months"}
              array={transformObject(ElNinoToolDataIndicators)}
              state={{
                value: chosenVariable,
                setValue: handleVariableChange,
              }}
            />
          </div>
        </div>
      </div> */}

      {isLoading(mapLoadingStatus) && (
        <div className="my-20  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-infinity color="green" size="35"></l-infinity>
            <p className="text-2xl text-lime-700 font-medium">Loading Map</p>
          </div>
        </div>
      )}

      {isFinished(mapLoadingStatus) && (
        <>
          <div className="p-10 ">
            <p className="text-lg mb-5 font-medium flex justify-center">
              Normal Rainfall for{" "}
              {
                countries.find((e) => e.value === mapFormData.countryValue)
                  .label
              }{" "}
              (mm)
            </p>
            <div className="flex flex-col ">
              <Leaflet
                country={mapFormData.countryValue}
                geoJsonData={dynamicMapData}
                mapType={"normal"}
                chosenYear={filterData.anomalyYear1}
                chosenDistrict={filterData.districtValue}
                preferredZoomScale={7}
              />
              <MapLegend mapType={mapDataType.normal} />
              <p className="text-center text-xs">Normal Rainfall (mm)</p>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 grid-cols-1">
            <div className="p-10">
              <p className="text-lg mb-5 font-medium flex justify-center">
                Rainfall Anomaly for{" "}
                {
                  countries.find((e) => e.value === mapFormData?.countryValue)
                    .label
                }{" "}
                (mm) in{" "}
                {
                  yearList.find((e) => e.value === filterData?.anomalyYear1)
                    .label
                }
              </p>

              <div className="w-full min-h-[420px] ">
                {isLoading(firstAnomalyMapStatus) && (
                  <div className=" flex flex-col items-center justify-center mt-40">
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
                    />
                    <MapLegend mapType={mapDataType.anomaly} />
                    <p className="text-center text-xs">Rainfall Anomaly (mm)</p>
                  </div>
                )}
              </div>

              <div className="w-full mt-5 z-10">
                <div className="flex gap-2 ">
                  <Label className="mb-2 font-semibold"> Anomaly Year </Label>
                  <HelpHoverCard
                    title={" Anomaly Year "}
                    content={` The year of anomaly that you would like to view `}
                  />
                </div>
                <Combobox
                  name="anomalyYear1"
                  label={"Year"}
                  array={ElNinoYears[chosenCategory]}
                  state={{
                    value: filterData.anomalyYear1,
                    setValue: handleChange,
                  }}
                />
              </div>
            </div>

            <div className="p-10">
              <p className="text-lg mb-5 font-medium flex justify-center">
                Rainfall Anomaly for{" "}
                {
                  countries.find((e) => e.value === mapFormData?.countryValue)
                    .label
                }{" "}
                (mm) in{" "}
                {
                  yearList.find((e) => e.value === filterData?.anomalyYear2)
                    .label
                }
              </p>

              <div className="w-full min-h-[420px] ">
                {isLoading(secondAnomalyMapStatus) && (
                  <div className=" flex flex-col items-center justify-center mt-40">
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
                    />
                    <MapLegend mapType={mapDataType.anomaly} />
                    <p className="text-center text-xs">Rainfall Anomaly (mm)</p>
                  </div>
                )}
              </div>

              <div className="w-full mt-5 z-10">
                <div className="flex gap-2 ">
                  <Label className="mb-2 font-semibold"> Anomaly Year </Label>
                  <HelpHoverCard
                    title={" Anomaly Year "}
                    content={` The year of anomaly that you would like to view `}
                  />
                </div>
                <Combobox
                  name="anomalyYear2"
                  label={"Year"}
                  array={ElNinoYears[chosenCategory]}
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
