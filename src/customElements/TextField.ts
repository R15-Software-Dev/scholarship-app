import {
  LitElement,
  html,
  css,
  nothing,
  HTMLTemplateResult,
  CSSResultGroup, PropertyValues
} from "lit";
import {
  customElement,
  property,
  queryAsync,
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
      &:has(input:disabled), :has(textarea:disabled) {
        border-color: black;
        background-color: lightgray;
      }
      &.errors {
        border-color: var(--theme-error-color);
      }
      &.textarea {
        height: auto;
        transition: height 0.2s ease;;
      }
    }

    div .error {
      display: none;
      height: auto;
      width: auto;
      padding: 5px 5px 5px 8px;
      margin-bottom: 0;  

      & span {
        color: var(--theme-error-color);
      }

      &.shown {
        display: block;
      }
    }

    textarea {
      font-family: inherit;
      z-index: 1;
      font-size: 11pt;
      flex-grow: 1;
      border: none;
      padding: 2px 15px;
      padding-top: 15px;
      padding-bottom: 0;
      color: #696158;
      border-radius: 8px;
      resize: none;
      line-height: 25px;
      transition:
        height 0.2s ease;
      &:focus {
        outline: none;
      }
      &:required {
        box-shadow: none;
      }
    }

    input {
      font-family: inherit;
      z-index: 1;
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
      &:required {
        box-shadow: none;
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
      z-index: 2;
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

    textarea:focus ~ label,
    textarea:not(:placeholder-shown) ~ label {
      top: -7px;
      font-size: 11pt;
      font-color: gray;
      background-color: white;
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

  @query('label') accessor _label: HTMLLabelElement;

  //#region From InputElement
  @property({ type: Boolean }) accessor disabled = false;
  @property({ type: Boolean }) accessor required = false;

  getValue(): string {
    return this.value;
  }

  /// Must be implemented per subclass
  checkValidity(): boolean {
    return true;
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
  
  setValue(value: string) {
    // TODO Make sure this updates the front end display
    this.value = value;
  }
}

@customElement("outlined-text-field")
export class OutlinedTextField extends TextField {

  @property({ type: String }) accessor pattern = "";  // Pattern for validation
  @property({ type: String }) accessor value = "";
  @property({ type: String, attribute: "prefix-text"}) accessor prefixText = "";
  @property({ type: String, attribute: "suffix-text"}) accessor suffixText = "";
  
  @query("input") protected accessor _input: HTMLInputElement;
  @query(".prefix") protected accessor _prefix: HTMLSpanElement;
  @query(".suffix") protected accessor _suffix: HTMLSpanElement;

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
            .value=${this.value}
          />
          ${this._renderSuffix()}
          <label>${this.placeholder}</label>
        </div>
        <div class="error ${classMap({ shown: this._errorVisible })}">
          <!-- Our error will go here. For now, this is a temporary message. -->
          <span>${this.errorText}</span>
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

  protected handleInput(e: InputEvent) {
    if (this.type === "number" && isNaN(Number(e.data))) {
      this._input.value = this.value;  // Ensure value is not changed
      return;
    }
    this.value = this._input.value;
  }

  protected _renderPrefix(): HTMLTemplateResult {
    if (!this._hasPrefix)
      return html``;

    return html`
      <span class=${classMap({ prefix: true, hidden: !this._hasPrefix })}>
        <p>${this.prefixText}</p>
      </span>
    `;
  }

  protected _renderSuffix(): HTMLTemplateResult {
    if (!this._hasSuffix) return html``;

    return html`
      <span class=${classMap({ suffix: true, hidden: !this._hasSuffix })}>
        <p>${this.suffixText}</p>
      </span>
    `;
  }

  public override checkValidity(): boolean {
    return this._input.checkValidity();
  }
}

@customElement("text-area")
export class TextArea extends TextField {
  @property({ type: Number }) accessor rows = 2;
  @property({ type: String }) accessor wrap = "soft";

  @query("textarea") private accessor _textarea: HTMLTextAreaElement;

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <div class="container textarea">
          <textarea
            placeholder=" "
            name=${this.name}
            rows=${this.rows}
            wrap=${this.wrap}
            ?disabled=${this.disabled}
            ?required=${this.required}
            maxlength=${this.maxLength || nothing}
            @input=${this._handleInput}
            .value="${this.value}"
          ></textarea>
          <label>${this.placeholder}</label>
        </div>
        <div class="error ${classMap({ shown: this._errorVisible })}">
          <!-- Our error will go here. -->
          <span>${this.errorText}</span>
        </div>
      </div>
    `;
  }

  private _handleInput(e: InputEvent): void {
    this.value = this._textarea.value;

    // Enable auto-resizing of the textarea
    this._textarea.style.height = "auto";
    this._textarea.style.height = this._textarea.scrollHeight + "px";
  }

  public override getValue(): string {
    return this._textarea.value;
  }

  public override checkValidity(): boolean {
    return this._textarea.checkValidity();
  }
}

@customElement("small-outlined-text-field")
export class SmallOutlinedTextField extends OutlinedTextField {
  static override styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-direction: row;
      border: 2px solid;
      border-radius: 8px;
      border-color: var(--theme-primary-color);
      background-color: transparent;
      margin-top: 2px;
      height: 36px;
      position: relative;
      transition:
        border-color 400ms ease,
        background-color 400ms ease;
    }

    input {
      font-family: inherit;
      font-size: 10pt;
      flex-grow: 1;
      border: none;
      padding: 0 10px;
      color: #696158;
      border-radius: 6px;
      &:focus {
        outline: none;
      }
    }

    label {
      font-size: 12pt;
      position: absolute;
      left: 10px;
      top: 8px;
      transition: all 0.1s ease;
      background-color: transparent;
      padding: 0 2px;
      display: flex;
      z-index: 2;
      pointer-events: none;
    }

    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
      top: -6px;
      font-size: 10pt;
      background-color: white;
    }

    .prefix,
    .suffix {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      font-size: 10pt;
    }

    .prefix {
      margin-left: 8px;
    }

    .suffix {
      margin-right: 8px;
    }
      
    div .error {
      display: none;
      height: auto;
      width: auto;
      padding: 5px 5px 5px 8px;
      margin-bottom: 0;

      & span {
        color: var(--theme-error-color);
      }

      &.shown {
        display: block;
      }
    }
  `;
}