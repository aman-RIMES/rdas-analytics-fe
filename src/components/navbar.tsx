"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import ThemeToggle from "./theme-toggle";
import AvatarMenu from "./avatar-menu";

export default function NavBar() {
  const location = useLocation();
  return (
    <>
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink className="mr-8 flex items-center space-x-2" to={"/"}>
            <Icons.logo className="w-8 h-8 text-gray-800 dark:text-white" />
            <span className="hidden font-bold text-2xl sm:inline-block">
              RDAS Analytics
            </span>
          </NavLink>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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
            <NavLink
              className={cn(
                location.pathname.startsWith("/dashboard")
                  ? "text-foreground"
                  : "text-foreground/50",
                "transition-colors hover:text-foreground/80"
              )}
              to={"/dashboard"}
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-3">
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
