import { calculateLinearPredictiveValue, formatTitle } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CountUp from "react-countup";

const PredictiveCalculation = ({
  intercept,
  coefficient,
  std_error,
  variable,
}) => {
  const [predictedValue, setPredictedValue] = useState({
    min: "",
    max: "",
    input: "",
  });
  const [showPredictedValue, setShowPredictedValue] = useState(false);
  const [elNinoInput, setElNinoInput] = useState("");

  const predictLinearValue = () => {
    const value = calculateLinearPredictiveValue(
      elNinoInput,
      coefficient,
      intercept,
      std_error
    );
    setPredictedValue(value);
    setShowPredictedValue(true);
  };

  return (
    <div className="mb-16">
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="flex justify-center">
          <p className="text-2xl font-bold">Final Range Prediction</p>
        </div>
        <div className="mt-5 w-80">
          <label className="text-lg font-medium" htmlFor="rainfall">
            El Nino Intensity
          </label>
          <Input
            id="rainfall"
            type="number"
            onChange={(e) => setElNinoInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-80">
          <Button
            className="text-md mt-2 bg-green-800 text-white hover:text-gray-800 hover:bg-yellow-300"
            onClick={predictLinearValue}
          >
            Predict Range
          </Button>
        </div>
      </div>

      {showPredictedValue && (
        <>
          <div className="flex flex-col items-center justify-center mt-16">
            <p className="text-xl font-semibold">Final Predicted Range (mm)</p>
            <p className="text-8xl font-semibold mt-5">
              <CountUp
                start={parseFloat(predictedValue.min) - 50}
                duration={2}
                decimals={2}
                end={parseFloat(predictedValue.min)}
              />{" "}
              -{" "}
              <CountUp
                start={parseFloat(predictedValue.max) - 50}
                duration={2}
                decimals={2}
                end={parseFloat(predictedValue.max)}
              />
            </p>
            <p className="text-xl mt-16">
              This means when ElNino intensity is{" "}
              <span className="text-2xl font-semibold">
                {predictedValue.input}
              </span>
              , the range for {formatTitle(variable)} is predicted to be between{" "}
              <span className="text-2xl font-semibold">
                <CountUp
                  start={parseFloat(predictedValue.min) - 50}
                  duration={2}
                  decimals={2}
                  end={parseFloat(predictedValue.min)}
                />
              </span>
              {"mm "}
              and{" "}
              <span className="text-2xl font-semibold">
                <CountUp
                  start={parseFloat(predictedValue.max) - 50}
                  duration={2}
                  decimals={2}
                  end={parseFloat(predictedValue.max)}
                />
              </span>
              {"mm"}.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictiveCalculation;
