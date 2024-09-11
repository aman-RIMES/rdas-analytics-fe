import { useState } from "react";
import Combobox from "../ui/combobox";
import {
  transformObject,
  formatDate,
  isLoading,
  isError,
  isFinished,
  getAllDistrictsOfCountry,
} from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import axios from "axios";
import {
  analysisType,
  ElNinoToolDataIndicators,
  ElNinoVariables,
  requestStatus,
} from "@/constants";
import { CorrelationFilterData, FilterProps } from "@/types";
import { quantum } from "ldrs";
quantum.register("l-quantum");

const AnalyticsCorrelation = ({
  filterData,
  params,
  typeOfAnalysis,
}: FilterProps) => {
  const [correlationFilterData, setCorrelationFilterData] =
    useState<CorrelationFilterData>({
      correlationVariable1:
        typeOfAnalysis === analysisType.elnino
          ? Array.from(filterData.dataVariable)[0]
          : "",
      correlationVariable2:
        typeOfAnalysis === analysisType.elnino ? filterData.elNinoVariable : "",
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
        typeOfAnalysis === analysisType.climate
          ? {
              source: "ERA5",
              indic: `${correlationFilterData.correlationVariable1},${correlationFilterData.correlationVariable2}`,
              period: filterData.periodValue,
              district: filterData.districtValue,
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
            }
          : {
              source: "ERA5",
              indic: `${correlationFilterData.correlationVariable1},${correlationFilterData.correlationVariable2}`,
              period: "annual",
              district: getAllDistrictsOfCountry(filterData?.districtList).join(
                ","
              ),
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
            }
      );
      const regressionModelData = await axios.post(
        "http://203.156.108.67:1580/regression_analysis",
        typeOfAnalysis === analysisType.climate
          ? {
              source: "ERA5",
              indic: `${correlationFilterData.correlationVariable1},${correlationFilterData.correlationVariable2}`,
              period: filterData.periodValue,
              district: filterData.districtValue,
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
            }
          : {
              source: "ERA5",
              indic: `${correlationFilterData.correlationVariable1},${correlationFilterData.correlationVariable2}`,
              period: "annual",
              district: getAllDistrictsOfCountry(filterData?.districtList).join(
                ","
              ),
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
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
    <div className="sm:p-10 p-4 mt-10 rounded-lg bg-gray-50 shadow-lg">
      <div className="flex justify-center mb-10">
        <h1 className="text-xl font-semibold">
          Correlation between two variables
        </h1>
      </div>

      <div className="grid gap-4 my-8 md:grid-cols-3 grid-cols-1 justify-center">
        <Combobox
          name={"correlationVariable1"}
          label={"First Variable"}
          array={transformObject(
            typeOfAnalysis === analysisType.climate
              ? params.indic
              : ElNinoToolDataIndicators
          ).filter(
            (e: any) => e.value !== correlationFilterData.correlationVariable2
          )}
          state={{
            value: correlationFilterData.correlationVariable1,
            setValue: handleChange,
          }}
        />
        <Combobox
          name={"correlationVariable2"}
          label={"Second Variable"}
          array={transformObject(
            typeOfAnalysis === analysisType.climate
              ? params.indic
              : ElNinoVariables
          ).filter(
            (e: any) => e.value !== correlationFilterData.correlationVariable1
          )}
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
          className="mt-8 md:mt-0 bg-green-800 text-white hover:text-gray-800 hover:bg-yellow-300"
          onClick={generateCorrelationPlot}
        >
          Analyze Correlation
        </Button>
      </div>

      {isLoading(correlationStatus) && (
        <div className="my-20  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-quantum color="green" size="35"></l-quantum>
            <p className="text-2xl text-lime-700 font-medium">
              Generating Correlation Data
            </p>
          </div>
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
          <div className="flex flex-col">
            <div>
              <HighchartsReact
                highcharts={Highcharts}
                options={correlationChartData}
              />
            </div>

            <div className="flex justify-center items-center">
              <p className="mt-5 w-4/5">
                The Correlation matrix shows the strength and direction of the
                relationship between{" "}
                <span className="font-bold">
                  {" "}
                  {
                    ElNinoToolDataIndicators[
                      correlationFilterData.correlationVariable1
                    ]
                  }{" "}
                </span>
                and{" "}
                <span className="font-bold">
                  {ElNinoVariables[correlationFilterData.correlationVariable2]}{" "}
                </span>
                variables. In this case, there&#39;s a{" "}
                <span className="font-bold">Negative</span> correlation between{" "}
                {ElNinoVariables[correlationFilterData.correlationVariable2]}{" "}
                and{" "}
                {
                  ElNinoToolDataIndicators[
                    correlationFilterData.correlationVariable1
                  ]
                }{" "}
                , suggesting that as{" "}
                {ElNinoVariables[correlationFilterData.correlationVariable2]}{" "}
                <span className="font-bold">intensifies</span>,{" "}
                {
                  ElNinoToolDataIndicators[
                    correlationFilterData.correlationVariable1
                  ]
                }{" "}
                tends to <span className="font-bold">decrease</span>.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <HighchartsReact
              highcharts={Highcharts}
              options={regressionModelChartData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCorrelation;
