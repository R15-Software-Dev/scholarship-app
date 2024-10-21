import {
  LitElement,
  html,
  css,
  nothing,
  HTMLTemplateResult,
  CSSResultGroup
} from "lit";
import {
  customElement,
  property,
  query,
  state
} from "lit/decorators.js";
import { InputElement } from "./InputElement";

export class TextField extends LitElement implements InputElement {
  static styles?: CSSResultGroup = css``; // No styles for now

  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Number }) accessor width = 200;  // Update this default as needed
  @property({ type: String }) accessor type = "text";  // This is the default type
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor name = "";
  @property({ type: String }) accessor errorText = "";
  @property({ type: Number }) accessor maxLength = 0;  // If 0, then no max length
  @state() accessor _errorVisible: boolean = false;
  @state() accessor _hasPrefix: boolean = false;

  @query('input') private _input: HTMLInputElement;
  @query('label') private _label: HTMLLabelElement;

  //#region From InputElement
  @property({ type: Boolean }) accessor disabled = false;
  @property({ type: Boolean }) accessor required = false;

  getValue(): string {
    return this.value;
  }

  checkValidity(): boolean {
    return this._input.checkValidity();
  }
  //#endregion

  showErrorString(errorText: string) {
    // Shows a custom error message
    this._errorVisible = true;
    this.errorText = errorText;
  }

  displayError() {
    // Shows the default error message
    this._errorVisible = true;
  }

  hideError() {
    this._errorVisible = false;
  }
}
