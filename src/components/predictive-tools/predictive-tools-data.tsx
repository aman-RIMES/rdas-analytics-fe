import {
  formatTitle,
  isError,
  isFinished,
  isIdle,
  isLoading,
  transformObject,
  transformPredictionTableData,
} from "@/lib/utils";

import { PredictiveDataProps, PredictiveFilterData } from "@/types";
import {
  ElNinoToolDataIndicators,
  IDLE_PREDICTIVE_CHART_MESSAGE,
  toolType,
} from "@/constants";
import { helix } from "ldrs";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { useEffect, useState } from "react";
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
import Loading from "../ui/loading";
import ErrorMessage from "../ui/error-message";
import PredictiveChart from "./predictive_chart";

const PredictiveToolsData = ({
  regressionModelData,
  regressionModelStatus,
  filterData,
  climatePattern,
}: PredictiveDataProps) => {
  const [predictiveFilterData, setPredictiveFilterData] =
    useState<PredictiveFilterData>({
      elNinoCategory: "moderate",
      predictiveVariable: "rainfall",
    });
  const [predictiveEvaluation, setPredictiveEvaluation] = useState<any>({});
  const [predictiveTable, setPredictiveTable] = useState<any>({});
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
    setPredictiveEvaluation(evaluation);
    setPredictiveTable(evaluation?.prediction_table);
  }, [predictiveFilterData.predictiveVariable, regressionModelData]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="relative z-0 bg-white shadow-lg rounded-lg col-span-2">
            <div className="my-1 flex flex-row gap-5 justify-center">
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

            <div className="p-1">
              {isFinished(regressionModelStatus) && predictiveEvaluation && (
                <>
                  <div className="mt-2">
                    <p className="text-center font-medium text-md ">
                      Table of Prediction
                    </p>
                    <ScrollArea>
                      <Table className="mt-3">
                        <TableHeader>
                          <TableRow>
                            {Object.keys(predictiveTable)?.map(
                              (element: any) => (
                                <TableHead className="text-xs text-black font-medium text-center">
                                  {element}
                                </TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {transformPredictionTableData(predictiveTable).map(
                            (e, index) => (
                              <TableRow key={index}>
                                {Object.values(e).map((element: any, index) => (
                                  <TableCell
                                    key={index}
                                    className="text-xs text-center"
                                  >
                                    {element === 0 &&
                                    index > 0 &&
                                    predictiveFilterData.predictiveVariable ===
                                      "rainfall"
                                      ? "No Rainfall"
                                      : element}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )
                          )}
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
                  <p className="text-xl font-bold text-green-800">
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

          <PredictiveChart
            predictiveEvaluation={predictiveEvaluation}
            regressionModelStatus={regressionModelStatus}
            chartNumber={0}
            climatePattern={climatePattern}
          />
          <PredictiveChart
            predictiveEvaluation={predictiveEvaluation}
            regressionModelStatus={regressionModelStatus}
            chartNumber={1}
            climatePattern={climatePattern}
          />
          <PredictiveChart
            predictiveEvaluation={predictiveEvaluation}
            regressionModelStatus={regressionModelStatus}
            chartNumber={2}
            climatePattern={climatePattern}
          />
          {climatePattern === toolType.elnino && (
            <PredictiveChart
              predictiveEvaluation={predictiveEvaluation}
              regressionModelStatus={regressionModelStatus}
              chartNumber={3}
              climatePattern={climatePattern}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PredictiveToolsData;
