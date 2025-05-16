import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MainScreensLayout from "./screens/MainScreensLayout";
import ProfileScreen from "./screens/ProfileScreen";
import DashboardScreensLayout from "./screens/DashboardScreensLayout";
import {AuthContextProvider} from "./store/auth-context";
import ProjectScreen from "./screens/ProjectScreen";
import CreateProjectScreen from "./screens/CreateProjectScreen";
import PageNotFoundScreen from "./screens/PageNotFoundScreen";
import SummarizeProjectScreen from "./screens/SummarizeProjectScreen";

function App() {
  const router = createBrowserRouter([
    {
      path: "*",
      element: <PageNotFoundScreen />,
    },
    {
      path: "/",
      element: <MainScreensLayout />,
      children: [
        {
          index: true,
          element: <HomeScreen />,
        },
        {
          path: "/login",
          element: <LoginScreen />,
        },
        {
          path: "/signUp",
          element: <SignUpScreen />,
        },
      ],
    },
    {
      path: "/app",
      element: <DashboardScreensLayout />,
      children: [
        {
          path: "profile",
          element: <ProfileScreen />,
        },
        {
          path: "project",
          element: <ProjectScreen />,
        },
        {
          path: "project/create",
          element: <CreateProjectScreen />,
        },
        {
          path: "project/summarize",
          element: <SummarizeProjectScreen />,
        },
      ],
    },
  ]);

  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
