import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Icons } from "./ui/icons";

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 my-5">
        <div className="pl-3 py-2 max-w-80">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight ">
            Climate, Agriculture and Adaptation Measures
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/analyze/1")}
            >
              <div className="flex items-center">
                <Icons.climate_behaviors />
                Climate Analytics
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/analyze/2")}
            >
              <div className="flex items-center">
                <Icons.report className="w-5 h-5 mr-2 text-gray-800 dark:text-white" />
                Climate Prediction Tools
              </div>
            </Button>
          </div>
        </div>
        <div className="pl-3 py-2 max-w-80">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            El Nino, Climate and Agriculture production
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/analyze/3")}
            >
              <Icons.climate_and_crops className="w-5 h-5 mr-2" />
              El Nino Analytics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/predictive-tools/")}
            >
              <Icons.report className="w-5 h-5 mr-2 text-gray-800 dark:text-white" />
              El Nino Predictive Tools
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/gdd-predictive-tools/")}
            >
              <Icons.report className="w-5 h-5 mr-2 text-gray-800 dark:text-white" />
              GDD Predictive Tool
            </Button>
          </div>
        </div>
        <div className="pl-3 py-2 max-w-80">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Climate Variability and Transport Vehicular Accidents
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/analyze/5")}
            >
              <Icons.accidents className="w-5 h-5 mr-2" />
              Transport Analytics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/analyze/6")}
            >
              <Icons.report className="w-5 h-5 mr-2 text-gray-800 dark:text-white" />
              Transport Predictive Tools
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
