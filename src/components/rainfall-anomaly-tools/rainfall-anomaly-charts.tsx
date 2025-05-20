import { IDLE_ANALYTICS_CHART_MESSAGE } from "@/constants";
import { isError, isFinished, isIdle } from "@/lib/utils";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import ExportingModule from "highcharts/modules/exporting";
import ExportDataModule from "highcharts/modules/export-data";
import OfflineExportingModule from "highcharts/modules/offline-exporting";
ExportingModule(Highcharts);
ExportDataModule(Highcharts);
OfflineExportingModule(Highcharts);
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import sampleCharts from "../../data/sample_charts.json";

function RainfallAnomalyChart({ chartData, AnalysisStatus, chartHeight }: any) {
  return (
    <>
      <div className="relative z-0 ">
        <div className="flex flex-col">
          <div className="rounded-lg bg-white p-1 ">
            <HighchartsReact
              containerProps={{ style: { height: chartHeight } }}
              highcharts={Highcharts}
              options={{
                ...(chartData ? chartData : sampleCharts?.gdd_chart),
                legend: { enabled: true },
              }}
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
