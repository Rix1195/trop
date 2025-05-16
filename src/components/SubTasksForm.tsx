import {Dispatch, FormEvent, SetStateAction} from "react";
import {IoTrash} from "react-icons/io5";

interface Props {
  subTasks: Array<string>;
  setSubTasks: Dispatch<SetStateAction<Array<string>>>;
  newSubTask: string;
  setNewSubTask: Dispatch<SetStateAction<string>>;
}

export default function SubTasksForm({
  newSubTask,
  setNewSubTask,
  subTasks,
  setSubTasks,
}: Props) {
  async function addSubTask(e: FormEvent) {
    e.preventDefault();

    setSubTasks((prevSubTasks) => [...prevSubTasks, newSubTask]);
  }

  function removeSubTask(e: FormEvent, name: string) {
    e.preventDefault();

    const newSubTasks = subTasks.filter((item) => item !== name);

    setSubTasks(newSubTasks);
  }

  return (
    <div>
      <p>Podzadania</p>

      <div className="flex gap-3">
        <input
          placeholder="Tu wpisz nazwę podzadania"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
        />
        <button className="text-xl" onClick={addSubTask}>
          Dodaj
        </button>
      </div>
      {subTasks.map((item) => (
        <div className="border-[3px] border-black my-3 flex justify-between">
          <h4 className="text-xl p-2">{item}</h4>

          <button
            className="w-16 bg-red-500 hover:bg-red-600"
            onClick={(e: FormEvent) => removeSubTask(e, item)}
          >
            <IoTrash size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
