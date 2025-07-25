import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { NavLink, useLocation } from "react-router-dom";
import AvatarMenu from "./avatar-menu";
import {
  AlignJustify,
  ChevronDown,
  HelpCircle,
  UserCircle,
} from "lucide-react";
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
import { NavMenubar } from "./navMenuBar";
import { CROP_ADMIN_LOGIN_URL, routeDefinitions } from "@/constants";
export default function NavBar() {
  const location = useLocation();
  return (
    <div className="">
      <div className="px-4 md:px-10 flex justify-between md:justify-between h-12 items-center bg-[#0B6623]  ">
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
            <NavLink className="mr-8 flex space-x-2 items-center" to={"/"}>
              <Icons.logo className="w-7 h-7 text-white dark:text-white" />
              <span className="hidden font-bold text-xl text-white sm:inline-block">
                RDAS Analytics
              </span>
            </NavLink>
            <nav className="flex items-center space-x-3 text-sm font-medium">
              <NavMenubar />
            </nav>
          </div>
        </div>
        {location.pathname !== "/" && (
          <div className="text-black font-medium text-lg bg-yellow-300 px-5 py-[3px] rounded-sm ml-[-330px] hidden lg:flex">
            {routeDefinitions[location.pathname]}
          </div>
        )}
        <div className="flex">
          <nav className="flex items-center gap-1 md:gap-3">
            <a
              rel="noreferrer"
              href="http://203.156.108.75:11155/"
              target="_blank"
            >
              <div className="flex gap-1 justify-center items-center py-1 px-3 rounded-sm text-white hover:bg-yellow-300 hover:text-black">
                <HelpCircle className="h-[18px] w-[18px] " />
                <p className="">Help</p>
              </div>
            </a>
            <a rel="noreferrer" href={CROP_ADMIN_LOGIN_URL} target="_blank">
              <div className="flex gap-1 justify-center items-center py-1 px-3 rounded-sm text-white hover:bg-yellow-300 hover:text-black">
                <UserCircle className="h-[18px] w-[18px] " />
                <p className="">Login</p>
              </div>
            </a>
            {/* <ThemeToggle /> */}
            {/* <AvatarMenu /> */}
          </nav>
        </div>
      </div>
    </div>
  );
}
