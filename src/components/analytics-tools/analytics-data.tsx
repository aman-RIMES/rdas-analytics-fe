import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { AlertCircle, FullscreenIcon } from "lucide-react";
import Leaflet from "../leaflet";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { isError, isFinished, isIdle, isLoading } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import MapLegend from "../map-legend";
import { IDLE_ANALYTICS_CHART_MESSAGE, monthsList } from "@/constants";
import { useState } from "react";
import DynamicMap from "./dynamic-map";
reuleaux.register("l-reuleaux");
grid.register("l-loader");
import sampleCharts from "../../data/sample_charts.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

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
  for (
    let i: any = parseInt(mapFormData.fromYear);
    i <= parseInt(mapFormData.toYear);
    i++
  ) {
    yearList.push({ value: i.toString(), label: i.toString() });
  }

  const [chosenMonth, setChosenMonth] = useState("1");
  const handleMonthChange = (name: string, value: string) => {
    setChosenMonth(value);
  };

  return (
    <div className="">
      {isLoading(dynamicChartStatus) && (
        <div className="flex items-center pt-[100px] justify-center bg-transparent">
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

      {(isFinished(dynamicChartStatus) || isIdle(dynamicChartStatus)) && (
        <div className="p-2 ">
          <div className="grid grid-cols-2 gap-5">
            <div className="relative z-0">
              <div className="absolute inset-0 z-20 max-h-10 flex justify-end items-start">
                <Dialog>
                  <DialogTrigger className="p-2">
                    <FullscreenIcon className="h-7 w-7 mt-1 text-green-700" />
                  </DialogTrigger>
                  <DialogContent className="lg:w-[70%]">
                    <DialogHeader>
                      <DialogDescription>
                        <HighchartsReact
                          containerProps={{ style: { height: "600px " } }}
                          highcharts={Highcharts}
                          options={
                            isIdle(dynamicChartStatus)
                              ? sampleCharts?.analytics_yearly
                              : timeSeriesChartData[0]
                          }
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <HighchartsReact
                containerProps={{ style: { height: "300px " } }}
                highcharts={Highcharts}
                options={
                  isIdle(dynamicChartStatus)
                    ? sampleCharts?.analytics_yearly
                    : timeSeriesChartData[0]
                }
              />
              {isIdle(dynamicChartStatus) && (
                <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                  <p className="text-2xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                </div>
              )}
            </div>

            <div className="relative z-0">
              <div className="absolute inset-0 z-20 max-h-10 flex justify-end items-start">
                <Dialog>
                  <DialogTrigger className="p-2">
                    <FullscreenIcon className="h-7 w-7 mt-1 text-green-700" />
                  </DialogTrigger>
                  <DialogContent className="lg:w-[70%]">
                    <DialogHeader>
                      <DialogDescription>
                        <HighchartsReact
                          containerProps={{ style: { height: "600px " } }}
                          highcharts={Highcharts}
                          options={
                            isIdle(dynamicChartStatus)
                              ? sampleCharts?.analytics_monthly
                              : timeSeriesChartData[chosenMonth]
                          }
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col">
                <div className="rounded-lg bg-white p-1 ">
                  <HighchartsReact
                    containerProps={{ style: { height: "300px " } }}
                    highcharts={Highcharts}
                    options={
                      isIdle(dynamicChartStatus)
                        ? sampleCharts?.analytics_monthly
                        : timeSeriesChartData[chosenMonth]
                    }
                  />
                </div>

                <div className="flex justify-center">
                  <div className="w-1/3">
                    <Combobox
                      name="month"
                      label={"Months"}
                      array={monthsList}
                      state={{
                        value: chosenMonth,
                        setValue: handleMonthChange,
                      }}
                      height="10"
                    />
                  </div>
                </div>
              </div>

              {isIdle(dynamicChartStatus) && (
                <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                  <p className="text-2xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsData;
