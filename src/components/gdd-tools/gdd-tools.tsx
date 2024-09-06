/* eslint-disable @typescript-eslint/no-explicit-any */
import GDDToolsFilter from "./gdd-tools-filter";
import GDDToolsData from "./gdd-tools-data";
import { requestStatus, yearsList } from "@/constants";
import { useState } from "react";
import { FilterData } from "@/types";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import SubmitButton from "../submit-button";

const GDDPredictiveTools = () => {
  const [isNewAnalysis, setIsNewAnalysis] = useState(true);
  const [gddStatus, setGddStatus] = useState<requestStatus>(requestStatus.idle);
  const [gddData, setGddData] = useState<any>([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filterData, setFilterData] = useState<FilterData>({
    districtValue: "",
    countryValue: "",
    provinceValue: "",
    dateRange: {},
    tehsilValue: "",
    cropValue: "",
    yearsValue: yearsList,
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.cropValue !== "" &&
      filterData.tehsilValue !== "" &&
      filterData.districtValue !== "" &&
      filterData.countryValue !== "" &&
      filterData.provinceValue !== "" &&
      filterData.yearsValue.length > 0 &&
      formatDate(filterData.dateRange?.from) !== "" &&
      formatDate(filterData.dateRange?.to) !== ""
    );
  };

  const generateGDD = async () => {
    try {
      setGddStatus(requestStatus.isLoading);
      const response: any = await axios.get(
        `http://203.156.108.67:1580/gdd?start_date=${formatDate(
          filterData.dateRange?.from
        )}&end_date=${formatDate(filterData.dateRange?.to)}&tehsil_id=${
          filterData.tehsilValue
        }&district_id=${filterData.districtValue}&crop=${
          filterData.cropValue
        }&years=${filterData.yearsValue.join(",")}`
      );
      setGddData(response.data);
      setGddStatus(requestStatus.isFinished);
      setIsNewAnalysis(false);
    } catch (error) {
      console.log(error);
      setGddStatus(requestStatus.isError);
      setIsNewAnalysis(false);
    }
  };

  return (
    <>
      <div className="flex flex-col text-center items-center justify-center gap-3 mb-7">
        <h1 className="text-4xl font-bold">GDD Analytical Tool</h1>
      </div>

      <div className="my-10">
        <div className="sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
          <GDDToolsFilter filterData={filterData} handleChange={handleChange} />

          <div className="md:mt-12 w-full">
            <SubmitButton
              verifyFilters={verifyFilters()}
              submitFunction={generateGDD}
              loadingStatus={gddStatus}
              label={isNewAnalysis ? "Start Analysis" : "Re-Analyze"}
            />
          </div>

          <GDDToolsData gddData={gddData} gddStatus={gddStatus} />
        </div>
      </div>
    </>
  );
};

export default GDDPredictiveTools;
