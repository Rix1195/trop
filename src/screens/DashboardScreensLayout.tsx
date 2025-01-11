import {Outlet} from "react-router-dom";
import DashboardRoutesDefender from "../components/DashboardRoutesDefender";
import DashboardNavbar from "../components/DashboardNavbar";

export default function DashboardScreensLayout() {
  return (
    <DashboardRoutesDefender>
      <DashboardNavbar />

      <Outlet />
    </DashboardRoutesDefender>
  );
}
