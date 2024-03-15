import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import Login from "./pages/login";
import { ThemeProvider } from "./components/theme-provider";
import ElNino from "./components/el-nino";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFoundPage />,
      // children: [
      //   {
      //     path: "/elnino",
      //     element: <ElNino />,
      //   },
      // ],
    },
    {
      path: "/home",
      element: <Navigate to="/" />,
    },
    {
      path: "/dashboard",
      element: <Home />,
      children: [
        {
          path: "/dashboard/elnino",
          element: <ElNino />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
