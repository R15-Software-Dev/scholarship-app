import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit-element";
import {
  customElement,
  state
} from "lit-element/decorators.js";

@customElement("file-input")
export class FileInput extends LitElement {
  static styles: CSSResultGroup = css`
      label {
          display: block;
      }

      input {
          margin: 0.4rem 0;
      }
  `;

  @state()
  private fileString: string | null = null;

  private handleFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileString = reader.result as string;
        console.log("Base64 String:", this.fileString);
      };
      reader.readAsDataURL(file); // Converts to base64 string
    } else {
      console.warn("Please upload a valid PDF file.");
    }
  }

  public getValue(): string | null {
    return this.fileString;
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          accept=".pdf"
          @change="${this.handleFileChange}" />
      </div>
    `;
  }
}
