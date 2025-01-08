import {forwardRef, ReactNode} from "react";
import {IoClose} from "react-icons/io5";

interface Props {
  title: string;
  content: ReactNode;
}

export const Popup = forwardRef<HTMLDialogElement, Props>(function Popup(
  {content, title}: Props,
  ref
) {
  return (
    <dialog ref={ref} className="p-3 w-[80vw]">
      <div className="flex justify-between">
        <h1 className="text-6xl mb-6">{title}</h1>
        {ref && "current" in ref && (
          <button
            className="bg-white text-black hover:bg-white"
            onClick={() => ref?.current?.close()}
          >
            <IoClose />
          </button>
        )}
      </div>
      {content}
    </dialog>
  );
});
