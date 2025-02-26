import {customElement, property, query} from "lit/decorators.js";
import {InputElement} from "./InputElement";
import {css, CSSResultGroup, html, HTMLTemplateResult, LitElement} from "lit";

@customElement("file-input")
export class FileInput extends LitElement implements InputElement {
  static styles: CSSResultGroup = css`
      label {
          display: block;
      }

      input {
          margin: 0.4rem 0;
      }
  `;


  @query("input")
    protected accessor fileInput: HTMLInputElement | null;
  @property({ type: File })
  get file(): File | null {
    if (this.fileInput)
      return this.fileInput.files[0];
    else return null;
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          accept=".pdf"
          ?disabled="${this.disabled}"/>
      </div>
    `;
  }

  @property({ type: Boolean, reflect: true })
    accessor disabled: boolean;
  @property({ type: String })
    accessor name: string;
  @property({ type: Boolean, reflect: true })
    accessor required: boolean;
  @property({ type: String, reflect: true })
    accessor value: string = "";

  checkValidity(): boolean {
    return true;  // for now, always valid
  }

  clearError(): void {
  }

  displayError(message: string): void {
  }

  getValue(): string {
    return JSON.stringify(this.fileInput);
  }
}
