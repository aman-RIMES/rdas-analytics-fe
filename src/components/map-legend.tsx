import { mapDataType } from "@/constants";
import { cn } from "@/lib/utils";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import React from "react";

const MapLegend = ({ mapType, variable }) => {
  const normal_rainfall_increments = [
    -1200, -900, -600, -300, 0, 300, 600, 900, 1200,
  ];
  const anomaly_rainfall_increments = [
    -600, -450, -300, -150, 0, 150, 300, 450, 600,
  ];
  const normal_temperature_increments = [
    -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50,
  ];
  const anomaly_temperature_increments = [
    -15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15,
  ];

  let legend_increments: any = () => {
    if (mapType === mapDataType.normal) {
      return variable === "rainfall"
        ? normal_rainfall_increments
        : normal_temperature_increments;
    } else {
      return variable === "rainfall"
        ? anomaly_rainfall_increments
        : anomaly_temperature_increments;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center px-2 mt-2">
      {mapType === mapDataType.normal ? (
        <div
          className={cn(
            variable === "rainfall"
              ? "from-red-700 via-gray-200 to-green-700"
              : "from-blue-500 via-gray-200 to-amber-700",
            "h-2 w-full bg-gradient-to-r rounded-3xl"
          )}
        ></div>
      ) : (
        <div
          className={cn(
            variable === "rainfall"
              ? "from-red-700 via-gray-200 to-green-700"
              : "from-blue-500 via-gray-200 to-amber-700",
            "h-2 w-full bg-gradient-to-r rounded-3xl"
          )}
        ></div>
      )}
      <div className="flex flex-row justify-between w-full p-1">
        {legend_increments().map((e) => (
          <div key={e} className="flex flex-col justify-center items-center">
            <DividerVerticalIcon />
            <p className="text-2xs lg:text-xs 2xl:text:3xs">{e}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
