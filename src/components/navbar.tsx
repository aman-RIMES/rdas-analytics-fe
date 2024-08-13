"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import AvatarMenu from "./avatar-menu";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Sidebar } from "./sidebar";
import { ScrollArea } from "./ui/scroll-area";

export default function NavBar() {
  const location = useLocation();
  return (
    <div className="">
      <div className="px-4 mt-3 md:px-10 flex justify-between md:justify-between h-14 items-center bg-green-900 mx-10 rounded-md">
        <div className="flex items-center gap-3">
          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger>
                <AlignJustify className="" />
              </SheetTrigger>
              <SheetContent side={"left"}>
                <ScrollArea>
                  <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>

                  <NavLink className="mr-8 flex justify-start gap-2" to={"/"}>
                    <Icons.logo className="w-6 h-6 text-gray-800 dark:text-white" />
                    <span className=" font-bold text-xl sm:inline-block">
                      RDAS Analytics
                    </span>
                  </NavLink>

                  <div className="flex justify-start">
                    <Sidebar />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex">
            <NavLink className="mr-8 flex space-x-2" to={"/"}>
              <Icons.logo className="w-8 h-8 text-white dark:text-white" />
              <span className="hidden font-bold text-2xl text-white sm:inline-block">
                RDAS Analytics
              </span>
            </NavLink>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavLink
                className={cn(
                  location.pathname === "/"
                    ? "text-foreground"
                    : "text-foreground/50",
                  "transition-colors hover:text-foreground/80 text-lg text-white hover:bg-yellow-300 hover:rounded-md hover:px-3"
                )}
                to="https://rdas.rimes.int"
              >
                Home
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="flex">
          <nav className="flex items-center gap-1 md:gap-3">
            <NavLink rel="noreferrer" to={"/"}>
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0 bg-yellow-300"
                )}
              >
                <Icons.notification />
                <span className="sr-only">Notification</span>
              </div>
            </NavLink>
            {/* <ThemeToggle /> */}
            <AvatarMenu />
          </nav>
        </div>
      </div>
    </div>
  );
}
