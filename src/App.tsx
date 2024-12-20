import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import { ThemeProvider } from "./components/theme-provider";
import PredictiveTools from "./components/predictive-tools/predictive-tools";
import ElNinoAnalytics from "./components/analytics-tools/elnino-analytics";
import GDDPredictiveTools from "./components/gdd-tools/gdd-tools";
import ClimateAnalytics from "./components/climate-tools/climate-analytics-tools/climate-analytics";
import ClimatePredictiveTools from "./components/climate-tools/climate-predictive-tools/climate-predictive-tools";
import Test from "./components/test";
import CropTools from "./components/crop-tools/crop-tools";
import LandUse from "./components/analytics-tools/land-use";
import TempS from "./components/analytics-tools/temps";
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
          path: "/climate-analytics",
          element: <ClimateAnalytics />,
        },
        {
          path: "/climate-predictive-tools",
          element: <ClimatePredictiveTools />,
        },
        {
          path: "/elnino-analytics",
          element: <ElNinoAnalytics />,
        },
        {
          path: "/land-use",
          element: <LandUse />,
        },
        {
          path: "/temps",
          element: <TempS />,
        },
        {
          path: "/predictive-tools/",
          element: <PredictiveTools />,
        },
        {
          path: "/crop-tools/",
          element: <CropTools />,
        },
        {
          path: "/gdd-predictive-tools/",
          element: <GDDPredictiveTools />,
        },
        {
          path: "/transport-analytics/",
          element: <ClimateAnalytics />,
        },
        {
          path: "/transport-predictive-tools/",
          element: <ClimatePredictiveTools />,
        },
      ],
    },
    {
      path: "/test",
      element: <Test />,
    },
  ]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
