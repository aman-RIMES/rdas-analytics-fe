import NavBar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Icons } from "@/components/ui/icons";
import { Outlet, useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  return (
    <>
      <NavBar />
      <hr />
      <div className="px-10 grid grid-cols-5">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
        <div className="col-span-5 lg:col-span-4  p-8 px-20">
          {location.pathname === "/" ? (
            <div className="h-full flex flex-row justify-center items-center gap-4">
              <Icons.logo className="w-20 h-20 text-gray-800 dark:text-white" />
              <span className="hidden font-bold text-5xl sm:inline-block">
                RDAS Analytics
              </span>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
