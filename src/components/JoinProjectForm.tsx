import {doc, getDoc, writeBatch} from "firebase/firestore";
import {FormEvent, useState} from "react";
import {db} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import {Project} from "../types/types";

interface Props {
  closePopup: (e: FormEvent) => void;
}

export default function JoinProjectForm({closePopup}: Props) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {user, userData} = useAuth();

  async function handleFormSubmition(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    const projectDoc = doc(db, `/projects/${code}`);
    await getDoc(projectDoc)
      .then(async (data) => {
        const newData = data.data() as Project;

        if (newData && data.exists()) {
          const usersDoc = doc(db, `/users/${user?.uid}`);

          const batch = writeBatch(db);

          batch.update(usersDoc, {
            projectId: newData.code,
            project: newData.name,
          });

          batch.update(projectDoc, {
            membersNames: [...newData.membersNames, userData?.name],
            members: [...newData.members, userData?.email],
          });

          await batch.commit();

          location.replace("/app/project");
        } else {
          alert("Nie znaleziono tropu! Wpisz inny kod.");
        }
      })
      .catch((err) => alert(err));

    setIsLoading(false);
  }

  return (
    <form className="flex flex-col gap-3">
      <p>Wpisz 6-cyfrowy kod projektu</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></input>

      <div className="flex gap-3">
        <button
          onClick={handleFormSubmition}
          type="submit"
          className="disabled:opacity-65"
          disabled={isLoading}
        >
          Zatwierdź
        </button>
        <button
          onClick={closePopup}
          type="button"
          className="disabled:opacity-65"
          disabled={isLoading}
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}
