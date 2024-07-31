/* eslint-disable @typescript-eslint/no-explicit-any */
import PredictiveToolsFilter from "./predictive-tools-filter";

const PredictiveTools = () => {
  return (
    <>
      <div className="flex flex-col text-center items-center justify-center gap-3 mb-7">
        <h1 className="text-3xl">
          El Nino, Climate and Agriculture production
        </h1>
        <h1 className="text-2xl">Predictive Tools</h1>
      </div>

      <div className="my-10 border rounded-lg">
        <PredictiveToolsFilter />
      </div>
    </>
  );
};

export default PredictiveTools;
