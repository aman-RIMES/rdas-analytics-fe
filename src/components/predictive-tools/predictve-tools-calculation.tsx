import { calculateLinearPredictiveValue } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const PredictiveCalculation = ({ regressionModelData }: any) => {
  const [predictedValue, setPredictedValue] = useState("");
  const [showPredictedValue, setShowPredictedValue] = useState(false);
  const [elNinoCoefficient, setElNinoCoefficient] = useState("");

  const predictLinearValue = () => {
    const value = calculateLinearPredictiveValue(
      [elNinoCoefficient],
      regressionModelData.coefficients,
      regressionModelData.intercept
    );
    setPredictedValue(value.toFixed(4));
    setShowPredictedValue(true);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="flex justify-center">
          <h1 className="text-xl font-bold">Final Value Prediction</h1>
        </div>
        <div className="flex flex-row mt-5 gap-5">
          <div>
            <label className="text-lg font-medium" htmlFor="rainfall">
              El Nino Coefficient
            </label>
            <Input
              className="mt-2"
              id="rainfall"
              type="number"
              onChange={(e) => setElNinoCoefficient(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col w-80">
          <Button
            className="text-md mt-2 bg-green-800 text-white hover:text-gray-800 hover:bg-yellow-300"
            onClick={predictLinearValue}
          >
            Predict Value
          </Button>
        </div>
      </div>

      {showPredictedValue && (
        <>
          <div className="flex flex-col items-center justify-center mt-20 mb-20">
            <p className="text-lg">Final Predicted Value</p>
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
