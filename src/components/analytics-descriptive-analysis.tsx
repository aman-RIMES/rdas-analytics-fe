import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  formatDate,
  formatTitle,
  isError,
  isFinished,
  isLoading,
} from "@/lib/utils";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { useState } from "react";
import { FilterProps } from "@/types";
import axios from "axios";
import { requestStatus } from "@/constants";

const DescriptiveAnalysis = ({ filterData }: FilterProps) => {
  const [descriptiveAnalysisStatus, setDescriptiveAnalysisStatus] =
    useState<requestStatus>();
  const [descriptiveAnalysisData, setDescriptiveAnalysisData] = useState<any>(
    {}
  );

  const generateDescriptionAnalysis = async () => {
    setDescriptiveAnalysisStatus(requestStatus.isLoading);
    setDescriptiveAnalysisData({});
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/description_analysis",
        {
          source: filterData.source,
          indic: filterData.independentVariables.join(","),
          period: filterData.periodValue,
          district: filterData.districtValue,
          start: formatDate(filterData.dateRange?.from),
          end: formatDate(filterData.dateRange?.to),
          indic_0: filterData.dependentVariable,
          // source: "ERA5",
          // indic: "rainfall,normal_rainfall",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
          // indic_0: "el_nino",
        }
      );
      setDescriptiveAnalysisData(response.data);
      setDescriptiveAnalysisStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setDescriptiveAnalysisStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="flex justify-center mt-16">
        <Button
          // "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"
          variant={"outline"}
          className="text-sm px-10 border-black"
          onClick={generateDescriptionAnalysis}
        >
          View Descriptive Analysis
        </Button>
      </div>

      {isLoading(descriptiveAnalysisStatus) && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Loading Descriptive Analysis ....</p>
        </div>
      )}
      {isError(descriptiveAnalysisStatus) && (
        <div className="flex justify-center">
          <Alert className="lg:w-3/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to load the Descriptive Analysis. This could be due to
              missing datasets. Try changing your filters and start the analysis
              again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isFinished(descriptiveAnalysisStatus) && (
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
                    {descriptiveAnalysisData?.head?.columns.map((e: string) => (
                      <TableHead
                        key={e}
                        className=" text-black text-md font-medium"
                      >
                        {e}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(descriptiveAnalysisData?.head?.values).map(
                    (value: string) => (
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
                    )
                  )}
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
                {Object.keys(descriptiveAnalysisData?.statistics?.values).map(
                  (value) => (
                    <TableRow>
                      <TableCell className="text-black text-md font-medium">
                        {formatTitle(value)}
                      </TableCell>

                      {descriptiveAnalysisData?.statistics?.values[value].map(
                        (e: number) => (
                          <TableCell className="text-md">
                            {e.toFixed(2)}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )}
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
    </>
  );
};

export default DescriptiveAnalysis;
