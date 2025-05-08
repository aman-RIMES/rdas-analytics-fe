import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import OfflineExportingModule from "highcharts/modules/offline-exporting";
ExportingModule(Highcharts);
ExportDataModule(Highcharts);
OfflineExportingModule(Highcharts);
import { isError, isFinished, isIdle, isLoading } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
import Combobox from "../ui/combobox";
import {
  BASE_URL,
  IDLE_ANALYTICS_CHART_MESSAGE,
  monthsList,
  requestStatus,
  toolType,
} from "@/constants";
import { useEffect, useState } from "react";
reuleaux.register("l-reuleaux");
grid.register("l-loader");
import sampleCharts from "../../data/sample_charts.json";
import Loading from "../ui/loading";
import ErrorMessage from "../ui/error-message";
import { FullscreenIcon } from "lucide-react";
import axios from "axios";
import CropToolsAnalysisText from "../crop-tools/crop-tool-analysis-text";
import { ScrollArea } from "../ui/scroll-area";

const GddToolsData = ({
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

  const climatePattern =
    location.pathname === "/lanina-analytics"
      ? toolType.lanina
      : toolType.elnino;

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
          multipleSources:
            filterData.source === "multipleSources"
              ? JSON.stringify(filterData.multipleSources)
              : "",
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
            `${BASE_URL}/${climatePattern}time_series_chart`,
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
        <div className="col-span-4 w-full rounded-lg h-[45vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="relative z-0 bg-white rounded-lg h-[43vh]">
              <div className="">
                <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2"> Analysis</p>
                </div>

                <ScrollArea className="h-[353px] p-2">
                  <p className="p-2" style={{ whiteSpace: "break-spaces" }}>
                    {sampleCharts?.crop_recommendation}
                  </p>
                </ScrollArea>
              </div>
              {(isIdle(dynamicChartStatus) ||
                isLoading(dynamicChartStatus) ||
                isError(dynamicChartStatus)) && (
                <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                  {isIdle(dynamicChartStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(dynamicChartStatus) ? (
                    <ErrorMessage />
                  ) : (
                    <Loading
                      animation={
                        <l-hourglass color="green" size="60"></l-hourglass>
                      }
                    />
                  )}
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg h-[43vh] relative z-0">
              <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                <p className="ml-2"> Recommendation</p>
              </div>
              <div>
                <ScrollArea className="h-[353px] p-2">
                  <p className="p-2" style={{ whiteSpace: "break-spaces" }}>
                    {sampleCharts?.crop_recommendation}
                  </p>
                </ScrollArea>
              </div>
              {(isIdle(dynamicChartStatus) ||
                isLoading(dynamicChartStatus) ||
                isError(dynamicChartStatus)) && (
                <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                  {isIdle(dynamicChartStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(dynamicChartStatus) ? (
                    <ErrorMessage />
                  ) : (
                    <Loading
                      animation={
                        <l-hourglass color="green" size="60"></l-hourglass>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GddToolsData;
