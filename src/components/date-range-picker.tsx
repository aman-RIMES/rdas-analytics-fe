/* eslint-disable @typescript-eslint/no-explicit-any */

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

export function DatePickerWithRange({ date, setDate, label, min, max }: any) {
  return (
    <div className={cn("grid gap-2")}>
      <div className="flex flex-col justify-start gap-2">
        <Label className="text-md font-semibold">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
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
              onSelect={setDate}
              numberOfMonths={2}
              // footer={
              //   <>
              //     <p className="flex justify-center mt-10">
              //       {" "}
              //       Choose between {min}-{max} days
              //     </p>
              //   </>
              // }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
