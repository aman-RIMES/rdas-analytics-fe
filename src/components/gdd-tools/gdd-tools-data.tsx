import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GDDDataProps } from "@/types";
import { isError, isFinished, isLoading } from "@/lib/utils";
import { infinity } from "ldrs";
infinity.register("l-infinity");

const GDDToolsData = ({ gddData, gddStatus }: GDDDataProps) => {
  return (
    <>
      {isError(gddStatus) && (
        <div className="flex justify-center my-20">
          <Alert className="lg:w-3/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to analyze the given filters. This could be due to missing
              datasets. Try changing your filters and start the analysis again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isLoading(gddStatus) && (
        <div className="my-20  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-infinity color="green" size="35"></l-infinity>
            <p className="text-2xl text-lime-700 font-medium">
              Analyzing GDD Data
            </p>
          </div>
        </div>
      )}

      {isFinished(gddStatus) && (
        <>
          <div className="mb-10 mt-10 flex flex-col gap-7 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <div className="p-2 rounded-lg bg-white shadow-lg">
              <HighchartsReact
                highcharts={Highcharts}
                options={gddData.gdd_chart}
              />
            </div>
          </div>

          <div className="mt-10 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <Tabs defaultValue={gddData.temp_charts[0].title.text}>
              <div className="flex justify-center">
                <TabsList className="py-8 px-10 border bg-green-800">
                  {gddData.temp_charts.map((chartOption: any) => (
                    <TabsTrigger
                      className="text-lg text-white data-[state=active]:bg-yellow-400"
                      key={Math.random()}
                      value={chartOption.title.text}
                    >
                      {chartOption.title.text.split(" ").splice(-1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="mt-10">
                {gddData.temp_charts.map((chartOption: any) => (
                  <TabsContent
                    key={Math.random()}
                    value={chartOption.title.text}
                  >
                    <div className="p-2 rounded-lg bg-white shadow-lg">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOption}
                      />
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>

          <div className="mt-20 sm:p-10 p-4 rounded-lg bg-gray-50 shadow-lg">
            <Tabs defaultValue={gddData.ndvi_images[0].year}>
              <div className="flex justify-center">
                <TabsList className="py-8 px-10 border bg-green-800">
                  {gddData.ndvi_images.map((element: any) => (
                    <TabsTrigger
                      className="text-lg text-white data-[state=active]:bg-yellow-400"
                      key={Math.random()}
                      value={element.year}
                    >
                      {element.year}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="mt-10">
                {gddData.ndvi_images.map((element: any) => (
                  <TabsContent key={Math.random()} value={element.year}>
                    <div className="flex flex-col items-center justify-center mt-5">
                      <p className="text-xl font-semibold">
                        NDVI Image for the year {element.year}
                      </p>
                      <div className="my-10">
                        <img
                          className="rounded-md object-cover"
                          src={`data:image/png;base64,${
                            element.image.split(",")[1]
                          }`}
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
};

export default GDDToolsData;
