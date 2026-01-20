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
  } else if (minLength && value.trim().length < minLength) {
    return `The ${target.toUpperCase()} value must be at least ${minLength} characters long.`;
  } else if (maxLength && value.trim().length > maxLength) {
    return `The ${target.toUpperCase()} value must be at max ${maxLength} characters long.`;
  } else {
    return "";
  }
};

export const createErrorMessage = ({
  input,
  message,
  showBorder = true,
  isBefore = false,
  showStyle = false,
}: {
  input: HTMLElement;
  message: string;
  showBorder?: boolean;
  isBefore?: boolean;
  showStyle?: boolean;
}) => {
  let oldTitleError = input.parentElement?.querySelector(".error-message");
  if (oldTitleError) {
    oldTitleError.remove();
  }
  if (showBorder) {
    input.style.border = "2px solid red";
  }
  const p = document.createElement("p");
  p.className = "error-message";
  p.textContent = message;
  if (showStyle) {
    p.style.color = "red";
    p.style.fontSize = "0.9rem";
    p.style.marginTop = "4px";
    p.style.fontWeight = "500";
    p.style.fontFamily = "Arial, sans-serif";
    p.style.backgroundColor = "#ffe6e6";
    p.style.padding = "15px 10px";
    p.style.borderRadius = "4px";
    p.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    p.style.marginBottom = "8px";
  }
  if (isBefore) {
    input.insertAdjacentElement("beforebegin", p);
  } else {
    input.insertAdjacentElement("afterend", p);
  }

  // Add event listener to validate input and remove error message if valid
  input.addEventListener("input", () => {
    if (input instanceof HTMLInputElement && input.value.trim() !== "") {
      input.style.border = "1px solid #ccc";
      const errorMessages = input.parentElement?.querySelector(".error-message");
      if (errorMessages) {
        errorMessages.remove();
      }
    }
  });
};

export const clearErrorMessages = ({ input }: { input: HTMLInputElement }) => {
  input.style.border = "1px solid #ccc";
  const errorMessages = input.parentElement?.querySelector(".error-message");
  if (errorMessages) {
    errorMessages.remove();
  }
};
