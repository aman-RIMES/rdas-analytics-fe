import { DividerVerticalIcon } from "@radix-ui/react-icons";
import React from "react";

const MapLegend = () => {
  const entries = [
    4200, 3500, 2800, 2100, 1400, 700, 0, -200, -400, -600, -800, -1000, -1200,
  ];
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="h-3 w-full bg-gradient-to-r from-green-500 via-white to-red-400 rounded-3xl"></div>
      <div className="flex flex-row justify-between w-full p-1 mt-">
        {entries.map((e) => (
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
