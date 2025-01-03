import {doc, getDoc} from "firebase/firestore";
import React, {useEffect, useState} from "react";
import {db} from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import {Project} from "../types/types";

export default function ProjectScreen() {
  const {userData} = useAuth();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (userData?.projectId) {
      const projectRef = doc(db, `projects/${userData?.projectId}`);

      (async () => {
        await getDoc(projectRef)
          .then((doc) => setProject(doc.data() as Project))
          .catch((err) => alert(err));
      })();
    }
  }, [userData?.projectId]);

  return (
    <div className="p-3">
      <h1>{project?.name}</h1>

      <div className="flex sm:flex-row flex-col justify-between sm:gap-0 gap-3 mt-9">
        <div className="flex-1">
          <h2>Dane</h2>

          <ul className="text-3xl">
            <li>Nazwa: {project?.name}</li>
            <li>Nazwa zespołu: {project?.team}</li>
            <li>Lider: {project?.leader}</li>
            <li>Cel: {project?.goal}</li>
          </ul>
        </div>

        <div className="vertical-separator"></div>

        <div className="flex-1">
          <h2>Członkowie</h2>

          <ul className="text-3xl">
            {project?.members.map((member) => (
              <li>{member}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
