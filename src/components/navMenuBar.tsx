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
    <Menubar className="bg-transparent border-0 ">
      <NavLink
        className={cn(
          "transition-colors hover:text-foreground/80 text-md font-medium text-white hover:bg-yellow-300 rounded-sm px-3 py-[6px]"
        )}
        to="//rdas.rimes.int"
      >
        Home
      </NavLink>
      <MenubarMenu>
        <MenubarTrigger
          className={cn(
            (location.pathname.startsWith("/analytics-") ||
              location.pathname === "/elnino-analytics" ||
              location.pathname === "/lanina-analytics") &&
              "data-[state=closed]:bg-yellow-300 data-[state=closed]:text-black"
          )}
        >
          Analytics
        </MenubarTrigger>
        <MenubarContent className="bg-green-700 text-white border-0 p-2">
          <NavLink to="/elnino-analytics">
            <MenubarItem className="font-medium text-sm ">
              El Nino and Local Climate
            </MenubarItem>
          </NavLink>
          <NavLink to="/lanina-analytics">
            <MenubarItem className="font-medium text-sm ">
              La Nina and Local Climate
            </MenubarItem>
          </NavLink>
          <NavLink to="/analytics-rainfall-anomaly">
            <MenubarItem className="font-medium text-sm ">
              Rainfall Anomaly
            </MenubarItem>
          </NavLink>
          <NavLink to="/analytics-crop">
            <MenubarItem className="font-medium text-sm ">
              Crop Calendar Suitability to Observed Climate
            </MenubarItem>
          </NavLink>
          <NavLink to="/analytics-land">
            <MenubarItem className="font-medium text-sm ">
              Land Use & Land Cover Change
            </MenubarItem>
          </NavLink>

          {/* <MenubarSeparator /> */}
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger
          className={cn(
            (location.pathname.startsWith("/predictive-") ||
              location.pathname === "/predictive-tools" ||
              location.pathname === "/lanina-predictive-tools") &&
              "data-[state=closed]:bg-yellow-300 data-[state=closed]:text-black"
          )}
        >
          Predictive Tools
        </MenubarTrigger>
        <MenubarContent className="bg-green-700 text-white border-0 p-2">
          <NavLink to="/predictive-tools">
            <MenubarItem className="font-medium text-sm ">
              El Nino Impacts Prediction
            </MenubarItem>
          </NavLink>
          <NavLink to="/lanina-predictive-tools">
            <MenubarItem className="font-medium text-sm ">
              La Nina Impacts Prediction
            </MenubarItem>
          </NavLink>
          <NavLink to="/predictive-gdd-tools">
            <MenubarItem className="font-medium text-sm ">
              Growing Degree Days
            </MenubarItem>
          </NavLink>
          <NavLink to="/predictive-temps">
            <MenubarItem className="font-medium text-sm ">
              Temperature Sensitivity Alert System (TEMPs)
            </MenubarItem>
          </NavLink>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
