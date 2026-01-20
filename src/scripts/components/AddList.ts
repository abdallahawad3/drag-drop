import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ProjectStatus } from "../enums";
import { ProjectRules } from "../store/ProjectRules";
import type { Projects, ProjectsList } from "../types";
import { createErrorMessage, validationInput } from "../utils/validation_helpers";
import { Base } from "./Base";
import { v4 as uuid } from "uuid";
import { db } from "../services/firebase";
export class AddList extends Base<HTMLDivElement> {
  private _form!: HTMLFormElement;
  private _input!: HTMLInputElement;
  private listeners: Function[] = [];
  private static _instance: AddList;
  public lists: ProjectsList[] = [];
  constructor() {
    super({
      elementId: "add-list",
      hostId: "management",
      templateId: "add-list",
      isBefore: true,
    });
    this._form = this.element.querySelector(".add-list-container") as HTMLFormElement;
    this._input = this.element.querySelector(".add-list-input") as HTMLInputElement;
    this._form.addEventListener("submit", this._submitHandler.bind(this));
    this._initializeLists();
    this._notifyListeners();
    this.getAlllists();
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new AddList();
      return this._instance;
    }
    return this._instance;
  }

  private _initializeLists() {
    const isInitialized = localStorage.getItem("lists_initialized");
    if (!isInitialized) {
      this.lists = [
        { id: uuid(), name: "Initial", projects: [] },
        { id: uuid(), name: "Active", projects: [] },
        { id: uuid(), name: "Finished", projects: [] },
      ];

      localStorage.setItem("lists_initialized", "true");
    }
  }

  private _submitHandler(event: Event) {
    event.preventDefault();
    const enteredTitle = this._input.value.trim();
    const validationMessage = validationInput({
      target: "list title",
      value: enteredTitle,
      required: true,
      minLength: 3,
      maxLength: 15,
    });

    if (validationMessage.length > 0) {
      createErrorMessage({
        input: this._input,
        message: validationMessage,
      });
      return;
    }

    this.addProjectsList({
      id: uuid(),
      name: enteredTitle,
      projects: [],
    });
    this._input.value = "";
  }
  async deleteList(listId: string) {
    const ref = doc(db, "lists", listId);
    await updateDoc(ref, {
      name: "__deleted__",
    });
    this.lists = this.lists.filter((list) => list.id !== listId);
    this._notifyListeners();
  }
  async addProjectsList(list: ProjectsList) {
    try {
      const ref = doc(db, "lists", list.id);
      await setDoc(ref, list);
      this._notifyListeners();
    } catch (error) {
      console.error("Firestore Error ❌", error);
    }
  }

  public addProject(title: string, description: string, listId: string) {
    const newProject = new ProjectRules({
      id: uuid(),
      title,
      description,
      listId,
      status: ProjectStatus.Initial,
    });

    this.addProjectsToList(listId, newProject);
  }

  async updateListTitle(listId: string, newTitle: string) {
    const ref = doc(db, "lists", listId);
    await updateDoc(ref, {
      name: newTitle,
    });
  }

  async addProjectsToList(listId: string, Projects: Projects) {
    try {
      const ref = doc(db, "lists", listId);
      await updateDoc(ref, {
        projects: arrayUnion({
          id: Projects.id,
          title: Projects.title,
          description: Projects.description,
          listId: listId,
        }),
      });
      this._notifyListeners();
    } catch (error) {
      console.error("Firestore Error ❌", error);
    }
  }

  async moveProject(projectId: string, fromListId: string, toListId: string) {
    console.log("Moving project...", fromListId, toListId);
    const fromRef = doc(db, "lists", fromListId);
    const toRef = doc(db, "lists", toListId);
    const fromSnap = await getDoc(fromRef);
    const toSnap = await getDoc(toRef);
    if (!fromSnap.exists() || !toSnap.exists()) return;
    const fromData = fromSnap.data();
    const toData = toSnap.data();
    const project = fromData.projects.find((p: any) => p.id === projectId);
    if (!project) return;
    const updatedFromProjects = fromData.projects.filter((p: any) => p.id !== projectId);
    const updatedToProjects = [...toData.projects, project];
    await updateDoc(fromRef, { projects: updatedFromProjects });
    await updateDoc(toRef, { projects: updatedToProjects });
  }

  async getAlllists() {
    const lists: ProjectsList[] = [];
    const snap = await getDocs(collection(db, "lists"));
    snap.forEach((doc) => lists.push(doc.data() as ProjectsList));
    this.lists = lists.filter((list) => list.name !== "__deleted__");
    return this.lists;
  }

  async removeProjectsFromList(listId: string, ProjectsId: string) {
    const ref = doc(db, "lists", listId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const list = snap.data();
    const updatedProjects = list.projects.filter((p: any) => p.id !== ProjectsId);

    await updateDoc(ref, { projects: updatedProjects });
  }

  async updateProject(
    listId: string,
    projectId: string,
    updates: { title?: string; description?: string },
  ) {
    const ref = doc(db, "lists", listId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    const updatedProjects = data.projects.map((project: any) => {
      if (project.id === projectId) {
        return {
          ...project,
          ...updates,
        };
      }
      return project;
    });

    await updateDoc(ref, {
      projects: updatedProjects,
    });
  }

  public static pushListener(listenerFn: Function) {
    this.getInstance().addListener(listenerFn);
  }

  async deleteProject(listId: string, projectId: string) {
    const ref = doc(db, "lists", listId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("List not found");
    const data = snap.data();
    const updatedProjects = data.projects.filter((p: Projects) => p.id !== projectId);
    await updateDoc(ref, { projects: updatedProjects });
  }

  private _notifyListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn([...this.lists]);
    }
  }
  public addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }
}

export const addListInstance = AddList.getInstance();
