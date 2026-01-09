import { validationInput } from "../utils/validation_helpers";
import { Base } from "./Base";
import { Popup } from "./Popup";

export class Login extends Base<HTMLDivElement> {
  private static _instance: Login;
  private _usernameInput!: HTMLInputElement;
  private _passwordInput!: HTMLInputElement;
  private _loginIcon!: HTMLDivElement;
  private _loginButton!: HTMLButtonElement;
  public isLoggedIn: boolean = localStorage.getItem("isLoggedIn")
    ? JSON.parse(localStorage.getItem("isLoggedIn")!)
    : false;
  constructor() {
    super({
      elementId: "login-form",
      hostId: "app",
      templateId: "login",
      isBefore: true,
    });

    this._usernameInput = this.element.querySelector("#username") as HTMLInputElement;
    this._passwordInput = this.element.querySelector("#password") as HTMLInputElement;
    this._loginIcon = this.element.querySelector(".login-icon") as HTMLDivElement;
    this._loginButton = this.element.querySelector("button") as HTMLButtonElement;
    console.log(this._loginButton);
    this._loginButton.addEventListener("click", this._handleLogin.bind(this));
  }

  public static getInstance(): Login {
    if (!this._instance) {
      this._instance = new Login();
    }
    return this._instance;
  }

  private _handleLogin = (event: Event) => {
    event.preventDefault();
    const username = this._usernameInput.value;
    const password = this._passwordInput.value;
    const usernameValid = validationInput({
      value: username,
      required: true,
      minLength: 3,
      maxLength: 15,
      target: "Username",
    });

    if (usernameValid.length > 0) {
      new Popup(usernameValid, "Username Error");
      return;
    }
    const passwordValid = validationInput({
      value: password,
      required: true,
      minLength: 6,
      maxLength: 20,
      target: "Password",
    });

    if (passwordValid.length > 0) {
      new Popup(passwordValid, "Password Error");
      return;
    }

    console.log("True Values");
  };
}

export const loginComponent = Login.getInstance();
