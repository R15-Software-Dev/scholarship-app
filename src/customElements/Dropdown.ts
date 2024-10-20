import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit-element";
import {
  customElement,
  property,
  state,
  query,
  queryAssignedElements,
} from "lit-element/decorators.js";
import { ModalWindow } from "./modalWindow";
import { InputElement } from "./InputElement";

@customElement("drop-down")
export class Dropdown extends LitElement implements InputElement {
  static styles: CSSResultGroup = css`
    :host {
      font-family: "Roboto", sans-serif;
    }

    .select-container {
      display: flex;
      flex-direction: row;
      border: 2px solid;
      border-radius: 8px;
      border-color: var(--theme-primary-color);
      background-color: transparent;
      margin-top: 6px;
      height: 48px;
      position: relative;
      transition:
        border-color 400ms ease,
        background-color 400ms ease;
    }

    select {
      font-size: 11pt;
      flex-grow: 1;
      border: none;
      padding: 2px 15px;
      color: #696158;
      border-radius: 8px;
      background-color: transparent;
      appearance: none;
      cursor: pointer;
    }

    select:focus {
      outline: none;
      border-color: var(--theme-primary-color);
    }

    .select-container.errors {
      border-color: var(--theme-error-color);
    }

    .prefix {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      margin-left: 15px;
      opacity: 1;
    }

    .suffix {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      margin-right: 15px;
      opacity: 1;
    }
  `;

  @property({ type: Boolean, reflect: true }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) disabled: boolean = false; // Added disabled property
  @property({ type: String }) value: string = ""; // Single value for each dropdown element

  @state() _hasChanged: boolean = false;

  @query("select") accessor _selectElement!: HTMLSelectElement;
  @queryAssignedElements({ selector: "option", flatten: true })
  accessor _options = Array<HTMLElement>();

  constructor() {
    super();
  }

  // Render the dropdown with a single value
  render() {
    return html`
      <div class="select-container">
        <select @change=${this.handleSelectChange}>
          <option value="" disabled selected>Select a state</option>
        </select>
        <slot @slotchange="${this.handleSlotChange}"></slot>
      </div>
    `;
  }

  handleSlotChange(event: Event) {
    this._options.map((element: HTMLOptionElement) => {
      // Add each element to the select element.
      console.log(`Transferring ownership of html element`);
      this._selectElement.appendChild(element);
    });
  }

  handleSelectChange(event: Event) {
    this.value = this._selectElement.value;

    // Make sure that this element knows it has been changed.
    // This is important for the form to know that the element has been changed,
    // and is used in checkValidity() to determine if the element is valid.
    // This also works because the user cannot change the value of the select element
    // back to the default value.
    this._hasChanged = true;
  }

  getValue(): string {
    return this.value;
  }

  checkValidity(): boolean {
    // return this.required ? this.value !== "" : true;
    return this._selectElement.checkValidity();
  }

  displayError(): void {
    // if (!this.checkValidity()) {
    //   this.classList.add("errors");
    // }

    // Display an element with the error message
    // this.shadowRoot.querySelector('#error-message')?.classList.remove('hidden');
  }
}
