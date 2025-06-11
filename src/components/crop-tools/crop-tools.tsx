import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import sampleCharts from "../../data/sample_charts.json";
import { useEffect, useState } from "react";
import { FilterData } from "@/types";
import axios from "axios";
import {
  BASE_URL,
  IDLE_ANALYTICS_CHART_MESSAGE,
  requestStatus,
} from "@/constants";
import CropToolsFilter from "./crop-tools-filter";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SubmitButton from "../submit-button";
import { PopoverClose } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { isError, isIdle, isLoading } from "@/lib/utils";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import highchartsVariwide from "highcharts/modules/variwide";
import { ScrollArea } from "../ui/scroll-area";
highchartsVariwide(Highcharts);
import { hourglass } from "ldrs";
hourglass.register("l-hourglass");
import DownloadPdf from "../dowload-pdf";
import CropCalendar from "./crop-calendar";
import CropToolsAnalysisText from "./crop-tool-analysis-text";

const CropTools = () => {
  const [cropAnalysisStatus, setCropAnalysisStatus] = useState(
    requestStatus.idle
  );
  const [cropAnalysisData, setCropAnalysisData] = useState<any>({});
  const [filterData, setFilterData] = useState<FilterData>(() => {
    const storedFilterData = localStorage.getItem("cropFilterData");
    return storedFilterData
      ? JSON.parse(storedFilterData)
      : {
          cropValue: "",
          source: "",
          customDataset: null,
          customCalendar: null,
          districtList: [],
          countryValue: "",
          provinceValue: "",
          districtValue: "",
          analysisTimeline: "",
          season: "",
        };
  });
  const [analysisSubject, setAnalysisSubject] = useState<any>({
    crop: "",
    location: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => {
      const updatedFilterData = { ...prev, [name]: value };
      localStorage.setItem("cropFilterData", JSON.stringify(updatedFilterData));
      return updatedFilterData;
    });
  };

  const verifyFilters = () => {
    return (
      filterData.source !== "" &&
      filterData.analysisTimeline !== "" &&
      filterData.cropValue !== "" &&
      (filterData.districtValue !== "" || filterData.provinceValue !== "") &&
      filterData.countryValue !== ""
    );
  };

  useEffect(() => {
    const storedFilterData = localStorage.getItem("cropFilterData");
    if (storedFilterData) {
      const parsedFilterData = JSON.parse(storedFilterData);
      setFilterData(parsedFilterData);
    }
  }, []);

  const generateCropAnalysis = async () => {
    const requestBody = {
      area: filterData.provinceValue
        ? filterData.provinceValue
        : filterData.districtValue,
      country: filterData.countryValue,
      season: filterData.season,
      start: `${
        new Date().getFullYear() - parseInt(filterData.analysisTimeline)
      }-01-01`,
      end: `${new Date().getFullYear() - 1}-01-01`,
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
    formData.append(
      `crop`,
      filterData.cropValue === "customCalendar"
        ? filterData.customCalendar
        : filterData.cropValue
    );

    setCropAnalysisStatus(requestStatus.isLoading);
    try {
      const response = await axios.post(
        `${BASE_URL}/crop_calendar_analysis`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCropAnalysisData(response.data);
      setAnalysisSubject({
        crop: filterData.cropValue,
        location:
          filterData.districtValue !== "none" ? filterData.districtValue : "",
      });
      setCropAnalysisStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setCropAnalysisStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="p-2 h-screen flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 flex-grow">
          <div className="col-span-4 w-full  bg-white rounded-lg flex-grow p-1 relative z-0 flex flex-col">
            <div className="absolute inset-0 z-30 max-h-10 max-w-60 flex justify-start items-start">
              <Popover>
                <PopoverTrigger className="p-2">
                  <div className="border-2 bg-white border-green-800 text-green-800 text-lg px-2 py-1 min-w-[190px]  rounded-md hover:bg-green-800 hover:text-white flex flex-row justify-between items-center">
                    <p className="text-md  font-medium">Filters</p>
                    <div className="justify-end">
                      <ChevronDown />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <CropToolsFilter
                    filterData={filterData}
                    handleChange={handleChange}
                  />

                  <PopoverClose asChild>
                    <div className="w-full h-full mt-5">
                      <SubmitButton
                        verifyFilters={verifyFilters()}
                        submitFunction={generateCropAnalysis}
                        loadingStatus={cropAnalysisStatus}
                        label="Analyze Crop Suitability"
                      />
                    </div>
                  </PopoverClose>
                </PopoverContent>
              </Popover>
            </div>

            <CropCalendar
              cropAnalysisData={cropAnalysisData}
              analysisSubject={analysisSubject}
            />

            <div className="absolute inset-0 z-10 max-h-12 mr-3 flex justify-end items-end ">
              <DownloadPdf
                cropAnalysisData={cropAnalysisData}
                analysisSubject={analysisSubject}
              />
            </div>

            {(isIdle(cropAnalysisStatus) ||
              isLoading(cropAnalysisStatus) ||
              isError(cropAnalysisStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(cropAnalysisStatus) ? (
                  <p className="text-xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                ) : isError(cropAnalysisStatus) ? (
                  <ErrorMessage />
                ) : (
                  <Loading
                    animation={
                      <l-hourglass color="green" size="60"></l-hourglass>
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className="col-span-3 w-full  bg-white rounded-lg flex-grow p-1 relative z-0 flex flex-col">
            <HighchartsReact
              highcharts={Highcharts}
              options={
                cropAnalysisData?.chart?.rainfall
                  ? cropAnalysisData?.chart?.rainfall
                  : sampleCharts?.crop_rainfall
              }
              containerProps={{ style: { height: "100%" } }}
            />
            {(isIdle(cropAnalysisStatus) ||
              isLoading(cropAnalysisStatus) ||
              isError(cropAnalysisStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(cropAnalysisStatus) ? (
                  <p className="text-xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                ) : isError(cropAnalysisStatus) ? (
                  <ErrorMessage />
                ) : (
                  <Loading
                    animation={
                      <l-hourglass color="green" size="60"></l-hourglass>
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className="col-span-4 w-full  rounded-lg flex-grow flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-grow">
              <div className="relative z-0 bg-white rounded-lg flex-grow flex flex-col">
                <div className="flex-grow flex flex-col">
                  <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                    <p className="ml-2"> Analysis</p>
                  </div>

                  <ScrollArea className="h-[400px] p-2 flex-grow">
                    <CropToolsAnalysisText
                      cropAnalysisData={cropAnalysisData}
                    />
                  </ScrollArea>
                </div>
                {(isIdle(cropAnalysisStatus) ||
                  isLoading(cropAnalysisStatus) ||
                  isError(cropAnalysisStatus)) && (
                  <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                    {isIdle(cropAnalysisStatus) ? (
                      <p className="text-xl font-bold text-green-800">
                        {IDLE_ANALYTICS_CHART_MESSAGE}
                      </p>
                    ) : isError(cropAnalysisStatus) ? (
                      <ErrorMessage />
                    ) : (
                      <Loading
                        animation={
                          <l-hourglass color="green" size="60"></l-hourglass>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg flex-grow relative z-0 flex flex-col">
                <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2"> Recommendation</p>
                </div>
                <div className="flex-grow">
                  <ScrollArea className="h-[400px] p-2 flex-grow">
                    <p className="p-2" style={{ whiteSpace: "break-spaces" }}>
                      {cropAnalysisData?.recommendation ||
                        sampleCharts?.crop_recommendation}
                    </p>
                  </ScrollArea>
                </div>
                {(isIdle(cropAnalysisStatus) ||
                  isLoading(cropAnalysisStatus) ||
                  isError(cropAnalysisStatus)) && (
                  <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                    {isIdle(cropAnalysisStatus) ? (
                      <p className="text-xl font-bold text-green-800">
                        {IDLE_ANALYTICS_CHART_MESSAGE}
                      </p>
                    ) : isError(cropAnalysisStatus) ? (
                      <ErrorMessage />
                    ) : (
                      <Loading
                        animation={
                          <l-hourglass color="green" size="60"></l-hourglass>
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-3 w-full  bg-white rounded-lg flex-grow p-1 relative z-0 flex flex-col">
            <HighchartsReact
              highcharts={Highcharts}
              options={
                cropAnalysisData?.chart?.temperature
                  ? cropAnalysisData?.chart?.temperature
                  : sampleCharts?.crop_temperature
              }
              containerProps={{ style: { height: "100%" } }}
            />
            {(isIdle(cropAnalysisStatus) ||
              isLoading(cropAnalysisStatus) ||
              isError(cropAnalysisStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(cropAnalysisStatus) ? (
                  <p className="text-xl font-bold text-green-800">
                    {IDLE_ANALYTICS_CHART_MESSAGE}
                  </p>
                ) : isError(cropAnalysisStatus) ? (
                  <ErrorMessage />
                ) : (
                  <Loading
                    animation={
                      <l-hourglass color="green" size="60"></l-hourglass>
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CropTools;
