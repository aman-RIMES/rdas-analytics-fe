import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { HelpCircle } from "lucide-react";

interface HoverCardProps {
  title: string;
  content: string;
}

const HelpHoverCard = ({ title, content }: HoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <HelpCircle className="h-4 w-4 mt-1" />
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col">
        <div className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span className="text-md font-semibold">{title}</span>
        </div>
        <p className="text-sm  mt-2">{content}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HelpHoverCard;
