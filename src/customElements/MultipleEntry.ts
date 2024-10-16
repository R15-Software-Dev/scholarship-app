import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit-element";
import { customElement, property, query } from "lit-element/decorators.js";
import { ModalWindow } from "./modalWindow";
import { InputElement } from "./InputElement";

type FormEntry = {
  // Base element for the entry - is passed by reference, so we can modify it
  baseElement: CustomEntry;
  // Contains pertinent data for the entry
  // This must be an any, because we can't predict the object that will be passed
  entryData: any;
};

@customElement("multi-entry")
export class MultiEntry extends LitElement implements InputElement {
  static styles?: CSSResultGroup = css``;

  @property({ type: Boolean, reflect: true })
  accessor disabled: boolean = false;
  @property({ type: String, reflect: true })
  accessor name: string = "";
  @property({ type: Boolean, reflect: true })
  accessor required: boolean = false;
  @property({ type: {} })
  private accessor _entries: Array<FormEntry>;
  @query('slot[name="entries"]')
  private accessor _entriesSlot!: HTMLSlotElement;
  @query("modal-window")
  private accessor _modalWindow!: ModalWindow;

  getValue(): string {
    // Converts values into a string and returns it.
    return this._entries.map((entry) => entry.entryData).toString();
  }

  checkValidity(): boolean {
    // Currently a prototype, will need to be updated.
    if (this.required && this._entries.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  displayError(): void {
    // TODO Implement this function
  }

  constructor() {
    // Initialize the entries array
    super();
    this._entries = [];
  }

  protected render(): HTMLTemplateResult {
    return html`
      <!-- Button allows user to add an entry -->
      <modal-window @submit=${this.addEntry}>
        <!-- These slots reflect the modal window slots -->
        <!-- TODO Is there a more efficient way of doing this? -->
        <slot name="modalHeader" slot="header">
          <!-- This slot will contain the header for the modal -->
        </slot>
        <slot name="modalQuestions" slot="content">
          <!-- This slot will contain the questions for the modal -->
        </slot>
      </modal-window>
      <div class="container">
        <p>Start entry element:</p>
        <slot name="entries"></slot>
        <action-button @click=${this.showModal}>Add</action-button>
      </div>
    `;
  }

  private showModal() {
    this._modalWindow.showModal();
  }

  private addEntry(event: CustomEvent): void {
    // Create an entry HTMLElement
    const entry = document.createElement("custom-entry") as CustomEntry;

    // Make a new FormEntry object and store in the array.
    const entryObject: FormEntry = {
      baseElement: entry,
      entryData: event.detail,
    };
    this._entries.push(entryObject);

    // Give the new element some content.
    // How can this use an unknown object to display information?
    const entryContent = document.createElement("p");
    entryContent.textContent = JSON.stringify(event.detail);
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
        <slot>
          <!-- Any display information about this entry goes here. -->
        </slot>
      </div>
    `;
  }
}
