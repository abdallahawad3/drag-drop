const { DotLottie } = await import("@lottiefiles/dotlottie-web");
import { auth } from "../services/firebase";
import {
  clearErrorMessages,
  createErrorMessage,
  validationInput,
} from "../utils/validation_helpers";
import { Base } from "./Base";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Login } from "./Login";
export class Register extends Base<HTMLDivElement> {
  private _registerForm!: HTMLFormElement;
  private _emailInput!: HTMLInputElement;
  private _passwordInput!: HTMLInputElement;
  private _usernameInput!: HTMLInputElement;
  private _showLoginFormButton!: HTMLButtonElement;
  private _showPasswordButton!: HTMLButtonElement;
  private _showConfirmPasswordButton!: HTMLButtonElement;
  constructor() {
    super({
      elementId: "register-form",
      hostId: "app",
      templateId: "register-template",
      isBefore: false,
    });
    new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector("#dotlottie-canvas")! as HTMLCanvasElement,
      src: "../../../assets/img/Sign up.lottie", // replace with your .lottie or .json file URL
    });
    new DotLottie({
      autoplay: true,
      loop: true,
      canvas: document.querySelector("#register-lottie")! as HTMLCanvasElement,
      src: "../../../assets/img/Registered.lottie", // replace with your .lottie or .json file URL
    });
    this._showConfirmPasswordButton = this.element.querySelector(
      "#confirm-password+i",
    ) as HTMLButtonElement;
    this._showPasswordButton = this.element.querySelector("#password+i") as HTMLButtonElement;
    this._registerForm = this.element.querySelector(".register-form") as HTMLFormElement;
    this._usernameInput = this.element.querySelector("#username") as HTMLInputElement;
    this._emailInput = this.element.querySelector("#email") as HTMLInputElement;
    this._passwordInput = this.element.querySelector("#password") as HTMLInputElement;
    this._registerForm.addEventListener("submit", this._handelRegister.bind(this));
    this._showLoginFormButton = this.element.querySelector(".login-link") as HTMLButtonElement;
    this._showLoginFormButton.addEventListener("click", () => {
      this.element.remove();
      new Login();
    });

    this._showPasswordButton.addEventListener("click", () => {
      this._togglePasswordVisibility(this._passwordInput, this._showPasswordButton);
    });
    this._showConfirmPasswordButton.addEventListener("click", () => {
      const confirmPasswordInput = this.element.querySelector(
        "input#confirm-password",
      ) as HTMLInputElement;
      this._togglePasswordVisibility(confirmPasswordInput, this._showConfirmPasswordButton);
    });
  }

  private _togglePasswordVisibility(input: HTMLInputElement, button: HTMLButtonElement) {
    if (input.type === "password" && input.value.length > 0) {
      button.classList.add("bx-eye");
      button.classList.remove("bx-eye-slash");
      input.type = "text";
    } else {
      button.classList.remove("bx-eye");
      button.classList.add("bx-eye-slash");
      input.type = "password";
    }
  }
  private _handelRegister = (e: Event) => {
    e.preventDefault();
    const usernameValidation = validationInput({
      value: this._usernameInput.value,
      required: true,
      minLength: 3,
      maxLength: 20,
      target: "Username",
    });

    if (usernameValidation.length > 0) {
      createErrorMessage({ input: this._usernameInput, message: usernameValidation });
      return;
    }
    clearErrorMessages({ input: this._usernameInput });

    const emailValidation = validationInput({
      value: this._emailInput.value,
      required: true,
      target: "Email",
    });

    if (emailValidation.length > 0) {
      createErrorMessage({ input: this._emailInput, message: emailValidation });
      return;
    }

    clearErrorMessages({ input: this._emailInput });

    const passwordValidation = validationInput({
      value: this._passwordInput.value,
      required: true,
      minLength: 6,
      target: "Password",
    });

    if (passwordValidation.length > 0) {
      createErrorMessage({ input: this._passwordInput, message: passwordValidation });
      return;
    }
    clearErrorMessages({ input: this._passwordInput });

    const confirmPasswordInput = this.element.querySelector(
      "input#confirm-password",
    ) as HTMLInputElement;

    if (confirmPasswordInput.value.trim().length === 0) {
      createErrorMessage({
        input: confirmPasswordInput,
        message: "Please confirm your password.",
      });
      return;
    }
    clearErrorMessages({ input: confirmPasswordInput });

    if (this._passwordInput.value !== confirmPasswordInput.value) {
      createErrorMessage({
        input: confirmPasswordInput,
        message: "Passwords do not match.",
      });
      return;
    }
    clearErrorMessages({ input: confirmPasswordInput });
    this._registerUser(this._emailInput.value, this._passwordInput.value);
  };

  private _clearForm() {
    this._usernameInput.value = "";
    this._emailInput.value = "";
    this._passwordInput.value = "";
  }

  private async _registerUser(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      this._clearForm();
      return result.user;
    } catch (err) {
      createErrorMessage({ input: this._emailInput, message: (err as Error).message });
    }
  }
}
