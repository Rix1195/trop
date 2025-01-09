import {signInWithEmailAndPassword} from "firebase/auth";
import {FormEvent, useState} from "react";
import {Link} from "react-router-dom";
import {auth} from "../firebase/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function login(event: FormEvent) {
    event.preventDefault();

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => location.replace("/app/profile"))
      .catch((err) => alert(err));

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] p-3 gap-6 sm:pt-3 pt-24">
      <h1>Zaloguj się</h1>

      <form className="w-full flex flex-col gap-5" onSubmit={login}>
        <div>
          <p>Email:</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <p>Hasło:</p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="self-center" disabled={loading}>
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
