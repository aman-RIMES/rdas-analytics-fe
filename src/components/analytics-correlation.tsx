import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import { transformObject, formatTitle, formatDate } from "@/lib/utils";
import { AlertCircle, Table } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Button } from "./ui/button";
import bodyParams from "../data/body_params.json";
import axios from "axios";
import { BODY_PARAMS_URL } from "@/constants";
import { CorrelationFilterData, FilterData } from "@/types";

const AnalyticsCorrelation = ({ filterData }: any) => {
  const [params, setParams] = useState<any>(bodyParams);
  const [correlationFilterData, setCorrelationFilterData] =
    useState<CorrelationFilterData>({
      correlationVariable1: "",
      correlationVariable2: "",
    });
  const [isLoadingCorrelationData, setIsLoadingCorrelationData] =
    useState<any>(false);
  const [isCorrelationDataError, setIsCorrelationDataError] =
    useState<any>(false);
  const [isCorrelationDataVisible, setIsCorrelationDataVisible] =
    useState<any>(false);
  const [correlationChartData, setCorrelationChartData] = useState<any>({});
  const [regressionModelChartData, setRegressionModelChartData] = useState<any>(
    {}
  );

  const handleChange = (name: string, value: string | []) => {
    setCorrelationFilterData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    (async () => {
      try {
        const response: any = await axios.get(BODY_PARAMS_URL);
        setParams(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const generateCorrelationPlot = async () => {
    setIsCorrelationDataError(false);
    setIsCorrelationDataVisible(false);
    setIsLoadingCorrelationData(true);
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
      setIsLoadingCorrelationData(false);
      setIsCorrelationDataVisible(true);
    } catch (error) {
      setIsLoadingCorrelationData(false);
      setIsCorrelationDataError(true);
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
          array={transformObject(params.indic)}
          state={{
            value: correlationFilterData.correlationVariable1,
            setValue: handleChange,
          }}
        />
        <Combobox
          name={"correlationVariable2"}
          label={"Second Variable"}
          array={transformObject(params.indic)}
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
          className="mt-8"
          onClick={generateCorrelationPlot}
        >
          Analyze Correlation
        </Button>
      </div>

      {isLoadingCorrelationData && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Generating Correlation Data ...</p>
        </div>
      )}

      {isCorrelationDataError && (
        <div className="flex justify-center">
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

      {isCorrelationDataVisible && (
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

      {/* <div className="flex justify-center mt-16">
                <Button
                  // "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"
                  variant={"outline"}
                  className="text-sm px-10 border-black"
                  onClick={generateDescriptionAnalysis}
                >
                  View Descriptive Analysis
                </Button>
              </div>

              {isLoadingDescriptiveAnalysis && (
                <div className="my-20 flex justify-center">
                  <p className="text-xl">Loading Descriptive Analysis ....</p>
                </div>
              )}
              {showDescriptiveAnalysisError && (
                <div className="flex justify-center">
                  <Alert className="lg:w-3/4" variant="destructive">
                    <AlertCircle className="h-5 w-5 mt-1" />
                    <AlertTitle className="text-lg">API Error !</AlertTitle>
                    <AlertDescription className="text-md">
                      Failed to load the Descriptive Analysis. This could be due
                      to missing datasets. Try changing your filters and start
                      the analysis again.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {showDescription && (
                <>
                  <div className="flex md:flex-row flex-col justify-center xl:gap-40 items-center mt-20">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xl font-medium mb-5 ml-3">Head</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className=" text-black text-md font-medium">
                              Variable
                            </TableHead>
                            {descriptiveAnalysisData?.head?.columns.map(
                              (e: string) => (
                                <TableHead
                                  key={e}
                                  className=" text-black text-md font-medium"
                                >
                                  {e}
                                </TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.keys(
                            descriptiveAnalysisData?.head?.values
                          ).map((value: string) => (
                            <TableRow>
                              <TableCell className="font-medium text-black">
                                {formatTitle(value)}
                              </TableCell>

                              {descriptiveAnalysisData?.head?.values[value].map(
                                (e: number) => (
                                  <TableCell className=" text-black">
                                    {e.toFixed(2)}
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-5 md:mt-0 flex flex-col justify-center items-center">
                      <p className="text-xl font-medium mb-5  ml-3">
                        Data Availability
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className=" text-black text-md font-medium">
                              Value
                            </TableHead>
                            {descriptiveAnalysisData?.missing_values.variables.map(
                              (e: string) => (
                                <TableHead className=" text-black text-md font-medium">
                                  {formatTitle(e)}
                                </TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className=" text-black text-md font-medium">
                              Missing Values
                            </TableCell>
                            {descriptiveAnalysisData?.missing_values.values.map(
                              (value: number) => (
                                <TableCell>{value}</TableCell>
                              )
                            )}
                          </TableRow>
                          <TableRow>
                            <TableCell className=" text-black text-md font-medium">
                              Data types
                            </TableCell>
                            {descriptiveAnalysisData?.data_types.values.map(
                              (value: number) => (
                                <TableCell>{value}</TableCell>
                              )
                            )}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center mt-10">
                    <p className="text-xl font-medium mb-10">Statistics</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className=" text-black text-md font-medium">
                            Variable
                          </TableHead>
                          {descriptiveAnalysisData?.statistics?.columns.map(
                            (e: string) => (
                              <TableHead className=" text-black text-md font-medium">
                                {formatTitle(e)}
                              </TableHead>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(
                          descriptiveAnalysisData?.statistics?.values
                        ).map((value) => (
                          <TableRow>
                            <TableCell className="text-black text-md font-medium">
                              {formatTitle(value)}
                            </TableCell>

                            {descriptiveAnalysisData?.statistics?.values[
                              value
                            ].map((e: number) => (
                              <TableCell className="text-md">
                                {e.toFixed(2)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-20">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={descriptiveAnalysisData?.correlation_matrix}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-center mt-16">
                <Button
                  className="text-sm px-10 border-black"
                  onClick={() =>
                    navigate("/predictive-tools", {
                      state: {
                        ...filterData,
                        selected,
                      },
                    })
                  }
                >
                  Move to Prediction
                </Button>
              </div> */}
    </>
  );
};

export default AnalyticsCorrelation;
