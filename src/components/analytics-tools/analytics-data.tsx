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
import Loading from "../ui/loading";
import ErrorMessage from "../ui/error-message";

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
              containerProps={{ style: { height: "312px " } }}
              highcharts={Highcharts}
              options={
                timeSeriesChartData[0]
                  ? timeSeriesChartData[0]
                  : sampleCharts?.analytics_yearly
              }
            />

            {!isFinished(dynamicChartStatus) && (
              <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                {isIdle(dynamicChartStatus) ? (
                  <p className="text-xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                ) : isError(dynamicChartStatus) ? (
                  <ErrorMessage />
                ) : (
                  <Loading
                    animation={
                      <l-reuleaux
                        color="green"
                        stroke={8}
                        size="50"
                      ></l-reuleaux>
                    }
                  />
                )}
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
                  containerProps={{ style: { height: "275px " } }}
                  highcharts={Highcharts}
                  options={
                    timeSeriesChartData[chosenMonth]
                      ? timeSeriesChartData[chosenMonth]
                      : sampleCharts?.analytics_monthly
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

            {!isFinished(dynamicChartStatus) && (
              <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                {isIdle(dynamicChartStatus) ? (
                  <p className="text-xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                ) : isError(dynamicChartStatus) ? (
                  <ErrorMessage />
                ) : (
                  <Loading
                    animation={
                      <l-reuleaux
                        color="green"
                        stroke={8}
                        size="50"
                      ></l-reuleaux>
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsData;
