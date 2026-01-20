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
  public userId: string; // Optional userId property
  constructor({ id, title, description, status, listId, userId }: IProps & { userId: string }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.listId = listId;
    this.userId = userId;
  }
}
