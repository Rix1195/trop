import {useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {IoMenuOutline} from "react-icons/io5";

export default function MainScreensNavbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  function toggleNavbar() {
    setIsNavbarOpen((prevState) => !prevState);
  }

  return (
    <nav className="bg-blue-500 text-white flex justify-between items-center shadow-lg fixed w-full">
      <div className="p-4 flex justify-between w-full items-center">
        <Link to="/">
          <h2 className="font-semibold text-5xl">Trop</h2>
        </Link>

        <button className="block sm:hidden text-3xl" onClick={toggleNavbar}>
          <IoMenuOutline />
        </button>

        <ul className="hidden sm:flex gap-7 text-2xl">
          <NavLink
            to="/"
            className={({isActive}) => (isActive ? "underline" : "")}
          >
            <li>Strona główna</li>
          </NavLink>
          <NavLink
            to="/login"
            className={({isActive}) => (isActive ? "underline" : "")}
          >
            <li>Zaloguj się</li>
          </NavLink>
          <NavLink
            to="/signUp"
            className={({isActive}) => (isActive ? "underline" : "")}
          >
            <li>Zarejestruj się</li>
          </NavLink>
        </ul>
      </div>

      <ul
        className={`sm:hidden fixed flex flex-col bg-blue-500 top-20 w-full gap-7 text-2xl p-4 shadow-md ${
          isNavbarOpen ? "" : "hidden"
        }`}
      >
        <NavLink
          to="/"
          className={({isActive}) => (isActive ? "underline" : "")}
        >
          <li>Strona główna</li>
        </NavLink>
        <NavLink
          to="/login"
          className={({isActive}) => (isActive ? "underline" : "")}
        >
          <li>Zaloguj się</li>
        </NavLink>
        <NavLink
          to="/signUp"
          className={({isActive}) => (isActive ? "underline" : "")}
        >
          <li>Zarejestruj się</li>
        </NavLink>
      </ul>
    </nav>
  );
}
