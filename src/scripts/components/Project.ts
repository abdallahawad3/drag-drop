import type { ProjectRules } from "../store/ProjectRules";
import { Base } from "./Base";

export class Project extends Base<HTMLDivElement> {
  private _project: ProjectRules;

  constructor(project: ProjectRules, projectListId: string) {
    super({
      elementId: project.id,
      hostId: projectListId,
      templateId: "single-project-template",
      isBefore: true,
    });

    this._project = project;
    this.element.id = project.id;
    this._renderProject();
  }
  private _renderProject() {
    const titleElement = this.element.querySelector(".project-title") as HTMLHeadingElement;
    const descriptionElement = this.element.querySelector(".project-description") as HTMLParagraphElement;
    const trashIcon = this.element.querySelector(".bx-trash") as HTMLElement;
    const editIcon = this.element.querySelector(".bx-edit") as HTMLElement;
    trashIcon.id = this._project.id;
    editIcon.id = this._project.id;
    titleElement.textContent = this._project.title;
    descriptionElement.textContent = this._project.description;
  }
}
