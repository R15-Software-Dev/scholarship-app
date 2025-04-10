import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state, query, queryAll } from "lit/decorators.js";
import {AttributeValue} from "@aws-sdk/client-dynamodb";

type Dictionary = { [key: string]: string };

/**
 * A custom element that displays a list of {@link CheckListViewEntry} elements.
 */
@customElement("check-list-view")
export class CheckListView extends LitElement {
  static styles?: CSSResultGroup = css`
      .center-all {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
      }

      .entry-content {
          display: flex;
          flex-direction: column;
      }

      .entry-container {
          display: flex;
          flex-direction: row;
          border-radius: 6px;
          box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
          width: auto;
          padding: 10px;
      }

      .member-headers {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: auto;
          padding: 10px;
          background-color: var(--theme-primary-color);
          color: white;
          border-radius: 6px;
          margin: 10px;
          align-items: center; /* Added to vertically align items */
      }

      .header-space {
          margin-left: 5px;
          flex: 1 1 0; /* Changed from flex-grow to flex for consistent sizing */
          padding: 5px; /* Match entry padding */
          display: flex; /* Added for consistent layout */
      }

      .checkbox-header { /* Added for checkbox alignment */
          width: 30px; /* Fixed width to match entry checkbox */
          padding: 5px;
          display: flex;
          align-items: center;
      }
        
    `;

  /** Indicates whether the component is disabled. */
  @property({ type: Boolean })
  accessor disabled = false;

  /** The stringified value of the _displayMembers state variable. */
  @property({ type: String, attribute: "display-members" })
  get members() {
    return JSON.stringify(this._displayMembers);
  }
  set members(value: string) {
    // This value should be passed as a JSON string.
    this._displayMembers = JSON.parse(value);
  }

  /** The members to display in the header. This will also be applied to the entries. */
  @state()
    accessor _displayMembers: Dictionary = {};

  @query("#entry-container")
    accessor entryContainer: HTMLDivElement;

  @query("#check-all-box")
    accessor checkAllBox: HTMLInputElement;

  @queryAll("check-list-view-entry")
    accessor entryElements: Array<CheckListViewEntry>;

  public constructor() {
    super();
  }

  /**
   * Adds a new element to the display.
   * @param elementInfo The data which the element will store and display.
   */
  public addNewElement(elementInfo: Record<string, AttributeValue>) {
    const newElement: CheckListViewEntry = new CheckListViewEntry(this._displayMembers, elementInfo);
    // console.log("Adding element with data: ", elementInfo);
    this.entryContainer.appendChild(newElement);
  }

  /**
   * Adds a new blank element to the display.
   */
  public addBlankElement() {
    this.addNewElement({
      testing: {
        S: "Some testing information"
      }
    });
  }

  /**
   * Removes the element at the specified index.
   * Fails if the index is out of bounds.
   * @param index The index of the element to remove.
   */
  public removeElement(index: number) {
    this.entryElements.splice(index, 1);
  }

  /**
   * Removes all currently selected elements.
   */
  public removeSelectedElements() {
    this.entryElements.forEach(element => {
      if (element.selected) {
        this.removeElement(this.entryElements.indexOf(element));
      }
    });
  }

  protected checkboxClick() {
    this.entryElements.forEach(element => {
      element.selected = this.checkAllBox.checked;
    });
  }

  /**
   * Renders the element.
   * @category Rendering
   */
  protected override render() {
    return html`
      <div id="header-container" class="member-headers">
        <div class="checkbox-header" @click="${this.checkboxClick}">
          <input id="check-all-box" type="checkbox">
        </div>
        ${Object.entries(this._displayMembers).map(([key]) =>
            html`<div class="header-space"><b>${key}</b></div>`
        )}
      </div>
      <div id="entry-container" class="entry-content">
        <slot name="entries"></slot>
      </div>
    `;
  }
}

/** The entry element for a {@link CheckListView}. */
@customElement("check-list-view-entry")
export class CheckListViewEntry extends LitElement {
  static styles?: CSSResultGroup = css`
      .content {
          margin: 2px 10px;
          display: flex;
          flex-direction: row;
          border-radius: 6px;
          box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
          width: auto;
          padding: 2px 10px;
          pointer-events: inherit;
      }

      .content:hover {
          box-shadow: rgba(0, 0, 0, 0.6) 0 0 8px;
      }

      .checkbox-container { /* Added for checkbox alignment */
          width: 30px; /* Match header checkbox width */
          padding: 5px;
          display: flex;
          align-items: center;
      }

      .entry-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-left: 5px;
          flex: 1; /* Ensure it takes remaining space */
      }

      .entry-content div {
          flex: 1 1 0; /* Consistent sizing with headers */
          padding: 5px;
          display: flex;
          align-items: center;
      }
  `;

  /** The stringified display members of the parent CheckListView. */
  @property({ type: String, attribute: "display-members" })
  get members() {
    return JSON.stringify(this._displayMembers);
  }
  set members(value: string) {
    // This value should be passed as a JSON string.
    this._displayMembers = JSON.parse(value);
  }

  /** The data associated with this entry. */
  @property({ type: Object })
    accessor data: Record<string, AttributeValue> = {};

  /** Indicates whether this entry is selected. */
  @property({ type: Boolean, reflect: true })
    accessor selected: boolean = false;

  /** The display members of this entry. */
  @state()
    accessor _displayMembers: Dictionary = {};

  public constructor(displayMembers: Dictionary, data: Record<string, AttributeValue>) {
    super();
    this._displayMembers = displayMembers;
    this.data = data;
  }

  protected unwrapAttributeValue(attr: AttributeValue) {
    if (!attr || typeof attr !== 'object') return attr;

    const type = Object.keys(attr)[0] as keyof AttributeValue;
    const value = (attr as any)[type];  // We'll use the any type for now, polish later.

    switch (type) {
      case "S":
        return value;
      case "N":
        return Number(value);
      case "BOOL":
        return value === "true";
      case "NULL":
        return null;
      case "SS":
        return value;
      case "NS":
        return value.map((v: string) => Number(v));
      default:
        throw new Error(`Unsupported attribute type: ${type}`);
    }
  }

  /**
   * Handles clicking on this element. Checks and unchecks the internal checkbox.
   * @protected
   */
  protected handleClick() {
    this.selected = !this.selected;
  }

  protected override render() {
    return html`
      <div>
        <label @click="${this.handleClick}">
          <div class="content">
            <div class="checkbox-container">
              <input type="checkbox" .checked="${this.selected}">
            </div>
            <div class="entry-content">
              ${Object.entries(this._displayMembers).map(([displayName, memberName]) =>
                html`<div>${this.unwrapAttributeValue(this.data[memberName])}</div>`
              )}
            </div>
          </div>
        </label>
      </div>
    `;
  }
}
