import {useState, useEffect} from "react";
import {Project, Task} from "../types/types";
import useAuth from "../hooks/useAuth";
import {
  getDocs,
  doc,
  getDoc,
  collection,
  where,
  query,
  writeBatch,
} from "firebase/firestore";
import {db} from "../firebase/firebase";
import ProjectData from "../components/ProjectData";
import TaskListTile from "../components/TaskListTile";
import {UserData} from "../types/types";

export default function SummarizeProjectScreen() {
  const {userData} = useAuth();

  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    if (userData?.projectId) {
      const projectRef = doc(db, `projects/${userData.projectId}`);
      const tasksRef = collection(db, `projects/${userData.projectId}/tasks`);

      const temporaryTasks: Task[] = [];

      (async () => {
        await getDoc(projectRef)
          .then((doc) => setProject(doc.data() as Project))
          .catch((err) => alert(err));
      })();

      (async () => {
        await getDocs(tasksRef).then((docs) => {
          docs.forEach((doc) => {
            temporaryTasks.push(doc.data() as Task);
          });

          setTasks(temporaryTasks);
        });
      })();
    }
  }, [userData?.projectId]);

  async function deleteProject() {
    if (
      confirm(
        "Czy na pewno chcesz nieodwracalnie usunąć trop?\nWszyscy uczestnicy tropu zostaną przedtem wyrzuceni i będą mieli mozliwosc stworzenia tropu lub dołączenia do innego"
      ) === true
    ) {
      if (project && tasks) {
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
  }

  return (
    <div className="p-3 pt-[10vh] w-[100vw] h-[100vh] justify-center items-center">
      <h1>Podsumowanie</h1>

      <ProjectData project={project ? project : ({} as Project)} />

      <h2 className="text-5xl mt-9">Zadania</h2>

      <div className="mt-3">
        {tasks?.map((el, index) => (
          <TaskListTile
            task={el}
            showEditButton={false}
            editTask={() => {}}
            index={index}
          />
        ))}
      </div>
      <div className="flex gap-3">
        <a href="mailto:zuzanna.sobczyk@zhp.pl">
          <button>Wyślij email druzynowemu</button>
        </a>

        <button className="bg-red-500 hover:bg-red-600" onClick={deleteProject}>
          Usuń trop
        </button>
      </div>
    </div>
  );
}
