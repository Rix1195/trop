import {FormEvent, useState} from "react";
import useAuth from "../hooks/useAuth";
import {Project} from "../types/types";
import {doc, setDoc, writeBatch} from "firebase/firestore";
import {db} from "../firebase/firebase";

interface Props {
  project: Project;
}

export default function ProjectSettings({project}: Props) {
  const [name, setName] = useState(project.name);
  const [team, setTeam] = useState(project.team);
  const [goal, setGoal] = useState(project.goal);

  const [loading, setLoading] = useState(false);

  const {userData} = useAuth();

  let formHasChanged =
    name !== project.name || team !== project.team || goal !== project.goal;

  function resetEditProjectForm(e: FormEvent) {
    e.preventDefault();

    setName(project.name);
    setTeam(project.team);
    setGoal(project.goal);

    formHasChanged =
      name !== project.name || team !== project.team || goal !== project.goal;
  }

  async function editProject(e: FormEvent) {
    e.preventDefault();

    const projectDoc = doc(db, `projects/${project.code}`);

    setLoading(true);

    await setDoc(projectDoc, {name, team, goal}, {merge: true})
      .then(() => location.reload())
      .catch((err) => alert(err));

    setLoading(false);
  }

  async function leaveProject(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    const projectDoc = doc(db, `/projects/${project.code}`);
    const usersDoc = doc(db, `/users/${userData?.id}`);

    const batch = writeBatch(db);

    const newMembers = project.members.filter((el) => el !== userData?.email);
    const newMembersNames = project.membersNames.filter(
      (el) => el !== userData?.name
    );

    batch.update(projectDoc, {
      members: newMembers,
      membersNames: newMembersNames,
    });

    batch.update(usersDoc, {
      project: null,
      projectId: null,
    });

    await batch
      .commit()
      .then(() => location.replace("/app/profile"))
      .catch((err) => alert(err));

    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3 items-start">
      <p>
        <span className="font-semibold">Kod tropu: </span>
        {project?.code}
      </p>
      <div className="horizontal-separator"></div>

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
                minLength={8}
                maxLength={60}
              />
            </div>

            <div>
              <p>Cel</p>
              <textarea
                rows={4}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                minLength={10}
                maxLength={300}
              ></textarea>
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
      {userData?.isLeader ? (
        <button className="bg-red-500 hover:bg-red-600" disabled>
          Usuń trop
        </button>
      ) : (
        <button
          className="bg-red-500 hover:bg-red-600"
          onClick={leaveProject}
          disabled={loading}
        >
          Opuść trop
        </button>
      )}
    </div>
  );
}
