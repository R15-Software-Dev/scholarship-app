import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("outlined-text-field")
export class OutlinedTextField extends LitElement {
  @property({type: String})
  accessor placeholder: string = "";

  @property({type: String})
  accessor width: string = "300px";

  @property({type: String})
  accessor text: string = "";

  // Input height was 44px
  static styles?: CSSResultGroup = css`
    .container {
      display: flex;
      border: 2px solid;
      border-radius: 8px;
      border-color: var(--theme-primary-color);
      margin-top: 6px;
      height: 48px;
      position: relative;
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
      transition: 0.1s ease all;
      background-color: white;
      padding-right: 0.3em;
      padding-left: 0.3em;
      display: flex;
      justify-content: center;
    }

    input:focus ~ label, input:not(:placeholder-shown) ~ label {
      top: -7px;
      font-size: 11pt;
      font-color: gray;
    }

    input:required {
      box-shadow: none;
    }
  `;

  private handleChange(event: Event): void {
    this.text = (event.currentTarget as HTMLInputElement).value;
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div class="container">
        <!-- There is a space character as a placeholder, which is slightly hacky, but works with the css :placeholder-shown -->
        <input type="text" placeholder=" " @change=${this.handleChange}/>
        <label>${this.placeholder}</label>
      </div>
    `; 
  }
}
