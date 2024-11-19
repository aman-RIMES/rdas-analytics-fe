import {
  formatTitle,
  isError,
  isFinished,
  isIdle,
  isLoading,
  transformObject,
  transformPredictionTableData,
} from "@/lib/utils";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import {
  PredictiveDataProps,
  PredictiveEvaluation,
  PredictiveFilterData,
} from "@/types";
import {
  ElNinoToolDataIndicators,
  ElNinoCategories,
  IDLE_PREDICTIVE_CHART_MESSAGE,
} from "@/constants";
import { helix } from "ldrs";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { useEffect, useState } from "react";
import PredictiveCalculation from "./predictve-tools-calculation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { title } from "process";
import { ScrollArea } from "@radix-ui/react-scroll-area";
helix.register("l-helix");
import sampleCharts from "../../data/sample_charts.json";
import Loading from "../ui/loading";
import ErrorMessage from "../ui/error-message";

const PredictiveToolsData = ({
  regressionModelData,
  regressionModelStatus,
  modelType,
  filterData,
}: PredictiveDataProps) => {
  const [predictiveFilterData, setPredictiveFilterData] =
    useState<PredictiveFilterData>({
      elNinoCategory: "moderate",
      predictiveVariable: "rainfall",
    });
  const [predictiveEvaluation, setPredictiveEvaluation] = useState<any>({});

  const handlePredictiveFilterChange = (name: string, value: string | []) => {
    setPredictiveFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const predictionVariables = Object.fromEntries(
    Object.entries(ElNinoToolDataIndicators).filter(([key, val]) =>
      filterData.dataVariable.includes(key)
    )
  );

  useEffect(() => {
    const evaluation = regressionModelData[
      predictiveFilterData.predictiveVariable
    ]?.find(
      (element) => element.category === predictiveFilterData.elNinoCategory
    );

    setPredictiveEvaluation(evaluation);
  }, [
    predictiveFilterData.predictiveVariable,
    predictiveFilterData.elNinoCategory,
    regressionModelData,
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-6 gap-2 mt-auto">
          <div className="rounded-lg bg-white shadow-lg col-span-4">
            <div className="my-3 flex flex-row gap-5 justify-center">
              <div className="w-1/3">
                <div className="flex  ">
                  <Label className="text-xs  font-semibold">
                    El Nino Category
                  </Label>
                  <HelpHoverCard
                    title={"El Nino Category"}
                    content={` The El Nino Category you would like to use for the prediction. `}
                  />
                </div>
                <Combobox
                  name="elNinoCategory"
                  label={"El Nino Category"}
                  array={ElNinoCategories}
                  state={{
                    value: predictiveFilterData.elNinoCategory,
                    setValue: handlePredictiveFilterChange,
                  }}
                />
              </div>
              <div className="w-1/3">
                <div className="flex">
                  <Label className=" text-xs font-semibold">Variable</Label>
                  <HelpHoverCard
                    title={"Variable"}
                    content={` The variable that you would like to use for the prediction. `}
                  />
                </div>
                <Combobox
                  name="predictiveVariable"
                  label={"Variable"}
                  array={transformObject(predictionVariables)}
                  state={{
                    value: predictiveFilterData.predictiveVariable,
                    setValue: handlePredictiveFilterChange,
                  }}
                />
              </div>
            </div>

            <div className="relative z-0">
              <div className="p-2 rounded-lg bg-white">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={
                    predictiveEvaluation?.chart
                      ? predictiveEvaluation?.chart
                      : sampleCharts?.predictive_chart
                  }
                />
              </div>
              {(isIdle(regressionModelStatus) ||
                isLoading(regressionModelStatus) ||
                isError(regressionModelStatus)) && (
                <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                  {isIdle(regressionModelStatus) ? (
                    <p className="text-2xl font-bold text-green-800">
                      {IDLE_PREDICTIVE_CHART_MESSAGE}
                    </p>
                  ) : isError(regressionModelStatus) ? (
                    <ErrorMessage
                      errorMessage={`Failed to generate model. This could be due to missing data for
              the chosen months. Try changing your filters/months and start the
              prediction again.`}
                    />
                  ) : (
                    <Loading
                      animation={<l-helix color="green" size="50"></l-helix>}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="relative z-0 col-span-2 bg-white shadow-lg rounded-lg ">
            <div className="p-1  ">
              <div className="flex justify-center">
                <p className="text-md font-medium">Predictive Evaluation</p>
              </div>

              <div className="mt-2 flex justify-center">
                <div className=" grid grid-cols-2 justify-center gap-2">
                  <div className="flex flex-col">
                    <div className="z-10  w-full flex flex-col items-center justify-center  py-3 border-2 rounded-lg bg-white shadow-lg">
                      <p className="text-xl font-medium">Test Statistic</p>
                      <p className="text-4xl font-semibold mt-2">
                        {isFinished(regressionModelStatus) &&
                        predictiveEvaluation
                          ? predictiveEvaluation["shapiro-wilk"][
                              "stat"
                            ].toFixed(2)
                          : "--"}
                      </p>
                    </div>
                    <div className="z-0 bg-emerald-600 h-full w-full flex flex-col items-center mt-[-10px]  justify-center mb-3 sm:px-5  rounded-lg shadow-lg">
                      <p className="text-xs text-white font-medium mt-5 mb-3">
                        The <span className="italic">Test Statistic</span> value
                        ranges between{" "}
                        <span className="underline">0 and 1</span>, with values
                        closer to 1 indicating that the sample data is more
                        likely to be normally distributed, and a test statistic
                        value below 1 suggests that the data departs from
                        normality.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="z-10  w-full flex flex-col items-center justify-center py-3 border-2 rounded-lg bg-white shadow-lg">
                      <p className="text-xl font-medium">P-Value</p>
                      <p className="text-4xl font-semibold mt-2">
                        {isFinished(regressionModelStatus) &&
                        predictiveEvaluation
                          ? predictiveEvaluation["shapiro-wilk"][
                              "p_value"
                            ].toFixed(2)
                          : "--"}
                      </p>
                    </div>

                    <div className="z-0 bg-emerald-600 h-full w-full flex flex-col  mt-[-10px]  mb-3 sm:px-5  rounded-lg shadow-lg">
                      <p className="text-xs text-white font-medium mt-5 mb-3">
                        The <span className="italic">P-Value</span> is greater
                        than <span className="underline font-bold">0.05</span>,
                        meaning that the sample follows a normal distribution
                        and the model is a good fit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isFinished(regressionModelStatus) &&
                predictiveEvaluation &&
                predictiveEvaluation["shapiro-wilk"]["p_value"] > 0.05 && (
                  <>
                    <div>
                      <p className="text-center font-medium text-md ">
                        Table of Prediction
                      </p>
                      <ScrollArea>
                        <Table className="mt-3">
                          <TableHeader>
                            <TableRow>
                              {Object.keys(
                                predictiveEvaluation["prediction_table"]
                              )?.map((element: any) => (
                                <TableHead className="text-xs text-black font-medium text-center">
                                  {element}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {transformPredictionTableData(
                              predictiveEvaluation["prediction_table"]
                            ).map((e, index) => (
                              <TableRow key={index}>
                                {Object.values(e).map((element: any, index) => (
                                  <TableCell
                                    key={index}
                                    className="text-xs text-center"
                                  >
                                    <HoverCard>
                                      <HoverCardTrigger>
                                        {element === 0 &&
                                        index > 0 &&
                                        predictiveFilterData.predictiveVariable ===
                                          "rainfall"
                                          ? "No Rainfall"
                                          : element.toFixed(2)}
                                      </HoverCardTrigger>
                                      <HoverCardContent className="flex flex-col">
                                        <p className="text-sm ">
                                          This means that ...{" "}
                                        </p>
                                      </HoverCardContent>
                                    </HoverCard>
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </>
                )}
            </div>

            {(isIdle(regressionModelStatus) ||
              isLoading(regressionModelStatus) ||
              isError(regressionModelStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(regressionModelStatus) ? (
                  <p className="text-2xl font-bold text-green-800">
                    {IDLE_PREDICTIVE_CHART_MESSAGE}
                  </p>
                ) : isError(regressionModelStatus) ? (
                  <ErrorMessage
                    errorMessage={`Failed to generate model. This could be due to missing data for
              the chosen months. Try changing your filters/months and start the
              prediction again.`}
                  />
                ) : (
                  <Loading
                    animation={<l-helix color="green" size="50"></l-helix>}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative z-0">
            <div className="sm:p-10 p-4 rounded-lg bg-white shadow-lg">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  predictiveEvaluation?.qq_plot
                    ? predictiveEvaluation?.qq_plot
                    : sampleCharts?.qq_plot
                }
                containerProps={{ style: { height: "300px" } }}
              />
            </div>
            {(isIdle(regressionModelStatus) ||
              isLoading(regressionModelStatus) ||
              isError(regressionModelStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(regressionModelStatus) ? (
                  <p className="text-2xl font-bold text-green-800">
                    {IDLE_PREDICTIVE_CHART_MESSAGE}
                  </p>
                ) : isError(regressionModelStatus) ? (
                  <ErrorMessage
                    errorMessage={`Failed to generate model. This could be due to missing data for
              the chosen months. Try changing your filters/months and start the
              prediction again.`}
                  />
                ) : (
                  <Loading
                    animation={<l-helix color="green" size="50"></l-helix>}
                  />
                )}
              </div>
            )}
          </div>

          <div className="relative z-0">
            <div className="sm:p-10 p-4 rounded-lg bg-white shadow-lg">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  predictiveEvaluation?.histogram
                    ? predictiveEvaluation?.histogram
                    : sampleCharts?.histogram
                }
                containerProps={{ style: { height: "300px" } }}
              />
            </div>
            {(isIdle(regressionModelStatus) ||
              isLoading(regressionModelStatus) ||
              isError(regressionModelStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(regressionModelStatus) ? (
                  <p className="text-2xl font-bold text-green-800">
                    {IDLE_PREDICTIVE_CHART_MESSAGE}
                  </p>
                ) : isError(regressionModelStatus) ? (
                  <ErrorMessage
                    errorMessage={`Failed to generate model. This could be due to missing data for
              the chosen months. Try changing your filters/months and start the
              prediction again.`}
                  />
                ) : (
                  <Loading
                    animation={<l-helix color="green" size="50"></l-helix>}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PredictiveToolsData;
