import { mapDataType } from "@/constants";
import { cn } from "@/lib/utils";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import React from "react";

const MapLegend = ({ mapType }) => {
  const normal_entries = [4800, 4200, 3600, 3000, 2400, 1800, 1200, 600, 0];
  const anomaly_entries = [
    900, 600, 300, 0, -300, -600, -900, -1200, -1500, -1800,
  ];
  return (
    <div className="flex flex-col items-center justify-center p-3">
      {mapType === mapDataType.normal ? (
        <div className="h-3 w-full bg-gradient-to-r from-green-700 to-green-100 to-80% rounded-3xl"></div>
      ) : (
        <div className="h-3 w-full bg-gradient-to-r from-green-200 via-white to-red-700 via-30%  rounded-3xl"></div>
      )}
      <div className="flex flex-row justify-between w-full p-1 mt-">
        {mapType === mapDataType.normal
          ? normal_entries.map((e) => (
              <div
                key={e}
                className="flex flex-col justify-center items-center"
              >
                <DividerVerticalIcon />
                <p className="text-xs lg:text-xs 2xl:text:3xs">{e}</p>
              </div>
            ))
          : anomaly_entries.map((e) => (
              <div
                key={e}
                className="flex flex-col justify-center items-center"
              >
                <DividerVerticalIcon />
                <p className="text-xs lg:text-xs 2xl:text:3xs">{e}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default MapLegend;
