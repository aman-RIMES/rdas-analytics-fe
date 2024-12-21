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
  const [predictiveEvaluation, setPredictiveEvaluation] = useState<any>([]);
  const [predictiveTableData, setPredictiveTableData] = useState<any>({});

  const handlePredictiveFilterChange = (name: string, value: string | []) => {
    setPredictiveFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const predictionVariables = Object.fromEntries(
    Object.entries(ElNinoToolDataIndicators).filter(([key, val]) =>
      filterData.dataVariable.includes(key)
    )
  );

  useEffect(() => {
    const evaluation =
      regressionModelData[predictiveFilterData.predictiveVariable];
    const predictiveTable = evaluation?.find(
      (element) => element.category === predictiveFilterData.elNinoCategory
    )["prediction_table"];

    setPredictiveEvaluation(evaluation);
    setPredictiveTableData(predictiveTable);
  }, [
    predictiveFilterData.predictiveVariable,
    predictiveFilterData.elNinoCategory,
    regressionModelData,
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-2 mt-auto">
          <div className="relative z-0 bg-white shadow-lg rounded-lg col-span-2">
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

            <div className="p-1  ">
              {isFinished(regressionModelStatus) && predictiveTableData && (
                <>
                  <div className="mt-5">
                    <p className="text-center font-medium text-md ">
                      Table of Prediction
                    </p>
                    <ScrollArea>
                      <Table className="mt-3">
                        <TableHeader>
                          <TableRow>
                            {Object.keys(predictiveTableData)?.map(
                              (element: any) => (
                                <TableHead className="text-xs text-black font-medium text-center">
                                  {element}
                                </TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {transformPredictionTableData(
                            predictiveTableData
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

          <div className="rounded-lg bg-white shadow-lg col-span-2">
            <div className="relative z-0">
              <div className="p-2 rounded-lg bg-white">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={
                    predictiveEvaluation?.find((el) => el.category === "weak")
                      ?.chart
                      ? predictiveEvaluation?.find(
                          (el) => el.category === "weak"
                        )?.chart
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
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="relative z-0">
            <div className="p-6  rounded-lg bg-white shadow-lg">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  predictiveEvaluation?.find((el) => el.category === "moderate")
                    ?.chart
                    ? predictiveEvaluation?.find(
                        (el) => el.category === "moderate"
                      )?.chart
                    : sampleCharts?.predictive_chart
                }
                containerProps={{ style: { height: "400px" } }}
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
            <div className="p-6 rounded-lg bg-white shadow-lg">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  predictiveEvaluation?.find((el) => el.category === "strong")
                    ?.chart
                    ? predictiveEvaluation?.find(
                        (el) => el.category === "strong"
                      )?.chart
                    : sampleCharts?.predictive_chart
                }
                containerProps={{ style: { height: "400px" } }}
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
            <div className="p-6 rounded-lg bg-white shadow-lg">
              <HighchartsReact
                highcharts={Highcharts}
                options={
                  predictiveEvaluation?.find(
                    (el) => el.category === "very_strong"
                  )?.chart
                    ? predictiveEvaluation?.find(
                        (el) => el.category === "very_strong"
                      )?.chart
                    : sampleCharts?.predictive_chart
                }
                containerProps={{ style: { height: "400px" } }}
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
