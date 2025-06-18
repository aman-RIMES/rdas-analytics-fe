/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";
import MenuButton from "./menu-button";

export function Sidebar() {
  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 my-1 bg-green-800 rounded-lg p-5 h-screen shadow-md">
        <div className="pl-3 py-2 max-w-80 text-white">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight ">
            Analytics
          </h2>
          <div className="space-y-1">
            <MenuButton
              url={"/elnino-analytics"}
              icon={
                <Icons.climate_behaviors className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"El Niño and Local Climate"}
            />
            <MenuButton
              url={"/lanina-analytics"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"La Niña and Local Climate"}
            />
            <MenuButton
              url={"/analytics-crop"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"Crop Calendar Suitability to Observed Climate"}
            />
            <MenuButton
              url={"/analytics-land"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"Land Use & Land Cover Change"}
            />
          </div>
        </div>
        <div className="pl-3 py-2 max-w-80 text-white">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Predictive Tools
          </h2>
          <div className="space-y-1">
            <MenuButton
              url={"/predictive-tools"}
              icon={
                <Icons.climate_and_crops className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"El Niño Impacts Prediction"}
            />
            <MenuButton
              url={"/lanina-predictive-tools"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"La Niña Impacts Prediction"}
            />
            <MenuButton
              url={"/predictive-temps"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"TempS"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
