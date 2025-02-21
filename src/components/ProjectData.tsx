import {Project} from "../types/types";

interface Props {
  project: Project;
}

export default function ProjectData({project}: Props) {
  return (
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
        <span className="font-semibold">Kategoria: </span>
        {project?.category}
      </p>

      <p>
        <span className="font-semibold">Lider: </span>
        {project?.leader}
      </p>

      <p>
        <span className="font-semibold">Nazwa zespołu: </span>
        {project?.team}
      </p>
    </section>
  );
}
