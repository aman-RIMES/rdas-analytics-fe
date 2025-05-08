/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  analysisType,
  IDLE_ANALYTICS_CHART_MESSAGE,
  monthsList,
  requestStatus,
  toolType,
} from "@/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
import { isError, isFinished, isIdle } from "@/lib/utils";
import SubmitButton from "../submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CustomDatasetGuide from "../custom-dataset-guide";
import GddToolsData from "./gdd-tools-data";
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
import Combobox from "../ui/combobox";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import sampleCharts from "../../data/sample_charts.json";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const GddPredictiveTools = () => {
  const navigate = useNavigate();

  const label =
    location.pathname === "/lanina-analytics" ? "La Nina" : "El Nino";

  const [selected, setSelected] = useState<[]>([]);
  const [loadAnalysisData, setLoadAnalysisData] = useState(false);
  const [dynamicChartStatus, setDynamicChartStatus] = useState<requestStatus>(
    requestStatus.idle
  );

  const [filterData, setFilterData] = useState<FilterData>(() => {
    const storedFilterData = localStorage.getItem("analyticsFilterData");
    return storedFilterData
      ? JSON.parse(storedFilterData)
      : {
          dataVariable: [],
          cropValue: "",
          source: "",
          customDataset: null,
          multipleSources: {},
          multipleCustomDatasets: {},
          allRequiredSourcesChosen: false,
          countryValue: "",
          districtValue: "",
          districtList: [],
          fromYear: "",
          toYear: "",
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
      filterData.dataVariable.length > 0 &&
      filterData.source !== "" &&
      filterData.fromYear !== "" &&
      filterData.toYear !== "" &&
      filterData.districtValue !== "" &&
      filterData.countryValue !== ""
    );
  };

  useEffect(() => {
    const storedFilterData = localStorage.getItem("analyticsFilterData");
    if (storedFilterData) {
      const parsedFilterData = JSON.parse(storedFilterData);
      setFilterData(parsedFilterData);
    }
  }, []);

  const generateAnalysis = async () => {
    setLoadAnalysisData(true);
    // Reset after short delay
    setTimeout(() => setLoadAnalysisData(false), 100);
  };

  const invoices = [
    {
      invoice: "Planting Date",
      paymentStatus: "567",
      totalAmount: "09 November",
      paymentMethod: "100%",
    },
    {
      invoice: "Germination",
      paymentStatus: "567",
      totalAmount: "09 November",
      paymentMethod: "95%",
    },
    {
      invoice: "Tillering",
      paymentStatus: "567",
      totalAmount: "09 November",
      paymentMethod: "100%",
    },
    {
      invoice: "Stem Elongation",
      paymentStatus: "335",
      totalAmount: "09 November",
      paymentMethod: "100%",
    },
    {
      invoice: "Booting",
      paymentStatus: "2247",
      totalAmount: "09 November",
      paymentMethod: "95%",
    },
    {
      invoice: "Heading",
      paymentStatus: "2247",
      totalAmount: "09 November",
      paymentMethod: "100%",
    },
    {
      invoice: "Flowering",
      paymentStatus: "335",
      totalAmount: "09 November",
      paymentMethod: "100%",
    },
  ];

  return (
    <>
      <div className="p-2">
        <div className=" flex flex-col gap-2">
          <div className="grid grid-cols-6 gap-3 ">
            <div className="col-span-1 w-full h-full bg-gray-100 rounded-b-lg">
              <div className="   ">
                <div className="bg-[#0B6623] flex justify-between items-center   text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2 text-sm"> Parameters</p>
                  <CustomDatasetGuide
                    title="Use Custom Dataset"
                    className="mr-2 text-sm text-yellow-300 text-decoration-line: underline"
                  />
                </div>
                <div className=" p-2 flex flex-col gap-5 justify-between">
                  <GddToolsFilter
                    filterData={filterData}
                    handleChange={handleChange}
                    selected={selected}
                    setSelected={setSelected}
                    filterType="analytics"
                  />

                  <div className="w-full h-full">
                    <SubmitButton
                      verifyFilters={verifyFilters()}
                      submitFunction={generateAnalysis}
                      loadingStatus={dynamicChartStatus}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5 w-full h-full  rounded-lg">
              <div className="">
                <div>
                  <div className="flex flex-col gap-3">
                    <div className="relative z-0">
                      <div className="p-5 mt-5">
                        <Table>
                          <TableHeader>
                            <TableRow className="text-black">
                              <TableHead className="text-md text-center">
                                Stage
                              </TableHead>
                              <TableHead className="text-md text-center">
                                GDD Threshold
                              </TableHead>
                              <TableHead className="text-md text-center">
                                Predicted Date
                              </TableHead>
                              <TableHead className="text-md text-center">
                                Probability
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invoices.map((invoice) => (
                              <TableRow
                                className="text-xs text-center"
                                key={invoice.invoice}
                              >
                                <TableCell className="font-medium">
                                  {invoice.invoice}
                                </TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.totalAmount}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {!isFinished(dynamicChartStatus) && (
                        <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                          {isIdle(dynamicChartStatus) ? (
                            <p className="text-xl font-bold text-green-800">
                              {IDLE_ANALYTICS_CHART_MESSAGE}
                            </p>
                          ) : isError(dynamicChartStatus) ? (
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

                    <div className="relative z-0">
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
                                    style: { height: "600px " },
                                  }}
                                  highcharts={Highcharts}
                                  options={
                                    sampleCharts?.analytics_monthly[
                                      toolType.elnino
                                    ]
                                  }
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="flex flex-col">
                        <div className="rounded-lg bg-white p-1 ">
                          <HighchartsReact
                            containerProps={{ style: { height: "450px " } }}
                            highcharts={Highcharts}
                            options={
                              sampleCharts?.analytics_monthly[toolType.elnino]
                            }
                          />
                        </div>
                      </div>

                      {!isFinished(dynamicChartStatus) && (
                        <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                          {isIdle(dynamicChartStatus) ? (
                            <p className="text-xl font-bold text-green-800">
                              {IDLE_ANALYTICS_CHART_MESSAGE}
                            </p>
                          ) : isError(dynamicChartStatus) ? (
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
