import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";

function App() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <HomeScreen />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
