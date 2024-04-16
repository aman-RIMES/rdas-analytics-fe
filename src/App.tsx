import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import Login from "./pages/login";
import { ThemeProvider } from "./components/theme-provider";
import Content from "./components/content";
import AnalysisTopics from "./components/analysis-topics";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/content",
          element: <Content />,
        },
        {
          path: "/analyze/:topic",
          element: <Content />,
        },
      ],
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
          element: <AnalysisTopics />,
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
