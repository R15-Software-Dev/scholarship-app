import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { OutlinedTextField } from "./OutlinedTextField";

@customElement("form-question")
export class FormQuestion extends LitElement {
  static styles: CSSResultGroup = css`
    div {
      display: flex;
      flex-direction: column;
      margin: 10px;
    }
  `;
  
  @property({type: String}) accessor type: string = "";
  @property({type: String}) accessor name: string = "";
  @property({type: String}) accessor id: string = "";
  @property({type: Boolean}) accessor required: boolean = false;
  @property({type: String}) accessor label: string = "";
  @property({type: String}) accessor domain: string = "";
  @property({type: Boolean}) accessor disabled: boolean = false;
  @property({type: String}) accessor value: string = "";
  @property({type: ElementInternals}) accessor internals: ElementInternals;

  @query("outlined-text-field") private accessor _input: OutlinedTextField;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  get getInput() {
    return this._input.text;
  }

  private _handleInput(event: InputEvent) {
    this.value = (event.target as OutlinedTextField).value;
    this.internals.setFormValue(this.value);
  }

  protected render(): HTMLTemplateResult {
    // This element MUST be used within a FormSection or HTMLFormElement.
    return html`
      <div>
        <label for=${this.name}><h3><slot></slot></h3></label>
        <outlined-text-field
          placeholder=${this.label}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          suffixText=${this.domain}
          type=${this.type}
          id=${this.id}
          @change=${this._handleInput}
        ></outlined-text-field>
      </div>
    `;
  }
}
