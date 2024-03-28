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
import Content from "./components/content";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFoundPage />,
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
          path: "/dashboard/content",
          element: <Content />,
        },
        {
          path: "/dashboard/:topic",
          element: <ElNino />,
        },
        {
          path: "/dashboard/:topic/analyze",
          element: <Content />,
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
