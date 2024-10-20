export interface InputElement {
  required: boolean;
  disabled: boolean;

  getValue(): string;
  checkValidity(): boolean;
  displayError(message: string): void;
  clearError(): void;
}
