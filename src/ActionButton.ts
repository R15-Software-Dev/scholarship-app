import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";

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

    span.ripple {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 600ms linear;
      background-color: rgba(255, 255, 255, 0.7);
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `; 

  @property({type: String}) accessor type: string = "";
  @property({type: String}) accessor form: string = "";
  @property({type: ElementInternals}) accessor internals: ElementInternals;

  @query("button") private accessor _buttonElement: HTMLButtonElement;

  createRipple(event: MouseEvent): void {
    // Credit for this code goes to Bret Cameron on css-tricks.com,
    // with some tweaks made for Typescript functionality.
    const button = event.currentTarget as HTMLButtonElement;
    
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  }

  private handleClick(event: MouseEvent): void {
    this.createRipple(event);
    
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
