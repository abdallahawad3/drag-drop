import { Base } from "./Base";

export class Popup extends Base<HTMLDivElement> {
  private errorMessage: string;
  private _closeBtn: HTMLButtonElement;
  private _overlay: HTMLDivElement;

  constructor(error: string, type: string) {
    super({
      elementId: "popup-template",
      hostId: "app",
      isBefore: false,
      templateId: "popup-template",
    });
    this._overlay = document.querySelector("#overlay")! as HTMLDivElement;
    this._closeBtn = this.element.querySelector("i")! as HTMLButtonElement;
    this.errorMessage = error;
    this._showErrorMessage(this.errorMessage, type);
    this._closeBtn.addEventListener("click", this._hideErrorMessage.bind(this));
  }

  private _showErrorMessage(msg: string, type: string) {
    const title = this.element.querySelector("h2")! as HTMLHeadingElement;
    const content = this.element.querySelector(
      ".content"
    )! as HTMLParagraphElement;
    this.element.classList.toggle("visible");
    this._overlay.classList.toggle("visible");
    content.textContent = msg;
    title.textContent = type;
  }

  private _hideErrorMessage() {
    this.element.classList.toggle("visible");
    this._overlay.classList.toggle("visible");
  }
}
