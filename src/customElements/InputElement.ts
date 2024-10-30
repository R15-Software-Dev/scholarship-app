export interface InputElement {
  required: boolean;
  disabled: boolean;
  name: string;

  getValue(): string;
  checkValidity(): boolean;
  displayError(message: string): void;
  clearError(): void;
}
