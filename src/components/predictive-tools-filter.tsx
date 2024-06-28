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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import { Input } from "./ui/input";

const PredictiveToolsFilter = ({
  setIsRegressionVisible,
  setRegressionModel,
}: any) => {
  const [primaryIndicator, setPrimaryIndicator] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [indicatorsSource, setIndicatorsSource] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [districtList, setDistrictList] = useState([{}]);
  const [countryValue, setCountryValue] = useState("");
  const [periodValue, setPeriodValue] = useState("");
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const [modelType, setModelType] = useState("");
  const [correlationMatrixData, setCorrelationMatrixData] = useState();
  const [showDescription, setShowDescription] = useState(false);
  const [showPredictiveValue, setShowPredictiveValue] = useState(false);

  useEffect(() => {
    const d = district
      .filter((e) => e.district_code.substring(0, 3) === countryValue)
      .slice(0, 15)
      .map((e) => ({ value: e.district_code, label: e.district_name }));
    setDistrictList(d);
  }, [countryValue]);

  const generateRegressionModel = async () => {
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/prediction_model",
        {
          // // source: sourceValue,
          // // indic: indicatorValue,
          // indic: "crop_production,rainfall,el_nino,normal_rainfall",
          // period: "annual",
          // //   country: countryValue,
          // //   district: [districtValue],
          // //   start_date: startDate?.toISOString().slice(0, 10),
          // //   end_date: endDate?.toISOString().slice(0, 10),

          source: "ERA5",
          indic: "rainfall,normal_rainfall",
          period: "annual",
          district: "NPL_33",
          start: "2015-10-12",
          end: "2021-10-12",
          model: "linear",
          indic_0: "el_nino",
        }
      );
      await setRegressionModel(response.data);
      await setIsRegressionVisible(true);
      await setShowPredictiveValue(true);
    } catch (error) {
      console.log(error);
    }
  };

  const generateDescriptionAnalysis = async () => {
    try {
      const response = await axios.post(
        "http://203.156.108.67:1580/description_analysis",
        {
          source: "ERA5",
          indic: "rainfall,normal_rainfall",
          period: "annual",
          district: "NPL_33",
          start: "2015-10-12",
          end: "2021-10-12",
          model: "linear",
          indic_0: "el_nino",
        }
      );
      console.log(response.data.correlation_matrix);

      await setCorrelationMatrixData(response.data.correlation_matrix);
      setShowDescription(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-10">
      <div className="grid gap-4 mb-6 md:grid-cols-2 justify-center">
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          label={"Start Date"}
        />
        <DatePicker date={endDate} setDate={setEndDate} label={"End Date"} />
        <Combobox
          label={"Dependent Variable"}
          array={transformObject(metadata.indic)}
          state={{
            value: primaryIndicator,
            setValue: setPrimaryIndicator,
          }}
        />
        <div>
          <Label className="mb-2.5 font-semibold">Independent Variables</Label>
          <FancyMultiSelect
            setState={setIndicators}
            array={transformObject(metadata.indic)}
          />
        </div>
        <Combobox
          label={"Source"}
          array={transformSourceObject(metadata.source)}
          state={{
            value: indicatorsSource,
            setValue: setIndicatorsSource,
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
      </div>
      <div className="grid gap-4 md:grid-cols-3 justify-center mt-10">
        <div></div>
        <Button className="w-full mt-10" onClick={generateDescriptionAnalysis}>
          Start Descriptive Analysis
        </Button>
      </div>

      {showDescription && (
        <>
          <div className="grid gap-4 md:grid-cols-2 items-center mt-20">
            <div className="flex flex-col">
              <p className="text-xl font-medium mb-5 ml-5">Head</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-black font-medium">
                      Values
                    </TableHead>
                    <TableHead className="text-black text-lg font-medium">
                      2015
                    </TableHead>
                    <TableHead className="text-black text-lg font-medium">
                      2016
                    </TableHead>
                    <TableHead className="text-black text-lg font-medium">
                      2017
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-black text-lg">
                      Rainfall
                    </TableCell>
                    <TableCell className="text-black text-lg ">
                      1054.41
                    </TableCell>
                    <TableCell className="text-black text-lg ">
                      1408.55
                    </TableCell>
                    <TableCell className="text-black text-lg ">
                      1547.23
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-black text-lg">
                      El Nino
                    </TableCell>
                    <TableCell className="text-black text-lg ">2.6</TableCell>
                    <TableCell className="text-black text-lg ">2.6</TableCell>
                    <TableCell className="text-black text-lg ">0.3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-black text-lg">
                      Normal Rainfall
                    </TableCell>
                    <TableCell className="text-black text-lg ">
                      1544.62
                    </TableCell>
                    <TableCell className="text-black text-lg ">
                      1544.62
                    </TableCell>
                    <TableCell className="text-black text-lg ">
                      1544.62
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-4 md:grid-cols-2 justify-center mt-10">
              <div>
                <p className="text-xl mt-7 flex justify-center font-medium">
                  Missing Values
                </p>
                <div className="grid gap-4 md:grid-cols-2 justify-center mt-5">
                  <p className="flex text-lg  justify-end">Rainfall:</p>
                  <p className="flex text-lg  justify-start">0</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 justify-center mt-5">
                  <p className="flex text-lg  justify-end">El Nino:</p>
                  <p className="flex text-lg  justify-start">0</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 justify-center mt-5">
                  <p className="flex text-lg  justify-end">Normal Rainfall:</p>
                  <p className="flex text-lg  justify-start">0</p>
                </div>
              </div>
              <div>
                <p className="text-xl mt-7 flex justify-center font-medium">
                  Data Types
                </p>
                <div className="grid gap-4 md:grid-cols-2 justify-center mt-5">
                  <p className="flex text-lg justify-end">Rainfall:</p>
                  <p className="flex text-lg justify-start">float64</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 justify-center mt-5">
                  <p className="flex text-lg justify-end">El Nino:</p>
                  <p className="flex text-lg justify-start">float64</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 justify-center mt-5">
                  <p className="flex text-lg justify-end">Normal Rainfall:</p>
                  <p className="flex text-lg justify-start">float64</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-10">
            <p className="text-xl font-medium mb-10">Statistics</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-lg text-black font-medium">
                    Values
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    count
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    mean
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    std
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    min
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    25%
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    50%
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    75%
                  </TableHead>
                  <TableHead className="text-black text-lg font-medium">
                    max
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-black text-lg font-medium">
                    Rainfall
                  </TableCell>
                  <TableCell className="text-lg">9.0,</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                  <TableCell className="text-lg">304.11</TableCell>
                  <TableCell className="text-lg">1054.41</TableCell>
                  <TableCell className="text-lg">1408.55</TableCell>
                  <TableCell className="text-lg">1547.27</TableCell>
                  <TableCell className="text-lg">1704.35</TableCell>
                  <TableCell className="text-lg">2067.24</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-lg font-medium">El Nino</TableCell>
                  <TableCell className="text-lg">9.0</TableCell>
                  <TableCell className="text-lg">0.86</TableCell>
                  <TableCell className="text-lg">1.07</TableCell>
                  <TableCell className="text-lg">-0.4</TableCell>
                  <TableCell className="text-lg">0.3</TableCell>
                  <TableCell className="text-lg">0.7</TableCell>
                  <TableCell className="text-lg">0.9</TableCell>
                  <TableCell className="text-lg">2.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-lg font-medium">
                    Normal Rainfall
                  </TableCell>
                  <TableCell className="text-lg">9.0</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                  <TableCell className="text-lg">0.0</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                  <TableCell className="text-lg">1544.62</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="mt-20">
            <HighchartsReact
              highcharts={Highcharts}
              options={correlationMatrixData}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-4 items-center justify-center mt-40">
            <div className="text-lg font-medium">
              <Combobox
                label={"Predictive model"}
                array={[
                  { value: "linear", label: "Linear" },
                  { value: "logistic", label: "Logistic" },
                ]}
                state={{
                  value: modelType,
                  setValue: setModelType,
                }}
              />
            </div>
            <div>
              <label className="text-lg font-medium" htmlFor="rainfall">
                Rainfall Value
              </label>
              <Input className="mt-2" id="rainfall" type="number" />
            </div>
            <div>
              <label className="text-lg font-medium" htmlFor="rainfall">
                Normal Rainfall Value
              </label>
              <Input className="mt-2" id="rainfall" type="number" />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-medium">Submit</label>
              <Button
                className="text-lg mt-2"
                onClick={generateRegressionModel}
              >
                Generate Linear Regression
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 12 and 7
       0.04906 */}

      {showPredictiveValue && (
        <>
          <div className="flex flex-col items-center justify-center mt-20 mb-20">
            <p className="text-lg">Predicited Value</p>
            <p className="text-8xl font-semibold mt-5">0.04906</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictiveToolsFilter;
