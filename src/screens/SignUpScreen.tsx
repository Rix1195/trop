import {createUserWithEmailAndPassword} from "firebase/auth";
import {FormEvent, useState} from "react";
import {auth, db} from "../firebase/firebase";
import {Link} from "react-router-dom";
import {doc, setDoc} from "firebase/firestore";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function signUp(event: FormEvent) {
    event.preventDefault();

    if (name.length < 3 || name.length > 25) {
      setError("Nazwa uzytkownika musi sie mieścić między 3 a 25 znakami");
      return;
    }

    if (email.length < 9 || email.length > 40) {
      setError("Email musi sie mieścić między 9 a 40 znakami");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć przynajmnie 6 znaków");
      return;
    }

    setIsLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        const usersRef = doc(db, `users/${user.user.uid}`);

        await setDoc(usersRef, {
          name,
          email,
          id: user.user.uid,
          project: null,
          projectId: null,
          isLeader: false,
        }).catch((err) => alert(err));
      })
      .then(() => location.replace("/app/profile"))
      .catch((err) => alert(err));

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] p-3 gap-6 sm:pt-0 pt-52">
      <h1>Zarejestruj się</h1>

      <form className="w-full flex flex-col gap-5" onSubmit={signUp}>
        <div>
          <p>Imię:</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <p>Email:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <p>Hasło:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

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
        <Link to="/login" className="font-semibold text-blue-500 text-center">
          Zaloguj się!
        </Link>
      </p>
    </div>
  );
}
