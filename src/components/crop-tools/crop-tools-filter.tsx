import { useEffect, useState } from "react";
import {
  countries,
  croppingTimeline,
  NEW_BODY_PARAMS_URL,
  NEW_BODY_PARAMS_URL_LEVEL_1,
} from "@/constants";
import {
  transformCropArray,
  transformNewParamsObject,
  transformSourceObject,
} from "@/lib/utils";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { FilterProps } from "@/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import CustomDatasetGuide from "../custom-dataset-guide";
import CustomCalendarGuide from "../custom-crop-calendar";
import newBodyParams from "../../data/new_body_params.json";
import axios from "axios";

const CropToolsFilter = ({ params, filterData, handleChange }: FilterProps) => {
  const [newParams, setNewParams] = useState<any>(newBodyParams);
  const [provinceList, setProvinceList] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const level_1_result: any = await axios.get(NEW_BODY_PARAMS_URL, {
          params: {
            ...(filterData?.countryValue
              ? { geo: filterData?.countryValue }
              : {}),
            // ...(filterData?.districtValue
            //   ? { district: filterData?.districtValue }
            //   : {}),
            // ...(filterData?.source ? { source: filterData?.source } : {}),
          },
        });

        const level_2_result: any = await axios.get(
          NEW_BODY_PARAMS_URL_LEVEL_1,
          {
            params: {
              ...(filterData?.countryValue
                ? { geo: filterData?.countryValue }
                : {}),
            },
          }
        );
        setNewParams(level_1_result?.data);
        setProvinceList(level_2_result?.data?.district);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [filterData.countryValue]);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold text-black"> Country </Label>
          <HelpHoverCard
            title={" Country "}
            content={` The country of chosen location that you'd like to analyze. `}
          />
        </div>
        <Combobox
          name="countryValue"
          label={"Country"}
          array={countries}
          state={{
            value: filterData.countryValue,
            setValue: handleChange,
          }}
        />
      </div>

      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold text-black">
            {" "}
            Province{" "}
          </Label>
          <HelpHoverCard
            title={" Province "}
            content={`  The specific province of the chosen country to be used for the
                analysis. `}
          />
        </div>
        <Combobox
          name="provinceValue"
          label={"Province"}
          array={[
            { value: "none", label: "None" },
            ...transformNewParamsObject(provinceList),
          ]}
          state={{
            value: filterData.provinceValue,
            setValue: handleChange,
          }}
        />
      </div>

      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold text-black">
            {" "}
            District{" "}
          </Label>
          <HelpHoverCard
            title={" District "}
            content={`  The specific district of the chosen country to be used for the
                analysis. `}
          />
        </div>
        <Combobox
          name="districtValue"
          label={"District"}
          array={[
            { value: "none", label: "None" },
            ...transformNewParamsObject(newParams?.district),
          ]}
          state={{
            value: filterData.districtValue,
            setValue: handleChange,
          }}
        />
      </div>

      <div className="">
        <div className="flex ">
          <Label className=" text-xs font-semibold text-black">
            Crop Calendar
          </Label>
          <HelpHoverCard
            title={" Crop Calendar"}
            content={` The specific crop you want to use for the current
              analysis. `}
          />
        </div>
        <Combobox
          name="cropValue"
          label={"Crop Calendar"}
          array={[
            { value: "customCalendar", label: "CUSTOM CALENDAR" },
            ...transformCropArray(params?.crop),
          ]}
          state={{
            value: filterData.cropValue,
            setValue: handleChange,
          }}
        />
      </div>
      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold text-black">
            Data Source{" "}
          </Label>
          <HelpHoverCard
            title={" Source "}
            content={` The source of dataset that you want to use for the current
              analysis. `}
          />

          <a
            className="text-green-600 text-xs font-semibold ml-2 text-decoration-line: underline"
            href={"http://203.156.108.67:1681/en/new-page"}
            target="_blank"
          >
            Dataset Guide
          </a>
        </div>
        <Combobox
          name="source"
          label={"Source"}
          array={[
            { value: "customDataset", label: "CUSTOM DATASET" },
            ...transformSourceObject(newParams?.source),
          ]}
          state={{
            value: filterData.source,
            setValue: handleChange,
          }}
        />
      </div>

      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold text-black">
            Analysis Timeline{" "}
          </Label>
          <HelpHoverCard
            title={" Analysis Timeline "}
            content={` The timeline of that you want to use for the current
              analysis. `}
          />
        </div>
        <Combobox
          name="analysisTimeline"
          label={"Cropping Timeline"}
          array={croppingTimeline}
          state={{
            value: filterData.analysisTimeline,
            setValue: handleChange,
          }}
        />
      </div>

      {filterData.source === "customDataset" && (
        <>
          <div>
            <div className="flex">
              <Label className=" text-xs font-semibold text-black">
                Upload CSV
              </Label>
              <HelpHoverCard
                title={" Custom Dataset "}
                content={` The custom dataset that you want to upload and use for the current
              analysis. You can upload CSV files only`}
              />
              <CustomDatasetGuide title="View Template Guide" />
            </div>
            <Input
              onChange={(e) => {
                handleChange("customDataset", e.target.files[0]);
              }}
              id="customDataset"
              type="file"
              accept=".csv"
              // value={fileName}
            />
          </div>
        </>
      )}

      {filterData.cropValue === "customCalendar" && (
        <>
          <div>
            <div className="flex">
              <Label className=" text-xs font-semibold text-black">
                Custom Calendar
              </Label>
              <HelpHoverCard
                title={" Custom Crop Calendar "}
                content={` The custom Crop Calendar that you want to upload and use for the current
              analysis. You can upload CSV files only`}
              />
              <CustomCalendarGuide title="View Template Guide" />
            </div>
            <Input
              onChange={(e) => {
                handleChange("customCalendar", e.target.files[0]);
              }}
              id="customCalendar"
              type="file"
              accept=".csv"
              // value={fileName}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CropToolsFilter;
