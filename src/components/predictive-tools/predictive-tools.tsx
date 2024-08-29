/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate, getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
import { Button } from "../ui/button";
import axios from "axios";
import { FilterData } from "@/types";
import { predictiveModelDataType, requestStatus } from "@/constants";
import bodyParams from "../../data/body_params.json";
import { useLocation } from "react-router-dom";
import PredictiveToolsData from "./predictive-tools-data";
import PredictiveCalculation from "./predictve-tools-calculation";
import { AlertCircle } from "lucide-react";
import ElNinoCommonFilter from "../analytics-tools/elnino-common-filter.component";
import SubmitButton from "../submit-button";

const PredictiveTools = () => {
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
    source: "",
    countryValue: "",
    districtList: [],
    fromYear: "",
    toYear: "",
    modelType: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.dependentVariable !== "" &&
      filterData.elNinoVariable !== "" &&
      filterData.source !== "" &&
      filterData.countryValue !== "" &&
      filterData.modelType !== "" &&
      filterData.toYear !== "" &&
      filterData.fromYear !== ""
    );
  };

  useEffect(() => {
    handleChange("fromYear", data?.fromYear);
    handleChange("toYear", data?.toYear);
    handleChange("countryValue", data?.countryValue);
    handleChange("source", data?.source);
    handleChange("dependentVariable", data?.dependentVariable);
    handleChange("elNinoVariable", data?.elNinoVariable);
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
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/prediction_model",
        {
          source: "ERA5",
          indic: filterData.dependentVariable,
          period: "annual",
          district: getAllDistrictsOfCountry(filterData.districtList).join(","),
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
          indic_0: "el_nino",
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
        <h1 className="text-4xl font-bold">El Nino Predictive Tools</h1>
      </div>

      <div className="my-10">
        <div className="sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
          <ElNinoCommonFilter
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

export default PredictiveTools;
