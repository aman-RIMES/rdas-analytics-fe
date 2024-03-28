import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Icons } from "./ui/icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { analysisTopics, sampleChartData } from "@/constants";
import { useParams, useSearchParams } from "react-router-dom";
import NotFoundPage from "./404-page";

const Content = () => {
  const [rainfallData, setRainfallData] = useState("local");
  const [temperatureData, setTemperatureData] = useState("local");
  const [extremeData, setExtremeData] = useState("local");

  const [searchParams] = useSearchParams();
  console.log(searchParams.get("year"));
  const { topic } = useParams();
  const analysisSubject = analysisTopics.find(
    (element) => element.name === topic
  );
  if (!analysisSubject) return <NotFoundPage />;

  const datasets = [
    {
      title: "Observed Rainfall",
      icon: Icons.rainfall,
      dataset: rainfallData,
      setData: setRainfallData,
    },
    {
      title: "Observed Temperature",
      icon: Icons.temperature,
      dataset: temperatureData,
      setData: setTemperatureData,
    },
    {
      title: "Observed Extremes",
      icon: Icons.extremes,
      dataset: extremeData,
      setData: setExtremeData,
    },
  ];

  return (
    <>
      <div className="flex justify-center mb-7">
        <h1 className="text-3xl">El Nino</h1>
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
        {datasets.map((element) => (
          <div key={element.title}>
            <Card
              className={cn(
                element.dataset === "custom"
                  ? "border-green-500 shadow-green-500"
                  : "border-gray-200",
                "border-2 shadow-md"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">
                    {element.title}{" "}
                  </CardTitle>
                  <element.icon />
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => element.setData(value)}
                  value={element.dataset}
                  defaultValue={element.dataset}
                  className="pb-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id={element.title} />
                    <Label htmlFor={element.title}>Use RDAS Dataset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id={element.title + "a"} />
                    <Label htmlFor={element.title + "a"}>
                      Use custom Dataset
                    </Label>
                  </div>
                </RadioGroup>
                {element.dataset === "custom" && (
                  <div className="grid w-full max-w-sm items-center gap-1.5 pt-4">
                    <Label className="text-xs" htmlFor="picture">
                      Upload Custom Dataset
                    </Label>
                    <Input
                      className={cn(
                        element.dataset === "custom"
                          ? "border-green-500 text-green-800"
                          : ""
                      )}
                      id="picture"
                      type="file"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex flex-row items-start">
                  <Badge
                    variant="outline"
                    className={cn(
                      element.dataset === "custom"
                        ? "bg-green-800"
                        : "bg-black",
                      "text-white"
                    )}
                  >
                    Using {element.dataset} Dataset
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <ReactApexChart
        // @ts-expect-error: weird type error with chart options
        options={sampleChartData.options}
        series={sampleChartData.series}
        type="line"
        height={350}
      />
    </>
  );
};

export default Content;
