import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("custom-button")
export class ButtonClone extends LitElement {
  @property({type: String})
  accessor text = "";

  static styles?: CSSResultGroup = css`
    .button {
      outline: 0px;
      border: 0px;
      border-radius: 6px;
      padding: 1rem 2rem;
      background-color: red;
      font-size: 1.5rem;
      overflow: hidden;
      color: #fff;
      box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
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

  createRipple(event: MouseEvent): void {
    // Credit for this code goes to Bret Cameron on css-tricks.com
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

  protected render() {
    return html`
      <form action='https://github.com/bobdafett/' method="get">
        <button class="button" type="submit" @click=${this.createRipple}>${this.text}</button>
      </form>
    `;
  }
}
