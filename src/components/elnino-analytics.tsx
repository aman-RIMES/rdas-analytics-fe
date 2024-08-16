/* eslint-disable @typescript-eslint/no-explicit-any */
import { BODY_PARAMS_URL, menus, requestStatus } from "@/constants";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./404-page";
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
import { formatDate, getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
import { Button } from "./ui/button";
import AnalyticsCorrelation from "./analytics-correlation";
import DescriptiveAnalysis from "./analytics-descriptive-analysis";
import AnalyticsData from "./analytics-data.component";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { AlertCircle } from "lucide-react";
import FilterComponent from "./filter.component";
import bodyParams from "../data/body_params.json";

//TODO: Replace all unknown/any types with their corresponding types/interfaces
const ElNinoAnalytics = () => {
  const { topic } = useParams();
  const subject: any = menus.find(
    (menu) => menu.id === parseInt(topic as string)
  );
  if (!subject) return <NotFoundPage />;

  const navigate = useNavigate();

  const [params, setParams] = useState<any>(bodyParams);
  const [dynamicChartStatus, setDynamicChartStatus] = useState<requestStatus>();
  const [dynamiMapStatus, setDynamiMapStatus] = useState<requestStatus>();
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [dynamiMapData, setDynamicMapData] = useState<any>({});
  const [selected, setSelected] = useState<[]>([]);

  const [filterData, setFilterData] = useState<FilterData>({
    dependentVariable: "",
    independentVariables: [],
    source: "",
    districtValue: "",
    countryValue: "",
    periodValue: "",
    dateRange: {},
    districtList: [],
    modelType: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.independentVariables.length > 0 &&
      filterData.dependentVariable !== "" &&
      filterData.source !== "" &&
      filterData.periodValue !== "" &&
      filterData.districtValue !== "" &&
      formatDate(filterData.dateRange?.from) !== "" &&
      formatDate(filterData.dateRange?.to) !== "" &&
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
          source: filterData.source,
          indic: filterData.independentVariables.join(","),
          period: filterData.periodValue,
          district: filterData.districtValue,
          start: formatDate(filterData.dateRange?.from),
          end: formatDate(filterData.dateRange?.to),

          // source: "ERA5",
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // district: "NPL_04",
          // start: "2015-10-12",
          // end: "2021-10-12",
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
          source: filterData.source,
          indic: "rainfall_deviation",
          period: filterData.periodValue,
          district: getAllDistrictsOfCountry(filterData?.districtList).join(
            ","
          ),
          start: formatDate(filterData.dateRange?.from),
          end: formatDate(filterData.dateRange?.to),

          // source: "ERA5",
          // indic: "rainfall_deviation",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
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
      <div className="flex flex-col text-center items-center justify-center gap-3 mb-7">
        <h1 className="text-3xl">{subject.category}</h1>
        <h1 className="text-2xl">{subject.title}</h1>
      </div>

      <div className="my-10 border rounded-lg">
        <div className="sm:p-10 p-4">
          <FilterComponent
            params={params}
            filterData={filterData}
            handleChange={handleChange}
            selected={selected}
            setSelected={setSelected}
            filterType="analytics"
          />

          <div className="md:mt-12 w-full">
            <HoverCard>
              <HoverCardTrigger className="w-full flex justify-center">
                <Button
                  className="md:w-1/3 w-full"
                  disabled={!verifyFilters()}
                  onClick={generateDynamicChart}
                >
                  Start Analysis
                </Button>
              </HoverCardTrigger>
              {!verifyFilters() && (
                <HoverCardContent className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-md font-semibold">
                      Invalid Input!
                    </span>
                  </div>
                  <p className="text-md">
                    Make sure you've filled every field above.
                  </p>
                </HoverCardContent>
              )}
            </HoverCard>
          </div>

          <div className="mb-10">
            <AnalyticsData
              timeSeriesChartData={timeSeriesChartData}
              countryValue={filterData.countryValue}
              dynamicMapData={dynamiMapData}
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
