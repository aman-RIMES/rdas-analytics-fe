/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate, isFinished } from "@/lib/utils";
import { Button } from "../ui/button";
import axios from "axios";
import { FilterData } from "@/types";
import { predictiveModelDataType, requestStatus } from "@/constants";
import bodyParams from "../../data/body_params.json";
import { useLocation } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import PredictiveToolsData from "./predictive-tools-data";
import PredictiveCalculation from "./predictve-tools-calculation";
import { AlertCircle } from "lucide-react";
import ElNinoCommonFilter from "../analytics-tools/elnino-common-filter.component";

const PredictiveTools = () => {
  const location = useLocation();
  const data = location.state;
  const [params, setParams] = useState<any>(bodyParams);
  const [persistentVariables, setPersistenVariables] = useState<any>([]);
  const [
    linearPredictionInputFieldValues,
    setLinearPredictionInputFieldValues,
  ] = useState<any>([]);
  const [predictiveDataType, setPredictiveDataType] =
    useState<predictiveModelDataType>();
  const [regressionModelStatus, setRegressionModelStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [regressionModelData, setRegressionModelData] = useState<any>({});
  const [selected, setSelected] = useState<any>([]);
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
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.independentVariables.length > 0 &&
      filterData.dependentVariable !== "" &&
      filterData.source !== "" &&
      filterData.periodValue !== "" &&
      filterData.districtValue !== "" &&
      filterData.countryValue !== "" &&
      formatDate(filterData.dateRange?.from) !== "" &&
      formatDate(filterData.dateRange?.to) !== "" &&
      filterData.modelType !== ""
    );
  };

  useEffect(() => {
    handleChange("countryValue", data?.countryValue);
    handleChange("source", data?.source);
    data?.independentVariables
      ? handleChange("independentVariables", data?.independentVariables)
      : null;
    data?.selected ? setSelected(data?.selected) : null;
    handleChange("dependentVariable", data?.dependentVariable);
    handleChange("districtValue", data?.districtValue);
    handleChange("dateRange", data?.dateRange);
    handleChange("periodValue", data?.periodValue);
  }, []);

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

  const generateRegressionModel = async () => {
    setRegressionModelStatus(requestStatus.isLoading);
    setLinearPredictionInputFieldValues([]);
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/prediction_model",
        {
          source: filterData.source,
          indic: filterData.independentVariables.join(","),
          period: filterData.periodValue,
          district: filterData.districtValue,
          start: formatDate(filterData.dateRange?.from),
          end: formatDate(filterData.dateRange?.to),
          indic_0: filterData.dependentVariable,
          model: filterData.modelType,
        }
      );
      setRegressionModelData(response.data);
      setPersistenVariables(filterData.independentVariables);
      filterData.modelType === "linear"
        ? setPredictiveDataType(predictiveModelDataType.linear)
        : setPredictiveDataType(predictiveModelDataType.logistic);
      filterData.independentVariables.map((e: any) => {
        linearPredictionInputFieldValues.push({ value: "" });
        setLinearPredictionInputFieldValues((prev: any) => [
          ...prev,
          { value: "" },
        ]);
      });
      setRegressionModelStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setRegressionModelStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="flex flex-col text-center items-center justify-center gap-3 mb-7">
        <h1 className="text-3xl">El Nino Predictive Tools</h1>
      </div>

      <div className="my-10 border rounded-lg">
        <div className="sm:p-10 p-4">
          <ElNinoCommonFilter
            params={params}
            filterData={filterData}
            handleChange={handleChange}
            selected={selected}
            setSelected={setSelected}
            filterType="predictive"
          />

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

          <PredictiveToolsData
            regressionModelStatus={regressionModelStatus}
            regressionModelData={regressionModelData}
            predictiveDataType={predictiveDataType}
          />

          {isFinished(regressionModelStatus) &&
            predictiveDataType === predictiveModelDataType.linear && (
              <PredictiveCalculation
                regressionModelData={regressionModelData}
                persistentVariables={persistentVariables}
                linearPredictionInputFieldValues={
                  linearPredictionInputFieldValues
                }
                setLinearPredictionInputFieldValues={
                  setLinearPredictionInputFieldValues
                }
              />
            )}
        </div>
      </div>
    </>
  );
};

export default PredictiveTools;
