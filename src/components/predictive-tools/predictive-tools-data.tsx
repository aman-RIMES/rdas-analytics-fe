import {
  formatTitle,
  isError,
  isFinished,
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
import { ElNinoToolDataIndicators, ElNinoCategories } from "@/constants";
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
helix.register("l-helix");

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
      {isLoading(regressionModelStatus) && (
        <div className="my-20 flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-helix color="green" size="50"></l-helix>
            <p className="text-xl text-lime-700 font-medium">
              {`Generating ${formatTitle(modelType)} Model`}
            </p>
          </div>
        </div>
      )}

      {isError(regressionModelStatus) && (
        <div className="flex justify-center my-20">
          <Alert className="lg:w-2/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to generate model. This could be due to missing data for
              the chosen months. Try changing your filters/months and start the
              prediction again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isFinished(regressionModelStatus) && (
        <>
          <div className="mt-10 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <div className="flex flex-row gap-5 justify-center">
              <div className="w-1/3">
                <div className="flex gap-2 ">
                  <Label className="mb-2 font-semibold">El Nino Category</Label>
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
                <div className="flex gap-2 ">
                  <Label className="mb-2 font-semibold">Variable</Label>
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

            <div className="flex justify-center mt-10">
              <h1 className="text-2xl font-semibold">
                {`Predictive Model Evaluation`}
              </h1>
            </div>

            <div className="flex flex-col gap-20">
              <div>
                <div className="mt-5 flex flex-col gap-10">
                  <div className="sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={predictiveEvaluation?.chart}
                    />
                  </div>
                  <div className="sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={predictiveEvaluation?.qq_plot}
                    />
                  </div>
                  <div className="sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={predictiveEvaluation?.histogram}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <div className="flex justify-center">
              <p className="text-2xl font-bold">Predictive Evaluation</p>
            </div>

            <div className=" flex justify-center">
              <div className=" grid grid-cols-2 justify-center gap-10">
                <div className="flex flex-col">
                  <div className="z-10 h-full w-full flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                    <p className="text-xl font-medium">Test Statistic</p>
                    <p className="text-6xl font-semibold mt-5">
                      {predictiveEvaluation &&
                        predictiveEvaluation["shapiro-wilk"]["stat"].toFixed(2)}
                    </p>
                  </div>
                  <div className="z-0 bg-emerald-600 h-full w-full flex flex-col items-center mt-[-50px]  justify-center mb-10 sm:px-5  rounded-lg shadow-lg">
                    <p className="text-sm text-white font-medium mt-5 mb-3">
                      The <span className="italic">Test Statistic</span> value
                      ranges between <span className="underline">0 and 1</span>,
                      with values closer to 1 indicating that the sample data is
                      more likely to be normally distributed, and a test
                      statistic value below 1 suggests that the data departs
                      from normality.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="z-10 h-full w-full flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                    <p className="text-xl font-medium">P-Value</p>
                    <p className="text-6xl font-semibold mt-5">
                      {predictiveEvaluation &&
                        predictiveEvaluation["shapiro-wilk"]["p_value"].toFixed(
                          2
                        )}
                    </p>
                  </div>

                  <div className="z-0 bg-emerald-600 h-full w-full flex flex-col items-center mt-[-50px]  justify-center mb-10 sm:px-5  rounded-lg shadow-lg">
                    <p className="text-sm text-white font-medium mt-5 mb-3">
                      The <span className="italic">P-Value</span> is greater
                      than <span className="underline font-bold">0.05</span>,
                      meaning that the sample follows a normal distribution and
                      the model is a good fit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {predictiveEvaluation &&
              predictiveEvaluation["shapiro-wilk"]["p_value"] > 0.05 && (
                <>
                  <div>
                    <p className="text-center font-semibold text-lg mt-3">
                      Table of Prediction
                    </p>
                    <Table className="mt-10">
                      <TableHeader>
                        <TableRow>
                          {Object.keys(
                            predictiveEvaluation["prediction_table"]
                          )?.map((element: any) => (
                            <TableHead className="text-md text-black font-medium text-center">
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
                                className="text-md text-center"
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
                  </div>
                </>
              )}

            {/* <PredictiveCalculation
              intercept={predictiveEvaluation?.intercept}
              coefficient={predictiveEvaluation?.coefficients[0]}
              std_error={predictiveEvaluation?.std_error}
              variable={predictiveFilterData?.predictiveVariable}
            /> */}
          </div>
        </>
      )}
    </>
  );
};

export default PredictiveToolsData;
