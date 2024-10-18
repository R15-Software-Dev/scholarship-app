import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRipple, rippleCSS } from "./Ripple";

// This element should render a bar that contains our TabElements.
// It will create a space where we can detect changes to our tabs, and show the correct TabPanel
// when needed. It will also handle disabled tabs.

@customElement("tab-bar")
export class TabBar extends LitElement {
  static styles?: CSSResultGroup = css`
    div {
      margin-bottom: 20px;
    }

    slot {
      display: flex;
      flex-direction: row;
    }
  `;

  @query("slot") accessor slotElement!: HTMLSlotElement | null;
  @queryAssignedElements({ selector: "c-tab", flatten: true })
  accessor _tabs: Array<Tab>;

  get activeTab() {
    return this._tabs.find((tab) => tab.active) ?? null;
  }
  set activeTab(tab: Tab | null) {
    if (tab) {
      this.activateTab(tab);
    }
  }

  @property({ type: Number, attribute: "active-tab-index" })
  get activeTabIndex(): number {
    // There is currently a bug with this.
    return this._tabs.findIndex((tab) => tab.active);
  }
  set activeTabIndex(index: number) {
    const activateTabAtIndex = () => {
      const tab = this._tabs[index];
      if (tab) this.activateTab(tab);
    };

    if (!this.slotElement) {
      this.updateComplete.then(activateTabAtIndex);
      return;
    }

    activateTabAtIndex();
  }

  private get focusedTab() {
    return this._tabs.find((tab) => tab.matches(":focus-within"));
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <slot @click=${this.handleClick}></slot>
      </div>
    `;
  }

  private async handleClick(event: MouseEvent) {
    console.log("Found click event!");
    const tab = event.target as Tab;
    // Allow event to bubble to other recievers
    await 0;

    if (event.defaultPrevented || tab.active) {
      return;
    }

    this.activateTab(tab);
  }

  activateTab(tab: Tab) {
    const { _tabs } = this;
    if (!_tabs.includes(tab) || tab.disabled) {
      // This ignores the request if the tab is not a child of the TabBar.
      return;
    }

    for (const tabElement of _tabs) {
      tabElement.active = tabElement === tab;
    }

    // This event is interpreted at the TabBar sending a change event.
    // The button should also send one, however this is the one that we should be listening for.
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: true }),
    );
  }
}

@customElement("c-tab")
export class Tab extends LitElement {
  static styles?: CSSResultGroup = css`
    .container {
      &::after {
        content: "";
        width: 0;
        height: 3px;
        margin: auto;
        display: block;
        background: transparent;
        transition:
          width 150ms ease,
          background-color 150ms ease;
      }
      &.active::after {
        width: 100%;
        background: var(--theme-primary-color);
      }

      &.disabled {
        display: none;
      }
    }

    .button {
      width: auto;
      position: relative;
      overflow: hidden;
      transition: background-color 400ms ease;
      user-select: none;
      text-align: center;
      padding: 5px;
      z-index: 0;
      border-radius: 4px;
      margin: 0 2px 5px 2px;

      &:hover {
        background-color: #e9e9e9;
      }
    }

    ${rippleCSS}
  `;

  @property({ type: String, attribute: "panel-id" }) accessor panelId: string =
    "";
  @property({ type: Boolean, reflect: true }) accessor disabled: boolean =
    false;
  @property({ type: Boolean, reflect: true }) accessor active: boolean = false;
  private readonly _internals = this.attachInternals;

  protected render(): HTMLTemplateResult {
    return html`
      <!-- This is essentially a customized button. -->
      <div
        class="${classMap({
          container: true,
          active: this.active,
          disabled: this.disabled,
        })}"
      >
        <div class="button" role="tab" @click=${this._handleClick}>
          <!-- Define where text and/or icons will appear. -->
          <slot name="icon"></slot>
          <slot>
            <!-- This is where our label content will go. -->
            <!-- Material Design has @slotchange here, but I don't know what that's for. -->
          </slot>
        </div>
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
