import type { ADD_PROJECT_VALIDATION } from "../validation/AddProjectValidation";

export const validationInput = ({
  target,
  maxLength,
  minLength,
  required,
  value,
}: ADD_PROJECT_VALIDATION) => {
  if (required && value.trim().length === 0) {
    return `The ${target.toUpperCase()} value is required.`;
  } else if (required && value.trim().length < minLength) {
    return `The ${target.toUpperCase()} value must be at least ${minLength} characters long.`;
  } else if (required && value.trim().length > maxLength) {
    return `The ${target.toUpperCase()} value must be at max ${maxLength} characters long.`;
  } else {
    return "";
  }
};

export const createErrorMessage = ({ input, message }: { input: HTMLElement; message: string }) => {
  let oldTitleError = input.parentElement?.querySelector(".error-message");
  if (oldTitleError) {
    oldTitleError.remove();
  }
  input.style.border = "2px solid red";
  const p = document.createElement("p");
  p.className = "error-message";
  p.textContent = message;
  input.insertAdjacentElement("afterend", p);
};

export const clearErrorMessages = ({ input }: { input: HTMLInputElement }) => {
  input.style.border = "1px solid #ccc";
  const errorMessages = input.parentElement?.querySelector(".error-message");
  if (errorMessages) {
    errorMessages.remove();
  }
};
