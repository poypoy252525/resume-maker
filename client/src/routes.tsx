import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BuilderLayout from "./layouts/BuilderLayout";
import Home from "./pages/Home";
import NewResume from "./pages/NewResume";
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
        element: <NewResume />,
      },
    ],
  },
  {
    path: "/scratch",
    element: <Scratch />,
  },
]);
