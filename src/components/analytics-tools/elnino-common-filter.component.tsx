import { useEffect, useState } from "react";
import {
  countries,
  CROP_PARAMS_URL,
  ElNinoToolDataIndicators,
  elNinoYearsList,
  monthsList,
  NEW_BODY_PARAMS_URL,
} from "@/constants";
import {
  containsCropAnalysis,
  isIdle,
  transformDistrictParams,
  transformMultiNewParamsObject,
  transformNewParamsObject,
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
import CustomDatasetGuide from "../custom-dataset-guide";
import newBodyParams from "../../data/new_body_params.json";
import axios from "axios";
import MultipleDatasetsDialog from "../multiple-datasets-dialog";

const ElNinoCommonFilter = ({
  filterData,
  handleChange,
  selected,
  setSelected,
  filterType,
}: FilterProps) => {
  const [newParams, setNewParams] = useState<any>(newBodyParams);
  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response: any = await axios.get(NEW_BODY_PARAMS_URL, {
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

        setNewParams(response?.data);
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
          array={transformNewParamsObject(newParams?.district)}
          state={{
            value: filterData.districtValue,
            setValue: handleChange,
          }}
        />
      </div>

      {location.pathname !== "/analytics-mjo" && (
        <div>
          <div className="flex">
            <Label className=" text-xs font-semibold">Data</Label>
            <HelpHoverCard
              title={"Data"}
              content={`Data used to compare against an El Niño
              variable.`}
            />
          </div>
          <FancyMultiSelect
            name="dataVariable"
            selected={selected}
            setSelected={setSelected}
            setState={handleChange}
            array={transformMultiNewParamsObject(newParams?.indic).filter(
              (e) =>
                !filterData.dataVariable?.includes(e.value) &&
                e.value !== "sfcWind" &&
                e.value !== "rsds" &&
                e.value !== "sfcWindDir" &&
                e.value !== "hurs"
            )}
            ScrollAreaHeight={22}
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
            { value: "multipleSources", label: "SELECT MULTIPLE SOURCES" },
          ]}
          state={{
            value: filterData.source,
            setValue: handleChange,
          }}
        />
      </div>

      {filterData.source === "multipleSources" && (
        <MultipleDatasetsDialog
          newParams={newParams}
          filterData={filterData}
          handleChange={handleChange}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex ">
            <Label className=" text-xs font-semibold"> From Year </Label>
            <HelpHoverCard
              title={" From Year "}
              content={` The beginning year for your analysis timeframe `}
            />
          </div>
          <Combobox
            name="fromYear"
            label={"Year"}
            array={elNinoYearsList(
              location.pathname === "/analytics-mjo" ? 1974 : 1950
            ).filter((e) => parseInt(e.value) + 30 < new Date().getFullYear())}
            state={{
              value: filterData.fromYear,
              setValue: handleChange,
            }}
          />
        </div>

        <div>
          <div className="flex gap-1 ">
            <Label className=" text-xs font-semibold"> To Year </Label>
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

      {filterType === "predictive" && (
        <div>
          <div className="flex">
            <Label className=" text-xs font-semibold">Months</Label>
            <HelpHoverCard
              title={"Months"}
              content={`The months used to compare against the data
              variables.`}
            />
          </div>
          <FancyMultiSelect
            name="months"
            placeholder="Select Months"
            selected={selectedMonths}
            setSelected={setSelectedMonths}
            setState={handleChange}
            array={monthsList}
            ScrollAreaHeight={180}
            orientation="horizontal"
          />
        </div>
      )}
      {filterType === "predictive" && (
        <div>
          <div className="flex ">
            <Label className=" text-xs font-semibold">Event Status</Label>
            <HelpHoverCard
              title={" Event Status"}
              content={` The current status of the event you want to predict. `}
            />
          </div>
          <Combobox
            name="eventStatus"
            label={"Event Status"}
            array={[
              { value: "persisting", label: "Persisting" },
              { value: "upcoming", label: "Upcoming" },
            ]}
            state={{
              value: filterData.eventStatus,
              setValue: handleChange,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ElNinoCommonFilter;
