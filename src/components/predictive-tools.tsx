/* eslint-disable @typescript-eslint/no-explicit-any */
import Highcharts from "highcharts/highmaps";
import HighchartsReact from "highcharts-react-official";
import PredictiveToolsFilter from "./predictive-tools-filter";
import { useState } from "react";

const PredictiveTools = () => {
  const [regressionModel, setRegressionModel] = useState<any>({});
  const [isRegressionVisible, setIsRegressionVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 mb-7">
        <h1 className="text-3xl">
          El Nino, Climate and Agriculture production
        </h1>
        <h1 className="text-2xl">Predictive Tools</h1>
      </div>

      <div className="mt-10 border rounded-lg">
        <PredictiveToolsFilter
          setIsRegressionVisible={setIsRegressionVisible}
          setRegressionModel={setRegressionModel}
        />
        <div className="mb-10 px-5 flex flex-col gap-7">
          {isRegressionVisible && (
            <HighchartsReact
              highcharts={Highcharts}
              options={regressionModel?.chart}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PredictiveTools;
