import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import { ThemeProvider } from "./components/theme-provider";
import PredictiveTools from "./components/predictive-tools/predictive-tools";
import ElNinoAnalytics from "./components/analytics-tools/elnino-analytics";
import GDDPredictiveTools from "./components/gdd-tools/gdd-tools";
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
          path: "/elnino-analytics",
          element: <ElNinoAnalytics key={"elnino"} />,
        },
        {
          path: "/lanina-analytics",
          element: <ElNinoAnalytics key={"lanina"} />,
        },
        {
          path: "/analytics-land",
          element: <LandUse />,
        },
        {
          path: "/predictive-temps",
          element: <TempS />,
        },
        {
          path: "/predictive-tools/",
          element: <PredictiveTools key={"elnino"} />,
        },
        {
          path: "/lanina-predictive-tools/",
          element: <PredictiveTools key={"lanina"} />,
        },
        {
          path: "/analytics-crop/",
          element: <CropTools />,
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
