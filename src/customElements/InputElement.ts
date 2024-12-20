export interface InputElement extends HTMLElement {
  required: boolean;
  disabled: boolean;
  name: string;
  id: string;

  getValue(): string;
  setValue(value: string | number | boolean | string[]): void;
  checkValidity(): boolean;
  displayError(message: string): void;
  clearError(): void;
}
