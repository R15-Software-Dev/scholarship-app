import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";

@customElement("form-section")
export class FormSection extends LitElement {
  static styles?: CSSResultGroup = css`
    .container {}
  `;

  @property({type: String})
  accessor header: string = "";

  @property({type: String})
  accessor name: string = "";

  @property({type: String})
  accessor id: string = "";

  @query("form")
  _formElement;

  private disableForm(): void {
    const questions = 
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr>
        <form id="form" name="${this.name}">
          <slot></slot>
          <action-button type="submit" @click=${this.disableForm}>Submit</action-button>
        </form>
      </div>
    `;
  }
}
