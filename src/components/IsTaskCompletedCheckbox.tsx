import {Dispatch, SetStateAction} from "react";
import {Task} from "../types/types";

interface Props {
  task: Task;
  isCompleted: boolean;
  setIsCompleted: Dispatch<SetStateAction<boolean>>;
}

export default function IsTaskCompletedCheckbox({
  task,
  isCompleted,
  setIsCompleted,
}: Props) {
  return (
    <>
      {task && (
        <div
          className="flex items-center justify-between"
          onClick={() => setIsCompleted((prevState) => !prevState)}
        >
          <p>Czy zadanie jest skończone?</p>
          <input type="checkbox" checked={isCompleted} className="w-6 h-6" />
        </div>
      )}
    </>
  );
}
