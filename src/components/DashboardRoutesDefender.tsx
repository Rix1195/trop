import {ReactNode} from "react";
import useAuth from "../hooks/useAuth";
import {Navigate} from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function DashboardRoutesDefender({children}: Props) {
  const {user} = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
