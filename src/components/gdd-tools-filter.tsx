/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import district from "@/data/district.json";
import metadata from "@/data/metadata.json";
import {
  getAverage,
  transformDistrictArray,
  transformObject,
  transformProvinceArray,
  transformSourceObject,
  transfromTehsilArray,
} from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "./ui/multiselect";
import { years } from "@/constants";
import { divIcon } from "leaflet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const GDDToolsFilter = () => {
  const [primaryIndicator, setPrimaryIndicator] = useState("");
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
  const [gddData, setGddData] = useState([]);
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
      const response: any = await axios.get(
        `http://203.156.108.67:1580/gdd?start_date=2022-10-01&end_date=2023-02-01&tehsil_id=PK10101&district_id=PK101&crop=Rice&years=2022,2021,2016`
      );
      setGddData(response.data);
      setResultVisibile(true);
      console.log(response.data);
    } catch (error) {
      console.log(error);
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
            value: primaryIndicator,
            setValue: setPrimaryIndicator,
          }}
        />
        <div>
          <Label className="mb-2.5 font-semibold">Years</Label>
          <FancyMultiSelect setState={setYearsValue} array={years} />
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
        <Button onClick={generateGDD} className="w-full">
          Start Analysis
        </Button>
      </div>

      {resultVisibile && (
        <div className="mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Year</TableHead>
                <TableHead>Average Max-Temp</TableHead>
                <TableHead>Average Min-Temp</TableHead>
                <TableHead>GDD Total</TableHead>
                <TableHead>Average GDD</TableHead>
                <TableHead>NDVI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gddData.map((element: any) => (
                <TableRow key={Math.random()}>
                  <TableCell className="font-medium">{element.Year}</TableCell>
                  <TableCell>
                    {getAverage(element.Max_temp).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getAverage(element.Min_temp).toFixed(2)}
                  </TableCell>
                  <TableCell>{element.Gdd_total}</TableCell>
                  <TableCell>{getAverage(element.GDD).toFixed(2)}</TableCell>
                  <TableCell>{element.NDVI}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GDDToolsFilter;
