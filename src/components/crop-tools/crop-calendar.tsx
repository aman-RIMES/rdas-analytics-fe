import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { croppingStageBackground } from "@/constants";
import dictionary from "../../data/dictionary.json";
import { cn } from "@/lib/utils";

const CropCalendar = ({ cropAnalysisData, analysisSubject }) => {
  return (
    <>
      <p className="text-lg font-bold text-green-800 text-center my-3">
        {dictionary.crop[analysisSubject?.crop] || "Crop"} Stages and Water and
        Temperature Requirements{""}
        {` in ${dictionary.district[analysisSubject?.location] || "location"}`}
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
            {cropAnalysisData?.crop_calendar?.map((calendar, monthIndex) => (
              <TableCell key={monthIndex}>
                <>
                  <div className="flex flex-row justify-center gap-16">
                    {calendar.stages.map((stage, stageIndex) => (
                      <div className=" m-[-15px]">
                        <img
                          className="
                                w-[70px] h-[140px]"
                          src={croppingStageBackground[stage?.number - 1].image}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                </>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {cropAnalysisData?.crop_calendar?.map((calendar, monthIndex) => (
              <TableCell
                key={monthIndex}
                className="text-xs text-center p-[2px] "
              >
                <>
                  <div className="flex flex-row">
                    {calendar.stages.map((stage, stageIndex) => (
                      <div
                        className={cn(
                          "text-xs w-full px-[-8] py-1 flex items-center justify-center",
                          croppingStageBackground[stage?.number - 1].color
                        )}
                      >
                        <p className="font-bold text-lg">{stage?.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {cropAnalysisData?.crop_calendar?.map((calendar, monthIndex) => (
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
                          croppingStageBackground[stage?.number - 1].color
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
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default CropCalendar;
