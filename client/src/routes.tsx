import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BuilderLayout from "./layouts/BuilderLayout";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Scratch from "./pages/Scratch";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/create",
    element: <BuilderLayout />,
    children: [
      {
        index: true,
        element: <Builder />,
      },
    ],
  },
  {
    path: "/scratch",
    element: <Scratch />,
  },
]);
