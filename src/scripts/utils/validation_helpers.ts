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
