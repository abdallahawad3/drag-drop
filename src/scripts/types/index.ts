export type InputsType = "title" | "description";
export interface Projects {
  id: string;
  title: string;
  description: string;
}

export interface ProjectsList {
  id: string;
  name: string;
  projects: Projects[];
}
