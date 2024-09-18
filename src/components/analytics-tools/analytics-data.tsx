import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { AlertCircle, LoaderIcon } from "lucide-react";
import Leaflet from "../leaflet";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { isError, isFinished, isLoading } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { useState } from "react";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import MapLegend from "../map-legend";
reuleaux.register("l-reuleaux");
grid.register("l-loader");

const AnalyticsData = ({
  filterData,
  timeSeriesChartData,
  countryValue,
  dynamicMapData,
  dynamicChartStatus,
  dynamiMapStatus,
}: AnalyticsDataProps) => {
  const [chosenYear, setChosenYear] = useState(filterData.fromYear);

  const yearList = [];
  let count = 0;
  for (
    let i: any = parseInt(filterData.fromYear);
    i <= parseInt(filterData.toYear);
    i++
  ) {
    count += 1;
    yearList.push({ value: count.toString(), label: i.toString() });
  }

  const handleChange = (name: string, value: string | []) => {
    setChosenYear(value.toString());
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
            {timeSeriesChartData.map((chartData, index) => (
              <div className="rounded-lg bg-white p-1 shadow-md">
                <HighchartsReact highcharts={Highcharts} options={chartData} />
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
                <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                  <div className="p-10 ">
                    <p className="text-lg mb-5 font-medium flex justify-center">
                      Normal Rainfall (mm)
                    </p>
                    <Leaflet
                      country={countryValue}
                      geoJsonData={dynamicMapData}
                      mapType={"normal"}
                      chosenYear={chosenYear}
                    />
                  </div>
                  <div className="p-10">
                    <p className="text-lg mb-5 font-medium flex justify-center">
                      Rainfall Anomaly (mm)
                    </p>
                    {chosenYear !== "0" && (
                      <Leaflet
                        country={countryValue}
                        geoJsonData={dynamicMapData}
                        mapType={"anomaly"}
                        chosenYear={chosenYear}
                      />
                    )}
                    <div className="z-50">
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
                        name="year"
                        label={"Year"}
                        array={yearList}
                        state={{
                          value: chosenYear,
                          setValue: handleChange,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <MapLegend />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsData;
