"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { NavLink } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import ThemeToggle from "./theme-toggle";
import AvatarMenu from "./avatar-menu";

export default function NavBar() {
  return (
    <>
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink className="mr-8 flex items-center space-x-2" to={"/"}>
            <Icons.logo />
            <span className="hidden font-bold text-2xl sm:inline-block">
              RDAS Analytics
            </span>
          </NavLink>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-foreground" : "text-foreground/50"
              }
              to={"/"}
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-foreground" : "text-foreground/50"
              }
              to={"/"}
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-foreground" : "text-foreground/50"
              }
              to={"/login"}
            >
              Login
            </NavLink>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2">
            <NavLink target="_blank" rel="noreferrer" to={"/"}>
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
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
