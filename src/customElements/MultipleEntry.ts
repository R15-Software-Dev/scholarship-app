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
    }
  `;

  @property({ type: Boolean, reflect: true }) accessor required: boolean = false;
  @property({ type: Boolean, reflect: true }) accessor disabled: boolean = false;
  @property({ type: String }) accessor name: string = "";
  @property({ type: String }) accessor id: string = "";
  @property({ type: String })
    // accessor value: string = "";
  get value(): string {
    return this.getValue();
  }
  set value(value: string) {
    this._value = JSON.parse(value);
    if (this._value.length > 0) {
      this._value.forEach(item => {
        this.entryDiv.appendChild(this.elementFromObject(item));
      })
    }
  }
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
  _editing: boolean = false;
  _value: ModalReturn[] = [];

  constructor() {
    super();
  }

  protected render(): HTMLTemplateResult {
    return html`<div>
      <div>
        <!-- The modal window should go here. We'll need to open that later. -->
        <modal-window>
          <slot name="modal-header" slot="header"></slot>
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
          ([key, value]) => html`<span><b>${key}</b></span>`
        )}
      </div>
      <div id="entriesDiv" class="entry-content">
        <!-- The custom entry elements will be put here. Not sure if that's going to be created as a slot yet. -->
        <slot name="entries"></slot>
      </div>
      <div class="center-all">
        <action-button id="btnCreateEntry" @click=${this.createElement} ?disabled=${this.disabled}>Add</action-button>
      </div>
    </div>`;
  }

  async editEntry(entry: CustomEntry) {
    // Allows editing of a currently displayed CustomEntry.
    // Marked async in the hopes of making more elements asynchronous.
    this._editing = true;
    this.modal.setQuestionValues(entry.displayObject);
    const response = await this.modal.showModalAsync();
    if (response != null) {
      entry.displayObject = response;
    }
    this._editing = false;
  }

  async createElement(): Promise<void> {
    // this.modal.showModal();
    let response = await this.modal.showModalAsync();
    if (response != null) {
      this.entryDiv.appendChild(this.elementFromObject(response));
    }
  }

  elementFromObject(obj: ModalReturn): CustomEntry {
    let entryElement = new CustomEntry(this._displayMembers, obj);
    entryElement.addEventListener("delete", (e) => entryElement.remove());
    entryElement.addEventListener("click", async (_) => await this.editEntry(entryElement));
    return entryElement;
  }

  checkValidity(): boolean {
    return true;  // this element doesn't need to be filled in.
  }

  clearError(): void {
  }

  displayError(message: string): void {
  }

  getValue(): string {
    // Returns the values associated with all the currently displayed entry elements.
    const rVal: ModalReturn[] = [];
    if (this.entryDiv) {
      this.entryDiv.querySelectorAll<CustomEntry>("custom-entry").forEach(
        (entry: CustomEntry) => {
          // add the displayed object into the array
          rVal.push(entry.displayObject);
        }
      )
    }

    return JSON.stringify(rVal);
  }
}

@customElement("custom-entry")
export class CustomEntry extends LitElement {
  // This element will handle the entry elements within the multi-entry element.
  // I'm not sure if this is needed just yet.

  static styles = css`
    :host {
      pointer-events: none;
    }
    .entry-container {
      margin: 5px;
      display: flex;
      flex-direction: row;
      border-radius: 6px;
      box-shadow: rgba(0, 0, 0, 0.5) 0 0 5px;
      width: auto;
      padding: 10px;
      pointer-events: inherit;
      
      &:hover {
        box-shadow: rgba(0, 0, 0, 0.6) 0 0 8px;
      }

      & div {
        pointer-events: inherit;
        flex: 1 1 0;
        display: flex;
          
        & div {
          flex: 1 1 0;
          padding: 5px;
          pointer-events: all;
          cursor: pointer;
        }
      }
      
      & span {
        justify-content: center;
        align-content: center;
        width: auto;
        font-size: 14pt;
        pointer-events: all;
        cursor: pointer;
      }
    }
  `;

  @property({ attribute: "display-members" })
    accessor displayMembers: { [key: string]: string };
  @property()
    accessor displayObject: ModalReturn;

  constructor(displayMembers: { [p: string]: string }, displayObject: ModalReturn) {
    super();

    console.log(displayObject);

    this.displayMembers = displayMembers;
    this.displayObject = displayObject;
  }

  sendDeleteEvent(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.dispatchEvent(new Event("delete"));
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div class="entry-container">
        <div>
          ${Object.entries(this.displayMembers).map(([_, displayMember]) => 
            html`<div class="display-value">${this.displayObject[displayMember]}</div>`
          )}
        </div>
        <span @click="${this.sendDeleteEvent}">&#10006;</span>
      </div>
    `;
  }
}
