/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import {
  formatDate,
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
import { DateRange, District } from "@/types";
import { DatePickerWithRange } from "./date-range-picker";

const Filter = () => {
  const [params, setParams] = useState<any>(bodyParams);

  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [periodValue, setPeriodValue] = useState("");
  const [sourceValue, setSourceValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>();

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

  useEffect(() => {
    (async () => {
      try {
        const response: any = await axios.get(
          "http://203.156.108.67:1580/body_params"
        );
        setParams(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const districtsData = params.district.filter(
      (e: District) => e.country === countryValue
    );
    setDistrictList(districtsData);
  }, [countryValue]);

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
          source: sourceValue,
          indic: "rainfall,el_nino,normal_rainfall",
          period: periodValue,
          district: districtValue,
          start: formatDate(dateRange?.from),
          end: formatDate(dateRange?.to),

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
          source: sourceValue,
          indic: "rainfall_deviation",
          period: periodValue,
          district: getAllDistrictsOfCountry(districtList).join(","),
          start: formatDate(dateRange?.from),
          end: formatDate(dateRange?.to),

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

  const generateCorrelationPlot = async () => {
    setIsCorrelationDataError(false);
    setIsCorrelationDataVisible(false);
    setIsLoadingCorrelationData(true);
    try {
      const correlationData = await axios.post(
        "http://203.156.108.67:1580/correlation_plot",
        {
          source: sourceValue,
          indic: `${correlationVariable1},${correlationVariable2}`,
          period: periodValue,
          district: districtValue,
          start: formatDate(dateRange?.from),
          end: formatDate(dateRange?.to),

          // source: "ERA5",
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
        }
      );
      const regressionModelData = await axios.post(
        "http://203.156.108.67:1580/regression_analysis",
        {
          source: sourceValue,
          indic: `${correlationVariable1},${correlationVariable2}`,
          period: periodValue,
          district: districtValue,
          start: formatDate(dateRange?.from),
          end: formatDate(dateRange?.to),

          // source: "ERA5",
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
        }
      );
      setRegressionModelChartData(regressionModelData.data);
      setCorrelationChartData(correlationData.data);
      setIsLoadingCorrelationData(false);
      setIsCorrelationDataVisible(true);
    } catch (error) {
      setIsLoadingCorrelationData(false);
      setIsCorrelationDataError(true);
    }
  };

  return (
    <div className="p-10">
      <div className="grid gap-4 mb-6 md:grid-cols-3 justify-center">
        <Combobox
          label={"Country"}
          array={countries}
          state={{
            value: countryValue,
            setValue: setCountryValue,
          }}
        />
        <Combobox
          label={"District"}
          array={transformDistrictParams(districtList)}
          state={{
            value: districtValue,
            setValue: setDistrictValue,
          }}
        />
        <Combobox
          label={"Period"}
          array={transformObject(params?.period)}
          state={{
            open: periodOpen,
            setOpen: setPeriodOpen,
            value: periodValue,
            setValue: setPeriodValue,
          }}
        />
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-3 justify-center">
        <Combobox
          label={"Source"}
          array={transformSourceObject(params?.source)}
          state={{
            value: sourceValue,
            setValue: setSourceValue,
          }}
        />
        <DatePickerWithRange
          //TODO: Limit dates to be between 2010 and 2015 for now
          date={dateRange}
          setDate={setDateRange}
          min={0}
          max={0}
          label={"Start and End date"}
        />
      </div>
      <div className="grid gap-4 mt-10 md:grid-cols-3 justify-center">
        <div></div>
        <Button onClick={generateDynamicChart}>Start Analysis</Button>
      </div>

      {isTimeSeriesVisible && (
        <div className="mb-10">
          <div className="mt-10">
            {isLoadingAnalysis && (
              <div className="my-20 flex justify-center">
                <p className="text-xl">Analyzing Data ...</p>
              </div>
            )}

            {!isLoadingAnalysis && !isAnalysisError && (
              <HighchartsReact
                highcharts={Highcharts}
                options={timeSeriesChartData}
              />
            )}

            {isAnalysisError && (
              <div className="my-20 flex flex-col items-center justify-center">
                <p className="text-xl">Failed to Analyze Data !</p>
                <p className="text-xl mt-2">Please check your input.</p>
              </div>
            )}

            <div>
              {isloadingDynamicMap && (
                <div className="my-20 flex justify-center border p-24 rounded-lg">
                  <p className="text-xl">Loading Dynamic Map ...</p>
                </div>
              )}
              {isDynamicMapError && (
                <div className="my-20 flex flex-col items-center justify-center">
                  <p className="text-xl">Failed to generate Dynamic Map !</p>
                  <p className="text-xl mt-2">Please check your input.</p>
                </div>
              )}

              {isDynamicMapVisible && !isDynamicMapError && (
                <div>
                  <p className="text-xl font-semibold flex justify-center my-8">
                    Deviation from Normal Rainfall
                  </p>
                  <Leaflet country={countryValue} geoJsonData={geoJsonData} />
                </div>
              )}
            </div>
          </div>
          {!isLoadingAnalysis && !isAnalysisError && (
            <>
              <div className="flex justify-center mt-10">
                <h1 className="text-xl font-semibold">
                  View Correlation between two variables
                </h1>
              </div>
              <div className="grid gap-4 mt-12 md:grid-cols-3 justify-center">
                <Combobox
                  label={"First Variable"}
                  array={transformObject(params.indic)}
                  state={{
                    value: correlationVariable1,
                    setValue: setCorrelationVariable1,
                  }}
                />
                <Combobox
                  label={"Second Variable"}
                  array={transformObject(params.indic)}
                  state={{
                    value: correlationVariable2,
                    setValue: setCorrelationVariable2,
                  }}
                />
                <Button
                  disabled={
                    correlationVariable1 === "" || correlationVariable2 === ""
                  }
                  className="mt-8"
                  onClick={generateCorrelationPlot}
                >
                  Analyze Correlation
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {isLoadingCorrelationData && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Generating Correlation Data ...</p>
        </div>
      )}

      {isCorrelationDataError && (
        <div className="my-20 flex flex-col items-center justify-center">
          <p className="text-xl">Failed to generate Correlation Data !</p>
          <p className="text-xl mt-2">Please check your input.</p>
        </div>
      )}

      {isCorrelationDataVisible && (
        <div className="mt-10">
          <HighchartsReact
            highcharts={Highcharts}
            options={correlationChartData}
          />
          <div className="mt-10">
            <HighchartsReact
              highcharts={Highcharts}
              options={regressionModelChartData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
