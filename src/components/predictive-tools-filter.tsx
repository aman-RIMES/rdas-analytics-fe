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
import { useLocation } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import HelpHoverCard from "./help-hover-card";

const PredictiveToolsFilter = () => {
  const location = useLocation();
  const data = location.state;

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
  const [isLoadingPredictiveModel, setIsLoadingPredictiveModel] =
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

  const [regressionModel, setRegressionModel] = useState<any>({});
  const [showLinearModel, setShowLinearModel] = useState(false);
  const [showLogisticModel, setShowLogisiticModel] = useState(false);

  const [selected, setSelected] = useState<any>([]);

  const verifyFilters = () => {
    return (
      independentVariables.length > 0 &&
      dependentVariable !== "" &&
      source !== "" &&
      periodValue !== "" &&
      modelType !== "" &&
      districtValue !== "" &&
      formatDate(dateRange?.from) !== "" &&
      formatDate(dateRange?.to) !== "" &&
      countryValue !== ""
    );
  };

  useEffect(() => {
    setCountryValue(data?.countryValue);
    setSource(data?.source);
    data?.independentVariables
      ? setIndependentVariables(data?.independentVariables)
      : null;
    data?.selected ? setSelected(data?.selected) : null;
    setDependentVariable(data?.dependentVariable);
    setDistrictValue(data?.districtValue);
    setDateRange(data?.dateRange);
    setPeriodValue(data?.periodValue);
  }, []);

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

  const predictLogisticValue = () => console.log("prediciting logisitic value");

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

  return (
    <div className="sm:p-10 p-4">
      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold">Dependent Variable</Label>
            <HelpHoverCard
              title={"Dependent Variable"}
              content={`A single climate variable used to compare against other climate
              variables.`}
            />
          </div>
          <Combobox
            label={"Dependent Variable"}
            array={transformObject(params?.indic).filter(
              (e) =>
                e.value !== "rainfall_deviation" &&
                e.value !== "el_nino" &&
                !independentVariables?.includes(e.value)
            )}
            state={{
              value: dependentVariable,
              setValue: setDependentVariable,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold">Independent Variables</Label>
            <HelpHoverCard
              title={"Independent Variables"}
              content={`One or more climate variables that will be compared against
                  the Dependent variable.`}
            />
          </div>
          <FancyMultiSelect
            selected={selected}
            setSelected={setSelected}
            setState={setIndependentVariables}
            array={independentVariablesList}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="font-semibold">Start and End date</Label>
            <HelpHoverCard
              title={"Start and End date"}
              content={`The specific date range that you'd like to be analyzed.`}
            />
          </div>
          <DatePickerWithRange
            date={dateRange}
            setDate={setDateRange}
            min={0}
            max={0}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Period </Label>
            <HelpHoverCard
              title={" Period "}
              content={` The period between each date that you want to analyze. `}
            />
          </div>
          <Combobox
            label={"Period"}
            array={transformObject(params?.period)}
            state={{
              value: periodValue,
              setValue: setPeriodValue,
            }}
          />
        </div>
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Source </Label>
            <HelpHoverCard
              title={" Source "}
              content={` The source of dataset that you want to use for the current
              analysis. `}
            />
          </div>
          <Combobox
            label={"Source"}
            array={transformSourceObject(params?.source)}
            state={{
              value: source,
              setValue: setSource,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Country </Label>
            <HelpHoverCard
              title={" Country "}
              content={` The country of chosen location that you'd like to analyze. `}
            />
          </div>
          <Combobox
            label={"Country"}
            array={countries}
            state={{
              value: countryValue,
              setValue: setCountryValue,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> District </Label>
            <HelpHoverCard
              title={" District "}
              content={`  The specific district of the chosen country to be used for the
              analysis. `}
            />
          </div>
          <Combobox
            label={"District"}
            array={transformDistrictParams(districtList)}
            state={{
              value: districtValue,
              setValue: setDistrictValue,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Predictive model type</Label>
            <HelpHoverCard
              title={" Predictive model type"}
              content={` The model type you would like to generate for the prediction (Linear or Logistic). `}
            />
          </div>
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
      </div>
      <div className="md:mt-12 w-full">
        <HoverCard>
          <HoverCardTrigger className="w-full flex justify-center">
            <Button
              className="md:w-1/3 w-full"
              disabled={!verifyFilters()}
              onClick={generateRegressionModel}
            >
              Generate Predictive Model
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

      {isLoadingPredictiveModel && (
        <div className="my-20 flex justify-center">
          <p className="text-xl">
            Generating {modelType === "linear" ? "Linear" : "Logistic"} Model
            ....
          </p>
        </div>
      )}
      {showPredictiveModelError && (
        <div className="flex justify-center my-10">
          <Alert className="lg:w-3/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to generate model. This could be due to missing datasets.
              Try changing your filters and start the analysis again.
            </AlertDescription>
          </Alert>
        </div>
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
                          <TableRow key={index}>
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
            <p className="text-lg">Predicted Value</p>
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
