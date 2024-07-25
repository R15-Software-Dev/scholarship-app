import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";


@customElement("outlined-text-field")
export class OutlinedTextField extends LitElement {
  // Input height was 44px
  static styles?: CSSResultGroup = css`
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
      transition: border-color 400ms ease,
        background-color 400ms ease;
      &:has(input:disabled) {
        border-color: black;
        background-color: lightgray;
      }
    }

    input {
      font-size: 11pt;
      flex-grow: 1;
      border: none;
      padding: 2px 15px;
      color: #696158;
      padding-right: 15px;
      padding-left: 15px;
      border-radius: 8px;
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

    input:focus ~ label, input:not(:placeholder-shown) ~ label {
      top: -7px;
      font-size: 11pt;
      font-color: gray;
      background-color: white;
    }

    input:required {
      box-shadow: none;
    }

    span .prefix {
      height: auto;
      width: auto;

    }
  `;

  @property({type: String}) accessor placeholder: string = "";
  @property({type: String}) accessor width: string = "300px";
  @property({type: String, attribute: "suffix-text"}) accessor suffixText: string = "";
  @property({type: String, attribute: "prefix-text"}) accessor prefixText: string = "";
  @property({type: String}) accessor pattern: string = "";
  @property({type: Boolean, reflect: true}) accessor disabled: boolean = false;
  @property({type: Boolean, reflect: true}) accessor required: boolean = false;
  @property({type: String}) accessor type: string = "text";
  @property({type: String}) accessor value: string = "";
  @property({type: String}) accessor name: string = "";

  @query("input") private accessor _input: HTMLInputElement;

  constructor() {
    super();
  }

  private _handleChange(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div class="container">
        ${this.renderPrefix()}
        <!-- There is a space character as a placeholder, which is slightly hacky, but works with the css :placeholder-shown -->
        <input type=${this.type} placeholder=" "
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          pattern=${this.pattern}
          @change=${this._handleChange}/>
        ${this.renderSuffix()}
        <label>${this.placeholder}</label>
      </div>
    `; 
  }

  private renderPrefix(): HTMLTemplateResult {
    return html`<span class="prefix">${this.prefixText}</span>`;
  }

  private renderSuffix(): HTMLTemplateResult {
    return html`<span class="suffix">${this.suffixText}</span>`;
  }
}
