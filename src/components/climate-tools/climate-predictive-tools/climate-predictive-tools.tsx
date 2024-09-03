/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate, getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
import axios from "axios";
import { FilterData } from "@/types";
import {
  BODY_PARAMS_URL,
  predictiveModelDataType,
  requestStatus,
} from "@/constants";
import bodyParams from "@/data/body_params.json";
import { useLocation } from "react-router-dom";
import PredictiveToolsData from "@/components/predictive-tools/predictive-tools-data";
import PredictiveCalculation from "@/components/predictive-tools/predictve-tools-calculation";
import ElNinoCommonFilter from "@/components/analytics-tools/elnino-common-filter.component";
import SubmitButton from "@/components/submit-button";
import ClimateCommonFilter from "../climate-analytics-tools/climate-common-filter";

const ClimatePredictiveTools = () => {
  const location = useLocation();
  const data = location.state;
  const [params, setParams] = useState<any>(bodyParams);
  const [predictiveDataType, setPredictiveDataType] = useState("");
  const [regressionModelStatus, setRegressionModelStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [regressionModelData, setRegressionModelData] = useState<any>({});
  const [selected, setSelected] = useState<any>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    dependentVariable: "",
    independentVariables: [],
    source: "",
    periodValue: "",
    countryValue: "",
    districtValue: "",
    dateRange: {},
    modelType: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.independentVariables?.length > 0 &&
      filterData.dependentVariable !== "" &&
      filterData.source !== "" &&
      filterData.countryValue !== "" &&
      filterData.modelType !== "" &&
      filterData.periodValue !== "" &&
      filterData.districtValue !== "" &&
      formatDate(filterData.dateRange?.from) !== "" &&
      formatDate(filterData.dateRange?.to) !== ""
    );
  };

  useEffect(() => {
    handleChange("dateRange", data?.dateRange);
    handleChange("countryValue", data?.countryValue);
    handleChange("source", data?.source);
    handleChange("periodValue", data?.periodValue);
    handleChange("districtValue", data?.districtValue);
    handleChange("dependentVariable", data?.dependentVariable);
    handleChange("independentVariables", data?.independentVariables);
    data?.independentVariables
      ? handleChange("independentVariables", data?.independentVariables)
      : null;
    data?.selected ? setSelected(data?.selected) : null;
  }, []);

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

  const generateRegressionModel = async () => {
    setRegressionModelStatus(requestStatus.isLoading);
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
      setPredictiveDataType(filterData.modelType);
      setRegressionModelStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setRegressionModelStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">Climate Predictive Tools</h1>
      </div>

      <div className="my-10">
        <div className="sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
          <ClimateCommonFilter
            params={params}
            filterData={filterData}
            handleChange={handleChange}
            selected={selected}
            setSelected={setSelected}
            filterType="predictive"
          />

          <div className="md:mt-12 w-full">
            <SubmitButton
              verifyFilters={verifyFilters()}
              submitFunction={generateRegressionModel}
              loadingStatus={regressionModelStatus}
              label="Generate Predictive Model"
            />
          </div>
        </div>
        <div>
          <PredictiveToolsData
            regressionModelStatus={regressionModelStatus}
            regressionModelData={regressionModelData}
            predictiveDataType={predictiveDataType}
            modelType={filterData.modelType}
          />

          {isFinished(regressionModelStatus) && (
            <>
              {predictiveDataType === predictiveModelDataType.linear && (
                <div className="mt-10 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
                  <PredictiveCalculation
                    regressionModelData={regressionModelData}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClimatePredictiveTools;
