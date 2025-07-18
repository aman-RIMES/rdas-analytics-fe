/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BASE_URL,
  filterType,
  IDLE_ANALYTICS_CHART_MESSAGE,
  requestStatus,
} from "@/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
import { isError, isFinished, isIdle, isLoading } from "@/lib/utils";
import SubmitButton from "../submit-button";
import CustomDatasetGuide from "../custom-dataset-guide";
import GddToolsFilter from "./gdd-tools-filter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FullscreenIcon } from "lucide-react";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import sampleCharts from "../../data/sample_charts.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

const GddPredictiveTools = () => {
  const [selected, setSelected] = useState<[]>([]);
  const [GDDAnalysisStatus, setGDDAnalysisStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [GDDAnalysisData, setGDDAnalysisData] = useState<any>({});
  const [filterData, setFilterData] = useState<FilterData>(() => {
    const storedFilterData = localStorage.getItem("analyticsFilterData");
    return storedFilterData
      ? JSON.parse(storedFilterData)
      : {
          cropValue: "",
          source: "",
          customDataset: null,
          allRequiredSourcesChosen: false,
          countryValue: "",
          districtValue: "",
          yearValue: new Date().getFullYear().toString(),
          districtList: [],
        };
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => {
      const updatedFilterData = { ...prev, [name]: value };
      localStorage.setItem(
        "analyticsFilterData",
        JSON.stringify(updatedFilterData)
      );
      return updatedFilterData;
    });
  };

  const verifyFilters = () => {
    return (
      filterData.source !== "" &&
      filterData.cropValue !== "" &&
      (filterData.districtValue !== "" || filterData.provinceValue !== "") &&
      filterData.countryValue !== "" &&
      filterData.yearValue !== ""
    );
  };

  useEffect(() => {
    const storedFilterData = localStorage.getItem("analyticsFilterData");
    if (storedFilterData) {
      const parsedFilterData = JSON.parse(storedFilterData);
      setFilterData(parsedFilterData);
    }
  }, []);

  const generateGDDAnalysis = async () => {
    const requestBody = {
      area: filterData.provinceValue
        ? filterData.provinceValue
        : filterData.districtValue,
      country: filterData.countryValue,
      crop: filterData.cropValue,
      year: filterData.yearValue,
    };
    const formData = new FormData();
    Object.keys(requestBody).map((key) => {
      formData.append(key, requestBody[key]);
    });
    formData.append(
      `source`,
      filterData.source === "customDataset"
        ? filterData.customDataset
        : filterData.source
    );

    setGDDAnalysisStatus(requestStatus.isLoading);
    try {
      const response = await axios.post(`${BASE_URL}/gdd_2`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setGDDAnalysisData(response.data);
      setGDDAnalysisStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setGDDAnalysisStatus(requestStatus.isError);
    }
  };

  const GddTableData = GDDAnalysisData?.table
    ? GDDAnalysisData?.table
    : sampleCharts?.gdd_table;

  return (
    <>
      <div className="p-2 h-screen flex flex-col">
        <div className=" flex flex-col gap-2 flex-grow">
          <div className="grid grid-cols-6 gap-3 flex-grow">
            <div className="col-span-1 w-full h-full bg-gray-100 rounded-b-lg flex flex-col">
              <div className="flex-grow flex flex-col">
                <div className="bg-[#0B6623] flex justify-between items-center   text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2 text-sm"> Parameters</p>
                  <CustomDatasetGuide
                    title="Use Custom Dataset"
                    className="mr-2 text-sm text-yellow-300 text-decoration-line: underline"
                  />
                </div>
                <div className=" p-2 flex flex-col gap-5 justify-between flex-grow">
                  <GddToolsFilter
                    filterData={filterData}
                    toolType={filterType.gdd}
                    handleChange={handleChange}
                  />

                  <div className="w-full h-full">
                    <SubmitButton
                      verifyFilters={verifyFilters()}
                      submitFunction={generateGDDAnalysis}
                      loadingStatus={GDDAnalysisStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5 w-full h-full flex flex-col rounded-lg">
              <div className="flex-grow flex flex-col">
                <div className="flex-grow flex flex-col">
                  <div className="flex gap-3 flex-grow">
                    <div className="relative z-0 flex-grow flex flex-col">
                      <div className="p-5 mt-2 bg-white rounded-lg flex-grow flex flex-col">
                        <Table className="flex-grow">
                          <ScrollArea className="h-[380px] flex-grow mt-5">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-black text-md text-center">
                                  Stage
                                </TableHead>
                                <TableHead className="text-black  text-md text-center">
                                  GDD Threshold
                                </TableHead>
                                <TableHead className="text-black  text-md text-center">
                                  Predicted Date
                                </TableHead>
                                <TableHead className="text-black  text-md text-center">
                                  Probability
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {GddTableData.map((invoice, index) => (
                                <TableRow
                                  className="text-md text-center"
                                  key={index}
                                >
                                  <TableCell className="font-medium">
                                    {invoice.Stage}
                                  </TableCell>
                                  <TableCell>
                                    {invoice["GDD Threshold"]}
                                  </TableCell>
                                  <TableCell>
                                    {invoice["Predicted Date"]}
                                  </TableCell>
                                  <TableCell>{invoice.Probability}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </ScrollArea>
                        </Table>
                      </div>

                      {!isFinished(GDDAnalysisStatus) && (
                        <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                          {isIdle(GDDAnalysisStatus) ? (
                            <p className="text-xl font-bold text-green-800">
                              {IDLE_ANALYTICS_CHART_MESSAGE}
                            </p>
                          ) : isError(GDDAnalysisStatus) ? (
                            <ErrorMessage />
                          ) : (
                            <Loading
                              animation={
                                <l-reuleaux
                                  color="green"
                                  stroke={8}
                                  size="50"
                                ></l-reuleaux>
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-500 rounded-lg">
            <div className="w-full">
              <div className="rounded-lg">
                <div className="">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-grow">
                    <div className="bg-white rounded-lg flex-grow relative z-0 flex flex-col">
                      <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                        <p className="ml-2"> Recommendation</p>
                      </div>
                      <div className="flex-grow">
                        <ScrollArea className="h-[400px] p-2 flex-grow">
                          <p
                            className="p-2"
                            style={{ whiteSpace: "break-spaces" }}
                          >
                            {isFinished(GDDAnalysisStatus)
                              ? GDDAnalysisData?.recommendation || "..."
                              : sampleCharts?.gdd_recommendation}
                          </p>
                        </ScrollArea>
                      </div>
                      {(isIdle(GDDAnalysisStatus) ||
                        isLoading(GDDAnalysisStatus) ||
                        isError(GDDAnalysisStatus)) && (
                        <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                          {isIdle(GDDAnalysisStatus) ? (
                            <p className="text-xl font-bold text-green-800">
                              {IDLE_ANALYTICS_CHART_MESSAGE}
                            </p>
                          ) : isError(GDDAnalysisStatus) ? (
                            <ErrorMessage />
                          ) : (
                            <Loading
                              animation={
                                <l-reuleaux
                                  color="green"
                                  stroke={8}
                                  size="50"
                                ></l-reuleaux>
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="relative z-0 flex-grow flex flex-col">
                      <div className="absolute inset-0 z-20 max-h-6 mr-12 flex justify-end items-start">
                        <Dialog>
                          <DialogTrigger className="p-2">
                            <FullscreenIcon className="h-7 w-7 mt-1 text-green-700" />
                          </DialogTrigger>
                          <DialogContent className="lg:w-[70%]">
                            <DialogHeader>
                              <DialogDescription>
                                <HighchartsReact
                                  containerProps={{
                                    style: { height: "screen" },
                                  }}
                                  highcharts={Highcharts}
                                  options={
                                    GDDAnalysisData?.chart
                                      ? GDDAnalysisData?.chart
                                      : sampleCharts?.gdd_chart
                                  }
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex flex-col flex-grow bg-white ">
                        <div className="rounded-lg bg-white p-1 flex-grow mt-5 ">
                          <HighchartsReact
                            containerProps={{ style: { height: "100%" } }}
                            highcharts={Highcharts}
                            options={
                              GDDAnalysisData?.chart
                                ? GDDAnalysisData?.chart
                                : sampleCharts?.gdd_chart
                            }
                          />
                        </div>
                      </div>

                      {!isFinished(GDDAnalysisStatus) && (
                        <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                          {isIdle(GDDAnalysisStatus) ? (
                            <p className="text-xl font-bold text-green-800">
                              {IDLE_ANALYTICS_CHART_MESSAGE}
                            </p>
                          ) : isError(GDDAnalysisStatus) ? (
                            <ErrorMessage />
                          ) : (
                            <Loading
                              animation={
                                <l-reuleaux
                                  color="green"
                                  stroke={8}
                                  size="50"
                                ></l-reuleaux>
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GddPredictiveTools;
