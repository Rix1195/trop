import {Outlet} from "react-router-dom";
import MainScreensNavbar from "../components/MainScreensNavbar";

export default function MainScreensLayout() {
  return (
    <>
      <MainScreensNavbar />

      <Outlet />
    </>
  );
}
