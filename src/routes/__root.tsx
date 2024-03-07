import NavBar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <hr />
      <div className="grid grid-cols-5">
        <Sidebar playlists={[]} className="hidden lg:block" />
        <div className=" col-span-4 p-4">
          {/* <div className="h-full bg-red-300"></div> */}
          <Outlet />
        </div>
      </div>

      <TanStackRouterDevtools />
    </>
  ),
});
