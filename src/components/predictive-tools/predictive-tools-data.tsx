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
import { AlertCircle } from "lucide-react";
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
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to generate model. This could be due to missing datasets.
              Try changing your filters and start the analysis again.
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

            <div className="flex flex-row justify-center gap-20">
              <div className="w-full flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                <p className="text-xl font-medium">Test Statistic</p>
                <p className="text-5xl font-semibold mt-5">
                  {predictiveEvaluation &&
                    predictiveEvaluation["shapiro-wilk"]["stat"].toFixed(2)}
                </p>
              </div>
              <div className="w-full flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                <p className="text-xl font-medium">P-Value</p>
                <p className="text-5xl font-semibold mt-5">
                  {predictiveEvaluation &&
                    predictiveEvaluation["shapiro-wilk"]["p_value"].toFixed(2)}
                </p>
              </div>
            </div>

            {predictiveEvaluation &&
              predictiveEvaluation["shapiro-wilk"]["p_value"] > 0.05 && (
                <>
                  <p className="text-center">
                    The P-Value is greater than{" "}
                    <span className="font-bold">0.05</span>, meaning that the
                    sample follows a normal distribution and the model is a good
                    fit.
                  </p>

                  <div>
                    <p className="text-center font-semibold text-lg mt-8">
                      Table of Prediction
                    </p>
                    <Table className="mt-10">
                      <TableHeader>
                        <TableRow>
                          {Object.keys(
                            predictiveEvaluation["prediction_table"]
                          )?.map((element: any) => (
                            <TableHead className="text-md text-black font-medium">
                              {element}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {transformPredictionTableData(
                          predictiveEvaluation["prediction_table"]
                        ).map((e) => (
                          <TableRow>
                            {Object.values(e).map((element: any) => (
                              <TableCell className="text-md">
                                {element}
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
