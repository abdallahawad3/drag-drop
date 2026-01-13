export type ADD_PROJECT_VALIDATION = {
  required: boolean;
  target: string;
  value: string;
  minLength?: number;
  maxLength?: number;
};
