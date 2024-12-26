import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";

function App() {
  const router = createBrowserRouter([
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
  ]);

  return <RouterProvider router={router} />;
}

export default App;
