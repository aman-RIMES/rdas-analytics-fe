import { calculateLinearPredictiveValue, formatTitle } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const PredictiveCalculation = ({
  regressionModelData,
  persistentVariables,
  linearPredictionInputFieldValues,
  setLinearPredictionInputFieldValues,
}: any) => {
  const [predictedValue, setPredictedValue] = useState("");
  const [showPredictedValue, setShowPredictedValue] = useState(false);

  const handlePredictiveValueChange = (index: number, event: any) => {
    const values = [...linearPredictionInputFieldValues];
    values[index].value = event?.target?.value;
    setLinearPredictionInputFieldValues(values);
  };

  const predictLinearValue = () => {
    const value = calculateLinearPredictiveValue(
      linearPredictionInputFieldValues,
      regressionModelData.coefficients,
      regressionModelData.intercept
    );
    setPredictedValue(value.toString());
    setShowPredictedValue(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="flex flex-row mt-10 gap-5">
          {persistentVariables.map((element: any, index: any) => (
            <div key={element}>
              <label className="text-lg font-medium" htmlFor="rainfall">
                {formatTitle(element) + " value"}
              </label>
              <Input
                className="mt-2"
                id="rainfall"
                type="number"
                onChange={(event) => handlePredictiveValueChange(index, event)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col w-80">
          <Button className="text-lg mt-2" onClick={predictLinearValue}>
            Predict Value
          </Button>
        </div>
      </div>

      {showPredictedValue && (
        <>
          <div className="flex flex-col items-center justify-center mt-20 mb-20">
            <p className="text-lg">Predicted Value</p>
            <p className="text-8xl font-semibold mt-5">
              {parseInt(predictedValue).toFixed(2)}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default PredictiveCalculation;
