import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Icons } from "./ui/icons";

export function OldSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Climate
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Icons.climate_behaviors />
                Climate Behaviors
              </div>
            </Button>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="w-full">
                <Button variant="ghost" className="w-full justify-between">
                  <div className="flex items-center">
                    <Icons.climate_and_crops />
                    Climate and Crops
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-9 p-0 flex just"
                  >
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                    <span className="sr-only">Toggle</span>
                  </Button>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Button
                  onClick={() => navigate("/dashboard/climate-variability")}
                  variant={
                    location.pathname.startsWith(
                      "/dashboard/climate-variability"
                    )
                      ? "secondary"
                      : "ghost"
                  }
                  className="pl-10 w-full justify-start"
                >
                  Climate variability and crops
                </Button>
                <Button
                  onClick={() => navigate("/dashboard/enso-and-crops")}
                  variant={
                    location.pathname.startsWith("/dashboard/enso-and-crops")
                      ? "secondary"
                      : "ghost"
                  }
                  className="pl-10 w-full justify-start"
                >
                  ENSO and crops
                </Button>
              </CollapsibleContent>
            </Collapsible>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-2"
              >
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
              </svg>
              Climate and Livestock
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Icons.climate_and_water />
                Climate and Water
              </div>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Agriculture
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
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
              Crops
            </Button>
            <Button variant="ghost" className="w-full justify-start">
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
              Livestock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
