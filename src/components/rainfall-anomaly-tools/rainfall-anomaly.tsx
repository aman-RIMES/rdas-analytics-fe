/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL, filterType, monthsList, requestStatus } from "@/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
import SubmitButton from "../submit-button";
import CustomDatasetGuide from "../custom-dataset-guide";
import GddToolsFilter from "../gdd-tools/gdd-tools-filter";
import RainfallAnomlayTabs from "./rainfall-anomaly-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import RainfallAnomalyChart from "./rainfall-anomaly-charts";
import sampleCharts from "../../data/sample_charts.json";
import Combobox from "../ui/combobox";
import { isFinished } from "@/lib/utils";

const RainfallAnomalyTools = () => {
  const [rainfallAnomalyStatus, setrainfallAnomalyStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [rainfallAnomalyData, setRainfallAnomalyData] = useState<any>({});
  const [chosenMonth, setChosenMonth] = useState("1");
  const [filterData, setFilterData] = useState<FilterData>(() => {
    const storedFilterData = localStorage.getItem("analyticsFilterData");
    return storedFilterData
      ? JSON.parse(storedFilterData)
      : {
          source: "",
          customDataset: null,
          allRequiredSourcesChosen: false,
          countryValue: "",
          districtValue: "",
          yearValue: new Date().getFullYear().toString(),
          districtList: [],
        };
  });

  const handleMonthChange = (name: string, value: string) => {
    setChosenMonth(value);
  };

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

  const generateRainfallAnomalyAnalysis = async () => {
    const requestBody = {
      area: filterData.provinceValue
        ? filterData.provinceValue
        : filterData.districtValue,
      country: filterData.countryValue,
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

    setrainfallAnomalyStatus(requestStatus.isLoading);
    try {
      const response = await axios.post(
        `${BASE_URL}/rainfall_anomaly`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRainfallAnomalyData(response.data);
      setrainfallAnomalyStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setrainfallAnomalyStatus(requestStatus.isError);
    }
  };

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
                    toolType={filterType.rainfallAnomaly}
                    handleChange={handleChange}
                  />

                  <div className="w-full h-full">
                    <SubmitButton
                      verifyFilters={verifyFilters()}
                      submitFunction={generateRainfallAnomalyAnalysis}
                      loadingStatus={rainfallAnomalyStatus}
                    />
                  </div>
                </div>
              </div>

              {isFinished(rainfallAnomalyStatus) && (
                <div className="p-1">
                  <div className="p-3 mt-5 border-2 border-green-800 rounded-lg flex flex-col gap-3">
                    <p className="text-lg font-semibold text-green-900 text-center underline">
                      Analysis
                    </p>
                    <div className="flex flex-col gap-2 ">
                      <p className="bg-green-700 text-white text-sm py-1 px-2 rounded font-medium flex">
                        {" "}
                        Number of Anomalous Pentads:
                      </p>
                      {/* <div className="flex flex-wrap gap-2 "> */}
                      <p className="border border-green-700 text-black text-md py-1 px-2 rounded font-bold text-center">
                        {rainfallAnomalyData &&
                          rainfallAnomalyData?.anomalous_pentads}
                      </p>
                      {/* </div> */}
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="bg-green-700 text-white text-sm py-1 px-2 rounded font-medium flex">
                        Anomalous Seasons:
                      </p>
                      <div className="flex flex-wrap gap-2 ">
                        {rainfallAnomalyData &&
                          rainfallAnomalyData?.anomalous_seasons?.map(
                            (season: string, index: number) => (
                              <p
                                className="border border-green-700 text-black text-xs py-1 px-2 rounded font-medium"
                                key={index}
                              >
                                {season}
                              </p>
                            )
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="bg-green-700 text-white text-sm py-1 px-2 rounded font-medium flex">
                        {" "}
                        Anomalous Months:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {rainfallAnomalyData &&
                          rainfallAnomalyData?.anomalous_months?.map(
                            (season: string, index: number) => (
                              <p
                                className="border border-green-700 text-black text-xs py-1 px-2 rounded font-medium"
                                key={index}
                              >
                                {season}
                              </p>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-5 w-full h-full rounded-lg">
              <div className="">
                <div className="grid grid-cols-2 gap-3">
                  <RainfallAnomlayTabs
                    firstChartData={rainfallAnomalyData?.yearly_rainfall_chart}
                    secondChartData={
                      rainfallAnomalyData?.yearly_rainy_day_chart
                    }
                    rainfallAnomalyStatus={rainfallAnomalyStatus}
                  />

                  <RainfallAnomlayTabs
                    firstChartData={
                      rainfallAnomalyData?.seasonal_rainfall_chart
                    }
                    secondChartData={
                      rainfallAnomalyData?.seasonal_rainy_day_chart
                    }
                    rainfallAnomalyStatus={rainfallAnomalyStatus}
                  />

                  <RainfallAnomlayTabs
                    chartHeight="415px"
                    firstChartData={rainfallAnomalyData?.monthly_rainfall_chart}
                    secondChartData={
                      rainfallAnomalyData?.monthly_rainy_day_chart
                    }
                    rainfallAnomalyStatus={rainfallAnomalyStatus}
                  />

                  <Tabs defaultValue="charts" className="w-full ">
                    <TabsList className="w-full">
                      <div className="flex  justify-between w-full">
                        <TabsTrigger
                          className="w-full text-green-600"
                          value="charts"
                        >
                          {rainfallAnomalyData?.seasonal_rainfall_chart
                            ? rainfallAnomalyData?.seasonal_rainfall_chart
                                ?.title?.text
                            : "Rainfall Chart"}
                        </TabsTrigger>
                        <TabsTrigger
                          className="w-full text-green-600"
                          value="correlation"
                        >
                          {rainfallAnomalyData?.seasonal_rainfall_chart
                            ? rainfallAnomalyData?.seasonal_rainfall_chart
                                ?.title?.text
                            : "Rainy Day Chart"}
                        </TabsTrigger>
                      </div>
                    </TabsList>
                    <div className="bg-white rounded-lg">
                      <TabsContent value="charts">
                        <div className="">
                          <RainfallAnomalyChart
                            chartHeight="380px"
                            chartData={
                              rainfallAnomalyData?.pentad_rainfall_charts
                                ? rainfallAnomalyData?.pentad_rainfall_charts[
                                    parseInt(chosenMonth) - 1
                                  ]
                                : sampleCharts?.gdd_chart
                            }
                            AnalysisStatus={rainfallAnomalyStatus}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="correlation">
                        <>
                          <RainfallAnomalyChart
                            chartHeight="380px"
                            chartData={
                              rainfallAnomalyData?.pentad_rainy_day_charts
                                ? rainfallAnomalyData?.pentad_rainy_day_charts[
                                    parseInt(chosenMonth) - 1
                                  ]
                                : sampleCharts?.gdd_chart
                            }
                            AnalysisStatus={rainfallAnomalyStatus}
                          />
                        </>
                      </TabsContent>
                      <div className="flex justify-center gap-2 items-center">
                        <div>
                          <p className="text-sm font-medium">Month:</p>
                        </div>
                        <div className="w-1/3">
                          <Combobox
                            name="month"
                            label={"Months"}
                            array={monthsList}
                            state={{
                              value: chosenMonth,
                              setValue: handleMonthChange,
                            }}
                            height="12"
                          />
                        </div>
                      </div>
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RainfallAnomalyTools;
