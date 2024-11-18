/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  analysisType,
  BASE_URL,
  BODY_PARAMS_URL,
  requestStatus,
} from "@/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData, MapFormData } from "@/types";
import {
  getAllDistrictsOfCountry,
  isError,
  isFinished,
  isIdle,
  isLoading,
} from "@/lib/utils";
import { Button } from "../ui/button";
import AnalyticsCorrelation from "./analytics-correlation";
import DescriptiveAnalysis from "./analytics-descriptive-analysis";
import AnalyticsData from "./analytics-data";
import bodyParams from "../../data/body_params.json";
import ElNinoCommonFilter from "./elnino-common-filter.component";
import SubmitButton from "../submit-button";
import DynamicMap from "./dynamic-map";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const ElNinoAnalytics = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState<any>(bodyParams);
  const [dynamicChartStatus, setDynamicChartStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [dynamiMapStatus, setDynamiMapStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [firstAnomlayMapStatus, setFirstAnomalyMapStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [secondAnomlayMapStatus, setSecondAnomalyMapStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [dynamicMapData, setDynamicMapData] = useState<any>({});
  const [selected, setSelected] = useState<[]>([]);
  const [mapFormData, setMapFormData] = useState<MapFormData>({
    fromYear: "",
    toYear: "",
    countryValue: "",
  });

  const yearList = [];
  for (
    let i: any = parseInt(mapFormData.fromYear);
    i <= parseInt(mapFormData.toYear);
    i++
  ) {
    yearList.push({ value: i.toString(), label: i.toString() });
  }

  const [filterData, setFilterData] = useState<FilterData>({
    dataVariable: [],
    cropValue: "",
    source: "",
    customDataset: null,
    countryValue: "",
    districtValue: "",
    districtList: [],
    anomalyYear1: "1",
    anomalyYear2: "2",
    fromYear: "",
    toYear: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
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
    (async () => {
      try {
        const response: any = await axios.get(BODY_PARAMS_URL);
        setParams(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  //TODO: Control the reloading of the maps from the analytics-data component
  useEffect(() => {
    reloadAnomalyMap(setFirstAnomalyMapStatus);
  }, [filterData.anomalyYear1]);
  useEffect(() => {
    reloadAnomalyMap(setSecondAnomalyMapStatus);
  }, [filterData.anomalyYear2]);

  const generateDynamicChart = async () => {
    const requestBody = {
      indic: `${filterData.dataVariable.join(",")}`,
      area: [`${filterData.districtValue}`],
      crop: filterData.cropValue,
      start: `${filterData.fromYear}-01-01`,
      end: `${filterData.toYear}-01-01`,
      country: filterData.countryValue,
    };
    const formData = new FormData();
    Object.keys(requestBody).map((key) => {
      formData.append(key, requestBody[key]);
    });
    formData.append(
      `source`,
      filterData.source === "customDataset" ? filterData.customDataset : `ERA5`
    );

    setDynamicChartStatus(requestStatus.isLoading);
    setDynamiMapStatus(requestStatus.isLoading);
    setTimeSeriesChartData({});
    setDynamicMapData({});
    handleChange("anomalyYear1", "1");
    handleChange("anomalyYear2", "2");
    try {
      const response = await axios.post(
        `${BASE_URL}/el_nino_time_series_chart`,
        formData
      );

      setTimeSeriesChartData(response.data);
      setDynamicChartStatus(requestStatus.isFinished);
      setMapFormData({
        fromYear: filterData.fromYear,
        toYear: filterData.toYear,
        countryValue: filterData.countryValue,
      });
    } catch (error) {
      setDynamicChartStatus(requestStatus.isError);
      return;
    }

    try {
      setDynamiMapStatus(requestStatus.isLoading);
      const geoJson = await axios.post(`${BASE_URL}/el_nino_map`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDynamicMapData(geoJson.data);
      setDynamiMapStatus(requestStatus.isFinished);
      setFirstAnomalyMapStatus(requestStatus.isFinished);
      setSecondAnomalyMapStatus(requestStatus.isFinished);
    } catch (error) {
      setDynamiMapStatus(requestStatus.isError);
    }
  };

  const reloadAnomalyMap = async (setStatus) => {
    try {
      setStatus(requestStatus.isLoading);
      setTimeout(() => {
        setStatus(requestStatus.isFinished);
      }, 0);
    } catch (error) {
      setDynamiMapStatus(requestStatus.isError);
    }
  };

  return (
    <>
      {/* <div className="flex justify-center">
        <h1 className="text-4xl font-bold">El Nino Analytics</h1>
      </div> */}

      <div className="p-2">
        <div className=" flex flex-col gap-2">
          <div className="grid grid-cols-6 gap-3 ">
            <div className="col-span-1 w-full h-full bg-gray-200 rounded-b-lg">
              <div className="   ">
                <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2"> Parameters</p>
                </div>
                <div className=" p-2 flex flex-col gap-5 justify-between">
                  <ElNinoCommonFilter
                    params={params}
                    filterData={filterData}
                    handleChange={handleChange}
                    selected={selected}
                    setSelected={setSelected}
                    filterType="analytics"
                  />

                  <div className="w-full h-full">
                    <SubmitButton
                      verifyFilters={verifyFilters()}
                      submitFunction={generateDynamicChart}
                      loadingStatus={dynamicChartStatus}
                    />

                    {isFinished(dynamicChartStatus) && (
                      <SubmitButton
                        className="mt-2 border border-green-600 text-green-800 bg-transparent hover:text-gray-800 hover:border-yellow-300"
                        label="Move to Prediction"
                        verifyFilters={verifyFilters()}
                        submitFunction={() =>
                          navigate("/predictive-tools", {
                            state: {
                              ...filterData,
                              selected,
                            },
                          })
                        }
                        loadingStatus={dynamicChartStatus}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-5 w-full h-full bg-white rounded-lg">
              <div className="">
                <div>
                  {isLoading(dynamiMapStatus) && (
                    <div className="bg-white w-full h-full pt-[100px]">
                      <div className="flex justify-center bg-transparent ">
                        <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
                          {/* @ts-ignore */}
                          <l-loader color="green" size="50"></l-loader>
                          <p className="text-xl text-lime-700 font-medium">
                            Loading Dynamic Map
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {isError(dynamiMapStatus) && (
                    <div className="my-20 flex justify-center">
                      <Alert className="lg:w-2/4" variant="destructive">
                        <AlertCircle className="h-5 w-5 mt-1" />
                        <AlertTitle className="text-lg">API Error !</AlertTitle>
                        <AlertDescription className="text-md">
                          Failed to load the Dynamic Map. This could be due to
                          missing datasets. Try changing your filters and start
                          the analysis again.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {(isFinished(dynamiMapStatus) || isIdle(dynamiMapStatus)) && (
                    <DynamicMap
                      mapFormData={mapFormData}
                      filterData={filterData}
                      dynamicMapData={dynamicMapData}
                      yearList={yearList}
                      firstAnomalyMapStatus={firstAnomlayMapStatus}
                      secondAnomalyMapStatus={secondAnomlayMapStatus}
                      handleChange={handleChange}
                      setDynamicMapStatus
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-500 rounded-lg">
            <div className="w-full">
              <Tabs defaultValue="charts" className="w-full ">
                <TabsList className="w-full">
                  <div className="flex  justify-between w-full">
                    <TabsTrigger
                      className="w-full text-green-600"
                      value="charts"
                    >
                      Normal vs Monthly Averaged during El Nino Years
                    </TabsTrigger>
                    <TabsTrigger
                      className="w-full text-green-600"
                      value="correlation"
                    >
                      Pearson Correlation Plot | Matrix
                    </TabsTrigger>
                  </div>
                </TabsList>
                <div className="bg-white rounded-lg">
                  <TabsContent value="charts">
                    <div className="">
                      <AnalyticsData
                        filterData={filterData}
                        timeSeriesChartData={timeSeriesChartData}
                        dynamicMapData={dynamicMapData}
                        dynamicChartStatus={dynamicChartStatus}
                        dynamiMapStatus={dynamiMapStatus}
                        firstAnomalyMapStatus={firstAnomlayMapStatus}
                        secondAnomalyMapStatus={secondAnomlayMapStatus}
                        handleChange={handleChange}
                        mapFormData={mapFormData}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="correlation">
                    {isFinished(dynamicChartStatus) && (
                      <>
                        <AnalyticsCorrelation
                          filterData={filterData}
                          params={params}
                          typeOfAnalysis={analysisType.elnino}
                        />
                      </>
                    )}
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
