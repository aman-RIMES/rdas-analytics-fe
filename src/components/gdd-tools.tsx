/* eslint-disable @typescript-eslint/no-explicit-any */
import GDDToolsFilter from "./gdd-tools-filter";

const GDDPredictiveTools = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 mb-7">
        <h1 className="text-3xl">
          El Nino, Climate and Agriculture production
        </h1>
        <h1 className="text-2xl">GDD Predictive Tool</h1>
      </div>

      <div className="mt-10 border rounded-lg">
        <GDDToolsFilter />
        <div className="mb-10 px-5 flex flex-col gap-7">
          {/* {isRegressionVisible && (
            <HighchartsReact
              highcharts={Highcharts}
              options={regressionModel?.chart}
            />
          )} */}
        </div>
      </div>
    </>
  );
};

export default GDDPredictiveTools;
