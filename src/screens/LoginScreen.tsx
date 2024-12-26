import {Link} from "react-router-dom";

export default function LoginScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-[90vh] p-3 gap-6 sm:pt-3 pt-24">
      <h1>Zaloguj się</h1>

      <form className="w-full flex flex-col gap-5">
        <div>
          <p>Email:</p>
          <input type="email" />
        </div>

        <div>
          <p>Hasło:</p>
          <input type="password" />
        </div>

        <button type="submit" className="self-center">
          Zaloguj się
        </button>
      </form>

      <p className="text-3xl mt-6 text-center">
        Nie masz konta?{" "}
        <Link to="/signUp" className="font-semibold text-blue-500 text-center">
          Zarejestruj się!
        </Link>
      </p>
    </div>
  );
}
