import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { BODY_PARAMS_URL, countries } from "@/constants";
import {
  transformObject,
  transformSourceObject,
  transformDistrictParams,
} from "@/lib/utils";
import { DatePickerWithRange } from "@/components/date-range-picker";
import HelpHoverCard from "@/components/help-hover-card";
import Combobox from "@/components/ui/combobox";
import { FancyMultiSelect } from "@/components/ui/multiselect";
import bodyParams from "@/data/body_params.json";
import { District, FilterData, FilterProps } from "@/types";
import axios from "axios";

const ClimateCommonFilter = ({
  params,
  filterData,
  handleChange,
  selected,
  setSelected,
  filterType,
}: FilterProps) => {
  const [districtList, setDistrictList] = useState([{}]);

  useEffect(() => {
    const districtsData = params.district.filter(
      (e: District) => e.country === filterData.countryValue
    );
    setDistrictList(districtsData);
  }, [filterData.countryValue]);

  return (
    // <div className="sm:p-10 p-4">
    <div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold">Dependent Variable</Label>
            <HelpHoverCard
              title={"Dependent Variable"}
              content={`A single climate variable used to compare against other climate
              variables.`}
            />
          </div>
          <Combobox
            name="dependentVariable"
            label={"Dependent Variable"}
            array={transformObject(params?.indic).filter(
              (e) =>
                e.value !== "rainfall_deviation" &&
                e.value !== "el_nino" &&
                !filterData.independentVariables?.includes(e.value)
            )}
            state={{
              value: filterData.dependentVariable,
              setValue: handleChange,
            }}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold">Independent Variables</Label>
            <HelpHoverCard
              title={"Independent Variables"}
              content={`One or more climate variables that will be compared against
                  the Dependent variable.`}
            />
          </div>
          <FancyMultiSelect
            name="independentVariables"
            selected={selected}
            setSelected={setSelected}
            setState={handleChange}
            array={transformObject(params?.indic).filter(
              (e) =>
                e.value !== filterData.dependentVariable &&
                e.value !== "rainfall_deviation" &&
                !filterData.independentVariables?.includes(e.value)
            )}
          />
        </div>

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
            date={filterData.dateRange}
            setDate={handleChange}
            min={0}
            max={0}
          />
        </div>

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> Period </Label>
            <HelpHoverCard
              title={" Period "}
              content={` The period between each date that you want to analyze. `}
            />
          </div>

          <Combobox
            name="periodValue"
            label={"Period"}
            array={transformObject(params?.period)}
            state={{
              value: filterData.periodValue,
              setValue: handleChange,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
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

        <div>
          <div className="flex gap-2 ">
            <Label className="mb-2 font-semibold"> District </Label>
            <HelpHoverCard
              title={" District "}
              content={`  The specific district of the chosen country to be used for the
              analysis. `}
            />
          </div>
          <Combobox
            name="districtValue"
            label={"District"}
            array={transformDistrictParams(districtList)}
            state={{
              value: filterData.districtValue,
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

export default ClimateCommonFilter;
