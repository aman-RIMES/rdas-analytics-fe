import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatTitle, isError, isFinished, isLoading } from "@/lib/utils";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { PredictiveDataProps } from "@/types";
import { predictiveModelDataType } from "@/constants";

const PredictiveToolsData = ({
  regressionModelData,
  regressionModelStatus,
  predictiveDataType,
}: PredictiveDataProps) => {
  return (
    <>
      {isLoading(regressionModelStatus) && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Generating Linear Model ....</p>
        </div>
      )}
      {isError(regressionModelStatus) && (
        <div className="flex justify-center my-10">
          <Alert className="lg:w-3/4" variant="destructive">
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
        <div className="mb-10 px-5">
          {predictiveDataType === predictiveModelDataType.linear && (
            <>
              <div className="flex flex-row justify-center gap-32 mt-5">
                <div className="flex flex-col items-center justify-center mt-10 mb-10">
                  <p className="text-lg">MSE</p>
                  <p className="text-5xl font-semibold mt-5">
                    {regressionModelData.performance_metrics?.mse.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center mt-10 mb-10">
                  <p className="text-lg">R2</p>
                  <p className="text-5xl font-semibold mt-5">
                    {regressionModelData.performance_metrics?.r2.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={regressionModelData?.chart}
                />
              </div>
            </>
          )}

          <div className="mt-5">
            {predictiveDataType === predictiveModelDataType.logistic && (
              <>
                <div className="flex flex-row justify-center items-center gap-44 mt-20">
                  <div className="flex flex-col items-center justify-center mt-10 mb-10">
                    <p className="text-lg">Accuracy</p>
                    <p className="text-5xl font-semibold mt-5">
                      {regressionModelData?.accuracy?.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <p className="text-lg">Confusion Matrix</p>
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

                <div className="mt-10">
                  <p className="flex justify-center text-md font-medium">
                    Classification Report
                  </p>
                  <Table className="mt-10">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-md text-black font-medium">
                          Value
                        </TableHead>
                        {Object.keys(
                          regressionModelData?.classification_report[
                            "macro avg"
                          ]
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
          </div>
        </div>
      )}
    </>
  );
};

export default PredictiveToolsData;
