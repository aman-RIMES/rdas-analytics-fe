/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate, getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import { BODY_PARAMS_URL, requestStatus } from "@/constants";
import bodyParams from "../data/body_params.json";
import { District, FilterData } from "@/types";
import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { AlertCircle } from "lucide-react";
import FilterComponent from "./filter.component";
import AnalyticsData from "./analytics-data.component";
import AnalyticsCorrelation from "./analytics-correlation";
import DescriptiveAnalysis from "./analytics-descriptive-analysis";

const ElNinoAnalyticsFilter = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState<any>(bodyParams);
  const [dynamicChartStatus, setDynamicChartStatus] = useState<requestStatus>();
  const [dynamiMapStatus, setDynamiMapStatus] = useState<requestStatus>();
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [dynamiMapData, setDynamicMapData] = useState<any>({});
  const [districtList, setDistrictList] = useState([{}]);
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
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
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
    const districtsData = params?.district.filter(
      (e: District) => e.country === filterData.countryValue
    );
    setDistrictList(districtsData);
  }, [filterData.countryValue]);

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
          district: getAllDistrictsOfCountry(districtList).join(","),
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
    <div className="sm:p-10 p-4">
      <FilterComponent
        params={params}
        filterData={filterData}
        handleChange={handleChange}
        selected={selected}
        setSelected={setSelected}
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
                <span className="text-md font-semibold">Invalid Input!</span>
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
            <AnalyticsCorrelation filterData={filterData} />
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
  );
};

export default ElNinoAnalyticsFilter;
