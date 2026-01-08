import type { InputsType } from "../types";
import { validationInput } from "../utils/validation_helpers";

export class Fields {
  private _host: HTMLDivElement;
  private _template: HTMLTemplateElement;
  public element: HTMLFormElement;
  constructor() {
    this._host = document.querySelector("#app") as HTMLDivElement;
    this._template = document.querySelector(
      ".form-template"
    ) as HTMLTemplateElement;
    const content = document.importNode(this._template.content, true);
    this.element = content.firstElementChild as HTMLFormElement;
    this._host.insertAdjacentElement("afterbegin", this.element);

    this.element.addEventListener("submit", this._handelAddProject.bind(this));
  }

  private _handelAddProject(e: Event) {
    e.preventDefault();
    const titleInput = this._getTargetInput("title");
    const descInput = this._getTargetInput("description");
    const titleValue = this._getInputValue(titleInput);
    const descValue = this._getInputValue(descInput);

    const titleValidation = validationInput({
      maxLength: 20,
      minLength: 5,
      required: true,
      target: "title",
      value: titleValue,
    });

    if (titleValidation.length > 0) {
      alert(titleValidation);
      return;
    }
    const descValidation = validationInput({
      minLength: 5,
      maxLength: 20,
      required: true,
      target: "description",
      value: descValue,
    });

    if (descValidation.length > 0) {
      alert(descValidation);
      return;
    }

    console.log("VALIDATION ACCESS");
  }

  /**
   * Retrieves the target HTML input element based on the provided input ID.
   *
   * @param inputId - The identifier of the input element to be retrieved.
   *                  This should match the ID of the desired HTML input element.
   * @returns The HTMLInputElement corresponding to the specified input ID.
   */
  private _getTargetInput(inputId: InputsType): HTMLInputElement {
    const input = this.element.querySelector(
      `#${inputId}`
    )! as HTMLInputElement;
    return input;
  }

  /**
   * Retrieves the value of the specified HTML input element.
   *
   * @param input - The HTML input element from which to extract the value.
   * @returns The current value of the input element as a string.
   */
  private _getInputValue(input: HTMLInputElement): string {
    const inputValue = input.value;
    return inputValue;
  }
}
