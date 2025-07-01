/* eslint-disable @typescript-eslint/no-explicit-any */
import { requestStatus, toolType } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
import { getAnalyticsToolType, isFinished } from "@/lib/utils";
import AnalyticsCorrelation from "./analytics-correlation";
import AnalyticsData from "./analytics-data";
import ElNinoCommonFilter from "./elnino-common-filter.component";
import SubmitButton from "../submit-button";
import DynamicMap from "./dynamic-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CustomDatasetGuide from "../custom-dataset-guide";

const ElNinoAnalytics = () => {
  const navigate = useNavigate();

  const label =
    location.pathname === "/lanina-analytics"
      ? "La Niña"
      : location.pathname === "/analytics-mjo"
      ? "MJO"
      : "El Niño";

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
      (getAnalyticsToolType(location.pathname) !== toolType.mjo
        ? filterData.dataVariable.length > 0
        : true) &&
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
                  <ElNinoCommonFilter
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

                    {label !== "MJO" && (
                      <SubmitButton
                        className="mt-2 border border-green-600 text-green-800 bg-transparent hover:text-gray-800 hover:border-yellow-300"
                        label="Move to Prediction"
                        verifyFilters={isFinished(dynamicChartStatus)}
                        submitFunction={() =>
                          navigate(
                            location.pathname === "/lanina-analytics"
                              ? "/lanina-predictive-tools"
                              : "/predictive-tools",
                            {
                              state: {
                                ...filterData,
                                selected,
                              },
                            }
                          )
                        }
                        loadingStatus={dynamicChartStatus}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5 w-full h-full bg-white rounded-lg flex flex-col">
              <div className="flex-grow flex flex-col">
                <div className="flex-grow">
                  <DynamicMap
                    filterData={filterData}
                    loadAnalysisData={loadAnalysisData}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-500 rounded-lg flex-grow flex flex-col">
            <div className="w-full flex-grow flex flex-col">
              <Tabs
                defaultValue="charts"
                className="w-full flex-grow flex flex-col"
              >
                <TabsList className="w-full">
                  <div className="flex  justify-between w-full">
                    <TabsTrigger
                      className="w-full text-green-600"
                      value="charts"
                    >
                      {label === "MJO" ? (
                        <p> Normal vs Daily Averages during MJO Events </p>
                      ) : (
                        <p> Normal vs Monthly Averages during {label} Years </p>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      className="w-full text-green-600"
                      value="correlation"
                    >
                      Pearson Correlation Plot | Matrix
                    </TabsTrigger>
                  </div>
                </TabsList>
                <div className="bg-white rounded-lg flex-grow flex flex-col">
                  <TabsContent
                    value="charts"
                    className="flex-grow flex flex-col"
                  >
                    <div className="flex-grow">
                      <AnalyticsData
                        filterData={filterData}
                        loadAnalysisData={loadAnalysisData}
                        setDynamicChartStatus={setDynamicChartStatus}
                        dynamicChartStatus={dynamicChartStatus}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="correlation"
                    className="flex-grow flex flex-col"
                  >
                    <>
                      <AnalyticsCorrelation filterData={filterData} />
                    </>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElNinoAnalytics;
