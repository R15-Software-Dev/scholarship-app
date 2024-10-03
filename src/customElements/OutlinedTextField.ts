import {
  LitElement,
  html,
  css,
  nothing,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("outlined-text-field")
export class OutlinedTextField extends LitElement {
  // Input height was 44px
  static styles?: CSSResultGroup = css`
    .input-container {
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

  @property({ type: String }) accessor placeholder: string = "";
  @property({ type: String }) accessor width: string = "300px";
  @property({ type: String, attribute: "suffix-text" })
  accessor suffixText: string = "";
  @property({ type: String, attribute: "prefix-text" })
  accessor prefixText: string = "";
  @property({ type: String }) accessor pattern: string = "";
  @property({ type: Boolean, reflect: true }) accessor disabled: boolean =
    false;
  @property({ type: Boolean, reflect: true }) accessor required: boolean =
    false;
  @property({ type: String }) accessor type: string = "text";
  @property({ type: String }) accessor value: string = "";
  @property({ type: String }) accessor name: string = "";
  @property({ type: String, attribute: "error-text" })
  accessor errorText: string = "";

  private _isInvalid: boolean = false;
  private _errorText: string = "";

  @query("input") private accessor _input: HTMLInputElement;
  @query("label") private accessor _label: HTMLLabelElement;
  @query(".prefix") private accessor _prefix: HTMLSpanElement;
  @query(".suffix") private accessor _suffix: HTMLSpanElement;

  @state() protected accessor _errorVisible: boolean = false;

  get hasPrefix(): boolean {
    return this.prefixText !== "";
  }

  constructor() {
    super();
  }

  public checkValidity(): boolean {
    // This should check whether the information present here is actually
    // valid. Should change colors and add an error message if not.
    // This really will just call the checkValidity method on the
    // input element, which should do the work for us.

    // There is a case where we will return the value of _isValid, which
    // is an override for the input's validity.
    if (this._isInvalid) {
      console.debug("Custom error displayed: Not checking actual validity");
      return false;
    }
    return this._input.checkValidity();
  }

  // Should we use this method, we are responsible for resetting the
  // error state. It will block automatic error checking.
  showErrorString(msg: string): void {
    this._errorText = msg;
    this._errorVisible = true;
    this._isInvalid = true;
  }

  showErrors(): void {
    console.log("showing error");
    this._errorText = this.errorText;
    this._errorVisible = true;
  }

  hideErrors(): void {
    console.log("hiding error");
    this._errorVisible = false;
    this._isInvalid = false;
  }

  private _handleChange(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <div
          class="input-container ${classMap({ errors: this._errorVisible })}"
        >
          ${this.renderPrefix()}
          <!-- There is a space character as a placeholder, which is slightly hacky, but works with the css :placeholder-shown -->
          <input
            class=${classMap({ hasPrefix: this.hasPrefix })}
            type=${this.type}
            placeholder=" "
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name}
            pattern=${this.pattern || nothing}
            @change=${this._handleChange}
          />
          ${this.renderSuffix()}
          <label>${this.placeholder}</label>
        </div>
        <div class=${classMap({ error: true, shown: this._errorVisible })}>
          <span>${this._errorText}</span>
        </div>
      </div>
    `;
  }

  private renderPrefix(): HTMLTemplateResult {
    return html`<span
      class=${classMap({ prefix: true, hidden: !this.hasPrefix })}
      ><p>${this.prefixText}</p></span
    >`;
  }

  private renderSuffix(): HTMLTemplateResult {
    return html`<span class="suffix"><p>${this.suffixText}</p></span>`;
  }
}
