import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { AlertCircle } from "lucide-react";
import Leaflet from "../leaflet";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { isError, isFinished, isLoading } from "@/lib/utils";
import { AnalyticsDataProps } from "@/types";

const AnalyticsData = ({
  timeSeriesChartData,
  countryValue,
  dynamicMapData,
  dynamicChartStatus,
  dynamiMapStatus,
}: AnalyticsDataProps) => {
  return (
    <div className="mt-10">
      {isLoading(dynamicChartStatus) && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Analyzing Data ...</p>
        </div>
      )}

      {isError(dynamicChartStatus) && (
        <div className="flex justify-center">
          <Alert className="lg:w-3/4" variant="destructive">
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
        <>
          <HighchartsReact
            highcharts={Highcharts}
            options={timeSeriesChartData}
          />

          <div>
            {isLoading(dynamiMapStatus) && (
              <div className="my-20 flex justify-center border p-24 rounded-lg">
                <p className="text-xl">Loading Dynamic Map ...</p>
              </div>
            )}
            {isError(dynamiMapStatus) && (
              <div className="flex justify-center">
                <Alert className="lg:w-3/4" variant="destructive">
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
              <div>
                <p className="text-xl font-semibold flex justify-center my-8">
                  Deviation from Normal Rainfall
                </p>
                <Leaflet country={countryValue} geoJsonData={dynamicMapData} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsData;
