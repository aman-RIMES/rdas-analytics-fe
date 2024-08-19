/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertCircle } from "lucide-react";
import GDDToolsFilter from "./gdd-tools-filter";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import GDDToolsData from "./gdd-tools-data";
import { requestStatus, yearsList } from "@/constants";
import { useState } from "react";
import { FilterData } from "@/types";
import { formatDate } from "@/lib/utils";
import axios from "axios";

const GDDPredictiveTools = () => {
  const [isNewAnalysis, setIsNewAnalysis] = useState(true);
  const [gddStatus, setGddStatus] = useState<requestStatus>(requestStatus.idle);
  const [gddData, setGddData] = useState<any>([]);
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
        <h1 className="text-3xl">
          El Nino, Climate and Agriculture production
        </h1>
        <h1 className="text-2xl">GDD Predictive Tool</h1>
      </div>

      <div className="my-10 border rounded-lg">
        <div className="sm:p-10 p-4">
          <GDDToolsFilter filterData={filterData} handleChange={handleChange} />

          <div className="md:mt-12 w-full">
            <HoverCard>
              <HoverCardTrigger className="w-full flex justify-center">
                <Button
                  onClick={generateGDD}
                  className="md:w-1/3 w-full"
                  disabled={!verifyFilters()}
                >
                  {isNewAnalysis ? "Start Analysis" : "Re-Analyze"}
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

          <GDDToolsData gddData={gddData} gddStatus={gddStatus} />
        </div>
      </div>
    </>
  );
};

export default GDDPredictiveTools;
