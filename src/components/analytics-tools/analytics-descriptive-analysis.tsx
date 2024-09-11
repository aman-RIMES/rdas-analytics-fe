import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  formatDate,
  formatTitle,
  getAllDistrictsOfCountry,
  isError,
  isFinished,
  isLoading,
} from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { useEffect, useState } from "react";
import { FilterProps } from "@/types";
import axios from "axios";
import { analysisType, requestStatus } from "@/constants";
import { tailChase } from "ldrs";
tailChase.register("l-tailchase");

const DescriptiveAnalysis = ({ filterData, typeOfAnalysis }: FilterProps) => {
  const [descriptiveAnalysisStatus, setDescriptiveAnalysisStatus] =
    useState<requestStatus>();
  const [descriptiveAnalysisData, setDescriptiveAnalysisData] = useState<any>(
    {}
  );

  useEffect(() => {
    generateDescriptionAnalysis();
  }, []);

  const generateDescriptionAnalysis = async () => {
    setDescriptiveAnalysisStatus(requestStatus.isLoading);
    setDescriptiveAnalysisData({});
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/description_analysis",
        typeOfAnalysis === analysisType.climate
          ? {
              source: "ERA5",
              indic: filterData.independentVariables.join(","),
              period: filterData.periodValue,
              district: filterData.districtValue,
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
              indic_0: filterData.dependentVariable,
            }
          : {
              source: "ERA5",
              // indic: filterData.elNinoVariable,
              indic: `${filterData.dataVariable.join(",")},${
                filterData.elNinoVariable
              }`,
              period: "annual",
              district: getAllDistrictsOfCountry(filterData?.districtList).join(
                ","
              ),
              crop: filterData.cropValue,
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
              // indic_0: filterData.dataVariable.join(","),
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
    <div className="sm:p-10 p-4 mt-10 rounded-lg bg-gray-50 shadow-lg">
      <div className="flex justify-center">
        <h1 className="text-xl font-semibold">Descriptive Analysis</h1>
      </div>

      {isLoading(descriptiveAnalysisStatus) && (
        <div className="my-20  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-tailchase color="green" size="35"></l-tailchase>
            <p className="text-2xl text-lime-700 font-medium">
              Loading Descriptive Analysis
            </p>
          </div>
        </div>
      )}

      {isError(descriptiveAnalysisStatus) && (
        <div className="my-5 flex justify-center">
          <Alert className="lg:w-2/4" variant="destructive">
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
          <div className="flex 2xl:flex-row flex-col justify-center 2xl:gap-20 gap-10 items-center mt-10 w-full">
            <div className="w-full h-[370px] flex flex-col items-center justify-center sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
              <p className="text-xl font-medium mb-5 ml-3">
                Summary From Top 10 Rows Of The Dataset
              </p>
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
                  {Object.keys(descriptiveAnalysisData?.head?.values)?.map(
                    (value: string) => (
                      <TableRow key={Math.random()}>
                        <TableCell className="font-medium text-black">
                          {formatTitle(value)}
                        </TableCell>

                        {descriptiveAnalysisData?.head?.values[value]?.map(
                          (e: number) => (
                            <TableCell
                              key={Math.random()}
                              className=" text-black"
                            >
                              {e}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="w-full h-[370px] mt-5 md:mt-0 flex flex-col justify-center items-center sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
              <p className="text-xl font-medium mb-5  ml-3">Data Overview</p>
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
                      Missing Data
                    </TableCell>
                    {descriptiveAnalysisData?.missing_values.values.map(
                      (value: number) => (
                        <TableCell>{value}</TableCell>
                      )
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell className=" text-black text-md font-medium">
                      Type of Value
                    </TableCell>
                    {descriptiveAnalysisData?.data_types.values.map(
                      (value: string) => (
                        <TableCell>
                          {value === "float64" ? "Decimal" : value}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-16 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <p className="text-xl font-medium mb-10">Data Statistics</p>
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
                {Object.keys(descriptiveAnalysisData?.statistics?.values)?.map(
                  (value) => (
                    <TableRow>
                      <TableCell className="text-black text-md font-medium">
                        {formatTitle(value)}
                      </TableCell>

                      {descriptiveAnalysisData?.statistics?.values[value]?.map(
                        (e: number) => (
                          <TableCell className="text-md">{e}</TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
          {/* 
          <div className="mt-20 mb-10 sm:p-10 p-4 rounded-lg bg-white shadow-lg">
            <HighchartsReact
              highcharts={Highcharts}
              options={descriptiveAnalysisData?.correlation_matrix}
            />
          </div> */}
        </>
      )}
    </div>
  );
};

export default DescriptiveAnalysis;
