import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  formatTitle,
  isError,
  isFinished,
  isLoading,
  transformObject,
} from "@/lib/utils";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { PredictiveDataProps } from "@/types";
import { ElNinoVariables, predictiveModelDataType } from "@/constants";
import { helix } from "ldrs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import PerformanceMetricsInference from "../performance-metrics-inference";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
helix.register("l-helix");

const PredictiveToolsData = ({
  regressionModelData,
  regressionModelStatus,
  predictiveDataType,
  modelType,
  filterData,
  handleChange,
}: PredictiveDataProps) => {
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
        <div className="mt-10 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
          <div className="flex justify-center mb-10">
            <h1 className="text-3xl font-semibold">
              {`${formatTitle(predictiveDataType)} Predictive Model`}
            </h1>
          </div>

          <div className="flex justify-center">
            <div className="w-1/2">
              <div className="flex gap-2 ">
                <Label className="mb-2 font-semibold">El Nino Category</Label>
                <HelpHoverCard
                  title={"El Nino Category"}
                  content={` The El Nino Category you would like to use for the prediction. `}
                />
              </div>
              <Combobox
                name="elNinoVariable"
                label={"El Nino Category"}
                array={transformObject(ElNinoVariables)}
                state={{
                  value: filterData.elNinoVariable,
                  setValue: handleChange,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-20">
            {regressionModelData[0]?.map(
              (data) =>
                data?.category === filterData.elNinoVariable && (
                  <div className="p-5 shadow-md shadow-gray-200 rounded-lg">
                    <div className="mt-5 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={data?.chart}
                      />
                    </div>

                    <div className="mt-10 ">
                      <p className="text-xl text-center font-semibold">
                        {formatTitle(data.category)} El Nino Performance Metrics
                      </p>
                    </div>
                    <div className="flex flex-row justify-center gap-20">
                      <div className="w-full flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                        <p className="text-xl font-medium">
                          MSE - Mean Square Error
                        </p>
                        <p className="text-5xl font-semibold mt-5">
                          {data.performance_metrics?.mse.toFixed(2)}
                        </p>
                      </div>
                      <div className="w-full flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
                        <p className="text-xl font-medium">
                          R2 - Proportion of Variance
                        </p>
                        <p className="text-5xl font-semibold mt-5">
                          {data.performance_metrics?.r2.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="flex justify-center text-md gap-2 text-green-700">
                          Performance Metrics Interpretation
                        </AccordionTrigger>
                        <AccordionContent>
                          <PerformanceMetricsInference />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )
            )}
          </div>

          {/* {predictiveDataType === predictiveModelDataType.logistic && (
            <>
              <div className="flex flex-row justify-center items-center gap-20 mt-10">
                <div className="h-[340px] flex flex-col items-center justify-center mt-10 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg w-full">
                  <p className="text-2xl font-medium">Accuracy</p>
                  <p className="text-8xl font-semibold mt-5">
                    {regressionModelData?.accuracy?.toFixed(2)}
                  </p>
                </div>

                <div className="h-[350px] flex flex-col justify-center items-center sm:p-10 p-4 rounded-lg bg-white shadow-lg w-full">
                  <p className="text-2xl font-medium">Confusion Matrix</p>
                  <Table className="mt-5">
                    <TableBody>
                      {regressionModelData?.confusion_matrix?.map(
                        (element: any, index: number) => (
                          <TableRow key={index}>
                            {element.map((cell: number) => (
                              <TableCell className="text-black text-md px-5">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg w-full">
                <p className="flex justify-center text-xl font-medium">
                  Classification Report
                </p>
                <Table className="mt-10">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-md text-black font-medium">
                        Value
                      </TableHead>
                      {Object.keys(
                        regressionModelData?.classification_report["macro avg"]
                      ).map((element: any) => (
                        <TableHead className="text-md text-black font-medium">
                          {formatTitle(element)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(regressionModelData.classification_report)
                      .filter((e) => e !== "accuracy")
                      .map((e) => (
                        <TableRow>
                          <TableCell className="text-black text-md font-medium">
                            {e}
                          </TableCell>

                          {Object.values(
                            regressionModelData.classification_report[e]
                          ).map((element: any) => (
                            <TableCell className="text-md">{element}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )} */}
        </div>
      )}
    </>
  );
};

export default PredictiveToolsData;
