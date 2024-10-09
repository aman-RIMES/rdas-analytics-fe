import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { AlertCircle } from "lucide-react";
import Leaflet from "../leaflet";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { isError, isFinished, isLoading } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import MapLegend from "../map-legend";
import { countries, mapDataType, monthsList } from "@/constants";
import { useState } from "react";
reuleaux.register("l-reuleaux");
grid.register("l-loader");

const AnalyticsData = ({
  filterData,
  timeSeriesChartData,
  dynamicMapData,
  dynamicChartStatus,
  dynamiMapStatus,
  firstAnomalyMapStatus,
  secondAnomalyMapStatus,
  handleChange,
  mapFormData,
}: AnalyticsDataProps) => {
  const yearList = [];
  let count = 0;
  for (
    let i: any = parseInt(mapFormData.fromYear);
    i <= parseInt(mapFormData.toYear);
    i++
  ) {
    count += 1;
    yearList.push({ value: count.toString(), label: i.toString() });
  }

  const [chosenMonth, setChosenMonth] = useState("January");
  const handleMonthChange = (name: string, value: string) => {
    setChosenMonth(value);
  };

  return (
    <div className=" mt-10">
      {isLoading(dynamicChartStatus) && (
        <div className="my-20  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-reuleaux color="green" size="35"></l-reuleaux>
            <p className="text-2xl text-lime-700 font-medium">Analyzing Data</p>
          </div>
        </div>
      )}

      {isError(dynamicChartStatus) && (
        <div className="flex justify-center my-20">
          <Alert className="lg:w-2/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to analyze the given filters. This could be due to missing
              datasets. Try changing your filters and start the analysis again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isFinished(dynamicChartStatus) && (
        <div className="sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
          <div className="flex flex-col gap-10">
            <div className="rounded-lg bg-white p-1 shadow-md">
              <HighchartsReact
                highcharts={Highcharts}
                options={timeSeriesChartData[0]}
              />
            </div>

            <div className="flex justify-center mt-8">
              <div className="w-1/3">
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
                  array={monthsList}
                  state={{
                    value: chosenMonth,
                    setValue: handleMonthChange,
                  }}
                />
              </div>
            </div>

            {timeSeriesChartData
              .filter((element) => element.title.text === chosenMonth)
              .map((chartData, index) => (
                <div key={index} className="rounded-lg bg-white p-1 shadow-md">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartData}
                  />
                </div>
              ))}
          </div>

          <div>
            {isLoading(dynamiMapStatus) && (
              <div className="my-20 flex justify-center bg-transparent">
                <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
                  {/* @ts-ignore */}
                  <l-loader color="green" size="50"></l-loader>
                  <p className="text-xl text-lime-700 font-medium">
                    Loading Dynamic Map
                  </p>
                </div>
              </div>
            )}
            {isError(dynamiMapStatus) && (
              <div className="my-20 flex justify-center">
                <Alert className="lg:w-2/4" variant="destructive">
                  <AlertCircle className="h-5 w-5 mt-1" />
                  <AlertTitle className="text-lg">API Error !</AlertTitle>
                  <AlertDescription className="text-md">
                    Failed to load the Dynamic Map. This could be due to missing
                    datasets. Try changing your filters and start the analysis
                    again.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {isFinished(dynamiMapStatus) && (
              <div className=" my-16 rounded-lg bg-white p-1 pb-10 shadow-md">
                <div className="p-10 ">
                  <p className="text-lg mb-5 font-medium flex justify-center">
                    Normal Rainfall for{" "}
                    {
                      countries.find(
                        (e) => e.value === mapFormData.countryValue
                      ).label
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
                        countries.find(
                          (e) => e.value === mapFormData?.countryValue
                        ).label
                      }{" "}
                      (mm) in{" "}
                      {
                        yearList.find(
                          (e) => e.value === filterData?.anomalyYear1
                        ).label
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
                          <p className="text-center text-xs">
                            Rainfall Anomaly (mm)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full mt-5 z-10">
                      <div className="flex gap-2 ">
                        <Label className="mb-2 font-semibold">
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

                  <div className="p-10">
                    <p className="text-lg mb-5 font-medium flex justify-center">
                      Rainfall Anomaly for{" "}
                      {
                        countries.find(
                          (e) => e.value === mapFormData?.countryValue
                        ).label
                      }{" "}
                      (mm) in{" "}
                      {
                        yearList.find(
                          (e) => e.value === filterData?.anomalyYear2
                        ).label
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
                          <p className="text-center text-xs">
                            Rainfall Anomaly (mm)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full mt-5 z-10">
                      <div className="flex gap-2 ">
                        <Label className="mb-2 font-semibold">
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsData;
