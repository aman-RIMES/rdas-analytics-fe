/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import metadata from "@/data/metadata.json";
import {
  transformDistrictArray,
  transformObject,
  transformProvinceArray,
  transfromTehsilArray,
} from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "./ui/multiselect";
import { years } from "@/constants";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const GDDToolsFilter = () => {
  const [isError, setIsError] = useState(false);
  const [isNewAnalysis, setIsNewAnalysis] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cropValue, setCropValue] = useState("");
  const [tehsils, setTehsils] = useState([{}]);
  const [tehsilValue, setTehsilValue] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districts, setDistricts] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [provinces, setProvinces] = useState([{}]);
  const [provinceValue, setProvinceValue] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [yearsValue, setYearsValue] = useState([]);
  const [gddData, setGddData] = useState<any>([]);
  const [resultVisibile, setResultVisibile] = useState(false);

  // function setProv(e) {
  //   console.log("#$##$%%% " + e);

  //   setProvinceValue(e);
  // }

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
        `http://203.156.108.67:1580/gdd?start_date=${startDate
          ?.toISOString()
          .slice(0, 10)}&end_date=${endDate
          ?.toISOString()
          .slice(
            0,
            10
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
    <div className="p-10">
      <div className="grid gap-4 mb-6 md:grid-cols-4 justify-center">
        <Combobox
          label={"Country"}
          array={transformObject(metadata.country)}
          state={{
            value: countryValue,
            setValue: setCountryValue,
          }}
        />
        <Combobox
          label={"Province"}
          array={transformProvinceArray(provinces)}
          state={{
            value: provinceValue,
            setValue: setProvinceValue,
          }}
        />
        <Combobox
          label={"District"}
          array={transformDistrictArray(districts.slice(0, 15))}
          state={{
            value: districtValue,
            setValue: setDistrictValue,
          }}
        />
        <Combobox
          label={"Tehsil"}
          array={transfromTehsilArray(tehsils)}
          state={{
            value: tehsilValue,
            setValue: setTehsilValue,
          }}
        />
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-4 justify-center">
        <Combobox
          label={"Crop"}
          array={transformObject(metadata.crop)}
          state={{
            value: cropValue,
            setValue: setCropValue,
          }}
        />
        <div>
          <Label className="mb-2.5 font-semibold">Years</Label>
          <FancyMultiSelect
            placeholder={"Select Years"}
            setState={setYearsValue}
            array={years}
          />
        </div>
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label={"Start Date"}
        />
        <DatePicker date={endDate} setDate={setEndDate} label={"End Date"} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 justify-center mt-10">
        <div></div>
        <Button onClick={generateGDD} className="w-full text-lg">
          {isNewAnalysis ? "Start Analysis" : "Re-Analyze"}
        </Button>
      </div>

      {isError && (
        <div className="my-20 flex justify-center">
          <p className="text-2xl">Error analyzing data !</p>
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
                      value={
                        chartOption.title.text ==
                        gddData.temp_charts[0].title.text
                          ? `${chartOption.title.text}`
                          : `The year ${chartOption.title.text
                              .split(" ")
                              .splice(-1)}`
                      }
                    >
                      {chartOption.title.text ==
                      gddData.temp_charts[0].title.text
                        ? `Between ${startDate
                            ?.toISOString()
                            .slice(0, 10)} - ${endDate
                            ?.toISOString()
                            .slice(0, 10)}`
                        : `The year ${chartOption.title.text
                            .split(" ")
                            .splice(-1)}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="mt-10">
                {gddData.temp_charts.map((chartOption: any) => (
                  <TabsContent
                    key={Math.random()}
                    value={
                      chartOption.title.text ==
                      gddData.temp_charts[0].title.text
                        ? `${chartOption.title.text}`
                        : `The year ${chartOption.title.text
                            .split(" ")
                            .splice(-1)}`
                    }
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

          <div>
            {/* {gddData.temp_charts.map((chartOption: any) => (
              <div key={Math.random()}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOption}
                />
              </div>
            ))} */}
          </div>
        </>
      )}
    </div>
  );
};

export default GDDToolsFilter;
