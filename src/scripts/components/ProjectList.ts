import type { ProjectRules } from "../store/ProjectRules";
import { projectState } from "../store/ProjectState";
import { addListInstance } from "./AddList";
import { Base } from "./Base";
import { Project } from "./Project";

interface IStatus {
  projects: ProjectRules[];
  status: string;
  listId: string;
}
export class ProjectList extends Base<HTMLDivElement> {
  private _listContainer: HTMLUListElement;
  private _editIcon: HTMLElement;
  private _addIcon: HTMLElement;
  private _closeIcon: HTMLElement;
  private _deleteIcon: HTMLElement;
  private _titleElement: HTMLHeadingElement;

  constructor({ listId, status, projects }: IStatus) {
    super({
      elementId: "project-list",
      hostId: "app",
      templateId: "projects-template",
      isBefore: true,
    });
    this._listContainer = this.element.querySelector("ul") as HTMLUListElement;
    this._editIcon = this.element.querySelector(".edit-icon") as HTMLElement;
    this._editIcon.addEventListener("click", () => {
      this._updateListTitle(this._listContainer.id);
    });
    this._addIcon = this.element.querySelector(".add-list-icon") as HTMLElement;
    this._closeIcon = this.element.querySelector(".close-list-icon") as HTMLElement;
    this._deleteIcon = this.element.querySelector(".delete-list-icon") as HTMLElement;
    this._deleteIcon.addEventListener("click", () => {
      const confirmDelete = confirm("Are you sure you want to delete this list?");
      if (confirmDelete) {
        addListInstance.deleteList(this._listContainer.id);
      }
    });
    this._titleElement = this.element.querySelector("h2") as HTMLHeadingElement;
    this._closeIcon.addEventListener("click", this._canceledUpdateListTitle.bind(this));
    this._renderProjectList({ listId, status, projects });
    this._runDragging();
  }

  private _updateListTitle(id: string) {
    this._titleElement.contentEditable = "true";
    this._titleElement.focus();
    this._editIcon.style.display = "none";
    this._addIcon.style.display = "block";
    this._closeIcon.style.display = "block";
    this._deleteIcon.style.display = "block";
    this._addIcon.addEventListener("click", () => {
      this._handleUpdateListTitle(id);
    });
  }

  private _handleUpdateListTitle(id: string) {
    const newTitle = this._titleElement.textContent!.trim();
    this._titleElement.contentEditable = "false";
    this._editIcon.style.display = "block";
    this._addIcon.style.display = "none";
    this._closeIcon.style.display = "none";
    this._deleteIcon.style.display = "none";
    addListInstance.updateListTitle(id, newTitle);
  }

  private _canceledUpdateListTitle() {
    this._titleElement.contentEditable = "false";
    this._editIcon.style.display = "block";
    this._addIcon.style.display = "none";
    this._closeIcon.style.display = "none";
    this._deleteIcon.style.display = "none";
  }
  private _renderProjectList({ listId, status, projects }: IStatus) {
    const title = this.element.querySelector(".list-header") as HTMLHeadingElement;

    title.textContent = `${status}`.toUpperCase();
    this._listContainer.id = `${listId}`;
    this._renderProjects(projects);
  }

  // We need to render projects based on their status
  private _renderProjects(projects: ProjectRules[]) {
    this._listContainer.innerHTML = "";
    for (const project of projects) {
      new Project(project, this._listContainer.id);
    }
  }

  private _runDragging() {
    this.element.addEventListener("dragover", this._handleDragOver.bind(this));
    this.element.addEventListener("dragleave", this._handleDragLeave.bind(this));
    this.element.addEventListener("drop", this._handleDrop.bind(this));
  }

  private _handleDragOver(event: DragEvent) {
    event.preventDefault();
    const list = this.element.querySelector("ul")! as HTMLUListElement;
    list.style.backgroundColor = "#f0f0f0";
    list.style.border = "2px dashed #000";
  }
  private _handleDragLeave(_: DragEvent) {
    const list = this.element.querySelector("ul")! as HTMLUListElement;
    list.style.backgroundColor = "none";
    list.style.border = "none";
  }

  private _handleDrop(event: DragEvent) {
    event.preventDefault();
    const projectId = event.dataTransfer!.getData("text/plain");

    projectState.moveProject(projectId, this._listContainer.id);
    this._handleDragLeave(event);
  }
}
