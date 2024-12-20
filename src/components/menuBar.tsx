import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

export function NavMenubar() {
  return (
    <Menubar className="bg-transparent border-0">
      <NavLink
        className={cn(
          location.pathname === "/predictive-tools"
            ? "text-foreground"
            : "text-foreground/50",
          "transition-colors hover:text-foreground/80 text-md font-medium text-white hover:bg-yellow-300 rounded-sm px-3 py-[6px]"
        )}
        to="//rdas.rimes.int"
      >
        Home
      </NavLink>
      <MenubarMenu>
        <MenubarTrigger className="">Analytics</MenubarTrigger>
        <MenubarContent className="bg-green-800 text-white">
          <NavLink to="/elnino-analytics">
            <MenubarItem className="font-medium text-md ">
              El Nino and Local Climate
            </MenubarItem>
          </NavLink>
          <NavLink to="/crop-tools">
            <MenubarItem className="font-medium text-md ">
              Crop Calendar Suitability to Observed Climate
            </MenubarItem>
          </NavLink>
          <NavLink to="/land-use">
            <MenubarItem className="font-medium text-md ">
              Land Use & Land Cover Change
            </MenubarItem>
          </NavLink>

          {/* <MenubarSeparator /> */}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="">Predictive Tools</MenubarTrigger>
        <MenubarContent className="bg-green-800 text-white">
          <NavLink to="/predictive-tools">
            <MenubarItem className="font-medium text-md ">
              El Nino Impacts Prediction
            </MenubarItem>
            {/* <MenubarSeparator className="bg-yellow-300" /> */}
          </NavLink>
          <a
            href="//np-moald-staging.rimes.int/livestock-regional"
            target="_blank"
          >
            <MenubarItem className="font-medium text-md ">TempS</MenubarItem>
          </a>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
