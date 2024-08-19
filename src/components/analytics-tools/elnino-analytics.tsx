/* eslint-disable @typescript-eslint/no-explicit-any */
import { BODY_PARAMS_URL, menus, requestStatus } from "@/constants";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "../404-page";
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
  const { topic } = useParams();
  const subject: any = menus.find(
    (menu) => menu.id === parseInt(topic as string)
  );
  if (!subject) return <NotFoundPage />;

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

  const [filterData, setFilterData] = useState<FilterData>({
    dependentVariable: "",
    elNinoVariable: "",
    source: "",
    countryValue: "",
    districtList: [],
    fromYear: "",
    toYear: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.dependentVariable !== "" &&
      filterData.elNinoVariable !== "" &&
      filterData.source !== "" &&
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

  const generateDynamicChart = async () => {
    setDynamicChartStatus(requestStatus.isLoading);
    setDynamiMapStatus(requestStatus.isLoading);
    setTimeSeriesChartData({});
    setDynamicMapData({});
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/dynamic_charts",
        {
          source: "ERA5",
          indic: filterData.dependentVariable,
          period: "annual",
          district: getAllDistrictsOfCountry(filterData?.districtList).join(
            ","
          ),
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
        "http://203.156.108.67:1580/dynamic_map",
        {
          source: "ERA5",
          indic: "rainfall_deviation",
          period: "annual",
          district: getAllDistrictsOfCountry(filterData?.districtList).join(
            ","
          ),
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
        }
      );
      setDynamicMapData(geoJson.data);
      setDynamiMapStatus(requestStatus.isFinished);
    } catch (error) {
      setDynamiMapStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">{subject.category}</h1>
      </div>

      <div className="mb-10 mt-5">
        <div className="">
          <div className="sm:p-10 p-4 rounded-lg bg-yellow-50 shadow-lg">
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
              />
            </div>
          </div>

          <div className="mb-10">
            <AnalyticsData
              timeSeriesChartData={timeSeriesChartData}
              countryValue={filterData.countryValue}
              dynamicMapData={dynamicMapData}
              dynamicChartStatus={dynamicChartStatus}
              dynamiMapStatus={dynamiMapStatus}
            />
            {isFinished(dynamicChartStatus) && (
              <>
                <AnalyticsCorrelation filterData={filterData} params={params} />
                <DescriptiveAnalysis filterData={filterData} />
                <div className="flex justify-center mt-16">
                  <Button
                    className="text-sm px-10 border-black"
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
