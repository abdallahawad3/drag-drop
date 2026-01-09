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

    projectState.addListener((projects: ProjectRules[]) => {
      const filteredProjects = this._filterProjectsByStatus(status, projects);
      this._renderProjects(filteredProjects);
    });
    this._runDragging();
  }

  private _renderProjectList({ status }: IStatus) {
    const title = this.element.querySelector(".list-header") as HTMLHeadingElement;

    title.textContent = `${status} Projects`.toUpperCase();
    this._listContainer.id = `${status}-projects`;
  }

  // We need to render projects based on their status
  private _renderProjects(projects: ProjectRules[]) {
    this._listContainer.innerHTML = "";
    for (const project of projects) {
      new Project(project, this._listContainer.id);
    }
  }
  private _filterProjectsByStatus(
    status: "Initial" | "Active" | "Finished",
    projects: ProjectRules[]
  ) {
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
    // This function make two things:
    // 1. Get the project id from the drag event
    // 2. Update the project status based on the drop target [this function will take the id and the chosen status]
    const projectId = event.dataTransfer!.getData("text/plain");
    const newStatus =
      this._listContainer.id.toLocaleLowerCase() === "active-projects".toLocaleLowerCase()
        ? ProjectStatus.Active
        : this._listContainer.id.toLocaleLowerCase() === "finished-projects".toLocaleLowerCase()
        ? ProjectStatus.Finished
        : ProjectStatus.Initial;
    projectState.moveProject(projectId, newStatus);
    this._handleDragLeave(event);
  }
}
