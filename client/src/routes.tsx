import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BuilderLayout from "./layouts/BuilderLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Scratch from "./pages/Scratch";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
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
