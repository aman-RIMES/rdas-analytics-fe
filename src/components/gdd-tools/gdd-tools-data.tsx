import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GDDDataProps } from "@/types";
import { isError, isFinished, isLoading } from "@/lib/utils";

const GDDToolsData = ({ gddData, gddStatus }: GDDDataProps) => {
  return (
    <>
      {isError(gddStatus) && (
        <div className="flex justify-center">
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
        <div className="my-20 flex justify-center">
          <p className="text-2xl">Loading ....</p>
        </div>
      )}

      {isFinished(gddStatus) && (
        <>
          <div className="mb-10 mt-10 px-5 flex flex-col gap-7">
            <HighchartsReact
              highcharts={Highcharts}
              options={gddData.gdd_chart}
            />
          </div>

          <div className="mt-20">
            <Tabs defaultValue={gddData.temp_charts[0].title.text}>
              <div className="flex justify-center">
                <TabsList className="py-7 border">
                  {gddData.temp_charts.map((chartOption: any) => (
                    <TabsTrigger
                      className="text-lg  data-[state=active]:border"
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
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={chartOption}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>

          <div className="mt-20">
            <Tabs defaultValue={gddData.ndvi_images[0].year}>
              <div className="flex justify-center">
                <TabsList className="py-7 border">
                  {gddData.ndvi_images.map((element: any) => (
                    <TabsTrigger
                      className="text-lg  data-[state=active]:border"
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
