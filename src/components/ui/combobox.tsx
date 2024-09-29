/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { ScrollArea } from "./scroll-area";
import { useState } from "react";

function Combobox({ array, state, label, name }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col justify-start gap-2 ">
      {/* <Label className="font-semibold">{label}</Label> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={
              cn(!state.value && "text-gray-500") +
              " justify-between border-0 shadow-md"
            }
          >
            {state.value
              ? array.find((element: any) => element.value === state.value)
                  ?.label
              : `Select ${label}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput placeholder="Search ..." />
            <CommandEmpty>{`No ${label} found`}</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="">
                <CommandList className="max-h-48">
                  {array.map((framework: any) => (
                    <CommandItem
                      key={Math.random()}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        state.setValue(name, currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          state.value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Combobox;
