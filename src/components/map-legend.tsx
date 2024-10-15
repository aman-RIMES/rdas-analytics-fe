import { mapDataType } from "@/constants";
import { cn } from "@/lib/utils";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import React from "react";

const MapLegend = ({ mapType, variable }) => {
  const normal_rainfall_increments = [
    4800, 4200, 3600, 3000, 2400, 1800, 1200, 600, 0,
  ];
  const anomaly_rainfall_increments = [
    900, 600, 300, 0, -300, -600, -900, -1200, -1500, -1800,
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
    <div className="flex flex-col items-center justify-center p-3">
      {mapType === mapDataType.normal ? (
        <div
          className={cn(
            variable === "rainfall"
              ? "from-green-700 to-green-100"
              : "from-emerald-500 via-white to-amber-600",
            "h-3 w-full bg-gradient-to-r rounded-3xl"
          )}
        ></div>
      ) : (
        <div
          className={cn(
            variable === "rainfall"
              ? "from-green-200 via-white to-red-700 via-30%"
              : "from-emerald-200 via-white to-amber-200",
            "h-3 w-full bg-gradient-to-r rounded-3xl"
          )}
        ></div>
      )}
      <div className="flex flex-row justify-between w-full p-1 mt-">
        {legend_increments().map((e) => (
          <div key={e} className="flex flex-col justify-center items-center">
            <DividerVerticalIcon />
            <p className="text-xs lg:text-xs 2xl:text:3xs">{e}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
