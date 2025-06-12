import NavBar from "@/components/navbar";
import { Outlet } from "react-router-dom";

//TODO: Replace all any with correct types
//TODO: Replace all Math.random keys with proper keys
//TODO: Create proper interfaces for all api responses

const Home = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-auto bg-green-50">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Home;
