/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactApexChart from "react-apexcharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { analysisTopics, sampleChartData } from "@/constants";
import { useParams, useSearchParams } from "react-router-dom";
import NotFoundPage from "./404-page";

//TODO: Replace all unknown/any types with their corresponding types/interfaces
const Content = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { topic } = useParams();
  const analysisSubject = analysisTopics.find(
    (element) => element.name === topic
  );
  if (!analysisSubject) return <NotFoundPage />;
  const id: string = searchParams.get("subject-id") || "";
  const subject: any = analysisSubject.options.find(
    (option) => option.id === parseInt(id)
  );

  function isUsingCustomDataset(id: string) {
    return searchParams.get("custom-datasets")?.includes(id);
  }

  return (
    <>
      <div className="flex justify-center mb-7">
        <h1 className="text-3xl">{subject.title}</h1>
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
        {subject.datasets.map((element: any) => (
          <div key={element.title}>
            <Card
              className={cn(
                searchParams.get("custom-datasets")?.includes(element.id)
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
                  onValueChange={() => {
                    const prev = searchParams.get("custom-datasets") || "";
                    let array: string[] = prev.split("_");

                    array.includes(element.id.toString())
                      ? (array = array.filter((e: string) => e != element.id))
                      : array.push(element.id);

                    setSearchParams(
                      (prev) => {
                        prev.set("custom-datasets", array.join("_"));
                        return prev;
                      },
                      { replace: true }
                    );
                  }}
                  value={
                    searchParams.get("custom-datasets")?.includes(element.id)
                      ? "custom"
                      : "local"
                  }
                  defaultValue={"local"}
                  className="pb-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id={element.id} />
                    <Label htmlFor={element.id}>Use RDAS Dataset</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id={element.id + "a"} />
                    <Label htmlFor={element.id + "a"}>Use custom Dataset</Label>
                  </div>
                </RadioGroup>
                {searchParams.get("custom-datasets")?.includes(element.id) && (
                  <div className="grid w-full max-w-sm items-center gap-1.5 pt-4">
                    <Label className="text-xs" htmlFor="picture">
                      Upload Custom Dataset
                    </Label>
                    <Input
                      className={cn(
                        searchParams
                          .get("custom-datasets")
                          ?.includes(element.id)
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
                      isUsingCustomDataset(element.id)
                        ? "bg-green-800"
                        : "bg-black",
                      "text-white"
                    )}
                  >
                    Using {isUsingCustomDataset(element.id) ? "custom" : "RDAS"}{" "}
                    Dataset
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
