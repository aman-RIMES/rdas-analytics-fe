/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useEffect, useState } from "react";
import { ScrollArea } from "./scroll-area";

type Indicator = Record<"value" | "label", string>;

export function FancyMultiSelect({
  name,
  selected,
  setSelected = () => {},
  setState,
  array,
  placeholder = "Select variables",
  ScrollAreaHeight = "180",
}: any) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<any>([]);
  // const [selected, setSelected] = useState<any>([]);
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    setState(name, selectedAnswers);
  }, [selectedAnswers]);

  const handleUnselect = (element: Indicator) => {
    setSelected((prev: any) =>
      prev.filter((s: any) => s.value !== element.value)
    );
    setSelectedAnswers((prev: any) =>
      prev.filter((e: any) => e !== element.value)
    );
  };

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev: any) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = array.filter(
    (element: any) => !selected?.includes(element)
  );
  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent "
    >
      <div className="group rounded-md border bg-white border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-col gap-1">
          {selected?.map((element: any) => {
            return (
              <Badge
                key={element?.value}
                variant="secondary"
                className="text-md rounded-md flex justify-between hover:bg-gray-300"
              >
                {element?.label}
                <button
                  className="ml-1 rounded-md outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(element);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(element)}
                >
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:font-medium  placeholder:text-black placeholder:text-md placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {/* <ScrollArea> */}
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <ScrollArea className={`h-[${ScrollAreaHeight}px]`}>
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((element: any) => {
                    return (
                      <CommandItem
                        key={element.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          setInputValue("");
                          setSelected((prev: any) => [...prev, element]);
                          setSelectedAnswers((prev: any) => [
                            ...prev,
                            element.value,
                          ]);
                        }}
                        className={"cursor-pointer"}
                      >
                        {element.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </div>
          ) : null}
        </CommandList>
        {/* </ScrollArea> */}
      </div>
    </Command>
  );
}
