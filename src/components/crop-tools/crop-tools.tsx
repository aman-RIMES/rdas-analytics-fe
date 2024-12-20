import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import sampleCharts from "../../data/sample_charts.json";
import bodyParams from "../../data/body_params.json";
import { useEffect, useState } from "react";
import { FilterData } from "@/types";
import axios from "axios";
import {
  BASE_URL,
  BODY_PARAMS_URL,
  croppingStageBackground,
  IDLE_ANALYTICS_CHART_MESSAGE,
  requestStatus,
} from "@/constants";
import CropToolsFilter from "./crop-tools-filter";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SubmitButton from "../submit-button";
import { PopoverClose } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { cn, formatTitle, isError, isIdle, isLoading } from "@/lib/utils";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import highchartsVariwide from "highcharts/modules/variwide";
import { ScrollArea } from "../ui/scroll-area";
highchartsVariwide(Highcharts);
import { hourglass } from "ldrs";
hourglass.register("l-hourglass");

const CropTools = () => {
  const [params, setParams] = useState<any>(bodyParams);
  const [cropAnalysisStatus, setCropAnalysisStatus] = useState(
    requestStatus.idle
  );
  const [cropAnalysisData, setCropAnalysisData] = useState<any>({});
  const [filterData, setFilterData] = useState<FilterData>({
    cropValue: "",
    source: "",
    customDataset: null,
    districtList: [],
    countryValue: "",
    districtValue: "",
    analysisTimeline: "",
  });

  const handleChange = (name: string, value: string | []) => {
    setFilterData((prev: any) => ({ ...prev, [name]: value }));
  };

  const verifyFilters = () => {
    return (
      filterData.source !== "" &&
      filterData.analysisTimeline !== "" &&
      filterData.cropValue !== "" &&
      filterData.districtValue !== "" &&
      filterData.countryValue !== ""
    );
  };

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

  const generateCropAnalysis = async () => {
    const requestBody = {
      area: `${filterData.districtValue}`,
      crop: filterData.cropValue,
      start: `${
        new Date().getFullYear() - parseInt(filterData.analysisTimeline)
      }-01-01`,
      end: `${new Date().getFullYear()}-01-01`,
    };
    const formData = new FormData();
    Object.keys(requestBody).map((key) => {
      formData.append(key, requestBody[key]);
    });
    formData.append(
      `source`,
      filterData.source === "customDataset" ? filterData.customDataset : `ERA5`
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
      setCropAnalysisStatus(requestStatus.isFinished);
    } catch (error) {
      console.log(error);
      setCropAnalysisStatus(requestStatus.isError);
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
          <div className="col-span-4 w-full  bg-white rounded-lg h-[45vh] p-1 relative z-0">
            <div className="absolute inset-0 z-20 max-h-10 flex justify-start items-start">
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
                    params={params}
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

            <p className="text-xl font-bold text-green-800 text-center my-3">
              Crop Stages and Water and Temperature Requirements
            </p>

            <Table className="">
              <TableHeader>
                <TableRow>
                  {cropAnalysisData?.crop_calendar?.map((element: any) => (
                    <TableHead className=" text-white text-md font-medium text-center p-[2px]">
                      <div className="bg-green-800 py-2 rounded-sm">
                        {element.month}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  {cropAnalysisData?.crop_calendar?.map(
                    (calendar, monthIndex) => (
                      <TableCell
                        key={monthIndex}
                        className="text-xs text-center p-[2px] "
                      >
                        <>
                          <div className="flex flex-row">
                            {calendar.stages.map((stage, stageIndex) => (
                              <div
                                className={cn(
                                  "text-xs w-full px-[-10] py-3",
                                  croppingStageBackground[stage?.number - 1]
                                )}
                              >
                                <p className="font-bold text-lg">
                                  {stage?.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      </TableCell>
                    )
                  )}
                </TableRow>
                <TableRow>
                  {cropAnalysisData?.crop_calendar?.map(
                    (calendar, monthIndex) => (
                      <TableCell
                        key={monthIndex}
                        className="text-xs text-center p-[2px] "
                      >
                        <>
                          <div className="flex flex-row">
                            {calendar.stages.map((stage, stageIndex) => (
                              <div
                                className={cn(
                                  "text-xs w-full px-[-10]  py-5",
                                  croppingStageBackground[stage?.number - 1]
                                )}
                              >
                                <p className="font-medium text-sm">
                                  Max Temp: {stage?.tmax_req}
                                </p>
                                <p className="font-medium text-sm">
                                  Min Temp: {stage?.tmin_req}
                                </p>
                                <p className="font-medium text-sm">
                                  Water: {stage?.water_req}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableBody>
            </Table>

            {(isIdle(cropAnalysisStatus) ||
              isLoading(cropAnalysisStatus) ||
              isError(cropAnalysisStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(cropAnalysisStatus) ? (
                  <p className="text-2xl font-bold text-green-800">
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

          <div className="col-span-3 w-full  bg-white rounded-lg h-[45vh] p-1 relative z-0">
            <HighchartsReact
              highcharts={Highcharts}
              options={
                cropAnalysisData?.chart?.rainfall
                  ? cropAnalysisData?.chart?.rainfall
                  : sampleCharts?.crop_rainfall
              }
              containerProps={{ style: { height: "425px" } }}
            />
            {(isIdle(cropAnalysisStatus) ||
              isLoading(cropAnalysisStatus) ||
              isError(cropAnalysisStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(cropAnalysisStatus) ? (
                  <p className="text-2xl font-bold text-green-800">
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

          <div className="col-span-4 w-full  rounded-lg h-[45vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="relative z-0 bg-white rounded-lg min-h-[45vh]">
                <div className="">
                  <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                    <p className="ml-2"> Analysis</p>
                  </div>

                  <ScrollArea className="h-[400px] p-2">
                    <div className="w-[520px]">
                      <p className="p-2" style={{ whiteSpace: "break-spaces" }}>
                        {cropAnalysisData?.analysis ||
                          sampleCharts?.crop_analysis}
                      </p>
                    </div>

                    {cropAnalysisData?.analysis_per_stage && (
                      <div className="w-[500px]">
                        <Table className="mt-2">
                          <TableHeader>
                            <TableRow>
                              {Object.keys(
                                cropAnalysisData?.analysis_per_stage[0]
                              )
                                .filter((key) => key !== "number")
                                ?.map((key: any) => (
                                  <TableHead className="text-black text-md font-medium text-center">
                                    <div>{formatTitle(key)}</div>
                                  </TableHead>
                                ))}
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {cropAnalysisData?.analysis_per_stage?.map(
                              (element: any, index) => (
                                <TableRow>
                                  {Object.keys(element)
                                    .filter((key) => key !== "number")
                                    ?.map((e: any) => (
                                      <TableCell
                                        key={index}
                                        className="text-sm text-center p-[4px] "
                                      >
                                        {element[e]}
                                      </TableCell>
                                    ))}
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </ScrollArea>
                </div>
                {(isIdle(cropAnalysisStatus) ||
                  isLoading(cropAnalysisStatus) ||
                  isError(cropAnalysisStatus)) && (
                  <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                    {isIdle(cropAnalysisStatus) ? (
                      <p className="text-2xl font-bold text-green-800">
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
              <div className="bg-white rounded-lg min-h-[45vh] relative z-0">
                <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2"> Recommendation</p>
                </div>
                <div>
                  <ScrollArea className="h-[400px] p-2">
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
                      <p className="text-2xl font-bold text-green-800">
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
          <div className="col-span-3 w-full  bg-white rounded-lg h-[45vh] p-1 relative z-0">
            <HighchartsReact
              highcharts={Highcharts}
              options={
                cropAnalysisData?.chart?.temperature
                  ? cropAnalysisData?.chart?.temperature
                  : sampleCharts?.crop_temperature
              }
              containerProps={{ style: { height: "425px" } }}
            />
            {(isIdle(cropAnalysisStatus) ||
              isLoading(cropAnalysisStatus) ||
              isError(cropAnalysisStatus)) && (
              <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                {isIdle(cropAnalysisStatus) ? (
                  <p className="text-2xl font-bold text-green-800">
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
