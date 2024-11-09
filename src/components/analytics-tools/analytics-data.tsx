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
import DynamicMap from "./dynamic-map";
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
        <div className="p-2 rounded-lg  shadow-lg">
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-lg bg-white p-1 shadow-md">
              <HighchartsReact
                containerProps={{ style: { height: "300px " } }}
                highcharts={Highcharts}
                options={timeSeriesChartData[0]}
              />
            </div>

            {/* <div className="flex justify-center mt-8">
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
            </div> */}

            <div className="rounded-lg bg-white p-1 shadow-md ">
              <HighchartsReact
                containerProps={{ style: { height: "300px " } }}
                highcharts={Highcharts}
                options={timeSeriesChartData[chosenMonth]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsData;
