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
    // TODO: Set proper overflow configurations for viewport
    <div className="h-screen w-screen flex flex-col overflow-scroll bg-green-50">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Home;
