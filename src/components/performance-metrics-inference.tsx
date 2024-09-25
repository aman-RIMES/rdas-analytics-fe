import React from "react";

const PerformanceMetricsInference = () => {
  return (
    <>
      <div className="p-5 shadow-md rounded-lg">
        <p className="text-lg text-center font-bold font-serif mb-5">
          MSE Interpretation
        </p>
        <ul className="">
          <li className="text-lg font-serif">
            &#8226; Lower MSE indicates that the model&#39;s predictions are
            closer to the actual values, meaning the model is performing well.
          </li>
          <li className="text-lg font-serif">
            &#8226; Higher MSE suggests that there is a larger discrepancy
            between the predicted values and the actual values, indicating the
            model may not be capturing the underlying patterns in the data
            effectively
          </li>
        </ul>
      </div>
      <div className="p-5 shadow-md rounded-lg mt-10">
        <p className="text-lg text-center font-bold font-serif mb-5">
          R2 Interpretation
        </p>

        <p className="font-serif text-lg font-semibold">Range of Values</p>
        <ul className="">
          <li className="text-lg font-serif">
            &#8226; R 2 ranges from 0 to 1.
          </li>
          <li className="text-lg font-serif">
            &#8226; R 2 =0: The model does not explain any of the variability in
            the dependent variable. This could mean the model is completely
            inaccurate.
          </li>
          <li className="text-lg font-serif">
            &#8226; R 2 =1: The model explains all of the variability in the
            dependent variable, meaning the model perfectly predicts the
            outcomes.
          </li>
        </ul>

        <p className="font-serif text-lg font-semibold mt-5">Interpretation</p>
        <ul className="">
          <li className="text-lg font-serif">
            &#8226; R 2 = 0.5: This indicates that 50% of the variability in the
            dependent variable can be explained by the model. The other 50% is
            due to factors not accounted for in the model.
          </li>
          <li className="text-lg font-serif">
            &#8226; Higher R 2 : A higher R 2 value means the model is better at
            explaining the variability in the data, but it doesn&#39;t
            necessarily mean the model is the best choice or that it predicts
            accurately outside the data range.
          </li>
          <li className="text-lg font-serif">
            &#8226; Lower R 2 : A lower R 2 suggests that the model does not
            explain much of the variability in the dependent variable. This
            could indicate a poor fit or that other factors not included in the
            model are influencing the dependent variable.
          </li>
        </ul>
      </div>
    </>
  );
};

export default PerformanceMetricsInference;
