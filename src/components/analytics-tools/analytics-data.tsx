import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { AlertCircle, LoaderIcon } from "lucide-react";
import Leaflet from "../leaflet";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { isError, isFinished, isLoading } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
reuleaux.register("l-reuleaux");
grid.register("l-loader");

const AnalyticsData = ({
  timeSeriesChartData,
  countryValue,
  dynamicMapData,
  dynamicChartStatus,
  dynamiMapStatus,
}: AnalyticsDataProps) => {
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
                      Normal Rainfall
                    </p>
                    <Leaflet
                      country={countryValue}
                      geoJsonData={dynamicMapData}
                    />
                  </div>
                  <div className="p-10">
                    <p className="text-lg mb-5 font-medium flex justify-center">
                      Rainfall Anomaly
                    </p>
                    <Leaflet
                      country={countryValue}
                      geoJsonData={dynamicMapData}
                    />
                  </div>
                </div>

                <div className=" w-full h-5 ml-5 mt-5 flex flex-row justify-center gap-5">
                  <div className="flex flex-row gap-2  justify-center">
                    <div className="bg-[#019110] h-6 w-12 rounded-sm"></div>
                    <p className="text-md font-medium ">{`Very High (> 900)`}</p>
                  </div>
                  <div className="flex flex-row gap-2  justify-center">
                    <div className="bg-[#67bd70] h-6 w-12 rounded-sm"></div>
                    <p className="text-md font-medium ">{`High (600 - 900)`}</p>
                  </div>
                  <div className="flex flex-row gap-2  justify-center">
                    <div className="bg-[#98d29e] h-6 w-12 rounded-sm"></div>
                    <p className="text-md font-medium ">{`Medium (300 - 600)`}</p>
                  </div>
                  <div className="flex flex-row gap-2  justify-center">
                    <div className="bg-[#cde8cf] h-6 w-12 rounded-sm"></div>
                    <p className="text-md font-medium ">{`Low < 300`}</p>
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
