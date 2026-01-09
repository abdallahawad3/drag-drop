import { ProjectStatus } from "../enums";
import { ProjectRules } from "./ProjectRules";

class ProjectState {
  private static _instance: ProjectState;
  private _projects: ProjectRules[] = [];
  private _listeners: Array<(projects: ProjectRules[]) => void> = [];
  constructor() {
    console.log(this._listeners);
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
    this._runListeners();
  }

  public addListener(listenerFn: (projects: ProjectRules[]) => void) {
    this._listeners.push(listenerFn);
  }

  private _runListeners() {
    for (const listenerFn of this._listeners) {
      listenerFn([...this._projects]);
    }
  }
}

export const projectState = ProjectState.getInstance();
