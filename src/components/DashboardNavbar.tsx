import {useState} from "react";
import {NavLink} from "react-router-dom";
import {IoMenuOutline} from "react-icons/io5";
import useAuth from "../hooks/useAuth";

export default function MainScreensNavbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const {userData} = useAuth();

  function toggleNavbar() {
    setIsNavbarOpen((prevState) => !prevState);
  }

  return (
    <nav className="bg-blue-500 text-white flex justify-between items-center shadow-lg fixed w-full">
      <div className="p-4 flex justify-between w-full items-center">
        <h2 className="font-semibold text-5xl">Trop</h2>

        <button className="block sm:hidden text-3xl" onClick={toggleNavbar}>
          <IoMenuOutline />
        </button>

        <ul className="hidden sm:flex gap-7 text-2xl">
          <NavLink
            to="/app/profile"
            className={({isActive}) => (isActive ? "underline" : "")}
          >
            <li>Profil</li>
          </NavLink>
          {userData?.project ? (
            <NavLink
              to="/app/project"
              className={({isActive}) => (isActive ? "underline" : "")}
            >
              <li>Twój trop</li>
            </NavLink>
          ) : (
            <NavLink
              to="/app/project/create"
              className={({isActive}) => (isActive ? "underline" : "")}
            >
              <li>Stwórz trop</li>
            </NavLink>
          )}
        </ul>
      </div>

      <ul
        className={`sm:hidden fixed flex flex-col bg-blue-500 top-20 w-full gap-7 text-2xl p-4 shadow-md ${
          isNavbarOpen ? "" : "hidden"
        }`}
      >
        <NavLink
          to="/app/profile"
          className={({isActive}) => (isActive ? "underline" : "")}
        >
          <li>Profil</li>
        </NavLink>
        {userData?.project ? (
          <NavLink
            to="/app/project"
            className={({isActive}) => (isActive ? "underline" : "")}
          >
            <li>Twój trop</li>
          </NavLink>
        ) : (
          <NavLink
            to="/app/project/create"
            className={({isActive}) => (isActive ? "underline" : "")}
          >
            <li>Stwórz trop</li>
          </NavLink>
        )}
      </ul>
    </nav>
  );
}
