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
    dataVariable: [],
    elNinoVariable: "moderate",
    cropValue: "",
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
      filterData.dataVariable.length > 0 &&
      filterData.elNinoVariable !== "" &&
      filterData.source !== "" &&
      filterData.countryValue !== "" &&
      filterData.modelType !== "" &&
      filterData.toYear !== "" &&
      filterData.fromYear !== ""
    );
  };

  useEffect(() => {
    data?.dataVariable ? handleChange("fromYear", data?.fromYear) : null;
    data?.dataVariable ? handleChange("toYear", data?.toYear) : null;
    data?.dataVariable
      ? handleChange("countryValue", data?.countryValue)
      : null;
    data?.dataVariable ? handleChange("source", data?.source) : null;
    data?.dataVariable
      ? handleChange("elNinoDataSource", data?.elNinoDataSource)
      : null;
    data?.dataVariable
      ? handleChange("dataVariable", data?.dataVariable)
      : null;
    data?.selected ? setSelected(data?.selected) : null;
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
        "http://203.156.108.67:1580/el_nino_prediction_model",
        {
          source: "ERA5",
          indic_y: "rainfall",
          // period: "annual",
          area: [`${filterData.districtValue}`],
          start: `${filterData.fromYear}-01-01`,
          end: `${filterData.toYear}-01-01`,
          // indic_0: filterData.elNinoVariable,
          model: "linear",
        }
      );
      setRegressionModelData(response.data);
      setPredictiveDataType(filterData.modelType);
      handleChange("elNinoVariable", "moderate");
      setRegressionModelStatus(requestStatus.isFinished);
      console.log(filterData.elNinoVariable);
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
            filterData={filterData}
            handleChange={handleChange}
          />

          {/* {isFinished(regressionModelStatus) && (
            <>
              {predictiveDataType === predictiveModelDataType.linear && (
                <div className="mt-10 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
                  <PredictiveCalculation
                    regressionModelData={regressionModelData}
                  />
                </div>
              )}
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

export default PredictiveTools;
