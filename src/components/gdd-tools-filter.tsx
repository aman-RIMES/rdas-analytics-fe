/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import district from "@/data/district.json";
import metadata from "@/data/metadata.json";
import {
  transformDistrictArray,
  transformObject,
  transformProvinceArray,
  transformSourceObject,
} from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "./ui/multiselect";

const GDDToolsFilter = () => {
  const [primaryIndicator, setPrimaryIndicator] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [indicatorsSource, setIndicatorsSource] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districts, setDistricts] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [provinces, setProvinces] = useState([{}]);
  const [provinceValue, setProvinceValue] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  useEffect(() => {
    (async () => {
      try {
        const provinceList: any = await axios.get(
          "http://203.156.108.67:14800/pakistan/provinces"
        );
        setProvinces(provinceList.data);
        console.log(provinceList.data);
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
        console.log(districtList.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [provinceValue]);

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
          array={transformDistrictArray(districts)}
          state={{
            value: districtValue,
            setValue: setDistrictValue,
          }}
        />
        <Combobox
          label={"Tehsil"}
          array={[]}
          state={{
            value: districtValue,
            setValue: setDistrictValue,
          }}
        />
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-3 justify-center">
        <Combobox
          label={"Crop"}
          array={transformObject(metadata.crop)}
          state={{
            value: primaryIndicator,
            setValue: setPrimaryIndicator,
          }}
        />
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label={"Start Date"}
        />
        <DatePicker date={endDate} setDate={setEndDate} label={"End Date"} />
      </div>

      <div className="grid gap-4 md:grid-cols-3 justify-center mt-10">
        <div></div>
        <Button className="w-full">Generate Predictive model</Button>
      </div>
    </div>
  );
};

export default GDDToolsFilter;
