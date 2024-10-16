import { LitElement } from "lit";

export interface InputElement {
  required: boolean;
  disabled: boolean;

  getValue(): string;
  checkValidity(): boolean;
  displayError(): void;
}
