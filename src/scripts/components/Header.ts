import { auth } from "../services/firebase";
import { Base } from "./Base";
import { signOut } from "firebase/auth";
export class Header extends Base<HTMLElement> {
  private _logoutIcon!: HTMLElement;
  constructor() {
    super({
      elementId: "header",
      hostId: "app",
      templateId: "header",
      isBefore: true,
    });

    this._logoutIcon = this.element.querySelector(".logo") as HTMLElement;
    this._logoutIcon.addEventListener("click", this._handleLogout.bind(this));
  }
  private async _handleLogout() {
    signOut(auth)
      .then(() => {
        setTimeout(() => {}, 300);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }
}
