import { useState } from "react";
import Combobox from "./ui/combobox";
import {
  transformObject,
  formatDate,
  isLoading,
  isError,
  isFinished,
} from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import axios from "axios";
import { requestStatus } from "@/constants";
import { CorrelationFilterData, FilterData, FilterProps } from "@/types";

const AnalyticsCorrelation = ({ filterData, params }: FilterProps) => {
  const [correlationFilterData, setCorrelationFilterData] =
    useState<CorrelationFilterData>({
      correlationVariable1: "",
      correlationVariable2: "",
    });
  const [correlationStatus, setCorrelationStatus] = useState<requestStatus>();
  const [correlationChartData, setCorrelationChartData] = useState<any>({});
  const [regressionModelChartData, setRegressionModelChartData] = useState<any>(
    {}
  );

  const handleChange = (name: string, value: string | []) => {
    setCorrelationFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const generateCorrelationPlot = async () => {
    setCorrelationStatus(requestStatus.isLoading);
    setCorrelationChartData({});
    setRegressionModelChartData({});
    try {
      const correlationData = await axios.post(
        "http://203.156.108.67:1580/correlation_plot",
        {
          source: filterData.source,
          indic: `${correlationFilterData.correlationVariable1},${correlationFilterData.correlationVariable2}`,
          period: filterData.periodValue,
          district: filterData.districtValue,
          start: formatDate(filterData.dateRange?.from),
          end: formatDate(filterData.dateRange?.to),

          // source: "ERA5",
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
        }
      );
      const regressionModelData = await axios.post(
        "http://203.156.108.67:1580/regression_analysis",
        {
          source: filterData.source,
          indic: `${correlationFilterData.correlationVariable1},${correlationFilterData.correlationVariable2}`,
          period: filterData.periodValue,
          district: filterData.districtValue,
          start: formatDate(filterData.dateRange?.from),
          end: formatDate(filterData.dateRange?.to),

          // source: "ERA5",
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
        }
      );
      setRegressionModelChartData(regressionModelData.data);
      setCorrelationChartData(correlationData.data);
      setCorrelationStatus(requestStatus.isFinished);
    } catch (error) {
      setCorrelationStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <h1 className="text-lg font-semibold">
          View Correlation between two variables
        </h1>
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-3 grid-cols-1 justify-center">
        <Combobox
          name={"correlationVariable1"}
          label={"First Variable"}
          array={transformObject(params?.indic)}
          state={{
            value: correlationFilterData.correlationVariable1,
            setValue: handleChange,
          }}
        />
        <Combobox
          name={"correlationVariable2"}
          label={"Second Variable"}
          array={transformObject(params?.indic)}
          state={{
            value: correlationFilterData.correlationVariable2,
            setValue: handleChange,
          }}
        />
        <Button
          disabled={
            correlationFilterData.correlationVariable1 === "" ||
            correlationFilterData.correlationVariable2 === ""
          }
          className="mt-8 md:mt-0"
          onClick={generateCorrelationPlot}
        >
          Analyze Correlation
        </Button>
      </div>

      {isLoading(correlationStatus) && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Generating Correlation Data ...</p>
        </div>
      )}

      {isError(correlationStatus) && (
        <div className="flex justify-center mt-10">
          <Alert className="lg:w-3/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to generate the Correlation Data. This could be due to
              missing datasets. Try changing your filters and start the analysis
              again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isFinished(correlationStatus) && (
        <div className="mt-10">
          <HighchartsReact
            highcharts={Highcharts}
            options={correlationChartData}
          />
          <div className="mt-10">
            <HighchartsReact
              highcharts={Highcharts}
              options={regressionModelChartData}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AnalyticsCorrelation;
