import {useNavigate} from "react-router-dom";
import {auth} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";

export default function ProfileScreen() {
  const {userData} = useAuth();

  const navigate = useNavigate();

  function signOut() {
    auth.signOut();

    navigate("/login");
  }

  return (
    <div className="p-3 flex flex-col">
      <h1>
        Witaj, <span className="text-blue-500">{userData?.name}</span>
      </h1>
      <div className="mt-12">
        <h2>Twoje dane</h2>

        <ul className="text-3xl  mt-3">
          <li>
            Imię:{" "}
            <span className="text-blue-500 font-semibold">
              {userData?.name}
            </span>
          </li>

          <li>
            Email:{" "}
            <span className="text-blue-500 font-semibold">
              {userData?.email}
            </span>
          </li>
        </ul>
      </div>
      <div className="separator"></div>
      <div>
        <h2>Twój trop</h2>

        {userData?.projectId ? (
          <div className="mt-3 flex flex-col ">
            <ul className="text-2xl">
              <li>Nazwa tropu: {userData.project}</li>
              <li>Lider tropu: {userData.isLeader ? "Tak" : "Nie"}</li>
            </ul>

            <button className="mt-5 self-start">Zobacz swój trop</button>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-center">
              Aktualnie nie nalezysz do zadnego tropu! Dołącz do zespołu lub
              utwórz własny trop.
            </p>

            <div className="flex justify-center gap-6 mt-3">
              <button>Dołącz do tropu</button>
              <button>Utwórz trop</button>
            </div>
          </div>
        )}
      </div>

      <div className="separator"></div>

      <button onClick={signOut} className="self-start">
        Wyloguj się
      </button>
    </div>
  );
}
