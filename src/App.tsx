import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import { ThemeProvider } from "./components/theme-provider";
import Content from "./components/analytics";
import PredictiveTools from "./components/predictive-tools";
import GDDPredictiveTools from "./components/gdd-tools";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/analyze/:topic",
          element: <Content />,
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
