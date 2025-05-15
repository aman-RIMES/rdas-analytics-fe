import { useEffect, useState } from "react";
import {
  countries,
  CROP_PARAMS_URL,
  elNinoYearsList,
  filterType,
  gddYearsList,
  NEW_BODY_PARAMS_URL,
  NEW_BODY_PARAMS_URL_LEVEL_1,
} from "@/constants";
import {
  transformGDDCropArray,
  transformNewParamsObject,
  transformSourceObject,
} from "@/lib/utils";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { FilterProps } from "@/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";
import CustomDatasetGuide from "../custom-dataset-guide";
import newBodyParams from "../../data/new_body_params.json";
import axios from "axios";

const GddToolsFilter = ({
  filterData,
  toolType,
  handleChange,
}: FilterProps) => {
  const [newParams, setNewParams] = useState<any>(newBodyParams);
  const [provinceList, setProvinceList] = useState<any>({});
  const [cropParams, setCropParams] = useState<any>(null);

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

        const crop_results: any = await axios.get(CROP_PARAMS_URL, {});
        setNewParams(level_1_result?.data);
        setProvinceList(level_2_result?.data?.district);
        setCropParams(crop_results?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [filterData.countryValue]);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold"> Country </Label>
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
            { value: "", label: "NONE" },
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
          <Label className=" text-xs font-semibold"> District </Label>
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
            { value: "", label: "NONE" },
            ...transformNewParamsObject(newParams?.district),
          ]}
          state={{
            value: filterData.districtValue,
            setValue: handleChange,
          }}
        />
      </div>

      {toolType === filterType.gdd && (
        <div className="">
          <div className="flex ">
            <Label className=" text-xs font-semibold text-black">Crop</Label>
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
              ...(cropParams
                ? transformGDDCropArray(cropParams?.crop_gdd)
                : []),
              // { value: "customCalendar", label: "CUSTOM CALENDAR" },
            ]}
            state={{
              value: filterData.cropValue,
              setValue: handleChange,
            }}
          />
        </div>
      )}

      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold">Data Source </Label>
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
            ...transformSourceObject(newParams?.source),
            { value: "customDataset", label: "CUSTOM DATASET" },
          ]}
          state={{
            value: filterData.source,
            setValue: handleChange,
          }}
        />
      </div>

      <div>
        <div>
          <div className="flex gap-1 ">
            <Label className=" text-xs font-semibold">Year </Label>
            <HelpHoverCard
              title={" To Year "}
              content={` The ending year for your analysis timeframe `}
            />
          </div>
          <Combobox
            name="yearValue"
            label={"Year"}
            array={
              toolType === filterType.gdd ? gddYearsList() : elNinoYearsList()
            }
            state={{
              value: filterData.yearValue,
              setValue: handleChange,
            }}
          />
        </div>
      </div>

      {filterData.source === "customDataset" && (
        <>
          <div>
            <div className="flex ">
              <Label className=" text-xs font-semibold">Upload CSV</Label>
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
    </div>
  );
};

export default GddToolsFilter;
