import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { createRipple, rippleCSS } from "./Ripple";

@customElement("action-button")
export class ActionButton extends LitElement {
  static styles?: CSSResultGroup = css`
    .button {
      position: relative;
      outline: 0px;
      border: 0px;
      border-radius: 6px;
      padding: 10px 25px;
      background-color: var(--theme-primary-color);
      font-size: 15pt;
      overflow: hidden;
      color: #fff;
      box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
      transition: background 400ms;
      cursor: pointer;
    }

    ${rippleCSS}
  `; 

  @property({type: String}) accessor type: string = "button";
  @property({type: String}) accessor form: string = "";
  @property({type: ElementInternals}) accessor internals: ElementInternals;

  private handleClick(event: MouseEvent): void {
    createRipple(event);
    
    if (this.type === "submit") {
      // Attempt to submit the associated form.
      // Otherwise, this event will be handled by user specified functions
      // externally.
      this.internals.form.requestSubmit();
    }
  }

  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  protected render(): HTMLTemplateResult {
    return html`
      <button class="button" type="${this.type}" @click=${this.handleClick} form=${this.form}>
        <slot></slot>
      </button>
    `;
  }
}
