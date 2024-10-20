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
import { classMap } from "lit/directives/class-map.js";

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

      &.error {
        border-color: var(--theme-error-color);
        transition:
          border-color 400ms ease,
          background-color 400ms ease;
      }
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

    .hidden {
      display: none;
    }

    div .error {
      color: var(--theme-error-color);
      font-size: 10pt;
      margin: 0;
    }

    p {
      &.error {
        color: var(--theme-error-color);
      }
    }
  `;

  @property({ type: Boolean, reflect: true }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) disabled: boolean = false; // Added disabled property
  @property({ type: String }) value: string = ""; // Single value for each dropdown element
  @property({ type: String, attribute: "error-message" }) accessor errorMessage: string = ""; // Public version, used to set the default error message

  @state() accessor _hasChanged: boolean = false;
  @state() accessor _showError: boolean = false;
  @state() accessor _errorMessage: string = ""; // private version, used in scripting for custom messages.

  @query("select") accessor _selectElement!: HTMLSelectElement;
  @queryAssignedElements({ selector: "option", flatten: true })
  accessor _options = Array<HTMLElement>();

  constructor() {
    super();

    // Set the default error message
    this._errorMessage = this.errorMessage;
  }

  // Render the dropdown with a single value
  render() {
    return html`
      <div class="select-container ${classMap({ error: this._showError })}">
        <select>
          <option value="" disabled selected>Select a state</option>
        </select>
        <slot @slotchange="${this.handleSlotChange}"></slot>
      </div>
      <div id="error-message" class=${classMap({ error: true, hidden: !this._showError })}>
        <p class="error">${this._errorMessage}</p>
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

  getValue(): string {
    return this._selectElement.value;
  }

  checkValidity(): boolean {
    // Check if the value is empty and the element is required
    if (this.required && !this.disabled) {
      if (this.value !== "") return true;
      else return false;
    }
    // Default to true if the element is not required and is enabled
    else return true;
  }

  displayError(): void {
    // Set the error message to the default message
    this._errorMessage = this.errorMessage;
    this._showError = true;
  }

  displayCustomError(message: string): void {
    this._errorMessage = message;
    this._showError = true;
  }

  clearError(): void {
    this._showError = false;
  }
}
