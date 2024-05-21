import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import district from "@/data/district.json";
import metadata from "@/data/metadata.json";
import { transformObject, transformSourceObject } from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";

const Filter = () => {
  const [districtOpen, setDistrictOpen] = useState(false);
  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [indicatorOpen, setIndicatorOpen] = useState(false);
  const [indicatorValue, setIndicatorValue] = useState("");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [periodValue, setPeriodValue] = useState("");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [sourceValue, setSourceValue] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  useEffect(() => {
    const d = district
      .filter((e) => e.district_code.substring(0, 3) === countryValue)
      .slice(0, 15)
      .map((e) => ({ value: e.district_code, label: e.district_name }));
    setDistrictList(d);
  }, [countryValue]);

  const filterData = async () => {
    try {
      const response = await axios.post(
        "http://203.156.108.67:14800/data/get",
        {
          source: sourceValue,
          indic: indicatorValue,
          period: periodValue,
          country: countryValue,
          district: [districtValue],
          start_date: startDate?.toISOString().slice(0, 10),
          end_date: endDate?.toISOString().slice(0, 10),
          cache: true,
        }
      );

      console.log(response);
      alert(
        "POST request Successfull ! View response on the network tab of dev tools."
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  return (
    <div className="p-10">
      {/* <div className="flex flex-row gap-5 m-5 justify-center"> */}
      <div className="grid gap-4 mb-6 md:grid-cols-5 justify-center">
        <Combobox
          label={"Country"}
          array={transformObject(metadata.country)}
          state={{
            open: countryOpen,
            setOpen: setCountryOpen,
            value: countryValue,
            setValue: setCountryValue,
          }}
        />
        <Combobox
          label={"District"}
          array={districtList}
          state={{
            open: districtOpen,
            setOpen: setDistrictOpen,
            value: districtValue,
            setValue: setDistrictValue,
          }}
        />
        <Combobox
          label={"Indicator"}
          array={transformObject(metadata.indic)}
          state={{
            open: indicatorOpen,
            setOpen: setIndicatorOpen,
            value: indicatorValue,
            setValue: setIndicatorValue,
          }}
        />
        <Combobox
          label={"Period"}
          array={transformObject(metadata.period)}
          state={{
            open: periodOpen,
            setOpen: setPeriodOpen,
            value: periodValue,
            setValue: setPeriodValue,
          }}
        />
        <Combobox
          label={"Source"}
          array={transformSourceObject(metadata.source)}
          state={{
            open: sourceOpen,
            setOpen: setSourceOpen,
            value: sourceValue,
            setValue: setSourceValue,
          }}
        />

        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label={"Start Date"}
        />
        <DatePicker date={endDate} setDate={setEndDate} label={"End Date"} />
        <div className="flex flex-col justify-start gap-2">
          <div>
            <Label>{"."}</Label>
          </div>
          <Button onClick={filterData}>Filter Data</Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
