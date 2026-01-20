import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ProjectStatus } from "../enums";
import { ProjectRules } from "../store/ProjectRules";
import type { Projects, ProjectsList } from "../types";
import { createErrorMessage, validationInput } from "../utils/validation_helpers";
import { Base } from "./Base";
import { v4 as uuid } from "uuid";
import { auth, db } from "../services/firebase";
import { ProjectList } from "./ProjectList";
import { Project } from "./Project";
import { Toast } from "./Toast";
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

  /**
   * Retrieves the singleton instance of the `AddList` class.
   * If the instance does not already exist, it creates a new one.
   *
   * @returns The singleton instance of the `AddList` class.
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new AddList();
      return this._instance;
    }
    return this._instance;
  }

  /**
   * Initializes the default lists for the application if they have not been set up already.
   * This method checks the local storage for an initialization flag (`lists_initialized`).
   * If the flag is not present, it creates three default lists: "Initial", "Active", and "Finished",
   * each associated with the current user's ID, and stores them in the `lists` property.
   * Finally, it sets the initialization flag in local storage to prevent reinitialization.
   */
  private _initializeLists() {
    const isInitialized = localStorage.getItem("lists_initialized");
    if (!isInitialized) {
      this.lists = [
        { id: uuid(), userId: auth.currentUser?.uid || "", name: "Initial", projects: [] },
        { id: uuid(), userId: auth.currentUser?.uid || "", name: "Active", projects: [] },
        { id: uuid(), userId: auth.currentUser?.uid || "", name: "Finished", projects: [] },
      ];

      localStorage.setItem("lists_initialized", "true");
    }
  }

  /**
   * Handles the submission of the form to add a new project list.
   *
   * @param event - The event object triggered by the form submission.
   *
   * @remarks
   * This method validates the input for the list title, ensuring it meets the
   * required criteria (e.g., non-empty, within the specified length range).
   * If validation fails, an error message is displayed next to the input field.
   *
   * If the user is authenticated, a new project list is created with a unique ID,
   * associated with the current user's ID, and added to the list of projects.
   * The input field is cleared after successful submission.
   *
   * @throws Error - Throws an error if the user is not logged in.
   */
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

    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    this.addProjectsList({
      id: uuid(),
      name: enteredTitle,
      userId: user.uid,
      projects: [],
    });
    this._input.value = "";
  }

  /**
   * Deletes a list by its ID. This method updates the list's name in the database
   * to "__deleted__", removes the list from the local `lists` array, and notifies
   * listeners about the change.
   *
   * @param listId - The unique identifier of the list to be deleted.
   * @returns A promise that resolves when the list has been successfully updated
   *          in the database and removed locally.
   */
  async deleteList(listId: string) {
    const ref = doc(db, "lists", listId);
    await updateDoc(ref, {
      name: "__deleted__",
    });
    this.lists = this.lists.filter((list) => list.id !== listId);
    document.getElementById(listId)?.remove();
    const toast = Toast.getInstance();
    toast.show("List deleted successfully!", {
      duration: 2000,
      position: "top-right",
      type: "success",
    });
    this._notifyListeners();
  }

  /**
   * Adds a new project list to the database and initializes it locally.
   *
   * @param list - The project list object to be added. It includes properties
   * such as `id`, `name`, `userId`, and `projects`.
   *
   * @remarks
   * This method ensures that the list is associated with the currently authenticated user.
   * It saves the list to Firestore, updates the local `lists` array, and notifies listeners
   * about the change. Additionally, it creates a new `ProjectList` instance for the added list.
   *
   * @throws Error - Throws an error if the user is not authenticated or if there is an issue
   * with Firestore operations.
   */
  async addProjectsList(list: ProjectsList) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const listInstance = new ProjectList({
        listId: list.id,
        status: list.name,
        projects: [],
      });
      const content = document.getElementById("content") as HTMLElement;
      content.insertAdjacentElement("afterbegin", listInstance.element);
      const ref = doc(db, "lists", list.id);
      await setDoc(ref, {
        ...list,
        userId: user.uid,
        createdAt: new Date(),
      }).then(() => {
        const toast = Toast.getInstance();
        toast.show("List added successfully!", {
          duration: 3000,
          position: "top-right",
          type: "success",
        });
      });
      new ProjectList({
        listId: list.id,
        status: list.name,
        projects: [],
      });

      this._notifyListeners();
    } catch (error) {
      console.error("Firestore Error ❌", error);
    }
  }

  /**
   * Adds a new project to a specified list.
   *
   * @param title - The title of the project to be added.
   * @param description - A brief description of the project.
   * @param listId - The unique identifier of the list to which the project will be added.
   *
   * @remarks
   * This method creates a new project using the `ProjectRules` class, assigning it a unique ID,
   * the specified title, description, and list ID. The project is also associated with the
   * currently authenticated user. Once created, the project is added to the specified list
   * using the `addProjectsToList` method.
   *
   * @throws Error - Throws an error if the user is not authenticated.
   */
  public addProject(title: string, description: string, listId: string) {
    const newProject = new ProjectRules({
      id: uuid(),
      title,
      description,
      listId,
      status: ProjectStatus.Initial,
      userId: auth.currentUser ? auth.currentUser.uid : "",
    });

    this.addProjectsToList(listId, newProject);
  }

  /**
   * Updates the title of a list in the database.
   *
   * @param listId - The unique identifier of the list to be updated.
   * @param newTitle - The new title to set for the list.
   * @returns A promise that resolves when the list title has been successfully updated.
   */
  async updateListTitle(listId: string, newTitle: string) {
    const ref = doc(db, "lists", listId);
    await updateDoc(ref, {
      name: newTitle,
    });
    const toast = Toast.getInstance();
    toast.show("List title updated successfully!", {
      duration: 2000,
      position: "top-right",
      type: "success",
    });
  }

  /**
   * Adds a project to the specified list in the Firestore database.
   *
   * @param listId - The unique identifier of the list to which the project will be added.
   * @param Projects - An object containing the project details, including:
   *   - `id`: The unique identifier of the project.
   *   - `title`: The title of the project.
   *   - `description`: A brief description of the project.
   *
   * This method updates the Firestore document for the specified list by appending
   * the project to the `projects` array. After updating the list, it refreshes the
   * list data by calling `getAlllists` and notifies listeners of the change.
   *
   * @throws Will log an error to the console if the Firestore operation fails.
   */
  async addProjectsToList(listId: string, Projects: Projects) {
    try {
      const listUl = document.getElementById(listId) as HTMLUListElement;

      const newProject = new Project(
        { description: Projects.description, id: Projects.id, title: Projects.title },
        listId,
      );

      const ref = doc(db, "lists", listId);
      await updateDoc(ref, {
        projects: arrayUnion({
          id: Projects.id,
          title: Projects.title,
          description: Projects.description,
          listId: listId,
        }),
      }).then(() => {
        const toast = Toast.getInstance();
        toast.show("Project added to list successfully!", {
          duration: 2000,
          position: "top-right",
          type: "success",
        });
      });

      listUl.insertAdjacentElement("beforeend", newProject.element);
    } catch (error) {
      console.error("Firestore Error ❌", error);
    }
  }

  /**
   * Moves a project from one list to another in the database.
   *
   * @param projectId - The ID of the project to be moved.
   * @param fromListId - The ID of the list from which the project will be removed.
   * @param toListId - The ID of the list to which the project will be added.
   *
   * @remarks
   * This function retrieves the data for both the source and destination lists,
   * verifies their existence, and updates their respective `projects` arrays.
   * If the project or either list does not exist, the function exits without making changes.
   *
   * @throws Will throw an error if the database operations fail.
   */
  async moveProject(projectId: string, fromListId: string, toListId: string) {
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
    const toast = Toast.getInstance();
    toast.show("Project moved successfully!", {
      duration: 2000,
      position: "top-right",
      type: "success",
    });
  }

  /**
   * Retrieves all project lists associated with the currently authenticated user,
   * excluding those marked as deleted (with the name "__deleted__").
   *
   * @returns {Promise<ProjectsList[]>} A promise that resolves to an array of project lists.
   * If no user is authenticated, an empty array is returned.
   */
  async getAlllists() {
    const user = auth.currentUser;
    if (!user) return [];

    const lists: ProjectsList[] = [];

    const q = query(collection(db, "lists"), where("userId", "==", user.uid));

    const snap = await getDocs(q);
    snap.forEach((doc) => lists.push(doc.data() as ProjectsList));

    this.lists = lists.filter((list) => list.name !== "__deleted__");
    return this.lists;
  }

  /**
   * Updates a specific project within a list by applying the provided updates.
   *
   * @param listId - The ID of the list containing the project to update.
   * @param projectId - The ID of the project to be updated.
   * @param updates - An object containing the fields to update in the project.
   *                   - `title` (optional): The new title for the project.
   *                   - `description` (optional): The new description for the project.
   *
   * @remarks
   * This method retrieves the list document from the database, updates the specified
   * project within the `projects` array, and saves the changes back to the database.
   * After updating, it refreshes the list data and notifies listeners of the change.
   * If the list does not exist, the method exits without making any changes.
   *
   * @returns A promise that resolves when the project has been successfully updated.
   */
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
        const updatedProject = {
          ...project,
          ...updates,
        };

        // Render the updated project
        const projectElement = document.getElementById(projectId) as HTMLElement;
        if (projectElement) {
          const titleElement = projectElement.querySelector(".project-title") as HTMLElement;
          const descriptionElement = projectElement.querySelector(
            ".project-description",
          ) as HTMLElement;

          if (titleElement && updates.title) {
            titleElement.textContent = updates.title;
          }

          if (descriptionElement && updates.description) {
            descriptionElement.textContent = updates.description;
          }
        }
        const toast = Toast.getInstance();
        toast.show("Project updated successfully!", {
          duration: 2000,
          position: "top-right",
          type: "success",
        });
        return updatedProject;
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

  /**
   * Deletes a project from a specific list in the database.
   *
   * @param listId - The unique identifier of the list containing the project.
   * @param projectId - The unique identifier of the project to be deleted.
   * @throws {Error} If the specified list is not found in the database.
   * @remarks
   * This method retrieves the list from the database, removes the specified project
   * from the list's projects array, and updates the database with the modified list.
   * After the update, it refreshes the list of all lists and notifies listeners of the change.
   */
  async deleteProject(listId: string, projectId: string) {
    const ref = doc(db, "lists", listId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("List not found");
    const data = snap.data();
    const updatedProjects = data.projects.filter((p: Projects) => p.id !== projectId);
    const projectElement = document.getElementById(projectId) as HTMLElement;
    if (projectElement) {
      projectElement.remove();
    }
    const toast = Toast.getInstance();
    toast.show("Project deleted successfully!", {
      duration: 2000,
      position: "top-right",
      type: "success",
    });
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
