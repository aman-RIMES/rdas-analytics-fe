import NavBar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Icons } from "@/components/ui/icons";
import { Outlet, useLocation } from "react-router-dom";

//TODO: Replace all any with correct types
//TODO: Replace all Math.random keys with proper keys
//TODO: Create proper interfaces for all api responses

const Home = () => {
  const location = useLocation();
  return (
    <div className="h-screen w-screen bg-green-50">
      <NavBar />
      {/* <hr /> */}
      {/* <div className="sm:px-2 px-4 grid grid-cols-5">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
        <div className="col-span-5 lg:col-span-4 pt-5 md:p-8 lg:px-20">
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
      </div> */}
      <Outlet />
    </div>
  );
};

export default Home;
