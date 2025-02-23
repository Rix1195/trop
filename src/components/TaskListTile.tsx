import {Task} from "../types/types";
import {Timestamp} from "firebase/firestore";

interface Props {
  task: Task;
  index: number;
  editTask: (task: Task) => void;
}

export default function TaskListTile({task, index, editTask}: Props) {
  function formatDate(timestamp: Timestamp) {
    const date = timestamp.toDate();

    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  return (
    <div
      key={index}
      className={
        "break-words border-4 border-blue-500 p-3 flex flex-col gap-2 mb-2 " +
        `${task.isCompleted ? "opacity-70" : "opacity-100"}`
      }
    >
      <h3 className={task.isCompleted ? "line-through" : ""}>{task.name}</h3>
      <p>{task.body}</p>
      <div className="flex flex-col sm:flex-row justify-between w-full">
        <p>
          <span className="font-semibold">Osoba: </span>
          {task.user}
        </p>

        <p>
          <span className="font-semibold">Termin: </span>
          {formatDate(task.deadline)}
        </p>
      </div>

      <p>
        <span className="font-semibold">Czy zadanie jest skończone? </span>
        {task.isCompleted ? "Tak" : "Nie"}
      </p>

      <button onClick={() => editTask(task)}>Edytuj zadanie</button>
    </div>
  );
}
