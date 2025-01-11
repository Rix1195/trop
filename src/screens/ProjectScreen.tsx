import {collection, doc, getDoc, getDocs, Timestamp} from "firebase/firestore";
import {ReactNode, useEffect, useRef, useState} from "react";
import {db} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import {Project, Task} from "../types/types";
import {Link} from "react-router-dom";
import {IoAdd, IoSettingsOutline} from "react-icons/io5";
import {Popup} from "../components/Popup";
import ProjectSettings from "../components/ProjectSettings";
import ProjectData from "../components/ProjectData";
import AddEditTaskForm from "../components/AddEditTaskForm";

export default function ProjectScreen() {
  const {userData} = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState<ReactNode>();

  const dialogRef = useRef<HTMLDialogElement>(null);

  function openProjectSettings() {
    setPopupTitle("Ustawienia tropu");
    setPopupContent(
      <ProjectSettings
        project={project ? project : ({} as Project)}
        tasks={tasks ? tasks : ([] as Task[])}
      />
    );

    dialogRef.current?.showModal();
  }

  function openNewTaskPopup() {
    setPopupTitle("Dodaj zadanie");
    setPopupContent(
      <AddEditTaskForm project={project ? project : ({} as Project)} />
    );

    dialogRef.current?.showModal();
  }

  function editTask(task: Task) {
    setPopupTitle("Edytuj zadanie");

    setPopupContent(
      <AddEditTaskForm
        project={project ? project : ({} as Project)}
        task={task}
      />
    );

    dialogRef.current?.showModal();
  }

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
      <Popup title={popupTitle} content={popupContent} ref={dialogRef} />
      {project ? (
        <div className="p-3 flex flex-col gap-6 w-screen pt-24">
          <div className="flex justify-between">
            <h1 className="text-6xl sm:text-8xl break-words">
              {project?.name}
            </h1>

            <button
              className="text-4xl bg-white hover:bg-white text-black"
              onClick={openProjectSettings}
            >
              <IoSettingsOutline />
            </button>
          </div>

          <ProjectData project={project} />

          <section>
            <h2 className="text-4xl sm:text-6xl">Uczestnicy</h2>
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
            <div className="flex justify-between">
              <h2 className="text-4xl sm:text-6xl">Zadania</h2>
              <button
                className="text-4xl bg-white hover:bg-white text-black"
                onClick={openNewTaskPopup}
              >
                <IoAdd />
              </button>
            </div>

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

                    <button onClick={() => editTask(item)}>
                      Edytuj zadanie
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Jeszcze tu nic nie ma :(</p>
            )}
          </section>
        </div>
      ) : (
        <div className="p-3 flex flex-col justify-center h-screen">
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
