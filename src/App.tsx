import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import NotFoundPage from "./components/404-page";
import { ThemeProvider } from "./components/theme-provider";
import Content from "./components/content";
import PredictiveTools from "./components/predictive-tools";
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
