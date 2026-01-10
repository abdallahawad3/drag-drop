interface IBaseProps {
  hostId: string;
  templateId: string;
  elementId: string;
  isBefore: boolean;
}

export class Base<T extends HTMLElement> {
  private _template: HTMLTemplateElement;
  private _host: HTMLDivElement;
  public element: T;

  constructor({ elementId, hostId, isBefore, templateId }: IBaseProps) {
    this._template = document.querySelector(`.${templateId}`) as HTMLTemplateElement;
    this._host = document.getElementById(`${hostId}`) as HTMLDivElement;
    const templateContent = document.importNode(this._template.content, true);
    this._adjustElementInHost;
    this.element = templateContent.firstElementChild as T;
    this.element.id = elementId;
    this._adjustElementInHost(isBefore);
  }

  private _adjustElementInHost(isBefore: boolean) {
    const elementPosition = isBefore ? "beforeend" : "afterbegin";
    this._host.insertAdjacentElement(elementPosition, this.element);
  }
}
