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

abstract class TextField extends LitElement implements InputElement {
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

  displayError(message: string): void {
    // Shows the default error message
    if (message || message !== "")
      this.errorText = message;

    this._errorVisible = true;
  }

  clearError() {
    this._errorVisible = false;
  }
}

@customElement("outlined-text-field")
export class OutlinedTextField extends TextField {
  static styles = css`
    .container {
      display: flex;
      flex-direction: row;
      border: 2px solid;
      border-radius: 8px;
      border-color: var(--theme-primary-color);
      background-color: transparent;
      margin-top: 6px;
      height: 48px;
      position: relative;
      transition:
        border-color 400ms ease,
        background-color 400ms ease;
      &:has(input:disabled) {
        border-color: black;
        background-color: lightgray;
      }
      &.errors {
        border-color: var(--theme-error-color);
      }
    }

    div .error {
      display: none;
      height: auto;
      width: auto;
      padding: 5px;
      padding-left: 8px;

      & span {
        color: var(--theme-error-color);
      }

      &.shown {
        display: block;
      }
    }

    input {
      font-size: 11pt;
      flex-grow: 1;
      border: none;
      padding: 2px 15px;
      color: #696158;
      border-radius: 8px;
      &.hasPrefix {
        padding-left: 5px;
      }
      &:focus {
        outline: none;
      }
    }

    label {
      font-size: 14pt;
      font-weight: normal;
      position: absolute;
      pointer-events: none;
      left: 15px;
      top: 13px;
      transition: all 0.1s ease;
      background-color: transparent;
      padding-right: 0.3em;
      padding-left: 0.3em;
      display: flex;
      justify-content: center;
    }

    input:required {
      box-shadow: none;
    }

    .prefix {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      margin-left: 15px;
      opacity: 0;
      transition: opacity 0.2s ease;

      &.hidden {
        display: none;
      }

      &:has(+ input:not(:placeholder-shown)),
      &:has(+ input:focus) {
        opacity: 1;
      }
    }

    .suffix {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      margin-right: 15px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
      top: -7px;
      font-size: 11pt;
      font-color: gray;
      background-color: white;
    }

    input:not(:placeholder-shown) ~ .suffix,
    input:focus ~ .suffix {
      opacity: 1;
    }
  `;

  @property({ type: String }) accessor pattern = "";  // Pattern for validation
  @property({ type: String }) accessor prefix = "";
  @property({ type: String }) accessor suffix = "";

  @query(".prefix") private _prefix: HTMLSpanElement;
  @query(".suffix") private _suffix: HTMLSpanElement;

  protected render(): HTMLTemplateResult {
    return html`
      <div class="container">
        <div>
          ${this._renderPrefix()}
          <input
            type="${this.type}"
            placeholder=" "
            value="${this.value}"
            name="${this.name}"
            pattern="${this.pattern || nothing}"
            ?disabled="${this.disabled}"
            ?required="${this.required}"
            maxlength="${this.maxLength}"
          />
          <label>${this.placeholder}</label>
          ${this._renderSuffix()}
        </div>
      </div>
    `;
  }

  private _renderPrefix(): HTMLTemplateResult {
    return html`
      <span class="prefix">${this.prefix}</span>
    `;
  }

  private _renderSuffix(): HTMLTemplateResult {
    return html`
      <span class="suffix">${this.suffix}</span>
    `;
  }
}
