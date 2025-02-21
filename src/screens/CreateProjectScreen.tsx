import {doc, writeBatch} from "firebase/firestore";
import {db} from "../firebase/firebase";
import {FormEvent, useState} from "react";
import useAuth from "../hooks/useAuth";
import {Link} from "react-router-dom";
import {ProjectCategory} from "../types/types";

export default function CreateProjectScreen() {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState("Braterstwo");
  const [doesProjectHaveService, setDoesProjectHaveService] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {user, userData} = useAuth();

  async function createProject(event: FormEvent) {
    event.preventDefault();

    if (name.length < 8 || name.length > 60) {
      setError("Nazwa tropu musi się mieścić między 8 a 60 znakami");
      return;
    }

    if (goal.length < 10 || goal.length > 300) {
      setError("Cel musi się mieścić między 10 a 300 znakami");
      return;
    }

    if (team.length < 4 || team.length > 30) {
      setError("Nazwa patrolu musi się mieścić między 4 a 30 znakami");
      return;
    }

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
      category: category,
      hasService: doesProjectHaveService,
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
        <div className="pt-24">
          <h1>Stwórz trop</h1>

          <form className="flex flex-col gap-6 mt-4" onSubmit={createProject}>
            <div>
              <p>Nazwa tropu</p>
              <input
                type="text"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <p>Nazwa patrolu</p>
              <input
                type="text"
                className="w-full"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>

            <div>
              <p>Cel</p>
              <textarea
                rows={5}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              ></textarea>
            </div>

            <div>
              <p>Kategoria tropu</p>
              <select
                className="text-2xl px-3 py-1 bg-gray-300"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.keys(ProjectCategory).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() =>
                setDoesProjectHaveService((prevState) => !prevState)
              }
            >
              <input
                type="checkbox"
                className="w-7 h-7"
                checked={doesProjectHaveService}
              />
              <p>Czy trop zawiera słuzbę?</p>
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

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="mb-3 self-start"
              disabled={loading}
            >
              Dodaj trop
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
