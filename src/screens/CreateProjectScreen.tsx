import {doc, writeBatch} from "firebase/firestore";
import {db} from "../firebase/firebase";
import {FormEvent, useState} from "react";
import useAuth from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";

export default function CreateProjectScreen() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [goal, setGoal] = useState("");

  const {user} = useAuth();

  const navigate = useNavigate();

  async function createProject(event: FormEvent) {
    event.preventDefault();

    const projectId = generateCode(6);

    const batch = writeBatch(db);

    const projectRef = doc(db, "projects", projectId);
    batch.set(projectRef, {
      name,
      team,
      goal,
      code: projectId,
    });

    console.log({
      name,
      team,
      goal,
      code: projectId,
    });

    const usersRef = doc(db, "users", user?.uid ? user?.uid : "");
    batch.update(usersRef, {
      project: name,
      projectId,
      isLeader: true,
    });

    await batch
      .commit()
      .then(() => navigate("/app/project"))
      .catch((err) => alert(err));
  }

  function generateCode(length: number) {
    let code = "";

    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10);
      code += digit;
    }

    return code;
  }

  return (
    <div className="p-3">
      <h1>Stwórz trop</h1>

      <form className="flex flex-col gap-6 mt-4" onSubmit={createProject}>
        <div>
          <p>Nazwa tropu</p>
          <input
            type="text"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={8}
            maxLength={60}
          />
        </div>

        <div>
          <p>Nazwa patrolu</p>
          <input
            type="text"
            className="w-full"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            minLength={4}
            maxLength={30}
          />
        </div>

        <div>
          <p>Cel</p>
          <textarea
            rows={5}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            minLength={10}
            maxLength={90}
          ></textarea>
        </div>

        <section>
          <h2>Uwaga!</h2>
          <p className="text-center">
            Jeśli stworzysz trop aplikacja oznaczy Ciebie jako patrolowego! Nie
            ma mozliwości "przekazania" tropu, więc jeśli masz być tylko jego
            uczestnikiem po prostu dołącz do tropu stworzonego przez faktycznego
            patrolowego.
          </p>
        </section>

        <button type="submit" className="self-center">
          Dodaj trop
        </button>
      </form>
    </div>
  );
}
