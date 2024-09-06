import { useEffect } from "react";
import { countries, ElNinoVariables, elNinoYearsList } from "@/constants";
import { transformObject, transformSourceObject } from "@/lib/utils";
import HelpHoverCard from "../help-hover-card";
import Combobox from "../ui/combobox";
import { District, FilterProps } from "@/types";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@radix-ui/react-dropdown-menu";

const ElNinoCommonFilter = ({
  params,
  filterData,
  handleChange,
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
      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold">Climate Variable</Label>
            <HelpHoverCard
              title={"Climate Variable"}
              content={`A single climate variable used to compare against an El Nino
              variable.`}
            />
          </div>
          <Combobox
            name="dependentVariable"
            label={"Climate Variable"}
            array={transformObject(ElNinoVariables).filter(
              (e) => e.value !== "el_nino"
            )}
            state={{
              value: filterData.dependentVariable,
              setValue: handleChange,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold">El Nino Variable</Label>
            <HelpHoverCard
              title={"El Nino Variable"}
              content={`A single variable used to compare against the climate variable.`}
            />
          </div>
          <Combobox
            name="elNinoVariable"
            label={"El Nino Variable"}
            array={transformObject(ElNinoVariables).filter(
              (e) => e.value === "el_nino"
            )}
            state={{
              value: filterData.elNinoVariable,
              setValue: handleChange,
            }}
          />
        </div>

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
            <Label className="mb-2 font-semibold"> Source </Label>
            <HelpHoverCard
              title={" Source "}
              content={` The source of dataset that you want to use for the current
              analysis. `}
            />
          </div>
          <Combobox
            name="source"
            label={"Source"}
            array={transformSourceObject(params?.source)}
            state={{
              value: filterData.source,
              setValue: handleChange,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
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
