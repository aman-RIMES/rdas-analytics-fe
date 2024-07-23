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
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import axios from "axios";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import Leaflet from "./leaflet";
import { countries } from "@/constants";
import bodyParams from "../data/body_params.json";
import { DateRange, District } from "@/types";
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

const CommonFilter = () => {
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

  const [independentVariablesList, setIndependentVariablesList] = useState<any>(
    []
  );

  const [dependentVariable, setDependentVariable] = useState("");
  const [independentVariables, setIndependentVariables] = useState<any>([]);
  const [source, setSource] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [periodValue, setPeriodValue] = useState("");

  const [dateRange, setDateRange] = useState<DateRange>();

  const [isLoadingDescriptiveAnalysis, setIsLoadingDescriptiveAnalysis] =
    useState(false);
  const [showDescriptiveAnalysisError, setShowDescriptiveAnalysisError] =
    useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [descriptiveAnalysisData, setDescriptiveAnalysisData] = useState<any>(
    {}
  );

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const newVariables = transformObject(params?.indic).filter(
      (e) =>
        e.value !== dependentVariable &&
        e.value !== "rainfall_deviation" &&
        !independentVariables.includes(e.value)
    );
    setIndependentVariablesList(newVariables);
  }, [dependentVariable]);

  useEffect(() => {
    (async () => {
      try {
        const response: any = await axios.get(
          "http://203.156.108.67:1580/body_params"
        );
        setParams(response.data);
        console.log(response.data);
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
    setDescriptiveAnalysisData({});
    setIsLoadingDynamicMap(false);
    setIsAnalysisError(false);
    setIsDynamicMapError(false);
    setIsCorrelationDataError(false);
    setShowDescription(false);
  };

  const generateDynamicChart = async () => {
    resetAllLoadingStates();
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/dynamic_charts",
        {
          source: source,
          indic: independentVariables.join(","),
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
          source: source,
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
          source: source,
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
          source: source,
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

  const generateDescriptionAnalysis = async () => {
    setShowDescription(false);
    setDescriptiveAnalysisData({});
    setShowDescriptiveAnalysisError(false);
    setIsLoadingDescriptiveAnalysis(true);
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/description_analysis",
        {
          source: source,
          indic: independentVariables.join(","),
          period: periodValue,
          district: districtValue,
          start: formatDate(dateRange?.from),
          end: formatDate(dateRange?.to),
          indic_0: dependentVariable,
          // source: "ERA5",
          // indic: "rainfall,normal_rainfall",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-10-12",
          // end: "2021-10-12",
          // indic_0: "el_nino",
        }
      );
      setDescriptiveAnalysisData(response.data);
      setIsLoadingDescriptiveAnalysis(false);
      setShowDescription(true);
    } catch (error) {
      console.log(error);
      setShowDescriptiveAnalysisError(true);
      setIsLoadingDescriptiveAnalysis(false);
    }
  };

  return (
    <div className="p-10">
      <div className="grid gap-4 mb-6 md:grid-cols-2 justify-center">
        <Combobox
          label={"Dependent Variable"}
          array={transformObject(params?.indic).filter(
            (e) =>
              e.value !== "rainfall_deviation" &&
              e.value !== "el_nino" &&
              !independentVariables.includes(e.value)
          )}
          state={{
            value: dependentVariable,
            setValue: setDependentVariable,
          }}
        />
        <div>
          <Label className="mb-2 font-semibold">Independent Variables</Label>
          <FancyMultiSelect
            selected={selected}
            setSelected={setSelected}
            setState={setIndependentVariables}
            array={independentVariablesList}
          />
        </div>

        <DatePickerWithRange
          date={dateRange}
          setDate={setDateRange}
          min={0}
          max={0}
          label={"Start and End date"}
        />
        <Combobox
          label={"Period"}
          array={transformObject(params?.period)}
          state={{
            value: periodValue,
            setValue: setPeriodValue,
          }}
        />
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 justify-center">
        <Combobox
          label={"Source"}
          array={transformSourceObject(params?.source)}
          state={{
            value: source,
            setValue: setSource,
          }}
        />
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
          array={transformDistrictParams(districtList).slice(0, 15)}
          state={{
            value: districtValue,
            setValue: setDistrictValue,
          }}
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
                <h1 className="text-lg font-semibold">
                  View Correlation between two variables
                </h1>
              </div>

              <div className="grid gap-4 mt-8 md:grid-cols-3 justify-center">
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

              {isLoadingCorrelationData && (
                <div className="my-20 flex justify-center">
                  <p className="text-xl">Generating Correlation Data ...</p>
                </div>
              )}

              {isCorrelationDataError && (
                <div className="my-20 flex flex-col items-center justify-center">
                  <p className="text-xl">
                    Failed to generate Correlation Data !
                  </p>
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

              <div className="flex justify-center mt-16">
                <Button
                  // "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"
                  variant={"outline"}
                  className="text-sm px-10 border-black"
                  onClick={generateDescriptionAnalysis}
                >
                  View Descriptive Analysis
                </Button>
              </div>

              {isLoadingDescriptiveAnalysis && (
                <div className="my-20 flex justify-center">
                  <p className="text-xl">Loading Descriptive Analysis ....</p>
                </div>
              )}
              {showDescriptiveAnalysisError && (
                <div className="my-20 flex flex-col items-center justify-center gap-3">
                  <p className="text-xl">
                    Failed to load descriptive analysis !
                  </p>
                  <p className="text-xl">Please check your input.</p>
                </div>
              )}

              {showDescription && (
                <>
                  <div className="grid gap-4 md:grid-cols-2 items-center mt-20">
                    <div className="flex flex-col">
                      <p className="text-xl font-medium mb-5 ml-5">Head</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className=" text-black text-md font-medium">
                              Variable
                            </TableHead>
                            {descriptiveAnalysisData?.head?.columns.map(
                              (e: string) => (
                                <TableHead
                                  key={e}
                                  className=" text-black text-md font-medium"
                                >
                                  {e}
                                </TableHead>
                              )
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.keys(
                            descriptiveAnalysisData?.head?.values
                          ).map((value: string) => (
                            <TableRow>
                              <TableCell className="font-medium text-black">
                                {formatTitle(value)}
                              </TableCell>

                              {descriptiveAnalysisData?.head?.values[value].map(
                                (e: number) => (
                                  <TableCell className=" text-black">
                                    {e.toFixed(2)}
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className=" text-black text-md font-medium">
                            Value
                          </TableHead>
                          {descriptiveAnalysisData?.missing_values.variables.map(
                            (e: string) => (
                              <TableHead className=" text-black text-md font-medium">
                                {formatTitle(e)}
                              </TableHead>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className=" text-black text-md font-medium">
                            Missing Values
                          </TableCell>
                          {descriptiveAnalysisData?.missing_values.values.map(
                            (value: number) => (
                              <TableCell>{value}</TableCell>
                            )
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell className=" text-black text-md font-medium">
                            Data types
                          </TableCell>
                          {descriptiveAnalysisData?.data_types.values.map(
                            (value: number) => (
                              <TableCell>{value}</TableCell>
                            )
                          )}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-col items-center justify-center mt-10">
                    <p className="text-xl font-medium mb-10">Statistics</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className=" text-black text-md font-medium">
                            Variable
                          </TableHead>
                          {descriptiveAnalysisData?.statistics?.columns.map(
                            (e: string) => (
                              <TableHead className=" text-black text-md font-medium">
                                {formatTitle(e)}
                              </TableHead>
                            )
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(
                          descriptiveAnalysisData?.statistics?.values
                        ).map((value) => (
                          <TableRow>
                            <TableCell className="text-black text-md font-medium">
                              {formatTitle(value)}
                            </TableCell>

                            {descriptiveAnalysisData?.statistics?.values[
                              value
                            ].map((e: number) => (
                              <TableCell className="text-md">
                                {e.toFixed(2)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-20">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={descriptiveAnalysisData?.correlation_matrix}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-center mt-16">
                <Button
                  className="text-sm px-10 border-black"
                  onClick={() =>
                    navigate("/predictive-tools", {
                      state: {
                        source,
                        independentVariables,
                        dependentVariable,
                        periodValue,
                        districtValue,
                        dateRange,
                        countryValue,
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
      )}
    </div>
  );
};

export default CommonFilter;
