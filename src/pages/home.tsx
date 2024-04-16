import NavBar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <NavBar />
      <hr />
      <div className="px-10 grid grid-cols-5">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
        <div className="col-span-5 lg:col-span-4  p-8 px-20">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
