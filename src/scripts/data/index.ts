import { v4 as uuid } from "uuid";
export const INITIAL_LISTS = [
  { id: uuid(), userId: "", name: "Initial", projects: [] },
  { id: uuid(), userId: "", name: "Active", projects: [] },
  { id: uuid(), userId: "", name: "Finished", projects: [] },
];
