import { LitElement } from "lit";

export interface InputElement extends LitElement {
  required: boolean;
  disabled: boolean;

  getValue(): string;
  checkValidity(): boolean;
  displayError(): void;
}
