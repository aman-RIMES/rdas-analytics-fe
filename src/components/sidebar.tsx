/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";
import MenuButton from "./menu-button";

export function Sidebar() {
  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 my-5 bg-green-800 rounded-lg p-5 h-screen shadow-md">
        <div className="pl-3 py-2 max-w-80 text-white">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight ">
            Climate & Agriculture
          </h2>
          <div className="space-y-1">
            <MenuButton
              url={"/analyze/1"}
              icon={
                <Icons.climate_behaviors className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"Climate Analytics"}
            />
            <MenuButton
              url={"/analyze/2"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"Climate Predictive Tools"}
            />
          </div>
        </div>
        <div className="pl-3 py-2 max-w-80 text-white">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            El Nino
          </h2>
          <div className="space-y-1">
            <MenuButton
              url={"/analyze/3"}
              icon={
                <Icons.climate_and_crops className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"El Nino Analytics"}
            />
            <MenuButton
              url={"/predictive-tools"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"El Nino Predictive Tools"}
            />
            <MenuButton
              url={"/gdd-predictive-tools"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"GDD Predictive Tool"}
            />
          </div>
        </div>
        <div className="pl-3 py-2 max-w-80 text-white">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Transport
          </h2>
          <div className="space-y-1">
            <MenuButton
              url={"/analyze/5"}
              icon={
                <Icons.accidents className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"Transport Analytics"}
            />
            <MenuButton
              url={"/analyze/6"}
              icon={
                <Icons.report className="w-7 h-7 mr-2 bg-yellow-500 text-gray-800 rounded-sm p-1" />
              }
              title={"Transport Predictive Tools"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
