import {doc, writeBatch} from "firebase/firestore";
import {db} from "../firebase/firebase";
import {FormEvent, useState} from "react";
import useAuth from "../hooks/useAuth";
import {Link} from "react-router-dom";

export default function CreateProjectScreen() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [goal, setGoal] = useState("");

  const [loading, setLoading] = useState(false);

  const {user, userData} = useAuth();

  async function createProject(event: FormEvent) {
    event.preventDefault();

    setLoading(true);

    const projectId = generateCode(6);

    const batch = writeBatch(db);

    const projectRef = doc(db, "projects", projectId);
    batch.set(projectRef, {
      name,
      team,
      goal,
      code: projectId,
      leader: userData?.name,
      members: [userData?.email],
      membersNames: [userData?.name],
    });

    const usersRef = doc(db, "users", user?.uid ? user?.uid : "");
    batch.update(usersRef, {
      project: name,
      projectId,
      isLeader: true,
    });

    await batch
      .commit()
      .then(() => location.replace("/app/project"))
      .catch((err) => alert(err));

    setLoading(false);
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
    <div className="p-3 h-screen">
      {userData?.projectId ? (
        <>
          <div className="flex justify-center items-center h-full flex-col gap-3">
            <h1 className="text-center">Jesteś juz w zespole!</h1>
            <p className="text-center">
              Nie mozesz stworzyc tropu, jesli do jednego nalezysz! Opuść trop,
              a następnie wróć tu!
            </p>

            <Link to="/app/project">
              <button>Zobacz swój trop</button>
            </Link>
          </div>
        </>
      ) : (
        <>
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
                maxLength={300}
              ></textarea>
            </div>

            <section>
              <h2>Uwaga!</h2>
              <p>
                Jeśli stworzysz trop aplikacja oznaczy Ciebie jako patrolowego!
                Nie ma mozliwości "przekazania" tropu, więc jeśli masz być tylko
                jego uczestnikiem po prostu dołącz do tropu stworzonego przez
                faktycznego patrolowego.
              </p>
            </section>

            <button type="submit" className="self-center" disabled={loading}>
              Dodaj trop
            </button>
          </form>
        </>
      )}
    </div>
  );
}
