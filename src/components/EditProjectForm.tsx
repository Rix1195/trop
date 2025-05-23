import {useState, FormEvent, Dispatch, SetStateAction} from "react";
import {Project, ProjectCategory} from "../types/types";
import useAuth from "../hooks/useAuth";
import {db} from "../firebase/firebase";
import {doc, setDoc} from "firebase/firestore";

interface Props {
  project: Project;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function EditProjectForm({project, loading, setLoading}: Props) {
  const [name, setName] = useState(project.name);
  const [team, setTeam] = useState(project.team);
  const [goal, setGoal] = useState(project.goal);
  const [category, setCategory] = useState(project.category.toString());
  const [doesProjectHaveService, setDoesProjectHaveService] = useState(
    project.hasService
  );

  const [error, setError] = useState("");

  const {userData} = useAuth();

  const formHasChanged =
    name !== project.name ||
    team !== project.team ||
    goal !== project.goal ||
    category !== project.category ||
    doesProjectHaveService !== project.hasService;

  function resetEditProjectForm(e: FormEvent) {
    e.preventDefault();

    setName(project.name);
    setTeam(project.team);
    setGoal(project.goal);
    setCategory(project.category);
    setDoesProjectHaveService(project.hasService);
  }

  async function editProject(e: FormEvent) {
    e.preventDefault();

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

    const projectDoc = doc(db, `projects/${project.code}`);

    setLoading(true);

    await setDoc(
      projectDoc,
      {name, team, goal, category, hasService: doesProjectHaveService},
      {merge: true}
    )
      .then(() => location.reload())
      .catch((err) => alert(err));

    setLoading(false);
  }

  return (
    <>
      {userData?.isLeader && (
        <>
          <form className="w-full flex flex-col gap-3">
            <h2 className="text-5xl">Edytuj trop</h2>

            <div>
              <p>Nazwa</p>
              <input
                type="text"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <p>Cel</p>
              <textarea
                rows={4}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              ></textarea>
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
              <p>Kategoria</p>
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

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <button
                type="submit"
                disabled={!formHasChanged || loading}
                onClick={editProject}
              >
                Zatwierdź
              </button>
              <button
                type="reset"
                onClick={resetEditProjectForm}
                disabled={!formHasChanged || loading}
              >
                Resetuj
              </button>
            </div>
          </form>

          <div className="horizontal-separator"></div>
        </>
      )}
    </>
  );
}
