/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import {
  calculateLinearPredictiveValue,
  formatDate,
  formatTitle,
  transformDistrictParams,
  transformObject,
  transformSourceObject,
} from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "./ui/multiselect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { Input } from "./ui/input";
import { DatePickerWithRange } from "./date-range-picker";
import { DateRange, District } from "@/types";
import { countries } from "@/constants";
import bodyParams from "../data/body_params.json";

const PredictiveToolsFilter = () => {
  const [params, setParams] = useState<any>(bodyParams);
  const [independentVariablesList, setIndependentVariablesList] = useState<any>(
    []
  );
  const [persistentVariables, setPersistenVariables] = useState<any>([]);
  const [
    linearPredictionInputFieldValues,
    setLinearPredictionInputFieldValues,
  ] = useState<any>([]);
  const [predictedValue, setPredictedValue] = useState("");
  const [showPredictedValue, setShowPredictedValue] = useState(false);
  const [showPredictValueMenu, setShowPredictValueMenu] = useState(false);
  const [isLoadingDescriptiveAnalysis, setIsLoadingDescriptiveAnalysis] =
    useState(false);
  const [isLoadingPredictiveModel, setIsLoadingPredictiveModel] =
    useState(false);
  const [showDescriptiveAnalysisError, setShowDescriptiveAnalysisError] =
    useState(false);
  const [showPredictiveModelError, setShowPredictiveModelError] =
    useState(false);

  const [dependentVariable, setDependentVariable] = useState("");
  const [independentVariables, setIndependentVariables] = useState<any>([]);
  const [source, setSource] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [periodValue, setPeriodValue] = useState("");

  const [dateRange, setDateRange] = useState<DateRange>();

  const [modelType, setModelType] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const [descriptiveAnalysisData, setDescriptiveAnalysisData] = useState<any>();
  const [regressionModel, setRegressionModel] = useState<any>({});
  const [showLinearModel, setShowLinearModel] = useState(false);
  const [showLogisticModel, setShowLogisiticModel] = useState(false);

  useEffect(() => {
    const newVariables = transformObject(params?.indic).filter(
      (e) => e.value !== dependentVariable && e.value !== "rainfall_deviation"
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

  const handleChange = (index: number, event: any) => {
    const values = [...linearPredictionInputFieldValues];
    values[index].value = event.target.value;
    setLinearPredictionInputFieldValues(values);
  };

  const predictLinearValue = () => {
    const value = calculateLinearPredictiveValue(
      linearPredictionInputFieldValues,
      regressionModel.coefficients,
      regressionModel.intercept
    );
    setPredictedValue(value.toString());
    setShowPredictedValue(true);
  };

  const predictLogisticValue = () => {
    console.log("Logistic Value");
  };

  const generateRegressionModel = async () => {
    setLinearPredictionInputFieldValues([]);
    setShowPredictValueMenu(false);
    setShowPredictedValue(false);
    setShowLinearModel(false);
    setShowLogisiticModel(false);
    setShowPredictiveModelError(false);
    setIsLoadingPredictiveModel(true);
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/prediction_model",
        {
          source: source,
          indic: independentVariables.join(","),
          period: periodValue,
          district: districtValue,
          start: formatDate(dateRange?.from),
          end: formatDate(dateRange?.to),
          indic_0: dependentVariable,
          model: modelType,
          // source: "ERA5",
          // indic: "normal_rainfall,el_nino",
          // period: "annual",
          // district: "NPL_33",
          // start: "2015-11-24",
          // end: "2021-10-19",
          // indic_0: "rainfall",
          // model: "linear",
        }
      );
      setRegressionModel(response.data);
      setPersistenVariables(independentVariables);
      independentVariables.map((e: any) => {
        linearPredictionInputFieldValues.push({ value: "" });
        setLinearPredictionInputFieldValues((prev: any) => [
          ...prev,
          { value: "" },
        ]);
      });
      setIsLoadingPredictiveModel(false);
      modelType === "linear"
        ? setShowLinearModel(true)
        : setShowLogisiticModel(true);
      setShowPredictValueMenu(true);
    } catch (error) {
      console.log(error);
      setShowPredictiveModelError(true);
      setIsLoadingPredictiveModel(false);
    }
  };

  const generateDescriptionAnalysis = async () => {
    setShowDescription(false);
    setShowPredictValueMenu(false);
    setShowLinearModel(false);
    setShowLogisiticModel(false);
    setShowPredictiveModelError(false);
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
      await setDescriptiveAnalysisData(response.data);
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
            (e) => e.value !== "rainfall_deviation" && e.value !== "el_nino"
          )}
          state={{
            value: dependentVariable,
            setValue: setDependentVariable,
          }}
        />
        <div>
          <Label className="mb-2 font-semibold">Independent Variables</Label>
          <FancyMultiSelect
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
      <div className="grid gap-4 md:grid-cols-3 justify-center mt-10 ">
        <div></div>
        <Button className="mt-10" onClick={generateDescriptionAnalysis}>
          Start Descriptive Analysis
        </Button>
      </div>

      {isLoadingDescriptiveAnalysis && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">Loading Descriptive Analysis ....</p>
        </div>
      )}
      {showDescriptiveAnalysisError && (
        <div className="my-20 flex flex-col items-center justify-center gap-3">
          <p className="text-xl">Failed to load descriptive analysis !</p>
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
                    {descriptiveAnalysisData.head.columns.map((e: string) => (
                      <TableHead
                        key={e}
                        className=" text-black text-md font-medium"
                      >
                        {e}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(descriptiveAnalysisData?.head?.values).map(
                    (value: string) => (
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
                    )
                  )}
                </TableBody>
              </Table>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" text-black text-md font-medium">
                    Value
                  </TableHead>
                  {descriptiveAnalysisData.missing_values.variables.map(
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
                  {descriptiveAnalysisData.missing_values.values.map(
                    (value: number) => (
                      <TableCell>{value}</TableCell>
                    )
                  )}
                </TableRow>
                <TableRow>
                  <TableCell className=" text-black text-md font-medium">
                    Data types
                  </TableCell>
                  {descriptiveAnalysisData.data_types.values.map(
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
                {Object.keys(descriptiveAnalysisData?.statistics?.values).map(
                  (value) => (
                    <TableRow>
                      <TableCell className="text-black text-md font-medium">
                        {formatTitle(value)}
                      </TableCell>

                      {descriptiveAnalysisData?.statistics?.values[value].map(
                        (e: number) => (
                          <TableCell className="text-md">
                            {e.toFixed(2)}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-20">
            <HighchartsReact
              highcharts={Highcharts}
              options={descriptiveAnalysisData?.correlation_matrix}
            />
          </div>

          <div className=" gap-4 flex flex-col justify-center items-center mt-20">
            <div className="text-lg font-medium w-80">
              <Combobox
                label={"Predictive model"}
                array={[
                  { value: "linear", label: "Linear" },
                  { value: "logistic", label: "Logistic" },
                ]}
                state={{
                  value: modelType,
                  setValue: setModelType,
                }}
              />
            </div>
            <div className="flex flex-col w-80">
              <Button
                className="text-lg mt-2"
                onClick={generateRegressionModel}
                disabled={modelType === ""}
              >
                Generate Model
              </Button>
            </div>
          </div>

          {isLoadingPredictiveModel && (
            <div className="my-20 flex justify-center">
              <p className="text-xl">
                Generating {modelType === "linear" ? "Linear" : "Logistic"}{" "}
                Model ....
              </p>
            </div>
          )}
          {showPredictiveModelError && (
            <div className="my-20 flex flex-col items-center justify-center">
              <p className="text-xl">Failed to generate model !</p>
              <p className="text-xl">Please check your input.</p>
            </div>
          )}
        </>
      )}

      <div className="mb-10 px-5">
        {showLinearModel && (
          <>
            <div className="flex flex-row justify-center gap-32 mt-5">
              <div className="flex flex-col items-center justify-center mt-10 mb-10">
                <p className="text-lg">MSE</p>
                <p className="text-5xl font-semibold mt-5">
                  {regressionModel.performance_metrics?.mse.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center mt-10 mb-10">
                <p className="text-lg">R2</p>
                <p className="text-5xl font-semibold mt-5">
                  {regressionModel.performance_metrics?.r2.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <HighchartsReact
                highcharts={Highcharts}
                options={regressionModel?.chart}
              />
            </div>
          </>
        )}

        <div className="mt-5">
          {showLogisticModel && (
            <>
              <div className="flex flex-row justify-center items-center gap-44 mt-20">
                <div className="flex flex-col items-center justify-center mt-10 mb-10">
                  <p className="text-lg">Accuracy</p>
                  <p className="text-5xl font-semibold mt-5">
                    {regressionModel?.accuracy?.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <p className="text-lg">Confusion Matrix</p>
                  <Table className="mt-5">
                    <TableBody>
                      {regressionModel?.confusion_matrix?.map(
                        (element: any, index: number) => (
                          <TableRow>
                            {element.map((cell: number) => (
                              <TableCell className="text-black text-md px-5">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-10">
                <p className="flex justify-center text-md font-medium">
                  Classification Report
                </p>
                <Table className="mt-10">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-md text-black font-medium">
                        Value
                      </TableHead>
                      {Object.keys(
                        regressionModel.classification_report["macro avg"]
                      ).map((element: any) => (
                        <TableHead className="text-md text-black font-medium">
                          {formatTitle(element)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(regressionModel.classification_report)
                      .filter((e) => e !== "accuracy")
                      .map((e) => (
                        <TableRow>
                          <TableCell className="text-black text-md font-medium">
                            {e}
                          </TableCell>

                          {Object.values(
                            regressionModel.classification_report[e]
                          ).map((element: any) => (
                            <TableCell className="text-md">{element}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>

      {showPredictValueMenu && modelType === "linear" && (
        <div className="flex flex-col justify-center items-center gap-5">
          <div className="flex flex-row mt-10 gap-5">
            {persistentVariables.map((element: any, index: any) => (
              <div key={element}>
                <label className="text-lg font-medium" htmlFor="rainfall">
                  {formatTitle(element) + " value"}
                </label>
                <Input
                  className="mt-2"
                  id="rainfall"
                  type="number"
                  onChange={(event) => handleChange(index, event)}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col w-80">
            <Button
              className="text-lg mt-2"
              onClick={
                modelType === "linear"
                  ? predictLinearValue
                  : predictLogisticValue
              }
            >
              Predict Value
            </Button>
          </div>
        </div>
      )}

      {showPredictedValue && (
        <>
          <div className="flex flex-col items-center justify-center mt-20 mb-20">
            <p className="text-lg">Predicited Value</p>
            <p className="text-8xl font-semibold mt-5">
              {parseInt(predictedValue).toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictiveToolsFilter;
