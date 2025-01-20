import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import OfflineExportingModule from "highcharts/modules/offline-exporting";
ExportingModule(Highcharts);
ExportDataModule(Highcharts);
OfflineExportingModule(Highcharts);
import { isError, isFinished, isIdle } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
import Combobox from "../ui/combobox";
import {
  BASE_URL,
  IDLE_ANALYTICS_CHART_MESSAGE,
  monthsList,
  requestStatus,
} from "@/constants";
import { useEffect, useState } from "react";
reuleaux.register("l-reuleaux");
grid.register("l-loader");
import sampleCharts from "../../data/sample_charts.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import Loading from "../ui/loading";
import ErrorMessage from "../ui/error-message";
import { FullscreenIcon } from "lucide-react";
import axios from "axios";

const AnalyticsData = ({
  filterData,
  loadAnalysisData,
  dynamicChartStatus,
  setDynamicChartStatus,
}: AnalyticsDataProps) => {
  const [chosenMonth, setChosenMonth] = useState("1");
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const handleMonthChange = (name: string, value: string) => {
    setChosenMonth(value);
  };

  const getChartConfig = (baseOptions: any) => ({
    ...baseOptions,
    exporting: {
      enabled: true,
      fallbackToExportServer: false,
    },
  });

  useEffect(() => {
    (async () => {
      if (loadAnalysisData) {
        const requestBody = {
          indic: `${filterData.dataVariable.join(",")}`,
          area: [`${filterData.districtValue}`],
          crop: filterData.cropValue,
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
          country: filterData.countryValue,
        };
        const formData = new FormData();
        Object.keys(requestBody).map((key) => {
          formData.append(key, requestBody[key]);
        });
        formData.append(
          `source`,
          filterData.source === "customDataset"
            ? filterData.customDataset
            : filterData.source
        );
        setDynamicChartStatus(requestStatus.isLoading);
        setTimeSeriesChartData({});

        try {
          const response = await axios.post(
            `${BASE_URL}/el_nino_time_series_chart`,
            formData
          );

          setTimeSeriesChartData(response.data);
          setDynamicChartStatus(requestStatus.isFinished);
        } catch (error) {
          setDynamicChartStatus(requestStatus.isError);
          return;
        }
      }
    })();
  }, [loadAnalysisData]);

  return (
    <div className="">
      <div className="p-2 ">
        <div className="grid grid-cols-2 gap-5">
          <div className="relative z-0">
            <div className="absolute inset-0 z-20 max-h-6 mr-10 flex justify-end items-start">
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
                        options={getChartConfig(
                          isIdle(dynamicChartStatus)
                            ? sampleCharts?.analytics_yearly
                            : timeSeriesChartData[0]
                        )}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <HighchartsReact
              containerProps={{ style: { height: "312px " } }}
              highcharts={Highcharts}
              options={getChartConfig(
                timeSeriesChartData[0]
                  ? timeSeriesChartData[0]
                  : sampleCharts?.analytics_yearly
              )}
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
            <div className="absolute inset-0 z-20 max-h-6 mr-12 flex justify-end items-start">
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
                        options={getChartConfig(
                          isIdle(dynamicChartStatus)
                            ? sampleCharts?.analytics_monthly
                            : timeSeriesChartData[chosenMonth]
                        )}
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
                  options={getChartConfig(
                    timeSeriesChartData[chosenMonth]
                      ? timeSeriesChartData[chosenMonth]
                      : sampleCharts?.analytics_monthly
                  )}
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
