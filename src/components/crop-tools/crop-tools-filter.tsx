import { useEffect } from "react";
import { countries, croppingTimeline } from "@/constants";
import {
  transformCropArray,
  transformDistrictParams,
  transformObject,
  transformSourceObject,
} from "@/lib/utils";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { District, FilterProps } from "@/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";

const CropToolsFilter = ({ params, filterData, handleChange }: FilterProps) => {
  useEffect(() => {
    const districtsData = params?.district.filter(
      (e: District) => e.country === filterData.countryValue
    );
    handleChange("districtList", districtsData);
  }, [filterData.countryValue]);

  return (
    <div className="flex flex-col gap-2">
      <div className="mt-2">
        <div className="flex ">
          <Label className=" text-sm font-semibold text-black">Crop </Label>
          <HelpHoverCard
            title={" Crop "}
            content={` The specific crop you want to use for the current
              analysis. `}
          />
        </div>
        <Combobox
          name="cropValue"
          label={"Crop"}
          array={transformCropArray(params?.crop)}
          state={{
            value: filterData.cropValue,
            setValue: handleChange,
          }}
        />
      </div>
      <div>
        <div className="flex ">
          <Label className=" text-sm font-semibold text-black">
            Data Source{" "}
          </Label>
          <HelpHoverCard
            title={" Source "}
            content={` The source of dataset that you want to use for the current
              analysis. `}
          />
        </div>
        <Combobox
          name="source"
          label={"Source"}
          array={[
            { value: "customDataset", label: "CUSTOM DATASET" },
            ...transformSourceObject(params?.source),
          ]}
          state={{
            value: filterData.source,
            setValue: handleChange,
          }}
        />
      </div>
      {filterData.source === "customDataset" && (
        <>
          <div>
            <div className="flex ">
              <Label className=" text-sm font-semibold text-black">
                Upload CSV
              </Label>
              <HelpHoverCard
                title={" Custom Dataset "}
                content={` The custom dataset that you want to upload and use for the current
              analysis. You can upload CSV files only`}
              />
              <a
                className="text-green-600 text-xs font-semibold text-black"
                href={"src/data/rdas_monthly_template.csv"}
                download
              >
                Download Template
              </a>
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

      <div>
        <div className="flex ">
          <Label className=" text-sm font-semibold text-black">
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
      <div>
        <div className="flex ">
          <Label className=" text-sm font-semibold text-black"> Country </Label>
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
          <Label className=" text-sm font-semibold text-black">
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
          array={transformDistrictParams(filterData?.districtList)}
          state={{
            value: filterData.districtValue,
            setValue: handleChange,
          }}
        />
      </div>
    </div>
  );
};

export default CropToolsFilter;
