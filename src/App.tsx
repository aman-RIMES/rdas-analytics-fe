import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import { Content } from "@radix-ui/react-dropdown-menu";
import Login from "./pages/login";
import { ThemeProvider } from "./components/theme-provider";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/:contentId",
          element: <Content />,
        },
      ],
    },
    {
      path: "/home",
      element: <Navigate to="/" />,
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
