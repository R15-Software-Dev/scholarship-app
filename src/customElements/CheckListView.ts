import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state, query, queryAll } from "lit/decorators.js";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

type Dictionary = { [key: string]: string };

/**
 * A custom element that displays a list of {@link CheckListViewEntry} elements.
 */
@customElement("check-list-view")
export class CheckListView extends LitElement {
  static styles?: CSSResultGroup = css``;

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

  @queryAll("check-list-view-entry")
    accessor entryElements: CheckListViewEntry[];

  public constructor() {
    super();
  }

  /**
   * Adds a new element to the display.
   * @param elementInfo The data which the element will store and display.
   */
  public addNewElement(elementInfo: Record<string, AttributeValue>) {
    const newElement: CheckListViewEntry = new CheckListViewEntry(this._displayMembers, elementInfo);
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

  /**
   * Renders the element.
   * @category Rendering
   */
  protected override render() {
    return html`
      <div id="header-container">
        <!-- This is where the headers are rendered -->
        ${Object.entries(this._displayMembers).map(([key]) => html`<div>${key}</div>`)}
      </div>
      <div id="entry-container">
        <!-- This is where the entry elements are rendered -->
        <slot name="entries"></slot>
      </div>
      <div id="testing-button">
        <!-- Just a button to test adding elements. -->
        <button @click=${this.addBlankElement}>Add Blank Element</button>
      </div>
    `;
  }
}

/** The entry element for a {@link CheckListView}. */
@customElement("check-list-view-entry")
class CheckListViewEntry extends LitElement {
  static styles?: CSSResultGroup = css`
    div .content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      & .entry-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
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
  @property({ type: Boolean })
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

  protected override render() {
    return html`
      <div>
        <label>
          <div class="content">
            <input type="checkbox" .checked=${this.selected}>
            <div id="entry-content">
              ${Object.entries(this._displayMembers).map(([displayName, memberName]) =>
                html`<div>${displayName}: ${this.unwrapAttributeValue(this.data[memberName])}</div>`
              )}
            </div>
          </div>
        </label>
      </div>
    `;
  }
}
