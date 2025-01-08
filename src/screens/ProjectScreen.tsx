import {collection, doc, getDoc, getDocs, Timestamp} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import {Project, Task} from "../types/types";
import {Link} from "react-router-dom";

export default function ProjectScreen() {
  const {userData} = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

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

  function formatDate(timestamp: Timestamp) {
    const date = timestamp.toDate();

    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  }

  return (
    <>
      {project ? (
        <div className="p-3 flex flex-col gap-6">
          <h1>{project?.name}</h1>

          <section className="mt-3">
            <p>
              <span className="font-semibold">Nazwa: </span>
              {project?.name}
            </p>

            <p>
              <span className="font-semibold">Cel: </span>
              {project?.goal}
            </p>

            <p>
              <span className="font-semibold">Lider: </span>
              {project?.leader}
            </p>

            <p>
              <span className="font-semibold">Nazwa zespołu: </span>
              {project?.team}
            </p>

            <p>
              <span className="font-semibold">Kod tropu: </span>
              {project?.code}
            </p>
          </section>

          <section>
            <h2>Uczestnicy</h2>
            <ul className="text-2xl">
              {project?.membersNames.map((member, index) => (
                <li key={index}>
                  {index + 1}. {member}{" "}
                  {project.leader === member && (
                    <span className="text-blue-500 font-semibold">(Lider)</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Zadania</h2>

            {tasks?.length ? (
              <div className="mt-3">
                {tasks.map((item, index) => (
                  <div
                    key={index}
                    className="break-words border-4 border-blue-500 p-3 flex flex-col gap-2 mb-2"
                  >
                    <h3>{item.name}</h3>
                    <p>{item.body}</p>
                    <div className="flex flex-col sm:flex-row justify-between w-full">
                      <p>
                        <span className="font-semibold">Osoba: </span>
                        {item.user}
                      </p>

                      <p>
                        <span className="font-semibold">Termin: </span>
                        {formatDate(item.deadline)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Jeszcze tu nic nie ma :(</p>
            )}
          </section>
        </div>
      ) : (
        <div className="p-3">
          <h1>Nie nalezysz do tropu!</h1>
          <p className="mt-3">
            W swoim profilu znajdziesz przycisk "Dołącz do tropu". Wpisz kod i
            dołącz do tropu, a potem wróc tutaj!
          </p>

          <Link to="/app/profile">
            <button className="mt-3">Zobacz profil</button>
          </Link>
        </div>
      )}
    </>
  );
}
