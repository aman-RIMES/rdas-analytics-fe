"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import ThemeToggle from "./theme-toggle";
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
    <>
      <div className="px-4 md:px-10 flex justify-between md:justify-between h-14 items-center">
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
              <Icons.logo className="w-8 h-8 text-gray-800 dark:text-white" />
              <span className="hidden font-bold text-2xl sm:inline-block">
                RDAS Analytics
              </span>
            </NavLink>
            {/* <nav className="flex items-center space-x-6 text-sm font-medium">
              <NavLink
                className={cn(
                  location.pathname === "/"
                    ? "text-foreground"
                    : "text-foreground/50",
                  "transition-colors hover:text-foreground/80"
                )}
                to={"/"}
              >
                Home
              </NavLink>
            </nav> */}
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
                  "w-9 px-0"
                )}
              >
                <Icons.notification />
                <span className="sr-only">Notification</span>
              </div>
            </NavLink>
            <ThemeToggle />
            <AvatarMenu />
          </nav>
        </div>
      </div>
    </>
  );
}
