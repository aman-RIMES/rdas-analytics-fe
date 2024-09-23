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
import { countries } from "@/constants";
reuleaux.register("l-reuleaux");
grid.register("l-loader");

const AnalyticsData = ({
  filterData,
  timeSeriesChartData,
  countryValue,
  dynamicMapData,
  dynamicChartStatus,
  dynamiMapStatus,
  anomalyMapStatus,
  handleChange,
}: AnalyticsDataProps) => {
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
              <div key={index} className="rounded-lg bg-white p-1 shadow-md">
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
                <div className="grid xl:grid-cols-2 grid-cols-1">
                  <div className="p-10 ">
                    <p className="text-lg mb-5 font-medium flex justify-center">
                      Normal Rainfall for{" "}
                      {countries.find((e) => e.value === countryValue).label}{" "}
                      (mm)
                    </p>
                    <div className="flex flex-col ">
                      <Leaflet
                        country={countryValue}
                        geoJsonData={dynamicMapData}
                        mapType={"normal"}
                        chosenYear={filterData.chosenYear}
                      />
                      <MapLegend />
                    </div>
                  </div>
                  <div className="p-10">
                    <p className="text-lg mb-5 font-medium flex justify-center">
                      Rainfall Anomaly for{" "}
                      {countries.find((e) => e.value === countryValue).label}{" "}
                      (mm) in{" "}
                      {
                        yearList.find((e) => e.value === filterData.chosenYear)
                          .label
                      }
                    </p>

                    <div className="w-full min-h-[420px] ">
                      {isLoading(anomalyMapStatus) && (
                        <div className=" flex flex-col items-center justify-center mt-40">
                          {/* @ts-ignore */}
                          <l-loader color="green" size="50"></l-loader>
                        </div>
                      )}
                      {isFinished(anomalyMapStatus) && (
                        <div className="flex flex-col">
                          <Leaflet
                            country={countryValue}
                            geoJsonData={dynamicMapData}
                            mapType={"anomaly"}
                            chosenYear={filterData.chosenYear}
                          />
                          <MapLegend />
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
                        name="chosenYear"
                        label={"Year"}
                        array={yearList}
                        state={{
                          value: filterData.chosenYear,
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
