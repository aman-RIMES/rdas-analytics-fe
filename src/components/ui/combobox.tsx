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
import { Label } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "./scroll-area";

function Combobox({ array, state, label, name }: any) {
  return (
    <div className="flex flex-col justify-start gap-2">
      {/* <Label className="font-semibold">{label}</Label> */}
      <Popover open={state.open} onOpenChange={state.setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={state.open}
            className=" justify-between"
          >
            {state.value
              ? array.find((element: any) => element.value === state.value)
                  ?.label
              : `Select ${label}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search ..." />
            <CommandEmpty>{`No ${label} found`}</CommandEmpty>
            <CommandGroup>
              {/* <ScrollArea className="h-72 w-48 rounded-md border"> */}
              <ScrollArea className="">
                <CommandList className="max-h-72">
                  {array.map((framework: any) => (
                    <CommandItem
                      key={Math.random()}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        state.setValue(
                          name,
                          currentValue === state.value ? "" : currentValue
                        );
                        state.setOpen(false);
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
