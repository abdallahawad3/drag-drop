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

    // TODO: Implement the edit functionality
    this._editBtn.addEventListener("click", () => {
      console.log("ID ==>", this._project.id);
    });

    this._runDragging();
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

  /**
   * Initializes the drag-and-drop functionality for the project element.
   *
   * This method sets up event listeners for the `dragstart` and `dragend` events
   * on the project element. During the `dragstart` event, it prepares the necessary
   * data for the drag operation, such as the project ID. The `dragend` event is used
   * to handle any cleanup or finalization after the drag operation is completed.
   *
   * The drop event handling is expected to be implemented in the `ProjectList` component,
   * where the project status can be updated based on the drop target.
   */
  private _runDragging() {
    this.element.addEventListener("dragstart", this._handleDragStart.bind(this));
    this.element.addEventListener("dragend", this._handleDragEnd.bind(this));
  }

  /**
   * Handles the drag start event for the project element.
   * This function sets the opacity of the dragged element to indicate
   * that it is being dragged, and attaches the project ID to the drag event's
   * data transfer object for use during the drop operation.
   *
   * @param event - The DragEvent triggered when the drag operation starts.
   */
  private _handleDragStart(event: DragEvent) {
    this.element.style.opacity = "0.5";
    event.dataTransfer!.setData("text/plain", this._project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  /**
   * Handles the drag end event for the element.
   * Restores the element's opacity to its default value of "1"
   * after the drag operation is completed.
   */
  private _handleDragEnd() {
    this.element.style.opacity = "1";
  }
}
