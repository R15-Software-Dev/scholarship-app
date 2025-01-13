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
      //margin-bottom: 20px;
      background-color: var(--theme-primary-color);
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

  public nextTab(){
    const nextTab = this._tabs[this.activeTabIndex + 1];
    this.activateTab(nextTab);
  }

  private async handleClick(event: MouseEvent) {
    console.log("Found click event!");
    const tab = event.target as Tab;
    // Allow event to bubble to other receivers
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
    //.container {
    //  &::after {
    //    content: "";
    //    width: 0;
    //    height: 3px;
    //    margin: auto;
    //    display: block;
    //    background: transparent;
    //    transition: width 150ms ease, background-color 150ms ease;
    //  }
    //  &.active::after {
    //    width: 100%;
    //    //background: #fff; /* Matches text when active */
    //  }
    //}

    .button {
      width: auto;
      position: relative;
      overflow: hidden;
      transition: background-color 150ms ease, color 150ms ease;
      user-select: none;
      text-align: center;
      padding: 10px 20px;
      z-index: 0;
      border-radius: 8px 8px 0 0; /* Rounded top corners */
      margin: 0 2px;
      background-color: #8B0000; /* Default dark red */
      color: white; /* Default white text */
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      font-weight: bold;

      &:hover {
        background-color: #6B0000; /* Slightly darker red on hover */
      }

      &.active {
        background-color: white; /* Blend with white page */
        color: black; /* Black text on white background */
        border-color: #8B0000; /* Red border for separation */
        z-index: 1; /* Keep the active tab above others */
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 4px #8B0000;
      }
    }

    .button.disabled {
      pointer-events: none;
      opacity: 0.5; /* Greyed-out appearance for disabled tabs */
    }

    .checkmark {
        position: absolute;
        right: 5px;
        bottom: 18px;
        font-size: large;
        display: none;
        
        &.checked {
            display:block;
        }
    }
      
    ${rippleCSS}
  `;
  @property({ type: String, attribute: "panel-id" }) accessor panelId: string =
    "";
  @property({ type: Boolean, reflect: true }) accessor disabled: boolean = false;

  @property({ type: Boolean, reflect: true }) accessor active: boolean = false;
  private readonly _internals = this.attachInternals;

  @property({ type: Boolean, reflect: true}) accessor checked: boolean = false;

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
        <div
            class="button ${classMap({
              active: this.active,
            })}"
            role="tab"
            @click=${this._handleClick}
        >
          <!-- Icon slot (optional) -->
          <slot name="icon"></slot>
          <!-- Label slot -->
          <slot></slot>
          <div id="tabChecked" class=" ${classMap({
              checkmark: true,
              checked: this.checked
          })}">
              <span>&#x2713</span>
          </div>
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

@customElement("tab-panel")
export class TabPanel extends LitElement {
  static styles?: CSSResultGroup = css`
    div {
      display: none;

      &.active {
        display: block;
      }

      background-color: white; /* Matches the background */
      border-color: #fff; /* White border for separation */
      padding: 20px;
      font-family: 'Roboto', sans-serif;
      color: black;
    }
  `;

  // This element is simply designed to hold content that is associated with a Tab.
  // It will be shown when the Tab is active.

  @property({ type: Boolean, reflect: true }) accessor active: boolean = false;

  protected render(): HTMLTemplateResult {
    return html`
      <div class="${classMap({ active: this.active })}">
        <slot ></slot>
      </div>
    `;
  }
}
