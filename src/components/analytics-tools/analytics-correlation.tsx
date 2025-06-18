import { useEffect, useState } from "react";
import Combobox from "../ui/combobox";
import {
  transformObject,
  isError,
  isFinished,
  isIdle,
  getAnalyticsToolType,
  cn,
} from "@/lib/utils";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import axios from "axios";
import {
  BASE_URL,
  ElNinoToolDataIndicators,
  IDLE_ANALYTICS_CHART_MESSAGE,
  monthsList,
  requestStatus,
  toolType,
} from "@/constants";
import { FilterProps } from "@/types";
import { quantum } from "ldrs";
quantum.register("l-quantum");
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import { FancyMultiSelect } from "../ui/multiselect";
import SubmitButton from "../submit-button";
import sampleCharts from "../../data/sample_charts.json";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";

const AnalyticsCorrelation = ({ filterData }: FilterProps) => {
  const [correlationFilter, setCorrelationFilter] = useState({
    correlationVariable: filterData?.dataVariable[0],
    chosenMonths: [],
  });
  const [correlationStatus, setCorrelationStatus] = useState<requestStatus>(
    requestStatus.idle
  );
  const [correlationChartData, setCorrelationChartData] = useState<any>({});
  const [selected, setSelected] = useState([]);

  const handleChange = (name: string, value: string) => {
    setCorrelationFilter((prev: any) => ({ ...prev, [name]: value }));
  };

  const climatePattern = getAnalyticsToolType(location.pathname);

  const verifyFilters = () => {
    return (
      (climatePattern !== toolType.mjo
        ? filterData.dataVariable.length > 0
        : true) &&
      filterData.source !== "" &&
      filterData.fromYear !== "" &&
      filterData.toYear !== "" &&
      filterData.districtValue !== "" &&
      filterData.countryValue !== ""
    );
  };

  useEffect(() => {
    if (verifyFilters()) {
      generateCorrelationMap();
    }
  }, []);

  const generateCorrelationMap = async () => {
    const requestBody = {
      indic:
        climatePattern !== toolType.mjo
          ? `${filterData.dataVariable.join(",")}`
          : `rainfall`,
      months: `${correlationFilter.chosenMonths.join(",")}`,
      area: [`${filterData.districtValue}`],
      crop: filterData.cropValue,
      start: `${filterData.fromYear}-01-01`,
      end: `${filterData.toYear}-01-01`,
      country: filterData.countryValue,
    };
    const formData = new FormData();
    Object.keys(requestBody)?.map((key) => {
      formData.append(key, requestBody[key]);
    });
    formData.append(
      `source`,
      filterData.source === "customDataset"
        ? filterData.customDataset
        : filterData.source
    );

    setCorrelationStatus(requestStatus.isLoading);
    setCorrelationChartData({});
    try {
      const correlationData = await axios.post(
        `${BASE_URL}/${climatePattern}correlation`,
        formData
      );
      setCorrelationChartData(correlationData.data);
      setCorrelationStatus(requestStatus.isFinished);
    } catch (error) {
      setCorrelationStatus(requestStatus.isError);
    }
  };

  return (
    <div className="relative rounded-lg">
      <div className="flex justify-center relative z-40">
        <div className="grid w-2/3 gap-4 lg:grid-cols-4 grid-cols-1 mb-1 mt-2">
          <div className="">
            <div className="flex ">
              <Label className="text-xs font-semibold">Data Variable</Label>
              <HelpHoverCard
                title={"Data Variable"}
                content={` The Data Variable you would like to compare against each El Niño category. `}
              />
            </div>
            <Combobox
              name="correlationVariable"
              label={"Data Variable"}
              array={
                climatePattern !== toolType.mjo
                  ? transformObject(ElNinoToolDataIndicators).filter((e) =>
                      filterData.dataVariable.includes(e.value)
                    )
                  : [{ value: "rainfall", label: "Rainfall" }]
              }
              state={{
                value: correlationFilter.correlationVariable,
                setValue: handleChange,
              }}
              height={31}
            />
          </div>

          <div className="col-span-2">
            <div className="flex">
              <Label className="text-xs font-semibold">Months</Label>
              <HelpHoverCard
                title={"Months"}
                content={`The month used to compare against the El Niño
              variable.`}
              />
            </div>
            <FancyMultiSelect
              name="chosenMonths"
              placeholder="Select multiple months"
              selected={selected}
              setSelected={setSelected}
              setState={handleChange}
              array={monthsList}
              orientation="horizontal"
              ScrollAreaHeight="180"
            />
          </div>
          <div className="lg:mt-[17px] ">
            <SubmitButton
              label={"Generate Correlation"}
              submitFunction={generateCorrelationMap}
              verifyFilters={
                correlationFilter.chosenMonths.length > 0 &&
                correlationFilter.correlationVariable !== "" &&
                isFinished(correlationStatus)
              }
              height={30}
            />
          </div>
        </div>
      </div>

      <div className="px-2">
        <div
          className={cn(
            "grid gap-4 grid-cols-1",
            climatePattern === toolType.mjo
              ? "md:grid-cols-3"
              : "md:grid-cols-4"
          )}
        >
          {isFinished(correlationStatus)
            ? correlationChartData[correlationFilter.correlationVariable]?.map(
                (chartData, index) => (
                  <div className="relative z-0">
                    <div key={index}>
                      <HighchartsReact
                        containerProps={{ style: { height: "250px" } }}
                        highcharts={Highcharts}
                        options={chartData.scatter}
                      />
                    </div>
                  </div>
                )
              )
            : (climatePattern === toolType.mjo ? [0, 1, 2] : [0, 1, 2, 3]).map(
                (i) => (
                  <div className="relative">
                    <div key={i}>
                      <HighchartsReact
                        containerProps={{ style: { height: "250px" } }}
                        highcharts={Highcharts}
                        options={sampleCharts?.scatter_chart[climatePattern]}
                      />
                    </div>

                    {!isFinished(correlationStatus) && (
                      <div className="absolute inset-0 flex justify-center items-center z-30 bg-white bg-opacity-70 ">
                        {isIdle(correlationStatus) ? (
                          <p className="text-xl font-bold text-green-800">
                            {IDLE_ANALYTICS_CHART_MESSAGE}
                          </p>
                        ) : isError(correlationStatus) ? (
                          <ErrorMessage />
                        ) : (
                          <Loading
                            animation={
                              <l-quantum
                                color="green"
                                // @ts-ignore
                                stroke={8}
                                size="50"
                              ></l-quantum>
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCorrelation;
