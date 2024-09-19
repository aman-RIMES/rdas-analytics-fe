/* eslint-disable @typescript-eslint/no-explicit-any */
import { analysisType, BODY_PARAMS_URL, requestStatus } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
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
  const [anomlayMapStatus, setAnomalyMapStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [dynamicMapData, setDynamicMapData] = useState<any>({});
  const [selected, setSelected] = useState<[]>([]);

  const [filterData, setFilterData] = useState<FilterData>({
    dataVariable: [],
    cropValue: "",
    source: "",
    countryValue: "",
    districtValue: "",
    districtList: [],
    chosenYear: "1",
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
    reloadAnomalyMap();
  }, [filterData.chosenYear]);

  const generateDynamicChart = async () => {
    setDynamicChartStatus(requestStatus.isLoading);
    setDynamiMapStatus(requestStatus.isLoading);
    setTimeSeriesChartData({});
    setDynamicMapData({});
    handleChange("chosenYear", "1");
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/el_nino_time_series_chart",
        {
          source: "ERA5",
          indic: `rainfall`,
          area: [`${filterData.districtValue}`],
          crop: filterData.cropValue,
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
        }
      );

      setTimeSeriesChartData(response.data);
      setDynamicChartStatus(requestStatus.isFinished);
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
          indic: "rainfall",
          country: filterData.countryValue,
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
        }
      );
      setDynamicMapData(geoJson.data);
      setDynamiMapStatus(requestStatus.isFinished);
      setAnomalyMapStatus(requestStatus.isFinished);
    } catch (error) {
      setDynamiMapStatus(requestStatus.isError);
    }
  };

  const reloadAnomalyMap = async () => {
    try {
      setAnomalyMapStatus(requestStatus.isLoading);
      setTimeout(() => {
        setAnomalyMapStatus(requestStatus.isFinished);
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
              countryValue={filterData.countryValue}
              dynamicMapData={dynamicMapData}
              dynamicChartStatus={dynamicChartStatus}
              dynamiMapStatus={dynamiMapStatus}
              anomalyMapStatus={anomlayMapStatus}
              handleChange={handleChange}
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
                    className="text-xl p-10 bg-green-800 text-white hover:bg-yellow-300 hover:text-gray-800"
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
