import type { ProjectRules } from "../store/ProjectRules";
import { projectState } from "../store/ProjectState";
import { Base } from "./Base";

export class Project extends Base<HTMLDivElement> {
  private _project: ProjectRules;
  private _deleteBtn: HTMLElement;
  private _editBtn: HTMLElement;
  constructor(project: ProjectRules, projectListId: string) {
    super({
      elementId: project.id,
      hostId: projectListId,
      templateId: "single-project-template",
      isBefore: true,
    });

    this._deleteBtn = this.element.querySelector(".bx-trash") as HTMLElement;
    this._editBtn = this.element.querySelector(".bx-edit") as HTMLElement;

    this._project = project;
    this.element.id = project.id;
    this._renderProject();
    this._deleteBtn.addEventListener("click", this._deleteProject.bind(this));
    this._editBtn.addEventListener("click", () => {
      console.log("ID ==>", this._project.id);
    });
  }
  private _renderProject() {
    const titleElement = this.element.querySelector(".project-title") as HTMLHeadingElement;
    const descriptionElement = this.element.querySelector(".project-description") as HTMLParagraphElement;
    titleElement.textContent = this._project.title;
    descriptionElement.textContent = this._project.description;
  }

  private _deleteProject() {
    projectState.deleteProject(this._project.id);
  }
}
