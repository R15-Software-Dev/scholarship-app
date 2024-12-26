export interface InputElement extends HTMLElement {
  required: boolean;
  disabled: boolean;
  name: string;
  id: string;
  value: string | boolean | string[] | number;

  getValue(): string;
  checkValidity(): boolean;
  displayError(message: string): void;
  clearError(): void;
}
