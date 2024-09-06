/* eslint-disable @typescript-eslint/no-explicit-any */

import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarComplete } from "./ui/calendar-complete";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export function DatePickerWithRange({
  name,
  date,
  setDate,
  label,
  min,
  max,
  disabledStatus,
}: any) {
  const [pickedDate, setPickedDate] = useState<DateRange>();
  useEffect(() => {
    setDate(name, pickedDate);
    console.log(pickedDate);
  }, [pickedDate]);

  const clearSelection = () => {
    setPickedDate({
      from: undefined,
      to: undefined,
    });
  };

  return (
    <div className={cn("grid gap-2")}>
      <div className="flex flex-col justify-start gap-2">
        <Label className="text-md font-semibold">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={disabledStatus}
              id="date"
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComplete
              initialFocus
              mode="range"
              captionLayout="dropdown-buttons"
              fromYear={2007}
              toYear={2023}
              min={min}
              max={max}
              defaultMonth={date?.from}
              selected={date}
              onSelect={setPickedDate}
              numberOfMonths={3}
              // footer={
              //   <>
              //     <p className="flex justify-center mt-10">
              //       Choose a between {min}-{max} days
              //     </p>
              //   </>
              // }
            />
            <div className="flex flex-col items-center gap-5 justify-center mt-2 mb-5">
              <p className="font-medium">
                Please scroll through the months and choose a date range between{" "}
                {min} - {max} days
              </p>
              <Button
                className="bg-yellow-300 text-gray-800 hover:bg-green-700 hover:text-white"
                onClick={clearSelection}
              >
                <Trash className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
