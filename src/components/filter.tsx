/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Combobox from "./ui/combobox";
import district from "@/data/district.json";
import metadata from "@/data/metadata.json";
import { transformObject, transformSourceObject } from "@/lib/utils";
import DatePicker from "./datepicker";
import { Button } from "./ui/button";
import axios from "axios";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import Leaflet from "./leaflet";

const Filter = () => {
  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [periodValue, setPeriodValue] = useState("");
  const [sourceValue, setSourceValue] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const [correlationVariable1, setCorrelationVariable1] = useState<any>(false);
  const [correlationVariable2, setCorrelationVariable2] = useState<any>(false);

  const [isTimeSeriesVisible, setIsTimeSeriesVisible] = useState<any>(false);
  const [isCorrelationDataVisible, setIsCorrelationDataVisible] =
    useState<any>(false);
  const [timeSeriesChartData, setTimeSeriesChartData] = useState<any>({});
  const [geoJsonData, setGeoJsonData] = useState<any>({});
  const [correlationChartData, setCorrelationChartData] = useState<any>({});
  const [regressionModelChartData, setRegressionModelChartData] = useState<any>(
    {}
  );

  useEffect(() => {
    const d = district
      .filter((e) => e.district_code.substring(0, 3) === countryValue)
      .slice(0, 15)
      .map((e) => ({ value: e.district_code, label: e.district_name }));
    setDistrictList(d);
  }, [countryValue]);

  const generateTimeSeries = async () => {
    setIsTimeSeriesVisible(false);
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/dynamic_charts",
        {
          // source: sourceValue,
          // // indic: indicatorValue,
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // country: countryValue,
          // // district: [districtValue],
          // start_date: startDate?.toISOString().slice(0, 10),
          // end_date: endDate?.toISOString().slice(0, 10),

          source: "ERA5",
          indic: "rainfall",
          period: "annual",
          district: "NPL_04",
          start: "2015-10-12",
          end: "2021-10-12",
        }
      );

      const geoJson = await axios.post(
        "http://203.156.108.67:1580/dynamic_map",
        {
          source: "ERA5",
          indic: "rainfall_deviation",
          period: "annual",
          district: "NPL_04,NPL_33",
          start: "2015-10-12",
          end: "2021-10-12",
        }
      );

      await setGeoJsonData(geoJson.data);
      setTimeSeriesChartData(response.data);
      setIsTimeSeriesVisible(true);
    } catch (error) {
      console.log(error);
    }
  };
  const generateCorrelationPlot = async () => {
    try {
      const correlationData = await axios.post(
        "http://203.156.108.67:1580/correlation_plot",
        {
          // source: sourceValue,
          // // indic: indicatorValue,
          // indic: "rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // country: countryValue,
          // district: [districtValue],
          // start_date: startDate?.toISOString().slice(0, 10),
          // end_date: endDate?.toISOString().slice(0, 10),

          source: "ERA5",
          indic: "rainfall,el_nino,normal_rainfall",
          period: "annual",
          district: "NPL_33",
          start: "2015-10-12",
          end: "2021-10-12",
        }
      );
      const regressionModelData = await axios.post(
        "http://203.156.108.67:1580/regression_analysis",
        {
          // source: sourceValue,
          // // indic: indicatorValue,
          // indic: "el_nino,rainfall",
          // period: "annual",
          // country: countryValue,
          // // district: [districtValue],
          // start_date: startDate?.toISOString().slice(0, 10),
          // end_date: endDate?.toISOString().slice(0, 10),

          source: "ERA5",
          indic: "rainfall,el_nino,normal_rainfall",
          period: "annual",
          district: "NPL_33",
          start: "2015-10-12",
          end: "2021-10-12",
        }
      );
      setRegressionModelChartData(regressionModelData.data);
      setCorrelationChartData(correlationData.data);
      setIsCorrelationDataVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10">
      {/* <div className="flex flex-row gap-5 m-5 justify-center"> */}
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
            open: periodOpen,
            setOpen: setPeriodOpen,
            value: periodValue,
            setValue: setPeriodValue,
          }}
        />
      </div>
      <div className="grid gap-4 mb-6 md:grid-cols-3 justify-center">
        <Combobox
          label={"Source"}
          array={transformSourceObject(metadata.source)}
          state={{
            value: sourceValue,
            setValue: setSourceValue,
          }}
        />
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label={"Start Date"}
        />
        <DatePicker date={endDate} setDate={setEndDate} label={"End Date"} />
      </div>
      <div className="grid gap-4 mt-10 md:grid-cols-3 justify-center">
        <div></div>
        <Button onClick={generateTimeSeries}>Start Analysis</Button>
      </div>

      {isTimeSeriesVisible && (
        <div className="mb-10">
          <div className="mt-10">
            <HighchartsReact
              highcharts={Highcharts}
              options={timeSeriesChartData}
            />

            <div>
              <p className="text-xl font-semibold flex justify-center my-8">
                India districts
              </p>
              <Leaflet data={geoJsonData} />
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <h1 className="text-xl font-semibold">
              View Correlation between two variables
            </h1>
          </div>
          <div className="grid gap-4 mt-5 md:grid-cols-3 justify-center">
            <Combobox
              label={"First Variable"}
              array={transformObject(metadata.indic)}
              state={{
                value: correlationVariable1,
                setValue: setCorrelationVariable1,
              }}
            />
            <Combobox
              label={"Second Variable"}
              array={transformObject(metadata.indic)}
              state={{
                value: correlationVariable2,
                setValue: setCorrelationVariable2,
              }}
            />
            <Button className="mt-8" onClick={generateCorrelationPlot}>
              Analyze Correlation
            </Button>
          </div>
        </div>
      )}

      {isCorrelationDataVisible && (
        <div className="mt-10">
          <HighchartsReact
            highcharts={Highcharts}
            options={correlationChartData}
          />
          <div className="mt-10">
            <HighchartsReact
              highcharts={Highcharts}
              options={regressionModelChartData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
