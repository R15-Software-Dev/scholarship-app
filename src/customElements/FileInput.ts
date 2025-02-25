import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit-element";
import {
  customElement,
} from "lit-element/decorators.js";

@customElement("file-input")
export class FileInput extends LitElement {
  static styles: CSSResultGroup = css `
    label {
      display: block;
    }

    input {
      margin: 0.4rem 0;
    }
  `;

  protected render(): HTMLTemplateResult {
    return html `
      <div>
        <input type="file" id="fileUpload" name="fileUpload" accept=".pdf" />
      </div>

    `
  }

}

