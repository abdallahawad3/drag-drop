import { Base } from "./Base";

export class Popup extends Base<HTMLDivElement> {
  private errorMessage: string;
  private _closeBtn: HTMLButtonElement;
  private _overlay: HTMLDivElement;
  private isOpen: boolean = false;
  private _showBtn: boolean;
  private _cb: ((val: boolean) => void) | undefined;
  constructor(error: string, type: string, showBtn?: boolean, cb?: (val: boolean) => void) {
    super({
      elementId: "popup-template",
      hostId: "app",
      isBefore: false,
      templateId: "popup-template",
    });
    this._overlay = document.querySelector("#overlay")! as HTMLDivElement;
    this._closeBtn = this.element.querySelector("i")! as HTMLButtonElement;
    this.errorMessage = error;
    this._showBtn = showBtn ?? false;
    this._cb = cb;
    this._showErrorMessage(this.errorMessage, type);
    if (this._showBtn) {
      this._renderButton();
    }
    this._closeBtn.addEventListener("click", this._hideErrorMessage.bind(this));
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.isOpen) {
        this._closeDialog(e);
      }
    });
  }

  private _showErrorMessage(msg: string, type: string) {
    const title = this.element.querySelector("h2")! as HTMLHeadingElement;
    const content = this.element.querySelector(".content")! as HTMLParagraphElement;
    this.element.classList.toggle("visible");
    this._overlay.classList.toggle("visible");
    content.textContent = msg;
    title.textContent = type;
    this.isOpen = true;
  }

  private _hideErrorMessage() {
    this.element.classList.toggle("visible");
    this._overlay.classList.toggle("visible");
  }

  private _closeDialog(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.element.classList.remove("visible");
      this._overlay.classList.remove("visible");
      this.isOpen = false;
    }
  }

  private _renderButton() {
    const button = document.createElement("button");
    button.textContent = "Confirm";
    button.style.padding = "10px 20px";
    button.style.marginTop = "15px";
    button.style.border = "none";
    button.style.backgroundColor = "#dc3545";
    button.style.color = "white";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.width = "100%";
    this.element.appendChild(button);
    button.addEventListener("click", () => {
      this._cb && this._cb(true);
      this._hideErrorMessage();
    });
  }
}
