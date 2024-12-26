import {createUserWithEmailAndPassword} from "firebase/auth";
import {FormEvent, useState} from "react";
import {auth} from "../firebase/firebase";
import {Link} from "react-router-dom";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signUp(event: FormEvent) {
    event.preventDefault();

    setIsLoading(true);

    await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
      alert(err)
    );

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] p-3 gap-6">
      <h1>Zarejestruj się</h1>

      <form className="w-full flex flex-col gap-5" onSubmit={signUp}>
        <div>
          <p>Imię:</p>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            minLength={6}
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="self-center disabled:opacity-65"
          disabled={isLoading}
        >
          Zarejestruj się
        </button>
      </form>

      <p className="text-3xl mt-6">
        Masz konto?{" "}
        <Link to="/login" className="font-semibold text-blue-500">
          Zaloguj się!
        </Link>
      </p>
    </div>
  );
}
