/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import district from "@/data/district.json";
import metadata from "@/data/metadata.json";
import { transformObject, transformSourceObject } from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { FancyMultiSelect } from "./ui/multiselect";

const PredictiveToolsFilter = ({
  setIsCorrelationVisible,
  setIsRegressionVisible,
  setCorrelationPlot,
  setRegressionModel,
}: any) => {
  const [primaryIndicator, setPrimaryIndicator] = useState("");
  const [primaryIndicatorSource, setPrimaryIndicatorSource] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [indicatorsSource, setIndicatorsSource] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [periodValue, setPeriodValue] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  useEffect(() => {
    const d = district
      .filter((e) => e.district_code.substring(0, 3) === countryValue)
      .slice(0, 15)
      .map((e) => ({ value: e.district_code, label: e.district_name }));
    setDistrictList(d);
  }, [countryValue]);

  const generateCorrelationPlot = async () => {
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/correlation_plot",
        {
          // source: sourceValue,
          // indic: indicatorValue,
          indic: "rainfall,crop_production,el_nino,normal_rainfall",
          period: "annual",
          // country: countryValue,
          // district: [districtValue],
          // start_date: startDate?.toISOString().slice(0, 10),
          // end_date: endDate?.toISOString().slice(0, 10),
        }
      );
      setCorrelationPlot(response.data);
      setIsCorrelationVisible(true);
    } catch (error) {
      console.log(error);
    }
  };
  const generateRegressionModel = async () => {
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/prediction_model",
        {
          // source: sourceValue,
          // indic: indicatorValue,
          indic: "crop_production,rainfall,el_nino,normal_rainfall",
          period: "annual",
          //   country: countryValue,
          //   district: [districtValue],
          //   start_date: startDate?.toISOString().slice(0, 10),
          //   end_date: endDate?.toISOString().slice(0, 10),
        }
      );
      await setRegressionModel(response.data);
      await setIsRegressionVisible(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-10">
      <div className="grid gap-4 mb-6 md:grid-cols-2 justify-center">
        <div className="flex flex-col gap-5 justify-center border rounded-lg p-5">
          <Combobox
            label={"Primary Indicator"}
            array={transformObject(metadata.indic)}
            state={{
              value: primaryIndicator,
              setValue: setPrimaryIndicator,
            }}
          />
          <Combobox
            label={"Primary Indicator Source"}
            array={transformSourceObject(metadata.source)}
            state={{
              value: primaryIndicatorSource,
              setValue: setPrimaryIndicatorSource,
            }}
          />
        </div>
        <div className="flex flex-col gap-5 justify-center border rounded-lg p-5">
          <div>
            <Label className="mb-2.5">Indicators</Label>
            <FancyMultiSelect
              setIndicators={setIndicators}
              array={transformObject(metadata.indic)}
            />
          </div>
          <Combobox
            label={"Indicators Source"}
            array={transformSourceObject(metadata.source)}
            state={{
              value: indicatorsSource,
              setValue: setIndicatorsSource,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-6 md:grid-cols-3 justify-center">
        <Combobox
          label={"Country"}
          array={transformObject(metadata.country)}
          state={{
            value: countryValue,
            setValue: setCountryValue,
          }}
        />
        <Combobox
          label={"District"}
          array={districtList}
          state={{
            value: districtValue,
            setValue: setDistrictValue,
          }}
        />
        <Combobox
          label={"Period"}
          array={transformObject(metadata.period)}
          state={{
            value: periodValue,
            setValue: setPeriodValue,
          }}
        />
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 justify-center">
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label={"Start Date"}
        />
        <DatePicker date={endDate} setDate={setEndDate} label={"End Date"} />
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-2 justify-center mt-10">
        <Button className="w-full" onClick={generateCorrelationPlot}>
          Generate Correlation Plot
        </Button>
        <Button className="w-full" onClick={generateRegressionModel}>
          Generate Regression model
        </Button>
      </div>
    </div>
  );
};

export default PredictiveToolsFilter;
