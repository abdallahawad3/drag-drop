import { ProjectStatus } from "../enums";
import { ProjectRules } from "./ProjectRules";

class ProjectState {
  private static _instance: ProjectState;
  private _projects: ProjectRules[] = [];
  private _listeners: Array<(projects: ProjectRules[]) => void> = [];
  private _localStorageProjects: ProjectRules[] = localStorage.getItem("projects") ? JSON.parse(localStorage.getItem("projects")!) : [];
  constructor() {
    this._projects = this._localStorageProjects;
  }

  /**
   * Retrieves the singleton instance of the `ProjectState` class.
   * If an instance does not already exist, it creates and initializes one.
   *
   * @returns The singleton instance of `ProjectState`.
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new ProjectState();
      return new ProjectState();
    }
    return this._instance;
  }

  /**
   * Creates a new project and adds it to the project list.
   *
   * @param title - The title of the project.
   * @param description - A brief description of the project.
   */
  public createProject(title: string, description: string) {
    const newProject = new ProjectRules({
      id: Math.random().toString(),
      title,
      description,
      status: ProjectStatus.Initial,
    });

    this._projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(this._projects));
    this._runListeners();
  }

  public deleteProject(projectId: string) {
    this._projects = this._projects.filter((project) => project.id !== projectId);
    localStorage.setItem("projects", JSON.stringify(this._projects));
    this._runListeners();
  }

  public EditProject(projectId: string, title: string, description: string) {
    const project = this._projects.find((proj) => proj.id === projectId);
    if (project) {
      project.title = title;
      project.description = description;
      localStorage.setItem("projects", JSON.stringify(this._projects));
      this._runListeners();
    }
  }

  /**
   * Registers a listener function that will be called whenever the state of projects changes.
   * The listener function receives an updated array of `ProjectRules` as its argument.
   *
   * @param listenerFn - A callback function that will be invoked with the updated list of projects.
   */
  public addListener(listenerFn: (projects: ProjectRules[]) => void) {
    this._listeners.push(listenerFn);
  }

  /**
   * Invokes all registered listener functions, passing a copy of the current projects array
   * to each listener. This ensures that listeners are notified of any changes to the projects.
   */
  private _runListeners() {
    for (const listenerFn of this._listeners) {
      listenerFn([...this._projects]);
    }
  }
}

export const projectState = ProjectState.getInstance();
