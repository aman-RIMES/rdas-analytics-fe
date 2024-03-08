import NavBar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <NavBar />
      <hr />
      <div className="grid grid-cols-5">
        <Sidebar />
        <div className="col-span-4 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
