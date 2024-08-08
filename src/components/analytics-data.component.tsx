import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { AlertCircle } from "lucide-react";
import React from "react";
import Leaflet from "./leaflet";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

const AnalyticsData = () => {
  return (
    <div className="mt-10">
      {isLoadingAnalysis && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Analyzing Data ...</p>
        </div>
      )}

      {!isLoadingAnalysis && !isAnalysisError && (
        <HighchartsReact
          highcharts={Highcharts}
          options={timeSeriesChartData}
        />
      )}

      {isAnalysisError && (
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

      <div>
        {isloadingDynamicMap && (
          <div className="my-20 flex justify-center border p-24 rounded-lg">
            <p className="text-xl">Loading Dynamic Map ...</p>
          </div>
        )}
        {isDynamicMapError && (
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

        {isDynamicMapVisible && !isDynamicMapError && (
          <div>
            <p className="text-xl font-semibold flex justify-center my-8">
              Deviation from Normal Rainfall
            </p>
            <Leaflet
              country={filterData.countryValue}
              geoJsonData={geoJsonData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsData;
