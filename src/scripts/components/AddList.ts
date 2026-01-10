import type { ProjectRules } from "../store/ProjectRules";
import { Base } from "./Base";
import { v4 as uuid } from "uuid";
export class AddList extends Base<HTMLDivElement> {
  private _form: HTMLFormElement;
  private _input: HTMLInputElement;
  private _lists: { id: string; name: string; projects: ProjectRules[] }[] = localStorage.getItem(
    "projectLists"
  )
    ? JSON.parse(localStorage.getItem("projectLists")!)
    : [];
  private listeners: Function[] = [];
  private static _instance: AddList;
  constructor() {
    super({
      elementId: "add-list",
      hostId: "app",
      templateId: "add-list",
      isBefore: false,
    });
    this._form = this.element.querySelector(".add-list-container") as HTMLFormElement;
    this._input = this.element.querySelector(".add-list-input") as HTMLInputElement;
    this._form.addEventListener("submit", this._submitHandler.bind(this));
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new AddList();
      return this._instance;
    }
    return this._instance;
  }
  private _submitHandler(event: Event) {
    event.preventDefault();
    const enteredTitle = this._input.value.trim();
    if (enteredTitle.length === 0) {
      alert("Please enter a valid list name.");
      return;
    }
    const obj = {
      id: uuid(),
      name: enteredTitle,
      projects: [],
    };

    this._addList(obj);
    this._input.value = "";
  }
  private _addList(obj: { id: string; name: string; projects: ProjectRules[] }) {
    this._lists.push(obj);
    this._notifyListeners();
    this._saveListsToLocalStorage();
    window.location.reload();
  }

  public addProjectToList(listId: string, project: ProjectRules) {
    const list = this._lists.find((lst) => lst.id === listId);
    if (list) {
      list.projects.push(project);
      this._saveListsToLocalStorage();
    }
  }

  public updateProjectsInList(targetListId: string, project: ProjectRules, oldListId?: string) {
    if (oldListId && oldListId !== targetListId) {
      this.removeProjectFromList(oldListId, project.id);
    }
    const targetList = this._lists.find((lst) => lst.id === targetListId);
    if (!targetList) return;

    const alreadyExists = targetList.projects.some((p) => p.id === project.id);
    if (!alreadyExists) {
      targetList.projects.push(project);
    }
    window.location.reload();
    this._saveListsToLocalStorage();
  }

  public removeProjectFromList(listId: string, projectId: string) {
    const list = this._lists.find((lst) => lst.id === listId);
    if (list) {
      list.projects = list.projects.filter((proj) => proj.id !== projectId);
      this._saveListsToLocalStorage();
    }
  }
  public get lists() {
    return [...this._lists];
  }

  private _saveListsToLocalStorage() {
    localStorage.setItem("projectLists", JSON.stringify(this._lists));
  }

  private _notifyListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this._lists]);
    }
  }
  public addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  public updateListTitle(listId: string, newTitle: string) {
    const list = this._lists.find((lst) => lst.id === listId);
    if (list) {
      list.name = newTitle;
      this._saveListsToLocalStorage();
      this._notifyListeners();
      window.location.reload();
    }
  }

  deleteList(listId: string) {
    this._lists = this._lists.filter((lst) => lst.id !== listId);
    this._saveListsToLocalStorage();
    this._notifyListeners();
    window.location.reload();
  }

  editProjectsInList(listId: string, project: ProjectRules) {
    const list = this._lists.find((lst) => lst.id === listId);
    const projIndex = list?.projects.findIndex((proj) => proj.id === project.id);
    if (list && projIndex !== undefined && projIndex > -1) {
      list.projects[projIndex] = project;
      this._saveListsToLocalStorage();
      this._notifyListeners();
    }

    window.location.reload();
  }

  deleteProjectFromList(listId: string, projectId: string) {
    console.log(listId);
    console.log(projectId);

    const list = this._lists.find((lst) => lst.id === listId);
    if (list) {
      const newProjects = list.projects.filter((proj) => proj.id !== projectId);
      list.projects = newProjects;
      this._saveListsToLocalStorage();
      this._notifyListeners();
    }
    window.location.reload();
  }
}

export const addListInstance = AddList.getInstance();
