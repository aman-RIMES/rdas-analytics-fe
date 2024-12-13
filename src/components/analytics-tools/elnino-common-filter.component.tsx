import { useEffect, useState } from "react";
import {
  countries,
  ElNinoToolDataIndicators,
  elNinoYearsList,
  monthsList,
} from "@/constants";
import {
  containsCropAnalysis,
  isIdle,
  transformDistrictParams,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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
  const [selectedMonths, setSelectedMonths] = useState([]);

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
          array={transformDistrictParams(filterData?.districtList)}
          state={{
            value: filterData.districtValue,
            setValue: handleChange,
          }}
        />
      </div>
      <div>
        <div className="flex">
          <Label className=" text-xs font-semibold">Data</Label>
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
          ScrollAreaHeight={22}
        />
      </div>
      {containsCropAnalysis(filterData.dataVariable) && (
        <div className="mt-2">
          <div className="flex ">
            <Label className=" text-xs font-semibold">Crop </Label>
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
      <div>
        <div className="flex ">
          <Label className=" text-xs font-semibold">Data Source </Label>
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

      {/* TODO: Delete if not needed */}
      {/* <div className="flex items-center gap-1  mt-1">
        <InfoCircledIcon className="h-4 w-4" />
        <p className="text-sm">
          Please choose a minimum of 30 years timeframe.
        </p>
      </div> */}

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

              <Dialog>
                <DialogTrigger className="ml-1">
                  <p className="text-green-600 text-xs font-semibold text-decoration-line: underline">
                    View Template Guide
                  </p>
                </DialogTrigger>
                <DialogContent className="lg:w-[40%]">
                  <DialogHeader>
                    <DialogDescription>
                      <div>
                        <p className="mt-5 text-base">
                          Use the following template to upload your dataset. The
                          dataset should consist of the year & month, the
                          average rainfall, and the average temperature.
                        </p>
                        <br />

                        <p className="text-black text-base">
                          Make sure that your CSV file strictly follows the
                          exact layout shown on the template to make sure the
                          data is analyzed properly. You can download a sample
                          CSV template below.
                        </p>

                        <div className="flex flex-col items-center justify-center m-10 mb-5 ">
                          <img src={"src/assets/guide.png"} alt="" />
                          <a
                            className="text-white text-lg font-semibold bg-green-800 py-1 px-5 rounded-md mt-10"
                            href={"src/data/rdas_monthly_template.csv"}
                            download
                          >
                            Download Template
                          </a>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
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
      {/* <div className="grid gap-4 mb-6 md:grid-cols-2 grid-cols-1 justify-center">
        {filterType === "predictive" && (
          <div>
            <div className="flex ">
              <Label className=" text-xs font-semibold">
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
      </div> */}
    </div>
  );
};

export default ElNinoCommonFilter;
