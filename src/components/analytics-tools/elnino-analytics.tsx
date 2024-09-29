/* eslint-disable @typescript-eslint/no-explicit-any */
import { analysisType, BODY_PARAMS_URL, requestStatus } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData, MapFormData } from "@/types";
import { getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
import { Button } from "../ui/button";
import AnalyticsCorrelation from "./analytics-correlation";
import DescriptiveAnalysis from "./analytics-descriptive-analysis";
import AnalyticsData from "./analytics-data";
import bodyParams from "../../data/body_params.json";
import ElNinoCommonFilter from "./elnino-common-filter.component";
import SubmitButton from "../submit-button";

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
        "http://203.156.108.67:1580/el_nino_time_series_chart",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
      const geoJson = await axios.post(
        "http://203.156.108.67:1580/el_nino_map",
        {
          source: "ERA5",
          indic: `${filterData.dataVariable.join(",")}`,
          country: filterData.countryValue,
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
        }
      );
      console.log("DONEWITH DYNAMIC MAP");
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
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">El Nino Analytics</h1>
      </div>

      <div className="my-10">
        <div className="">
          <div className="sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <ElNinoCommonFilter
              params={params}
              filterData={filterData}
              handleChange={handleChange}
              selected={selected}
              setSelected={setSelected}
              filterType="analytics"
            />

            <div className="md:mt-12 w-full">
              <SubmitButton
                verifyFilters={verifyFilters()}
                submitFunction={generateDynamicChart}
                loadingStatus={dynamicChartStatus}
              />
            </div>
          </div>

          <div className="mb-10">
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
            {isFinished(dynamicChartStatus) && (
              <>
                <AnalyticsCorrelation
                  filterData={filterData}
                  params={params}
                  typeOfAnalysis={analysisType.elnino}
                />

                <div className="flex justify-center mt-16">
                  <Button
                    variant="default"
                    className="text-xl p-7 bg-green-800 text-white hover:bg-yellow-300 hover:text-gray-800"
                    onClick={() =>
                      navigate("/predictive-tools", {
                        state: {
                          ...filterData,
                          selected,
                        },
                      })
                    }
                  >
                    Move to Prediction
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ElNinoAnalytics;
