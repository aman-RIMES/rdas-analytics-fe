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
      correlationVariable2: "",
    });
  const [correlationStatus, setCorrelationStatus] = useState<requestStatus>();
  const [correlationChartData, setCorrelationChartData] = useState<any>({});

  const handleChange = (name: string, value: string | []) => {
    setCorrelationFilterData((prev) => ({ ...prev, [name]: value }));
  };

  const generateCorrelationPlot = async () => {
    setCorrelationStatus(requestStatus.isLoading);
    setCorrelationChartData({});
    try {
      const correlationData = await axios.post(
        "http://203.156.108.67:1580/el_nino_correlation",
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
              indic: `rainfall`,
              country: filterData.countryValue,
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
            }
      );
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

      <div className="flex justify-center">
        <div className="grid w-2/3 gap-4 my-8 xl:grid-cols-2 grid-cols-1 ">
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

          <Button
            disabled={correlationFilterData.correlationVariable1 === ""}
            className="mt-8 md:mt-0 bg-green-800 text-white hover:text-gray-800 hover:bg-yellow-300"
            onClick={generateCorrelationPlot}
          >
            Analyze Correlation
          </Button>
        </div>
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
          <div className="grid gap-4 my-8 md:grid-cols-2 grid-cols-1 justify-center">
            <div>
              <HighchartsReact
                highcharts={Highcharts}
                options={correlationChartData.scatter}
              />
            </div>
            <div>
              <HighchartsReact
                highcharts={Highcharts}
                options={correlationChartData.plot}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCorrelation;
