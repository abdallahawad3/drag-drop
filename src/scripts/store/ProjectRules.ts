import type { ProjectStatus } from "../enums";
interface IProps {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
}
export class ProjectRules {
  public id: string;
  public title: string;
  public description: string;
  public status: ProjectStatus;
  constructor({ id, title, description, status }: IProps) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
