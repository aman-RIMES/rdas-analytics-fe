import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import { ThemeProvider } from "./components/theme-provider";
import PredictiveTools from "./components/predictive-tools/predictive-tools";
import ElNinoAnalytics from "./components/analytics-tools/elnino-analytics";
import GDDPredictiveTools from "./components/gdd-tools/gdd-tools";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/analyze/:topic",
          element: <ElNinoAnalytics />,
        },
        {
          path: "/predictive-tools/",
          element: <PredictiveTools />,
        },
        {
          path: "/gdd-predictive-tools/",
          element: <GDDPredictiveTools />,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
