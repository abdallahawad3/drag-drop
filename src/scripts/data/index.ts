import { v4 as uuid } from "uuid";
export const INITIAL_LISTS = [
  { id: uuid(), name: "Initial", projects: [] },
  { id: uuid(), name: "Active", projects: [] },
  { id: uuid(), name: "Finished", projects: [] },
];
