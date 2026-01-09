import { ProjectStatus } from "../enums";
import type { ProjectRules } from "../store/ProjectRules";
import { projectState } from "../store/ProjectState";
import { Base } from "./Base";
import { Project } from "./Project";

interface IStatus {
  status: "Active" | "Finished" | "Initial";
}
export class ProjectList extends Base<HTMLDivElement> {
  private _listContainer: HTMLUListElement;
  constructor({ status }: IStatus) {
    super({
      elementId: "project-list",
      hostId: "app",
      templateId: "projects-template",
      isBefore: true,
    });
    this._listContainer = this.element.querySelector("ul") as HTMLUListElement;

    this._renderProjectList({ status });
    if (localStorage.getItem("projects")!) {
      const projects = JSON.parse(localStorage.getItem("projects")!);
      const filteredProjects = this._filterProjectsByStatus(status, projects);
      this._renderProjects(filteredProjects);
    }
    // I need to push listener here to listen for state changes and render projects accordingly
    // And this function will be called whenever there is a change in the project state
    projectState.addListener((projects: ProjectRules[]) => {
      const filteredProjects = this._filterProjectsByStatus(status, projects);
      this._renderProjects(filteredProjects);
    });
  }

  private _renderProjectList({ status }: IStatus) {
    const title = this.element.querySelector(".list-header") as HTMLHeadingElement;

    title.textContent = `${status} Projects`.toUpperCase();
    this._listContainer.id = `${status}-projects-list`;
  }

  // We need to render projects based on their status
  private _renderProjects(projects: ProjectRules[]) {
    this._listContainer.innerHTML = "";
    for (const project of projects) {
      new Project(project, this._listContainer.id);
    }
  }
  private _filterProjectsByStatus(status: "Initial" | "Active" | "Finished", projects: ProjectRules[]) {
    const filteredProjects = projects.filter((project) => {
      if (status === "Initial") {
        return project.status === ProjectStatus.Initial;
      } else if (status === "Active") {
        return project.status === ProjectStatus.Active;
      } else if (status === "Finished") {
        return project.status === ProjectStatus.Finished;
      }
    });

    return filteredProjects;
  }
}
