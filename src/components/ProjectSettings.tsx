import {FormEvent, useState} from "react";
import useAuth from "../hooks/useAuth";
import {Project, Task, UserData} from "../types/types";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import {db} from "../firebase/firebase";
import EditProjectForm from "./EditProjectForm";

interface Props {
  project: Project;
  tasks: Task[];
}

export default function ProjectSettings({project, tasks}: Props) {
  const [loading, setLoading] = useState(false);

  const {userData} = useAuth();

  async function leaveProject(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (
      confirm(
        "Czy chcesz opuścić trop?\nOpuszczenie tropu spowoduje usunięcie wszystkich twoich zadań!"
      ) === true
    ) {
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

      tasks.forEach((task) => {
        if (task.user === userData?.name) {
          const taskDoc = doc(db, `projects/${project.code}/tasks/${task.id}`);
          batch.delete(taskDoc);
        }
      });

      await batch
        .commit()
        .then(() => location.replace("/app/profile"))
        .catch((err) => alert(err));
    }

    setLoading(false);
  }

  async function deleteProject() {
    if (
      confirm(
        "Czy na pewno chcesz nieodwracalnie usunąć trop?\nWszyscy uczestnicy tropu zostaną przedtem wyrzuceni i będą mieli mozliwosc stworzenia tropu lub dołączenia do innego"
      ) === true
    ) {
      const usersQuery = query(
        collection(db, "users"),
        where("projectId", "==", project.code)
      );

      const projectRef = doc(db, `/projects/${project.code}`);

      const users: UserData[] = [];
      const tasksIds: string[] = [];

      await getDocs(usersQuery).then((docs) => {
        docs.forEach((doc) => users.push(doc.data().id));
      });

      tasks.forEach((task) => tasksIds.push(task.id));

      const batch = writeBatch(db);

      users.forEach((user) => {
        const usersRef = doc(db, `/users/${user}`);

        batch.update(usersRef, {
          project: null,
          projectId: null,
          isLeader: false,
        });
      });

      tasksIds.forEach((id) => {
        const taskRef = doc(db, `/projects/${project.code}/tasks/${id}`);

        batch.delete(taskRef);
      });

      batch.delete(projectRef);

      await batch
        .commit()
        .then(() => location.replace("/app/profile"))
        .catch((err) => alert(err));
    }
  }

  return (
    <div className="flex flex-col gap-3 items-start">
      <p>
        <span className="font-semibold">Kod tropu: </span>
        {project?.code}
      </p>
      <div className="horizontal-separator"></div>

      <EditProjectForm
        project={project}
        loading={loading}
        setLoading={setLoading}
      />

      {userData?.isLeader ? (
        <button className="bg-red-500 hover:bg-red-600" onClick={deleteProject}>
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
