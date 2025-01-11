import {Timestamp} from "firebase/firestore";

export interface UserData {
  id: string;
  project: string | null;
  email: string;
  projectId: string | null;
  name: string;
  isLeader: boolean;
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
}

export interface Task {
  name: string;
  user: string;
  body: string;
  deadline: Timestamp;
  id: string;
}
