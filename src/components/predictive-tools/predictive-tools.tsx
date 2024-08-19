/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { formatDate, getAllDistrictsOfCountry, isFinished } from "@/lib/utils";
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
              />
            )}
        </div>
      </div>
    </>
  );
};

export default PredictiveTools;
