import { useEffect, useState } from "react";
import Combobox from "../ui/combobox";
import {
  transformObject,
  formatDate,
  isLoading,
  isError,
  isFinished,
  getAllDistrictsOfCountry,
} from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import axios from "axios";
import {
  analysisType,
  ElNinoToolDataIndicators,
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

const AnalyticsCorrelation = ({
  filterData,
  params,
  typeOfAnalysis,
}: FilterProps) => {
  const [correlationFilter, setCorrelationFilter] = useState({
    correlationVariable: filterData?.dataVariable[0],
    chosenMonths: [],
  });
  const [correlationStatus, setCorrelationStatus] = useState<requestStatus>();
  const [correlationChartData, setCorrelationChartData] = useState<any>({});
  const [selected, setSelected] = useState([]);

  const handleChange = (name: string, value: string) => {
    setCorrelationFilter((prev: any) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    generateCorrelationMap();
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
        "http://203.156.108.67:1580/el_nino_correlation",
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
    <div className="sm:p-10 p-4 mt-10 rounded-lg bg-gray-50 shadow-lg">
      <div className="flex justify-center mb-10">
        <h1 className="text-xl font-semibold">
          Correlation between Data Variables and El Nino
        </h1>
      </div>

      <div className="flex justify-center">
        <div className="grid w-2/3 gap-4 my-8 xl:grid-cols-2 grid-cols-1">
          <div className="">
            <div className="flex gap-2 ">
              <Label className="mb-2 font-semibold">Data Variable</Label>
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
            />
          </div>

          <div className="">
            <div className="flex gap-2">
              <Label className="mb-2 font-semibold">Months</Label>
              <HelpHoverCard
                title={"Months"}
                content={`The month used to compare against the El Nino
              variable.`}
              />
            </div>
            <FancyMultiSelect
              name="chosenMonths"
              selected={selected}
              setSelected={setSelected}
              setState={handleChange}
              array={monthsList}
              ScrollAreaHeight={180}
            />
          </div>
        </div>
      </div>
      <div className="md:mt-5 w-full">
        <SubmitButton
          label={"Generate Correlation Data"}
          submitFunction={generateCorrelationMap}
          verifyFilters={correlationFilter.chosenMonths.length > 0}
        />
      </div>

      {isLoading(correlationStatus) && (
        <div className="my-20  flex justify-center bg-transparent">
          <div className="flex items-center justify-center gap-8 lg:w-2/4 border-lime-700 border rounded-xl p-5">
            {/* @ts-ignore */}
            <l-quantum color="green" size="35"></l-quantum>
            <p className="text-2xl text-lime-700 font-medium">
              Generating Correlation Data
            </p>
          </div>
        </div>
      )}

      {isError(correlationStatus) && (
        <div className="flex justify-center mt-10">
          <Alert className="lg:w-3/4" variant="destructive">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertTitle className="text-lg">API Error !</AlertTitle>
            <AlertDescription className="text-md">
              Failed to generate the Correlation Data. This could be due to
              missing datasets. Try changing your filters and start the analysis
              again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {isFinished(correlationStatus) && (
        <div className="mt-10">
          <div className="grid gap-4 my-8 md:grid-cols-2 grid-cols-1 justify-center">
            {correlationChartData[correlationFilter.correlationVariable].map(
              (chartData, index) => (
                <div key={index}>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartData.scatter}
                  />
                </div>
                //   {/* <div>
                //     <HighchartsReact
                //       highcharts={Highcharts}
                //       options={chartData.plot}
                //     />
                //   </div> */}
                // // </div>
              )
            )}
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex justify-center text-md gap-2 text-green-700">
                Correlation Plot
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 my-8 md:grid-cols-2 grid-cols-1 justify-center">
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
                </div>

                <CorrelationPlotLegend />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCorrelation;
