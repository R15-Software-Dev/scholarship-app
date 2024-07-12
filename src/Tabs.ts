import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, queryAssignedElements } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRipple, rippleCSS } from "./Ripple";

// This element should render a bar that contains our TabElements.
// It will create a space where we can detect changes to our tabs, and show the correct TabPanel
// when needed. It will also handle disabled tabs.

@customElement('tab-bar')
export class TabBar extends LitElement {
  static styles?: CSSResultGroup = css`
    slot[name=tab]::slotted("tab"):disabled {
      
    }

    slot[name=panel]::slotted(*) .active {
      
    }
  `;

  @property({type: String}) accessor test: string = "";

  @queryAssignedElements({selector: "tab"}) private accessor tabs: Tab[];

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <!-- We must be able to query and get events from the elements within the -->
        <!-- shadow DOM. This will allow us to show the correct TabPanel elements. -->
        <slot name="tab"></slot>
        <slot name="panel"></slot>
      </div>
    `;
  }
}

@customElement("custom-tab")
export class Tab extends LitElement {
  static styles?: CSSResultGroup = css`
    .button {
      width: 100px;
      position: relative;
      overflow: hidden;
      transition: background-color 400ms ease;
      user-select: none;
      &:hover {
        background-color: lightgray;
      }
      &.disabled {
        background-color: gray;
        pointer-events: none;
      }
    }

    ${rippleCSS}
  `;

  @property({type: String, attribute: "panel-id"}) accessor panelId: string = "";
  @property({type: Boolean, reflect: true}) accessor disabled: boolean = false;
  private readonly _internals = this.attachInternals;

  protected render(): HTMLTemplateResult {
    return html`
      <!-- This is essentially a customized button. -->
      <div
        class="${classMap({button: true, disabled: this.disabled})}"
        role="tab"
        @click=${this._handleClick}>
        <!-- Define where text and/or icons will appear. -->
        <slot name="icon"></slot>
        <slot>
          <!-- This is where our label content will go. -->
          <!-- Material Design has @slotchange here, but I don't know what that's for. -->
        </slot>
      </div>
    `;
  }

  private _handleClick(event: MouseEvent): void {
    // This will prevent a "double" click on this element.
    // Blocks click events from anything except the <div> container.
    event.stopPropagation();
    this.click();
    createRipple(event);
  }
}

