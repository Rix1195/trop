import {Timestamp} from "firebase/firestore";

export interface UserData {
  id: string;
  project: string | null;
  email: string;
  projectId: string | null;
  name: string;
  isLeader: boolean;
}

export enum ProjectCategory {
  Braterstwo = "Braterstwo",
  Człowiek = "Człowiek",
  Inicjatywa = "Inicjatywa",
  Odkrywanie = "Odkrywanie",
  Zaradność = "Zaradność",
  Ojczyzna = "Ojczyzna",
  Natura = "Natura",
}

export interface Project {
  code: string;
  goal: string;
  name: string;
  leader: string;
  team: string;
  members: Array<string>;
  tasks: Map<string, string>;
  membersNames: Array<string>;
  hasService: boolean;
  category: ProjectCategory;
}

export interface Task {
  name: string;
  user: string;
  body: string;
  deadline: Timestamp;
  isCompleted: boolean;
  id: string;
}
