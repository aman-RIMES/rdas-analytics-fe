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
                Climate Dynamic Graphs
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/analyze/2")}
            >
              <div className="flex items-center">
                <Icons.climate_and_water />
                Climate Correlation Coefficient
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
              <svg
                className="w-5 h-5 mr-2 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 3v4c0 .6-.4 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z"
                />
              </svg>
              Agriculture Dynamic Graphs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/analyze/4")}
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6a7.5 7.5 0 1 0 8 8h-8V6Z"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.5 3H13v8h8v-.5A7.5 7.5 0 0 0 13.5 3Z"
                />
              </svg>
              Agriculture Correlation Coefficient
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
              <svg
                className="w-5 h-5 mr-2 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 3v4c0 .6-.4 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z"
                />
              </svg>
              Transport dynamic graphs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/analyze/6")}
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6a7.5 7.5 0 1 0 8 8h-8V6Z"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.5 3H13v8h8v-.5A7.5 7.5 0 0 0 13.5 3Z"
                />
              </svg>
              Transport Correlation Coefficient
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
