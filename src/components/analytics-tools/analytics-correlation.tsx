import { useEffect, useState } from "react";
import Combobox from "../ui/combobox";
import {
  transformObject,
  formatDate,
  isLoading,
  isError,
  isFinished,
  getAllDistrictsOfCountry,
  isIdle,
} from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import axios from "axios";
import {
  analysisType,
  BASE_URL,
  ElNinoToolDataIndicators,
  IDLE_ANALYTICS_CHART_MESSAGE,
  monthsList,
  requestStatus,
} from "@/constants";
import { CorrelationFilterData, FilterProps } from "@/types";
import { quantum } from "ldrs";
import CorrelationPlotLegend from "../correlation-plot-legend";
quantum.register("l-quantum");
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@radix-ui/react-dropdown-menu";
import HelpHoverCard from "../help-hover-card";
import { FancyMultiSelect } from "../ui/multiselect";
import SubmitButton from "../submit-button";
import sampleCharts from "../../data/sample_charts.json";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";

const AnalyticsCorrelation = ({
  filterData,
  params,
  typeOfAnalysis,
}: FilterProps) => {
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

  const verifyFilters = () => {
    return (
      filterData.dataVariable.length > 0 &&
      filterData.source !== "" &&
      filterData.fromYear !== "" &&
      filterData.toYear !== "" &&
      filterData.districtValue !== "" &&
      filterData.countryValue !== ""
    );
  };

  useEffect(() => {
    console.log(verifyFilters());

    if (verifyFilters()) {
      generateCorrelationMap();
    }
  }, []);

  const generateCorrelationMap = async () => {
    const requestBody = {
      indic: `${filterData.dataVariable.join(",")}`,
      months: `${correlationFilter.chosenMonths.join(",")}`,
      area: [`${filterData.districtValue}`],
      crop: filterData.cropValue,
      start: `${filterData.fromYear}-01-01`,
      end: `${filterData.toYear}-01-01`,
      country: filterData.countryValue,
    };
    const formData = new FormData();
    Object.keys(requestBody).map((key) => {
      formData.append(key, requestBody[key]);
    });
    formData.append(
      `source`,
      filterData.source === "customDataset" ? filterData.customDataset : `ERA5`
    );

    setCorrelationStatus(requestStatus.isLoading);
    setCorrelationChartData({});
    try {
      const correlationData = await axios.post(
        `${BASE_URL}/el_nino_correlation`,
        typeOfAnalysis === analysisType.climate
          ? {
              source: "ERA5",
              indic: `${filterData.dataVariable.join(",")}`,
              period: filterData.periodValue,
              district: filterData.districtValue,
              start: `${filterData.fromYear}-01-01`,
              end: `${filterData.toYear}-01-01`,
            }
          : formData
      );
      setCorrelationChartData(correlationData.data);
      setCorrelationStatus(requestStatus.isFinished);
    } catch (error) {
      setCorrelationStatus(requestStatus.isError);
    }
  };

  return (
    <div className=" rounded-lg">
      <div className="flex justify-center">
        <div className="grid w-2/3 gap-4 lg:grid-cols-4 grid-cols-1 mb-1 mt-2">
          <div className="">
            <div className="flex ">
              <Label className="text-xs font-semibold">Data Variable</Label>
              <HelpHoverCard
                title={"Data Variable"}
                content={` The Data Variable you would like to compare against each El Nino category. `}
              />
            </div>
            <Combobox
              name="correlationVariable"
              label={"Data Variable"}
              array={transformObject(ElNinoToolDataIndicators)}
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
                content={`The month used to compare against the El Nino
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
              ScrollAreaHeight="200"
              orientation="horizontal"
            />
          </div>
          <div className="lg:mt-[17px] ">
            <SubmitButton
              label={"Generate Correlation"}
              submitFunction={generateCorrelationMap}
              verifyFilters={correlationFilter.chosenMonths.length > 0}
              height={30}
            />
          </div>
        </div>
      </div>

      <div className="px-2">
        <div className="grid gap-4 md:grid-cols-4 grid-cols-1 ">
          {isFinished(correlationStatus)
            ? correlationChartData[correlationFilter.correlationVariable].map(
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
            : [0, 1, 2, 3].map((i) => (
                <div className="relative">
                  <div key={i}>
                    <HighchartsReact
                      containerProps={{ style: { height: "250px" } }}
                      highcharts={Highcharts}
                      options={sampleCharts.scatter_chart}
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
              ))}
        </div>

        {/* <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex justify-center text-md gap-2 text-green-700">
              Correlation Plot
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 my-8 md:grid-cols-4 grid-cols-1 justify-center">
                {correlationChartData[
                  correlationFilter.correlationVariable
                ].map((chartData, index) => (
                  <div key={index}>
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={chartData.plot}
                    />
                  </div>
                ))}
                <CorrelationPlotLegend />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
      </div>
    </div>
  );
};

export default AnalyticsCorrelation;
