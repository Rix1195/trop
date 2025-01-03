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
}
