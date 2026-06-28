import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import BuilderLayout from "./layouts/BuilderLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Scratch from "./pages/Scratch";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Resumes from "./pages/Resumes";
import Activity from "./pages/activity/page";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

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
    path: "/app",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "resumes",
        element: <Resumes />,
      },
      {
        path: "activity",
        element: <Activity />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
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
