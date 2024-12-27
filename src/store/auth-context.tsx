import {createContext, ReactNode, useState} from "react";
import {auth} from "../firebase/firebase";
import {User} from "firebase/auth";

interface AuthContextReturnType {
  user: User | null;
}

export const AuthContext = createContext<AuthContextReturnType | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);
  });

  const value = {
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? "Ładowanie..." : children}
    </AuthContext.Provider>
  );
};
