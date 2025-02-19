import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { requestStatus } from "@/constants";
import { cn, isLoading } from "@/lib/utils";

const SubmitButton = ({
  verifyFilters,
  submitFunction,
  loadingStatus = requestStatus.idle,
  label = "Start Analysis",
  height = 40,
  className,
}: any) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="w-full flex justify-center">
        <Button
          className={cn(
            `h-[${height}px]`,
            "w-full bg-[#0B6623] text-white hover:text-gray-800 hover:bg-yellow-300",
            className
          )}
          disabled={!verifyFilters || isLoading(loadingStatus)}
          // disabled={!verifyFilters}
          onClick={submitFunction}
        >
          {label}
        </Button>
      </HoverCardTrigger>
      {!verifyFilters && (
        <HoverCardContent className="flex flex-col">
          <div className="flex items-center gap-1">
            <AlertCircle className="h-5 w-5" />
            <span className="text-md font-semibold">Invalid Input!</span>
          </div>
          <p className="text-md">Make sure you've filled every field above.</p>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default SubmitButton;
