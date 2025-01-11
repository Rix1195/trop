import {Link, useNavigate} from "react-router-dom";
import {auth} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import {FormEvent, useRef} from "react";
import {Popup} from "../components/Popup";
import JoinProjectForm from "../components/JoinProjectForm";

export default function ProfileScreen() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const {userData} = useAuth();

  const navigate = useNavigate();

  function signOut() {
    auth.signOut();
    navigate("/login");
  }

  function openPopup() {
    dialogRef.current?.showModal();
  }

  function closePopup(e: FormEvent) {
    e.preventDefault();

    dialogRef.current?.close();
  }

  return (
    <>
      <Popup
        ref={dialogRef}
        title="Dołącz do tropu"
        content={<JoinProjectForm closePopup={closePopup} />}
      />

      <div className="p-3 flex flex-col pt-24">
        <h1 className="text-6xl sm:text-8xl">
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

              <Link to="/app/project">
                <button className="mt-5 self-start">Zobacz swój trop</button>
              </Link>
            </div>
          ) : (
            <div className="mt-3">
              <p>
                Aktualnie nie nalezysz do zadnego tropu! Dołącz do zespołu lub
                utwórz własny trop.
              </p>

              <div className="flex gap-6 mt-3">
                <button onClick={openPopup}>Dołącz do tropu</button>
                <Link to="/app/project/create">
                  <button>Utwórz trop</button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="separator"></div>

        <button
          onClick={signOut}
          className="self-start bg-red-500 hover:bg-red-600"
        >
          Wyloguj się
        </button>
      </div>
    </>
  );
}
