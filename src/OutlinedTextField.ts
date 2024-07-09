import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";

@customElement("outlined-text-field")
export class OutlinedTextField extends LitElement {
  static styles?: CSSResultGroup = css`
    
  `;

  @property({type: String})
  accessor placeholder: string = "";


  protected render(): HTMLTemplateResult {
    return html``; 
  }
}
