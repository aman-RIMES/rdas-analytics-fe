import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

const SubmitButton = ({ verifyFilters, submitFunction }: any) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="w-full flex justify-center">
        <Button
          className="md:w-1/3 w-full bg-yellow-300 text-gray-800 hover:text-white hover:bg-green-800"
          disabled={!verifyFilters}
          onClick={submitFunction}
        >
          Start Analysis
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
