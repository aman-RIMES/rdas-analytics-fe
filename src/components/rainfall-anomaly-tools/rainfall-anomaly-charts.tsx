import { IDLE_ANALYTICS_CHART_MESSAGE } from "@/constants";
import { isError, isFinished, isIdle } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FullscreenIcon } from "lucide-react";
import { DialogHeader } from "../ui/dialog";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import sampleCharts from "../../data/sample_charts.json";

function RainfallAnomalyChart({ chartData, AnalysisStatus, chartHeight }: any) {
  return (
    <>
      <div className="relative z-0 ">
        <div className="absolute inset-0 z-20 max-h-6 mr-12 flex justify-end items-start">
          <Dialog>
            <DialogTrigger className="p-2">
              <FullscreenIcon className="h-7 w-7 mt-1 text-green-700" />
            </DialogTrigger>
            <DialogContent className="lg:w-[70%]">
              <DialogHeader>
                <DialogDescription>
                  <HighchartsReact
                    containerProps={{
                      style: { height: "600px " },
                    }}
                    highcharts={Highcharts}
                    options={chartData ? chartData : sampleCharts?.gdd_chart}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col">
          <div className="rounded-lg bg-white p-1 ">
            <HighchartsReact
              containerProps={{ style: { height: chartHeight } }}
              highcharts={Highcharts}
              options={chartData ? chartData : sampleCharts?.gdd_chart}
            />
          </div>
        </div>

        {!isFinished(AnalysisStatus) && (
          <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
            {isIdle(AnalysisStatus) ? (
              <p className="text-xl font-bold text-green-800">
                {IDLE_ANALYTICS_CHART_MESSAGE}
              </p>
            ) : isError(AnalysisStatus) ? (
              <ErrorMessage />
            ) : (
              <Loading
                animation={
                  <l-reuleaux color="green" stroke={8} size="50"></l-reuleaux>
                }
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default RainfallAnomalyChart;
