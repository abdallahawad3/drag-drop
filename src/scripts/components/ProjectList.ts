import { Base } from "./Base";

interface IStatus {
  status: "Active" | "Finished" | "Initial";
}
export class ProjectList extends Base<HTMLDivElement> {
  constructor({ status }: IStatus) {
    super({
      elementId: "project-list",
      hostId: "app",
      templateId: "projects-template",
      isBefore: true,
    });

    this._insertListTitle({ status });
  }

  private _insertListTitle({ status }: IStatus) {
    const title = this.element.querySelector(
      ".list-header"
    ) as HTMLHeadingElement;
    title.textContent = `${status} Projects`.toUpperCase();
  }
}
