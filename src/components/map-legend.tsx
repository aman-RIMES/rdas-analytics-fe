import { mapDataType, toolType } from "@/constants";
import { cn, getAnalyticsToolType } from "@/lib/utils";
import { DividerVerticalIcon } from "@radix-ui/react-icons";

const MapLegend = ({ mapType, variable }) => {
  const climatePattern = getAnalyticsToolType(location.pathname);

  const increments = {
    normal: {
      rainfall: [0, 150, 300, 450, 600, 750, 900, 1050, 1200],
      tavg: [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50],
      mjo: [0, 3, 6, 9, 12, 15, 18, 21, 24],
    },
    anomaly: {
      rainfall: [-600, -450, -300, -150, 0, 150, 300, 450, 600],
      tavg: [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15],
      mjo: [-200, -160, -120, -80, -40, 0, 40, 80, 120, 160, 200],
    },
  };

  let legend_increments: any = () =>
    climatePattern === toolType.mjo
      ? increments[mapType].mjo
      : increments[mapType][variable];

  return (
    <div className="flex flex-col items-center justify-center px-2 mt-2">
      {mapType === mapDataType.normal ? (
        <div
          className={cn(
            variable === "rainfall"
              ? "from-green-100 to-green-700"
              : "from-blue-500 via-gray-200 to-amber-600",
            "h-2 w-full bg-gradient-to-r rounded-3xl"
          )}
        ></div>
      ) : (
        <div
          className={cn(
            variable === "rainfall"
              ? "from-red-700 via-gray-200 to-green-700"
              : "from-blue-500 via-gray-200 to-amber-600",
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
