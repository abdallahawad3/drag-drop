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
  }
}
