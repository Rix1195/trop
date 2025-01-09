import {createContext, ReactNode, useEffect, useState} from "react";
import {auth, db} from "../firebase/firebase";
import {User} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {UserData} from "../types/types";

interface AuthContextReturnType {
  user: User | null;
  userData: UserData | null;
}

export const AuthContext = createContext<AuthContextReturnType | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthContextProvider = ({children}: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);
  });

  useEffect(() => {
    if (user) {
      const userDoc = doc(db, "users", user.uid);

      (async () => {
        await getDoc(userDoc).then((doc) =>
          setUserData(doc.data() as UserData)
        );
      })();
    }
  }, [user]);

  const value = {
    user,
    userData,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="h-[90vh] flex justify-center items-center">
          <p>Ładowanie...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
