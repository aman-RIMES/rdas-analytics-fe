import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import sampleCharts from "../../data/sample_charts.json";
import { isError, isIdle, isLoading } from "@/lib/utils";
import ErrorMessage from "../ui/error-message";
import Loading from "../ui/loading";
import { IDLE_PREDICTIVE_CHART_MESSAGE } from "@/constants";

const PredictiveChart = ({
  predictiveEvaluation,
  regressionModelStatus,
  chartNumber,
  climatePattern,
}) => {
  return (
    <div className="relative z-0 h-[100%] bg-white flex flex-col flex-grow shadow-lg rounded-lg">
      <div className="p-6 bg-white ">
        <HighchartsReact
          highcharts={Highcharts}
          options={
            predictiveEvaluation?.charts
              ? predictiveEvaluation?.charts[chartNumber]
              : sampleCharts?.scatter_chart[climatePattern]
          }
          containerProps={{ style: { height: "100%" } }}
        />
      </div>
      {(isIdle(regressionModelStatus) ||
        isLoading(regressionModelStatus) ||
        isError(regressionModelStatus)) && (
        <div className=" flex flex-col flex-grow">
          <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-70 ">
            {isIdle(regressionModelStatus) ? (
              <p className="text-xl font-bold text-green-800">
                {IDLE_PREDICTIVE_CHART_MESSAGE}
              </p>
            ) : isError(regressionModelStatus) ? (
              <ErrorMessage
                errorMessage={`Failed to generate model. This could be due to missing data for
              the chosen months. Try changing your filters/months and start the
              prediction again.`}
              />
            ) : (
              <Loading
                animation={<l-helix color="green" size="50"></l-helix>}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveChart;
