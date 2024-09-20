import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit-element";
import { customElement, property, query } from "lit-element/decorators.js";
import { ModalWindow } from "./modalWindow";

type FormEntry = {
  baseElement: CustomEntry;
  // This must be an any, because we can't predict the object that will be passed.
  entryData: any;
};

@customElement("multi-entry")
export class MultiEntry extends LitElement {
  static styles?: CSSResultGroup = css``;

  @property({ type: Boolean, reflect: true })
  accessor required: boolean = false;
  @property({ type: {} }) private accessor _entries: Array<FormEntry> = [];
  @query('slot[name="entries"]') private accessor _entriesSlot: HTMLSlotElement;
  @query("modal-window") private accessor _modalWindow: ModalWindow;

  protected render(): HTMLTemplateResult {
    return html`
      <!-- Button allows user to add an entry -->
      <modal-window>
        <label for="entry" slot="content">Add an entry:</label>
        <input type="text" id="entry" name="entry" slot="content" />
      </modal-window>
      <div class="container">
        <p>Start entry element:</p>
        <slot name="entries"></slot>
        <action-button @click=${this._modalWindow.showModal}>Add</action-button>
      </div>
    `;
  }

  addEntry(entryData: any): void {
    // Create an entry HTMLElement
    const entry = document.createElement("entry") as CustomEntry;

    // Make a new FormEntry object and store in array.
    // TODO Make this object not a testing object.
    const entryObject: FormEntry = {
      baseElement: entry,
      entryData: entryData,
    };
    this._entries.push(entryObject);

    // Give the new element some content.
    const entryContent = document.createElement("p");
    entryContent.textContent = "Testing info!";
    entry.appendChild(entryContent);

    // Add the element to the DOM.
    this._entriesSlot.appendChild(entry);
  }
}

@customElement("custom-entry")
export class CustomEntry extends LitElement {
  // This element will handle the entry elements within the multi-entry element.
  // I'm not sure if this is needed just yet.

  static styles: CSSResultGroup = css`
    div .container {
      display: flex;
      flex-direction: row;
    }

    slot {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  `;

  protected render(): HTMLTemplateResult {
    return html`
      <div class="container">
        <slot name="info">
          <!-- Any display information about this entry goes here. -->
        </slot>
      </div>
    `;
  }
}
