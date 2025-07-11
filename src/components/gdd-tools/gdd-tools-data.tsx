import { isError, isIdle, isLoading } from "@/lib/utils";
import { GDDDataProps } from "@/types";
import { grid, reuleaux } from "ldrs";
import { IDLE_ANALYTICS_CHART_MESSAGE } from "@/constants";
reuleaux.register("l-reuleaux");
grid.register("l-loader");
import sampleCharts from "../../data/sample_charts.json";
import Loading from "../ui/loading";
import ErrorMessage from "../ui/error-message";
import { ScrollArea } from "../ui/scroll-area";
import CropToolsAnalysisText from "../crop-tools/crop-tool-analysis-text";

const GddToolsData = ({ gddData, gddStatus }: GDDDataProps) => {
  console.log(gddStatus);

  return (
    <div className="">
      <div className="p-2 ">
        <div className="col-span-4 w-full  rounded-lg flex-grow flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-grow">
            <div className="relative z-0 bg-white rounded-lg flex-grow flex flex-col">
              <div className="flex-grow flex flex-col">
                <div className="bg-green-800 text-white text-md p-1 rounded-t-lg font-medium">
                  <p className="ml-2"> Analysis</p>
                </div>
                {/* //TODO: Replace with a proper analysis placeholder text */}
                <ScrollArea className="h-[400px] p-2 flex-grow">
                  <p className="p-2" style={{ whiteSpace: "break-spaces" }}>
                    {gddData?.analysis || sampleCharts?.crop_recommendation}{" "}
                  </p>
                </ScrollArea>
              </div>
              {(isIdle(gddStatus) ||
                isLoading(gddStatus) ||
                isError(gddStatus)) && (
                <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                  {isIdle(gddStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(gddStatus) ? (
                    <ErrorMessage />
                  ) : (
                    <Loading
                      animation={
                        <l-reuleaux
                          color="green"
                          stroke={8}
                          size="50"
                        ></l-reuleaux>
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
                    {gddData?.recommendation ||
                      sampleCharts?.gdd_recommendation}
                  </p>
                </ScrollArea>
              </div>
              {(isIdle(gddStatus) ||
                isLoading(gddStatus) ||
                isError(gddStatus)) && (
                <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
                  {isIdle(gddStatus) ? (
                    <p className="text-xl font-bold text-green-800">
                      {IDLE_ANALYTICS_CHART_MESSAGE}
                    </p>
                  ) : isError(gddStatus) ? (
                    <ErrorMessage />
                  ) : (
                    <Loading
                      animation={
                        <l-reuleaux
                          color="green"
                          stroke={8}
                          size="50"
                        ></l-reuleaux>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GddToolsData;
