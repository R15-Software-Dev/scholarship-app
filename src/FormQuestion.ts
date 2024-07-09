import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";

@customElement("form-question")
export class FormQuestion extends LitElement {
  static styles?: CSSResultGroup = css``;


  @property({type: String})
  accessor type: string = "";

  @property({type: String})
  accessor name: string = "";

  @property({type: String})
  accessor id: string = "";

  @property({type: Boolean})
  accessor required: boolean = false;

  @property({type: String})
  accessor label: string = "";

  @property({type: String})
  accessor domain: string = "";

  @property({type: Boolean})
  accessor disabled: boolean = false;

  @query("outlined-text-field")
  private accessor _input: LitElement;
  
  protected render(): HTMLTemplateResult {
    return html``;
  }
}
