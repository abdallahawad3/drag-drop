import { signInWithEmailAndPassword } from "firebase/auth";
import {
  clearErrorMessages,
  createErrorMessage,
  validationInput,
} from "../utils/validation_helpers";
import { Base } from "./Base";
import { Register } from "./Register";
import { auth } from "../services/firebase";
const { DotLottie } = await import("@lottiefiles/dotlottie-web");

export class Login extends Base<HTMLDivElement> {
  private _emailInput!: HTMLInputElement;
  private _passwordInput!: HTMLInputElement;
  private _loginButton!: HTMLButtonElement;
  private _showRegisterFormButton!: HTMLButtonElement;
  private _registerForm!: HTMLFormElement;
  constructor() {
    super({
      elementId: "login-form",
      hostId: "app",
      templateId: "login",
      isBefore: true,
    });
    new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector("#login-lottie")! as HTMLCanvasElement,
      src: "../../../assets/img/register.lottie", // replace with your .lottie or .json file URL
    });

    new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector("#login-icon")! as HTMLCanvasElement,
      src: "../../../assets/img/Registered.lottie", // replace with your .lottie or .json file URL
    });
    this.element.classList.add("visible");
    this._emailInput = this.element.querySelector("#email") as HTMLInputElement;
    this._registerForm = this.element.querySelector(".login-header") as HTMLFormElement;
    this._passwordInput = this.element.querySelector("#password") as HTMLInputElement;
    this._loginButton = this.element.querySelector("button") as HTMLButtonElement;
    this._loginButton.addEventListener("click", this._handleLogin.bind(this));
    this._showRegisterFormButton = this.element.querySelector(
      ".register-link"
    ) as HTMLButtonElement;
    this._showRegisterFormButton.addEventListener("click", this._showRegisterForm.bind(this));
    this.element.addEventListener("submit", this._handleLogin.bind(this));
  }

  private _handleLogin = (event: Event) => {
    event.preventDefault();
    const email = this._emailInput.value;
    const password = this._passwordInput.value;
    const emailValid = validationInput({
      value: email,
      required: true,
      target: "Email",
    });

    if (emailValid.length > 0) {
      createErrorMessage({
        input: this._emailInput,
        message: emailValid,
      });
      return;
    }
    clearErrorMessages({ input: this._emailInput });

    const passwordValid = validationInput({
      value: password,
      required: true,
      minLength: 6,
      maxLength: 20,
      target: "Password",
    });

    if (passwordValid.length > 0) {
      createErrorMessage({
        input: this._passwordInput,
        message: passwordValid,
      });
      return;
    }
    this._loginUser(email, password);
    clearErrorMessages({ input: this._passwordInput });
    this._closeLogin();
  };

  private _closeLogin = () => {
    this.element.classList.remove("visible");
  };

  private async _loginUser(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", result.user);
      return result.user;
    } catch (err) {
      createErrorMessage({
        input: this._registerForm,
        message: "Invalid email or password.",
        showBorder: false,
        isBefore: false,
        showStyle: true,
      });
    }
  }

  private _showRegisterForm = () => {
    this.element.remove();
    new Register();
  };
}
