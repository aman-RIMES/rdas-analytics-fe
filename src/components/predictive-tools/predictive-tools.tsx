/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { FilterData } from "@/types";
import { BASE_URL, requestStatus, toolType } from "@/constants";
import { useLocation } from "react-router-dom";
import PredictiveToolsData from "./predictive-tools-data";
import ElNinoCommonFilter from "../analytics-tools/elnino-common-filter.component";
import SubmitButton from "../submit-button";
import CustomDatasetGuide from "../custom-dataset-guide";

const PredictiveTools = () => {
  const location = useLocation();
  const data = location.state;
  const [predictiveDataType, setPredictiveDataType] = useState("");
  const [regressionModelStatus, setRegressionModelStatus] =
    useState<requestStatus>(requestStatus.idle);
  const [regressionModelData, setRegressionModelData] = useState<any>({});
  const [selected, setSelected] = useState<any>([]);
  const [filterData, setFilterData] = useState<FilterData>(() => {
    const storedFilterData = localStorage.getItem("predictiveFilterData");
    return storedFilterData
      ? JSON.parse(storedFilterData)
      : {
          dataVariable: [],
          cropValue: "",
          source: "",
          countryValue: "",
          districtValue: "",
          districtList: [],
          fromYear: "",
          toYear: "",
          modelType: "linear",
          eventStatus: "",
          months: [],
        };
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => {
      const updatedFilterData = { ...prev, [name]: value };
      localStorage.setItem(
        "predictiveFilterData",
        JSON.stringify(updatedFilterData)
      );
      return updatedFilterData;
    });
  };

  const climatePattern =
    location.pathname === "/lanina-predictive-tools"
      ? toolType.lanina
      : toolType.elnino;

  const verifyFilters = () => {
    return (
      filterData.dataVariable.length > 0 &&
      filterData.months.length > 0 &&
      filterData.source !== "" &&
      filterData.countryValue !== "" &&
      filterData.districtValue !== "" &&
      filterData.eventStatus !== "" &&
      filterData.toYear !== "" &&
      filterData.fromYear !== ""
    );
  };

  useEffect(() => {
    const storedFilterData = localStorage.getItem("predictiveFilterData");
    if (storedFilterData) {
      const parsedFilterData = JSON.parse(storedFilterData);
      setFilterData(parsedFilterData);
    }
  }, []);

  useEffect(() => {
    data?.fromYear ? handleChange("fromYear", data?.fromYear) : null;
    data?.toYear ? handleChange("toYear", data?.toYear) : null;
    data?.countryValue
      ? handleChange("countryValue", data?.countryValue)
      : null;
    data?.source ? handleChange("source", data?.source) : null;
    data?.districtValue
      ? handleChange("districtValue", data?.districtValue)
      : null;
    data?.dataVariable
      ? handleChange("dataVariable", data?.dataVariable)
      : null;
    data?.selected ? setSelected(data?.selected) : null;
  }, []);

  const generateRegressionModel = async () => {
    const requestBody = {
      indic_y: `${filterData.dataVariable.join(",")}`,
      months: `${filterData.months.join(",")}`,
      area: [`${filterData.districtValue}`],
      crop: filterData.cropValue,
      start: `${filterData.fromYear}-01-01`,
      end: `${filterData.toYear}-01-01`,
      status: filterData.eventStatus,
    };
    const formData = new FormData();
    Object.keys(requestBody).map((key) => {
      formData.append(key, requestBody[key]);
    });
    formData.append(
      `source`,
      filterData.source === "customDataset"
        ? filterData.customDataset
        : filterData.source
    );

    setRegressionModelStatus(requestStatus.isLoading);
    try {
      const response = await axios.post(
        `${BASE_URL}/${climatePattern}prediction_model`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
      <div className="p-2 h-screen flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 flex-grow">
          <div className="col-span-1 flex flex-col">
            <div className=" border-grey-600 rounded-lg flex-grow flex flex-col">
              <div className="bg-[#0B6623] flex justify-between items-center text-white text-md p-1 rounded-t-lg font-medium ">
                <p className="ml-2 text-sm"> Parameters</p>
                <CustomDatasetGuide
                  title="Use Custom Dataset"
                  className="mr-2 text-sm text-yellow-300 text-decoration-line: underline"
                />
              </div>
              <div className="bg-gray-100 p-2 rounded-b-lg flex flex-col gap-5 shadow-lg flex-grow">
                <ElNinoCommonFilter
                  filterData={filterData}
                  handleChange={handleChange}
                  selected={selected}
                  setSelected={setSelected}
                  filterType="predictive"
                />

                <div className="w-full h-full">
                  <SubmitButton
                    verifyFilters={verifyFilters()}
                    submitFunction={generateRegressionModel}
                    loadingStatus={regressionModelStatus}
                    label="Generate Predictive Model"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 flex-grow flex flex-col">
            <PredictiveToolsData
              regressionModelStatus={regressionModelStatus}
              regressionModelData={regressionModelData}
              predictiveDataType={predictiveDataType}
              modelType={filterData.modelType}
              filterData={filterData}
              handleChange={handleChange}
              climatePattern={climatePattern}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PredictiveTools;
