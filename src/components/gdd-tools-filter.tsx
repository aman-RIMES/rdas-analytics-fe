/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import metadata from "@/data/metadata.json";
import {
  formatDate,
  transformDistrictArray,
  transformObject,
  transformProvinceArray,
  transformCropArray,
  transformTehsilArray,
} from "@/lib/utils";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "./ui/multiselect";
import { yearsList } from "@/constants";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DatePickerWithRange } from "./date-range-picker";
import { Crop, DateRange } from "@/types";
import { setYear } from "date-fns";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import HelpHoverCard from "./help-hover-card";

const GDDToolsFilter = () => {
  const [isError, setIsError] = useState(false);
  const [isNewAnalysis, setIsNewAnalysis] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cropValue, setCropValue] = useState();
  const [tehsils, setTehsils] = useState([{}]);
  const [tehsilValue, setTehsilValue] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districts, setDistricts] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [provinces, setProvinces] = useState([{}]);
  const [provinceValue, setProvinceValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [yearsValue, setYearsValue] = useState<any>([]);
  const [gddData, setGddData] = useState<any>([]);
  const [resultVisibile, setResultVisibile] = useState(false);
  const [years, setYears] = useState(yearsList);

  const [selected, setSelected] = useState([]);

  // function setProv(e) {
  //   console.log("#$##$%%% " + e);

  //   setProvinceValue(e);
  // }

  const verifyFilters = () => {
    return (
      cropValue !== "" &&
      tehsilValue !== "" &&
      districtValue !== "" &&
      countryValue !== "" &&
      provinceValue !== "" &&
      yearsValue.length > 0 &&
      formatDate(dateRange?.from) !== "" &&
      formatDate(dateRange?.to) !== ""
    );
  };

  useEffect(() => {
    const chosenYear = formatDate(dateRange?.from).slice(0, 4);
    setYears(yearsList.filter((e) => e.label !== chosenYear));
  }, [dateRange]);

  useEffect(() => {
    (async () => {
      try {
        const cropsList = await axios.get("http://203.156.108.67:1480/crops");
        setCrops(cropsList.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const provinceList: any = await axios.get(
          "http://203.156.108.67:14800/pakistan/provinces"
        );
        setProvinces(provinceList.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const districtList: any = await axios.get(
          `http://203.156.108.67:14800/pakistan/get_districts_by_province/${provinceValue}`
        );
        setDistricts(districtList.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [provinceValue]);

  useEffect(() => {
    (async () => {
      try {
        const tehsilList: any = await axios.get(
          `http://203.156.108.67:14800/pakistan/get_tehsil_by_district_id/${districtValue}`
        );
        setTehsils(tehsilList.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [districtValue]);

  const generateGDD = async () => {
    try {
      setResultVisibile(false);
      setIsError(false);
      setIsLoading(true);
      const response: any = await axios.get(
        `http://203.156.108.67:1580/gdd?start_date=${formatDate(
          dateRange?.from
        )}&end_date=${formatDate(
          dateRange?.to
        )}&tehsil_id=${tehsilValue}&district_id=${districtValue}&crop=${cropValue}&years=${yearsValue.join(
          ","
        )}`
      );
      setGddData(response.data);
      setIsLoading(false);
      setResultVisibile(true);
      setIsNewAnalysis(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setIsNewAnalysis(false);
    }
  };

  return (
    <div className="sm:p-10 p-4">
      <div className="grid gap-4 mb-6 md:grid-cols-2 xl:grid-cols-4 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Country </Label>
            <HelpHoverCard
              title={" Country "}
              content={` The country of chosen location that you'd like to analyze. `}
            />
          </div>
          <Combobox
            label={"Country"}
            array={transformObject(metadata.country)}
            state={{
              value: countryValue,
              setValue: setCountryValue,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Province </Label>
            <HelpHoverCard
              title={" Province "}
              content={`  The Province of the chosen country to be used for the
              analysis. `}
            />
          </div>
          <Combobox
            label={"Province"}
            array={transformProvinceArray(provinces)}
            state={{
              value: provinceValue,
              setValue: setProvinceValue,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> District </Label>
            <HelpHoverCard
              title={" District "}
              content={`  The district of the chosen country to be used for the
              analysis. `}
            />
          </div>
          <Combobox
            label={"District"}
            array={transformDistrictArray(districts)}
            state={{
              value: districtValue,
              setValue: setDistrictValue,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Tehsil </Label>
            <HelpHoverCard
              title={" Tehsil "}
              content={`  The specific Tehsil of the chosen district to be used for the
              detailed analysis. `}
            />
          </div>
          <Combobox
            label={"Tehsil"}
            array={transformTehsilArray(tehsils)}
            state={{
              value: tehsilValue,
              setValue: setTehsilValue,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 xl:grid-cols-4 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Crop </Label>
            <HelpHoverCard
              title={" Crop "}
              content={`  The type of crop you want to analyze. `}
            />
          </div>
          <Combobox
            label={"Crop"}
            array={transformCropArray(crops)}
            state={{
              value: cropValue,
              setValue: setCropValue,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="font-semibold">Start and End date</Label>
            <HelpHoverCard
              title={"Start and End date"}
              content={`The specific date range that you'd like to be analyzed.`}
            />
          </div>
          <DatePickerWithRange
            disabledStatus={cropValue == null}
            date={dateRange}
            setDate={setDateRange}
            min={crops.find((e) => e?.crop_id == cropValue)?.min_period_days}
            max={crops.find((e) => e?.crop_id == cropValue)?.max_period_days}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Years </Label>
            <HelpHoverCard
              title={" Years "}
              content={` The list of years you would like to view individual analysis for. `}
            />
          </div>
          <FancyMultiSelect
            selected={selected}
            setSelected={setSelected}
            placeholder={"Select Years"}
            setState={setYearsValue}
            array={years}
          />
        </div>
      </div>

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
                <span className="text-md font-semibold">Invalid Input!</span>
              </div>
              <p className="text-md">
                Make sure you've filled every field above.
              </p>
            </HoverCardContent>
          )}
        </HoverCard>
      </div>

      {isError && (
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
      {isLoading && (
        <div className="my-20 flex justify-center">
          <p className="text-2xl">Loading ....</p>
        </div>
      )}
      {resultVisibile && (
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
    </div>
  );
};

export default GDDToolsFilter;
