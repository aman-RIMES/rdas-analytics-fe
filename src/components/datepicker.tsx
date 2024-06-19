/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarComplete } from "./ui/calendar-complete";
import { Label } from "./ui/label";

export function DatePicker({ date, setDate, label }: any) {
  return (
    <div className="flex flex-col justify-start gap-2">
      <Label className="text-md font-semibold">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComplete
            initialFocus
            mode="single"
            captionLayout="dropdown-buttons" //Also: dropdown | buttons
            // fromYear={1960}
            // toYear={2023}
            // fromMonth={new Date("2022,10")}
            // toMonth={new Date("2022,12")}
            // fromDate={new Date("2022,10,10")}
            // toDate={new Date("2022,11,11")}
            selected={date}
            onSelect={setDate}
            showOutsideDays={false}
            // numberOfMonths={2}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
