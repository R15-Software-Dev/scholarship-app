import { LitElement, html, css, CSSResultGroup } from "lit";
import { customElement, property, state, query, queryAll } from "lit/decorators.js";

type Dictionary = { [key: string]: string };

/**
 * A custom element that displays a list of {@link CheckListViewEntry} elements.
 */
@customElement("check-list-view")
class CheckListView extends LitElement {
  static styles?: CSSResultGroup = css`
      div .center-all {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
      }

      div .entry-content {
          display: flex;
          flex-direction: column;
      }

      div .entry-container {
          display: flex;
          flex-direction: row;
          border-radius: 6px;
          box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
          width: auto;
          padding: 10px;
      }

      div .member-headers {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: auto;
          padding: 6px 14px;
          background-color: var(--theme-primary-color); /* Dark red background */
          border-radius: 8px; /* Rounded edges */
          margin: 5px 0; /* Added some vertical spacing */

          & span {
              flex: 1 1 0;
              width: auto;
              padding: 8px;
              color: white; /* White text for the headers */
              font-weight: bold; /* Keep the bold styling from the template */
              font-size: 16px;
          }
      }`;

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
  public addNewElement(elementInfo: Dictionary) {
    const newElement: CheckListViewEntry = new CheckListViewEntry(this._displayMembers, elementInfo);
    this.entryContainer.appendChild(newElement);
  }

  /**
   * Adds a new blank element to the display.
   */
  public addBlankElement() {
    this.addNewElement({
      testing: "Some testing information"
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
      <div id="header-container" class="member-headers">
        <!-- This is where the headers are rendered -->
        ${Object.entries(this._displayMembers).map(([key]) => html`<div>${key}</div>`)}
      </div>
      <div id="entry-container" class="entry-content">
        <!-- This is where the entry elements are rendered -->
        <slot name="entries" ></slot>
      </div>
      <div id="testing-button" class="center-all">
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
        margin: 10px;
        display: flex;
        flex-direction: row;
        border-radius: 6px;
        box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
        width: auto;
        padding: 10px;
        pointer-events: inherit;

      & .entry-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-left: 5px;
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
    accessor data: Dictionary = {};

  /** Indicates whether this entry is selected. */
  @property({ type: Boolean })
    accessor selected: boolean = false;

  /** The display members of this entry. */
  @state()
    accessor _displayMembers: Dictionary = {};

  public constructor(displayMembers: Dictionary, data: Dictionary) {
    super();
    this._displayMembers = displayMembers;
    this.data = data;
  }

  protected override render() {
    return html`
      <div>
        <label>
          <div class="content">
            <input type="checkbox" .checked=${this.selected}>
            <div id="entry-content">
              ${Object.entries(this._displayMembers).map(([displayName, memberName]) =>
                html`<div>${displayName}: ${this.data[memberName]}</div>`
              )}
            </div>
          </div>
        </label>
      </div>
    `;
  }
}
