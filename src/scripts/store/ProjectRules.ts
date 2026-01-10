import type { ProjectStatus } from "../enums";
interface IProps {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  listId: string;
}
export class ProjectRules {
  public id: string;
  public title: string;
  public description: string;
  public status: ProjectStatus;
  public listId: string;
  constructor({ id, title, description, status, listId }: IProps) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.listId = listId;
  }
}
