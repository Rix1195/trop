import {useContext} from "react";
import {AuthContext} from "../store/auth-context";

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("You can't use useAuth outside AuthContextProvider!");
  }

  return context;
}
