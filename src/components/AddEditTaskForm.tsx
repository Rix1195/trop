import {FormEvent, useEffect, useState} from "react";
import {Project, Task} from "../types/types";
import {deleteDoc, doc, setDoc, Timestamp} from "firebase/firestore";
import {db} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";

interface Props {
  project: Project;
  task?: Task | null;
}

export default function AddEditTaskForm({project, task}: Props) {
  const {userData} = useAuth();

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [user, setUser] = useState(userData?.name);
  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      const deadline = task.deadline.toDate();
      deadline.setMinutes(deadline.getMinutes() - deadline.getTimezoneOffset());

      setName(task.name);
      setBody(task.body);
      setUser(task.user);
      setDeadline(deadline.toISOString().slice(0, 16));
    }

    setError("");
  }, [task]);

  function clearForm(e: FormEvent) {
    e.preventDefault();

    setName("");
    setBody("");
    setUser("");
    setDeadline("");
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();

    if (name.length < 5 || name.length > 40) {
      setError("Nazwa zadania musi się mieścić między 5 a 40 znakami");
      return;
    }

    if (body.length < 8 || body.length > 100) {
      setError("Opis zadania musi się mieścić między 8 a 100 znakami");
      return;
    }

    if (!deadline) {
      setError("Wybierz właściwy termin");
    }

    setLoading(true);

    const id = Math.random().toString(16).slice(2);

    const tasksRef = doc(db, `/projects/${project.code}/tasks/${id}`);

    await setDoc(tasksRef, {
      name,
      body,
      user,
      deadline: Timestamp.fromDate(new Date(deadline)),
      id,
    })
      .then(() => location.reload())
      .catch((err) => alert(err));
  }

  async function editTask(e: FormEvent) {
    e.preventDefault();

    if (name.length < 5 || name.length > 40) {
      setError("Nazwa zadania musi się mieścić między 5 a 40 znakami");
      return;
    }

    if (body.length < 8 || body.length > 100) {
      setError("Opis zadania musi się mieścić między 8 a 100 znakami");
      return;
    }

    if (!deadline) {
      setError("Wybierz właściwy termin");
      return;
    }

    setLoading(true);

    const tasksRef = doc(db, `/projects/${project.code}/tasks/${task?.id}`);

    await setDoc(tasksRef, {
      name,
      body,
      user,
      deadline: Timestamp.fromDate(new Date(deadline)),
    })
      .then(() => location.reload())
      .catch((err) => alert(err));
  }

  async function deleteTask(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    const tasksRef = doc(db, `/projects/${project.code}/tasks/${task?.id}`);

    if (confirm("Czy chcesz usunąć to zadanie?") == true) {
      await deleteDoc(tasksRef)
        .then(() => location.reload())
        .catch((err) => alert(err));
    }
  }

  return (
    <form className="flex flex-col gap-3">
      <p>Nazwa zadania:</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        minLength={5}
        maxLength={40}
      />

      <p>Osoba:</p>
      <select
        className="text-3xl bg-gray-300 px-3 py-1"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      >
        {project.membersNames.map((user, index) => (
          <option key={index}>{user}</option>
        ))}
      </select>

      <p>Opis zadania:</p>
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        minLength={8}
        maxLength={100}
      ></textarea>

      <p>Termin:</p>
      <input
        type="datetime-local"
        value={deadline}
        required
        onChange={(e) => setDeadline(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col sm:flex-row items-start gap-3">
        <button onClick={task ? editTask : addTask} disabled={loading}>
          {task ? "Edytuj zadanie" : "Dodaj zadanie"}
        </button>
        <button onClick={clearForm} disabled={loading}>
          Wyczyść
        </button>
      </div>

      {task && (
        <button
          onClick={deleteTask}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 self-start"
        >
          Usuń
        </button>
      )}
    </form>
  );
}
