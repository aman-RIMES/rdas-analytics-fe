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
import { analysisTopics2, menus } from "@/constants";

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className={cn("pb-12")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Climate
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
              Agriculture Dynamic Graphs
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
              Agriculture Correlation Coefficient
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Transport
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
              Transport Dynamic Graphs
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
              Transport Correlation Coefficient
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
