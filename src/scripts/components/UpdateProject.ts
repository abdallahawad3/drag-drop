import { ProjectStatus } from "../enums";
import { projectState } from "../store/ProjectState";
import { validationInput } from "../utils/validation_helpers";
import { addListInstance } from "./AddList";
import { Base } from "./Base";

export class UpdateProject extends Base<HTMLDivElement> {
  private _title: string;
  private _description: string;
  private _id: string;
  private _listId: string;
  private titleInput: HTMLInputElement;
  private descriptionInput: HTMLInputElement;
  private _submitBtn: HTMLButtonElement;
  private _cancelBtn: HTMLButtonElement;
  private isErrorExists: boolean = false;
  constructor(title: string, description: string, id: string, listId: string) {
    super({
      elementId: "update-project-form",
      hostId: "app",
      templateId: "update-project",
      isBefore: true,
    });
    this._listId = listId;
    this.titleInput = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInput = this.element.querySelector("#description") as HTMLInputElement;
    this._submitBtn = this.element.querySelector("button") as HTMLButtonElement;
    this._cancelBtn = this.element.querySelector(".update-icon") as HTMLButtonElement;
    this._title = title;
    this._id = id;
    this._description = description;
    this.element.classList.toggle("visible");
    this._cancelBtn.addEventListener("click", this._closeUpdateForm.bind(this));
    this._submitBtn.addEventListener("click", this._submitUpdate.bind(this));

    this._renderUpdateForm();
  }

  private _renderUpdateForm() {
    this.titleInput.value = this._title;
    this.descriptionInput.value = this._description;
  }

  private _closeUpdateForm() {
    this.element.classList.toggle("visible");
  }

  private _submitUpdate(e: Event) {
    e.preventDefault();
    const updatedTitleValidation = validationInput({
      value: this.titleInput.value,
      required: true,
      minLength: 5,
      maxLength: 50,
      target: "Title",
    });
    if (updatedTitleValidation.length > 0) {
      if (this.isErrorExists) {
        return;
      }
      this.titleInput.focus();
      this.titleInput.classList.add("error");
      this.titleInput.insertAdjacentElement(
        "afterend",
        this._createErrorMessage(updatedTitleValidation)
      );
      return;
    }

    this.titleInput.classList.remove("error");

    const updatedDescriptionValidation = validationInput({
      value: this.descriptionInput.value,
      required: true,
      minLength: 10,
      maxLength: 200,
      target: "Description",
    });
    if (updatedDescriptionValidation.length > 0) {
      if (this.isErrorExists) {
        return;
      }
      this.descriptionInput.focus();
      this.descriptionInput.insertAdjacentElement(
        "afterend",
        this._createErrorMessage(updatedDescriptionValidation)
      );
      return;
    }

    this._title = this.titleInput.value;
    this._description = this.descriptionInput.value;

    this._EditProject();
    this._closeUpdateForm();
  }

  private _createErrorMessage(messages: string): HTMLParagraphElement {
    this.isErrorExists = true;
    const errorMessage = document.createElement("p");
    errorMessage.className = "error-message";
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.8rem";
    errorMessage.style.marginTop = "0.25rem";
    errorMessage.textContent = messages;

    return errorMessage;
  }

  private _EditProject() {
    addListInstance.editProjectsInList(this._listId, {
      id: this._id,
      title: this._title,
      description: this._description,
      status: ProjectStatus.Initial,
      listId: this._listId, // You might want to pass the status if needed
    });
    projectState.EditProject(this._id, this._title, this._description);
  }
}
