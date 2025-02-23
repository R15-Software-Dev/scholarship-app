import { ModalWindow, ModalReturn } from "./modalWindow";
import { InputElement } from "./InputElement";
import {customElement, property, query} from "lit/decorators.js";
import {css, CSSResultGroup, html, HTMLTemplateResult, LitElement} from "lit";

@customElement("multi-entry")
export class MultiEntry extends LitElement implements InputElement {
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
      padding: 5px;
      
      & div {
        flex-grow: 1;
        width: auto;
        padding: 5px;
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) accessor required: boolean = false;
  @property({ type: Boolean, reflect: true }) accessor disabled: boolean = false;
  @property({ type: String }) accessor name: string = "";
  @property({ type: String }) accessor id: string = "";
  @property({ type: String }) accessor value: string = "";
  @property({ type: String, noAccessor: true, attribute: "display-members" })
  set members(value: string) {
    this._displayMembers = JSON.parse(value);
  }
  get members() {
    return JSON.stringify(this._displayMembers);
  }

  @query("modal-window") accessor modal: ModalWindow;
  @query("#entriesDiv") accessor entryDiv: HTMLDivElement;

  _displayMembers: { [key: string]: string };

  // This element will function in a specific way:
  // The user will click an "Add" button
  // A modal window will appear (or so I think right now)
  // When submitted successfully, the entry object will be created.
  // Entries have a "data" field that stores an object with a field [string]: string
  // Entries will accept an array of field values that it will query from the data object to display
  // Displayed entries will be editable through an edit button of some sort.
  // The rest should be fairly self-explanatory.

  constructor() {
    super();
  }

  protected render(): HTMLTemplateResult {
    return html`<div>
      <div>
        <!-- The modal window should go here. We'll need to open that later. -->
        <modal-window @submit=${this.modalWindow_submit}>
          <slot></slot>
        </modal-window>
      </div>
      <div class="header">
        <!-- The element header will go here. -->
        <slot name="header"></slot>
      </div>
      <div class="member-headers">
        <!-- Display the row headers here. -->
        ${Object.entries(this._displayMembers).map(
          ([key, value]) => html`<div class="multi-headers">${key}</div>`
        )}
      </div>
      <div><hr></div>
      <div id="entriesDiv" class="entry-content">
        <!-- The custom entry elements will be put here. Not sure if that's going to be created as a slot yet. -->
        <slot name="entries"></slot>
      </div>
      <div class="center-all">
        <action-button id="btnCreateEntry" @click=${this.createElement}>Add</action-button>
      </div>
    </div>`;
  }

  modalWindow_submit(e: CustomEvent) {
    // Create the new entry within the entry div.
    let entry = e.detail;
    console.log(entry);
    let entryElement = document.createElement('custom-entry') as CustomEntry;
    Object.entries(this._displayMembers).forEach(([key, value]) => {
      // Create a new display value in our entry
      const objectValue = entry[value];
      entryElement.innerHTML += `<div>${objectValue}</div>`
    });
    this.entryDiv.appendChild(entryElement);
  }

  createElement(): void {
    this.modal.showModal();
    console.log("Showed modal window.");
  }

  checkValidity(): boolean {
    return false;
  }

  clearError(): void {
  }

  displayError(message: string): void {
  }

  getValue(): string {
    return "";
  }
}

@customElement("custom-entry")
export class CustomEntry extends LitElement {
  // This element will handle the entry elements within the multi-entry element.
  // I'm not sure if this is needed just yet.

  static styles = css`
    div {
      margin: 5px;
      display: flex;
      flex-direction: row;
      border-radius: 6px;
      box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
      width: auto;
      padding: 10px;
      
      &:hover {
        box-shadow: rgba(0, 0, 0, 0.6) 0 0 8px;
      }
    }

    slot {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  `;

  constructor(displayMembers: string[], displayObject: ModalReturn) {
    super();

    // TODO Create divs for displayed members here
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div class="entry-container">
        <slot>
          <!-- Any display information about this entry goes here. -->
        </slot>
      </div>
    `;
  }
}
