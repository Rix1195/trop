import {Outlet} from "react-router-dom";
import DashboardRoutesDefender from "../components/DashboardRoutesDefender";

export default function DashboardScreensLayout() {
  return (
    <DashboardRoutesDefender>
      <Outlet />
    </DashboardRoutesDefender>
  );
}
