import { useEffect } from "react";
import {
  countries,
  ElNinoToolDataIndicators,
  ElNinoVariables,
  elNinoYearsList,
} from "@/constants";
import {
  containsCropAnalysis,
  transformObject,
  transformSourceObject,
} from "@/lib/utils";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { District, FilterProps } from "@/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-dropdown-menu";
import { FancyMultiSelect } from "../ui/multiselect";
import { Input } from "../ui/input";

const ElNinoCommonFilter = ({
  params,
  filterData,
  handleChange,
  selected,
  setSelected,
  filterType,
}: FilterProps) => {
  useEffect(() => {
    const districtsData = params?.district.filter(
      (e: District) => e.country === filterData.countryValue
    );
    handleChange("districtList", districtsData);
  }, [filterData.countryValue]);

  return (
    <div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center shadow-md shadow-gray-300 rounded-lg">
        <div className="flex flex-col  p-3 ">
          <div className="col-span-2">
            <div className="flex gap-2">
              <Label className="mb-2 font-semibold">Data</Label>
              <HelpHoverCard
                title={"Data"}
                content={`Data used to compare against an El Nino
              variable.`}
              />
            </div>
            <FancyMultiSelect
              name="dataVariable"
              selected={selected}
              setSelected={setSelected}
              setState={handleChange}
              array={transformObject(ElNinoToolDataIndicators).filter(
                (e) => !filterData.dataVariable?.includes(e.value)
              )}
            />
          </div>

          {containsCropAnalysis(filterData.dataVariable) && (
            <div className="mt-2">
              <div className="flex gap-2 ">
                <Label className="mb-2 font-semibold">Crop </Label>
                <HelpHoverCard
                  title={" Crop "}
                  content={` The specific crop you want to use for the current
              analysis. `}
                />
              </div>
              <Combobox
                name="cropValue"
                label={"Crop"}
                array={transformObject(params?.crop)}
                state={{
                  value: filterData.cropValue,
                  setValue: handleChange,
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col  p-3">
          <div>
            <div className="flex gap-2 ">
              <Label className="mb-2 font-semibold">Data Source </Label>
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
                { value: "customDataset", label: "Custom Dataset" },
                ...transformSourceObject(params?.source),
              ]}
              state={{
                value: filterData.source,
                setValue: handleChange,
              }}
            />
          </div>

          {filterData.source === "customDataset" && (
            <div className="mt-3">
              <div className="flex gap-2 ">
                <Label className="mb-2 font-semibold">Custom Dataset</Label>
                <HelpHoverCard
                  title={" Custom Dataset "}
                  content={` The custom dataset that you want to upload and use for the current
              analysis. `}
                />
              </div>
              <Input
                onChange={(e) => {}}
                id="picture"
                type="file"
                // value={fileName}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        <div>
          <div className="grid gap-4 md:grid-cols-2 grid-cols-1 justify-center">
            <div>
              <div className="flex gap-2 ">
                <Label className="mb-2 font-semibold"> From Year </Label>
                <HelpHoverCard
                  title={" From Year "}
                  content={` The beginning year for your analysis timeframe `}
                />
              </div>
              <Combobox
                name="fromYear"
                label={"Year"}
                array={elNinoYearsList().filter(
                  (e) => parseInt(e.value) + 30 < new Date().getFullYear()
                )}
                state={{
                  value: filterData.fromYear,
                  setValue: handleChange,
                }}
              />
            </div>

            <div>
              <div className="flex gap-2 ">
                <Label className="mb-2 font-semibold"> To Year </Label>
                <HelpHoverCard
                  title={" To Year "}
                  content={` The ending year for your analysis timeframe `}
                />
              </div>
              <Combobox
                name="toYear"
                label={"Year"}
                array={elNinoYearsList().filter(
                  (e) => parseInt(e.value) - parseInt(filterData.fromYear) >= 30
                )}
                state={{
                  value: filterData.toYear,
                  setValue: handleChange,
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1  mt-1">
            <InfoCircledIcon className="h-4 w-4" />
            <p className="text-sm">
              Please choose a minimum of 30 years timeframe.
            </p>
          </div>
        </div>

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
            array={countries}
            state={{
              value: filterData.countryValue,
              setValue: handleChange,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        {filterType === "predictive" && (
          <div>
            <div className="flex gap-2 ">
              <Label className="mb-2 font-semibold">
                Predictive model type
              </Label>
              <HelpHoverCard
                title={" Predictive model type"}
                content={` The model type you would like to generate for the prediction (Linear or Logistic). `}
              />
            </div>
            <Combobox
              name="modelType"
              label={"Predictive model"}
              array={[
                { value: "linear", label: "Linear" },
                { value: "logistic", label: "Logistic" },
              ]}
              state={{
                value: filterData.modelType,
                setValue: handleChange,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ElNinoCommonFilter;
