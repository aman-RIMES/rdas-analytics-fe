/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Combobox from "../ui/combobox";
import metadata from "@/data/metadata.json";
import {
  formatDate,
  transformDistrictArray,
  transformObject,
  transformProvinceArray,
  transformCropArray,
  transformTehsilArray,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "../ui/multiselect";
import { Crop, GDDFilterProps } from "@/types";
import HelpHoverCard from "../help-hover-card";
import { yearsList } from "@/constants";
import { DatePickerWithRange } from "../date-range-picker";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const GDDToolsFilter = ({ filterData, handleChange }: GDDFilterProps) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [tehsils, setTehsils] = useState([{}]);
  const [districts, setDistricts] = useState([{}]);
  const [provinces, setProvinces] = useState([{}]);
  const [years, setYears] = useState(yearsList);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const chosenYear = formatDate(filterData.dateRange?.from).slice(0, 4);
    setYears(yearsList.filter((e) => e.label !== chosenYear));
  }, [filterData.dateRange]);

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
      if (filterData.provinceValue !== "") {
        try {
          const districtList: any = await axios.get(
            `http://203.156.108.67:14800/pakistan/get_districts_by_province/${filterData.provinceValue}`
          );
          setDistricts(districtList.data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [filterData.provinceValue]);

  useEffect(() => {
    (async () => {
      if (filterData.districtValue !== "") {
        try {
          const tehsilList: any = await axios.get(
            `http://203.156.108.67:14800/pakistan/get_tehsil_by_district_id/${filterData.districtValue}`
          );
          setTehsils(tehsilList.data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [filterData.districtValue]);

  return (
    <div>
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
            name="countryValue"
            label={"Country"}
            array={transformObject(metadata.country)}
            state={{
              value: filterData.countryValue,
              setValue: handleChange,
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
            name="provinceValue"
            label={"Province"}
            array={transformProvinceArray(provinces)}
            state={{
              value: filterData.provinceValue,
              setValue: handleChange,
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
            name="districtValue"
            label={"District"}
            array={transformDistrictArray(districts)}
            state={{
              value: filterData.districtValue,
              setValue: handleChange,
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
            name="tehsilValue"
            label={"Tehsil"}
            array={transformTehsilArray(tehsils)}
            state={{
              value: filterData.tehsilValue,
              setValue: handleChange,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 xl:grid-cols-3 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Crop </Label>
            <HelpHoverCard
              title={" Crop "}
              content={`  The type of crop you want to analyze. `}
            />
          </div>
          <Combobox
            name="cropValue"
            label={"Crop"}
            array={transformCropArray(crops)}
            state={{
              value: filterData.cropValue,
              setValue: handleChange,
            }}
          />
        </div>
        <div>
          <div>
            <div className="flex gap-2 ">
              <Label className="font-semibold">Start and End date</Label>
              <HelpHoverCard
                title={"Start and End date"}
                content={`The specific date range that you'd like to be analyzed.`}
              />
            </div>
            <DatePickerWithRange
              name="dateRange"
              disabledStatus={filterData.cropValue == ""}
              date={filterData.dateRange}
              setDate={handleChange}
              min={
                crops.find((e) => e?.crop_id == parseInt(filterData.cropValue))
                  ?.min_period_days
              }
              max={
                crops.find((e) => e?.crop_id == parseInt(filterData.cropValue))
                  ?.max_period_days
              }
            />
          </div>
          {filterData.cropValue !== "" && (
            <div className="flex gap-2  mt-2">
              <InfoCircledIcon className="h-7 w-7" />
              <p className="text-sm">
                Please choose a minimum of{" "}
                {
                  crops.find(
                    (e) => e?.crop_id == parseInt(filterData.cropValue)
                  )?.min_period_days
                }{" "}
                and a maximum of{" "}
                {
                  crops.find(
                    (e) => e?.crop_id == parseInt(filterData.cropValue)
                  )?.max_period_days
                }{" "}
                days .
              </p>
            </div>
          )}
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
            name="yearsValue"
            selected={selected}
            setSelected={setSelected}
            placeholder={"Select Years"}
            setState={handleChange}
            array={years}
          />
        </div>
      </div>
    </div>
  );
};

export default GDDToolsFilter;
