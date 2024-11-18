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
import { District, FilterData } from "@/types";
import { formatDate, getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AnalyticsCorrelation from "@/components/analytics-tools/analytics-correlation";
import DescriptiveAnalysis from "@/components/analytics-tools/analytics-descriptive-analysis";
import AnalyticsData from "@/components/analytics-tools/analytics-data";
import bodyParams from "@/data/body_params.json";
import SubmitButton from "@/components/submit-button";
import ClimateCommonFilter from "./climate-common-filter";

const ClimateAnalytics = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState<any>(bodyParams);
  const [dynamicChartStatus, setDynamicChartStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [dynamiMapStatus, setDynamiMapStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [dynamicMapData, setDynamicMapData] = useState<any>({});
  const [selected, setSelected] = useState<[]>([]);
  const [districtList, setDistrictList] = useState([{}]);

  const [filterData, setFilterData] = useState<FilterData>({
    dependentVariable: "",
    independentVariables: [],
    source: "",
    periodValue: "",
    countryValue: "",
    districtValue: "",
    fromYear: "",
    toYear: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.independentVariables?.length > 0 &&
      filterData.dependentVariable !== "" &&
      filterData.source !== "" &&
      filterData.periodValue !== "" &&
      filterData.districtValue !== "" &&
      filterData.fromYear !== "" &&
      filterData.toYear !== "" &&
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
    const districtsData = params.district.filter(
      (e: District) => e.country === filterData.countryValue
    );
    setDistrictList(districtsData);
  }, [filterData.countryValue]);

  const generateDynamicChart = async () => {
    setDynamicChartStatus(requestStatus.isLoading);
    setDynamiMapStatus(requestStatus.isLoading);
    setTimeSeriesChartData({});
    setDynamicMapData({});
    try {
      const response = await axios.post(`${BASE_URL}/dynamic_charts`, {
        source: filterData.source,
        indic: filterData.independentVariables.join(","),
        period: filterData.periodValue,
        district: filterData.districtValue,
        start: `${filterData.fromYear}-01-01`,
        end: `${filterData.toYear}-01-01`,
      });

      setTimeSeriesChartData(response.data);
      setDynamicChartStatus(requestStatus.isFinished);
    } catch (error) {
      setDynamicChartStatus(requestStatus.isError);
      return;
    }

    try {
      setDynamiMapStatus(requestStatus.isLoading);
      const geoJson = await axios.post(`${BASE_URL}/dynamic_map`, {
        source: "ERA5",
        indic: "rainfall_deviation",
        period: "annual",
        district: getAllDistrictsOfCountry(districtList).join(","),
        start: `${filterData.fromYear}-01-01`,
        end: `${filterData.toYear}-01-01`,
      });
      setDynamicMapData(geoJson.data);
      setDynamiMapStatus(requestStatus.isFinished);
    } catch (error) {
      setDynamiMapStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">Climate Analytics</h1>
      </div>

      <div className="my-10">
        <div className="">
          <div className="sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <ClimateCommonFilter
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
            {isFinished(dynamicChartStatus) && (
              <DescriptiveAnalysis
                filterData={filterData}
                typeOfAnalysis={analysisType.climate}
              />
            )}
            <AnalyticsData
              timeSeriesChartData={timeSeriesChartData}
              countryValue={filterData.countryValue}
              dynamicMapData={dynamicMapData}
              dynamicChartStatus={dynamicChartStatus}
              dynamiMapStatus={dynamiMapStatus}
            />
            {isFinished(dynamicChartStatus) && (
              <>
                <AnalyticsCorrelation
                  filterData={filterData}
                  params={params}
                  typeOfAnalysis={analysisType.climate}
                />

                <div className="flex justify-center mt-16">
                  <Button
                    variant="default"
                    className="text-xl p-10 bg-green-800 text-white hover:bg-yellow-300 hover:text-gray-800"
                    onClick={() =>
                      navigate("/climate-predictive-tools", {
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

export default ClimateAnalytics;
