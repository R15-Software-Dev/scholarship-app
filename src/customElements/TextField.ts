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
import { classMap } from "lit/directives/class-map.js";

type FieldTypes = "text" | "password" | "email" | "tel" | "number";

abstract class TextField extends LitElement implements InputElement {
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

  @property({ type: String }) accessor label = "";
  @property({ type: String }) accessor placeholder = "";
  @property({ type: Number }) accessor width = 200;  // Update this default as needed
  @property({ type: String }) accessor type: FieldTypes = "text";  // This is the default type
  @property({ type: String }) accessor value = "";
  @property({ type: String }) accessor name = "";
  @property({ type: String, attribute: "error-text" }) accessor errorText = "";
  @property({ type: Number }) accessor maxLength = 0;  // If 0, then no max length
  @state() accessor _errorVisible: boolean = false;

  @query('input') accessor _input: HTMLInputElement;
  @query('label') accessor _label: HTMLLabelElement;

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

  @property({ type: String }) accessor pattern = "";  // Pattern for validation
  @property({ type: String, attribute: "prefix-text"}) accessor prefixText = "";
  @property({ type: String, attribute: "suffix-text"}) accessor suffixText = "";

  @query(".prefix") private _prefix: HTMLSpanElement;
  @query(".suffix") private _suffix: HTMLSpanElement;

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <div class="container">
          ${this._renderPrefix()}
          <input
            class=${classMap({ hasPrefix: this._hasPrefix })}
            type=${this.type}
            placeholder=" "
            name=${this.name}
            pattern=${this.pattern || nothing}
            ?disabled=${this.disabled}
            ?required=${this.required}
            maxlength=${this.maxLength || nothing}
            @input=${this.handleInput}
          />
          ${this._renderSuffix()}
          <label>${this.placeholder}</label>
        </div>
      </div>
    `;
  }

  get _hasPrefix(): boolean {
    if (this.prefixText === "" || !this.prefixText) return false;
    return true;
  }

  get _hasSuffix(): boolean {
    if (this.suffixText === "" || !this.suffixText) return false;
    return true;
  }

  private handleInput(e: InputEvent) {
    if (this.type === "number" && isNaN(Number(e.data))) {
      this._input.value = this.value;  // Ensure value is not changed
      return;
    }
    this.value = this._input.value;
  }

  private _renderPrefix(): HTMLTemplateResult {
    if (!this._hasPrefix)
      return html``;

    return html`
      <span class=${classMap({ prefix: true, hidden: !this._hasPrefix })}>
        <p>${this.prefixText}</p>
      </span>
    `;
  }

  private _renderSuffix(): HTMLTemplateResult {
    if (!this._hasSuffix) return html``;

    return html`
      <span class=${classMap({ suffix: true, hidden: !this._hasSuffix })}>
        <p>${this.suffixText}</p>
      </span>
    `;
  }
}

@customElement("text-area")
export class TextArea extends TextField {
  @property({ type: String }) accessor rows = "4";
  @property({ type: String }) accessor wrap = "soft";

  @query("textarea") private accessor _textarea: HTMLTextAreaElement;

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <div class="container">
          <textarea
            placeholder=" "
            name=${this.name}
            rows=${this.rows}
            wrap=${this.wrap}
            ?disabled=${this.disabled}
            ?required=${this.required}
            maxlength=${this.maxLength || nothing}
          ></textarea>
          <label>${this.placeholder}</label>
        </div>
      </div>
    `;
  }

  public override getValue(): string {
    return this._textarea.value;
  }
}
