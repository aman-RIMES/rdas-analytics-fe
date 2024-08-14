/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import {
  formatDate,
  formatTitle,
  getAllDistrictsOfCountry,
  transformDistrictParams,
  transformObject,
  transformSourceObject,
} from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import Leaflet from "./leaflet";
import { countries } from "@/constants";
import bodyParams from "../data/body_params.json";
import { District, FilterData } from "@/types";
import { DatePickerWithRange } from "./date-range-picker";
import { FancyMultiSelect } from "./ui/multiselect";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useNavigate } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import HelpHoverCard from "./help-hover-card";
import FilterComponent from "./filter.component";
import ElNinoAnalytics from "./elnino-analytics";
import AnalyticsData from "./analytics-data.component";
import AnalyticsCorrelation from "./analytics-correlation";
import DescriptiveAnalysis from "./analytics-descriptive-analysis";

const ElNinoAnalyticsFilter = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState<any>(bodyParams);

  const [correlationVariable1, setCorrelationVariable1] = useState<any>("");
  const [correlationVariable2, setCorrelationVariable2] = useState<any>("");

  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<any>(false);
  const [isAnalysisError, setIsAnalysisError] = useState<any>(false);
  const [isloadingDynamicMap, setIsLoadingDynamicMap] = useState<any>(false);
  const [isDynamicMapError, setIsDynamicMapError] = useState<any>(false);
  const [isLoadingCorrelationData, setIsLoadingCorrelationData] =
    useState<any>(false);
  const [isCorrelationDataError, setIsCorrelationDataError] =
    useState<any>(false);

  const [isTimeSeriesVisible, setIsTimeSeriesVisible] = useState<any>(false);
  const [isDynamicMapVisible, setIsDynamicMapVisible] = useState<any>(false);
  const [isCorrelationDataVisible, setIsCorrelationDataVisible] =
    useState<any>(false);

  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [geoJsonData, setGeoJsonData] = useState<any>({});
  const [correlationChartData, setCorrelationChartData] = useState<any>({});
  const [regressionModelChartData, setRegressionModelChartData] = useState<any>(
    {}
  );

  const [districtList, setDistrictList] = useState([{}]);

  const [filterData, setFilterData] = useState<FilterData>({
    dependentVariable: "",
    independentVariables: [],
    source: "",
    districtValue: "",
    countryValue: "",
    periodValue: "",
    dateRange: {},
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log(filterData);
  }, [filterData]);

  const [selected, setSelected] = useState<[]>([]);

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

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response: any = await axios.get(
  //         "http://203.156.108.67:1580/body_params"
  //       );
  //       setParams(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    const districtsData = params.district.filter(
      (e: District) => e.country === filterData.countryValue
    );

    setDistrictList(districtsData);
  }, [filterData.countryValue]);

  const resetAllLoadingStates = () => {
    setIsTimeSeriesVisible(true);
    setIsDynamicMapVisible(false);
    setIsCorrelationDataVisible(false);
    setIsLoadingAnalysis(true);
    setIsLoadingCorrelationData(false);
    setIsLoadingDynamicMap(false);
    setIsAnalysisError(false);
    setIsDynamicMapError(false);
    setIsCorrelationDataError(false);
  };

  const generateDynamicChart = async () => {
    resetAllLoadingStates();
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
      setIsLoadingAnalysis(false);
    } catch (error) {
      setIsLoadingAnalysis(false);
      setIsAnalysisError(true);
      return;
    }

    try {
      setIsLoadingDynamicMap(true);
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
      setGeoJsonData(geoJson.data);
      geoJson.data.features.map((e: any) =>
        console.log(e.properties.data_value)
      );

      setIsLoadingDynamicMap(false);
      setIsDynamicMapVisible(true);
    } catch (error) {
      setIsLoadingDynamicMap(false);
      setIsDynamicMapError(true);
    }
  };

  return (
    <div className="sm:p-10 p-4">
      <FilterComponent
        filterData={filterData}
        setFilterData={setFilterData}
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

      {isTimeSeriesVisible && (
        <div className="mb-10">
          <AnalyticsData
            timeSeriesChartData={timeSeriesChartData}
            countryValue={filterData.countryValue}
            geoJsonData={geoJsonData}
            isLoadingAnalysis={isLoadingAnalysis}
            isAnalysisError={isAnalysisError}
            isloadingDynamicMap={isloadingDynamicMap}
            isDynamicMapError={isDynamicMapError}
            isDynamicMapVisible={isDynamicMapVisible}
          />

          {!isLoadingAnalysis && !isAnalysisError && (
            <AnalyticsCorrelation filterData={filterData} />
          )}

          {!isLoadingAnalysis && !isAnalysisError && (
            <DescriptiveAnalysis filterData={filterData} />
          )}

          {!isLoadingAnalysis && !isAnalysisError && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default ElNinoAnalyticsFilter;
