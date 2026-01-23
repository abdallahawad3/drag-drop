import type { Projects } from "../types";
import { addListInstance } from "./AddList";
import { Base } from "./Base";
import { Popup } from "./Popup";
import { Project } from "./Project";
import type { ProjectsList } from "../types/index";
import { Toast } from "./Toast";
export class ProjectList extends Base<HTMLDivElement> {
  private _listContainer: HTMLUListElement;
  private _editIcon: HTMLElement;
  private _addIcon: HTMLElement;
  private _closeIcon: HTMLElement;
  private _deleteIcon: HTMLElement;
  private _titleElement: HTMLHeadingElement;
  public list: ProjectsList[];
  private _lastTitleStatus: string = "";

  constructor({ listId, status }: { listId: string; status: string; projects: Projects[] }) {
    super({
      elementId: "project-list",
      hostId: "content",
      templateId: "projects-template",
      isBefore: true,
    });
    this._listContainer = this.element.querySelector("ul") as HTMLUListElement;
    this._titleElement = this.element.querySelector("h2") as HTMLHeadingElement;
    this._editIcon = this.element.querySelector(".edit-icon") as HTMLElement;
    this._addIcon = this.element.querySelector(".add-list-icon") as HTMLElement;
    this._closeIcon = this.element.querySelector(".close-list-icon") as HTMLElement;
    this._deleteIcon = this.element.querySelector(".delete-list-icon") as HTMLElement;
    this.list = [];
    this._listContainer.id = listId;
    const currentList = addListInstance.lists.find((l) => l.id === listId);
    if (currentList) {
      this._titleElement.textContent = currentList.name;
      const header = this.element.querySelector(".list-header") as HTMLElement;
      if (header) header.textContent = status;
      this._renderProjects(currentList.projects);
    } else {
      this._titleElement.textContent = status;
      const header = this.element.querySelector(".list-header") as HTMLElement;
      if (header) header.textContent = status;
    }

    this._setupEventListeners(listId);
    this._runDragging();

    const updatedList = addListInstance.lists.find((l) => l.id === listId);
    if (!updatedList) {
      this.element.remove();
      return;
    }

    this._titleElement.textContent = updatedList.name;
    this._renderProjects(updatedList.projects);
  }

  private _setupEventListeners(listId: string) {
    this._lastTitleStatus = this._titleElement.textContent || "";
    this._editIcon.addEventListener("click", () => this._updateListTitle(listId));
    this._closeIcon.addEventListener("click", this._canceledUpdateListTitle.bind(this));
    this._deleteIcon.addEventListener("click", () => {
      if (addListInstance.lists.length <= 1) {
        new Popup("At least one list must exist.", "Cannot Delete List");
        return;
      }

      new Popup(
        "Are you sure you want to delete this list? All projects in this list will be lost.",
        "Delete List",
        true,
        (confirm: boolean) => {
          if (confirm) {
            addListInstance.deleteList(listId);
            this.element.remove();
          }
        },
      );
    });
  }

  private _updateListTitle(id: string) {
    this._titleElement.contentEditable = "true";
    this._titleElement.focus();
    this._editIcon.style.display = "none";
    this._addIcon.style.display = "block";
    this._closeIcon.style.display = "block";
    this._deleteIcon.style.display = "none";
    this._addIcon.addEventListener("click", () => {
      this._handleUpdateListTitle(id);
    });
  }

  private _handleUpdateListTitle(id: string) {
    const newTitle = this._titleElement.textContent!.trim();
    if (newTitle.length === 0) {
      const toast = Toast.getInstance();
      toast.show("List title cannot be empty.", { type: "error" });
      this._titleElement.textContent = this._lastTitleStatus;
      this._titleElement.contentEditable = "false";
      this._editIcon.style.display = "block";
      this._addIcon.style.display = "none";
      this._closeIcon.style.display = "none";
      return;
    }

    if (newTitle.length < 3) {
      const toast = Toast.getInstance();
      toast.show("List title must be at least 3 characters long.", { type: "error" });
      this._titleElement.textContent = this._lastTitleStatus;
      this._titleElement.contentEditable = "false";
      this._editIcon.style.display = "block";
      this._addIcon.style.display = "none";
      this._closeIcon.style.display = "none";
      return;
    }

    if (newTitle.length > 20) {
      const toast = Toast.getInstance();
      toast.show("List title cannot exceed 20 characters.", { type: "error" });
      this._titleElement.textContent = this._lastTitleStatus;
      this._titleElement.contentEditable = "false";
      this._editIcon.style.display = "block";
      this._addIcon.style.display = "none";
      this._closeIcon.style.display = "none";
      return;
    }
    this._titleElement.contentEditable = "false";
    this._editIcon.style.display = "block";
    this._addIcon.style.display = "none";
    this._closeIcon.style.display = "none";
    addListInstance.updateListTitle(id, newTitle);
  }

  private _canceledUpdateListTitle() {
    this._titleElement.textContent = this._lastTitleStatus;
    this._titleElement.contentEditable = "false";
    this._editIcon.style.display = "block";
    this._addIcon.style.display = "none";
    this._closeIcon.style.display = "none";
  }

  // We need to render projects based on their status
  private _renderProjects(projects: Projects[]) {
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
    list.style.border = "2px dashed #fff";
    list.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  }
  private _handleDragLeave(_: DragEvent) {
    const list = this.element.querySelector("ul")! as HTMLUListElement;
    list.style.backgroundColor = "none";
    list.style.border = "none";
  }
  private async _handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const toUList = this.element.querySelector("ul") as HTMLUListElement;
    if (!toUList) return;
    const projectId = event.dataTransfer?.getData("text/plain");
    const fromListId = event.dataTransfer?.getData("application/x-from-list-id");
    if (!projectId || !fromListId) {
      console.warn("Missing drag data — drop cancelled");
      return;
    }
    const fromUList = document.getElementById(fromListId) as HTMLUListElement | null;
    // Clean up visual feedback
    toUList.style.border = "none";
    toUList.style.backgroundColor = "";

    if (!fromUList) {
      console.warn("Source list not found:", fromListId);
      return;
    }

    if (fromUList === toUList) {
      console.log("Dropped in the same list — no move needed");
      return;
    }
    const projectElement = document.getElementById(projectId) as HTMLLIElement | null;
    if (projectElement) {
      toUList.appendChild(projectElement);
    } else {
      console.warn("Project element not found:", projectId);
    }
    await addListInstance.moveProject(projectId, fromUList.id, toUList.id);
  }
}
