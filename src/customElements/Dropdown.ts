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
import {ModalWindow} from "./modalWindow";
import {InputElement} from "./InputElement";
import {classMap} from "lit/directives/class-map.js";
import {PropertyValues} from "lit";

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
      //background-color: transparent;
      margin-top: 6px;
      height: 48px;
      position: relative;
      transition: border-color 400ms ease,
      background-color 400ms ease;

      &.error {
        border-color: var(--theme-error-color);
        transition: border-color 400ms ease,
        background-color 400ms ease;
      }

      &.disabled {
          transition: background-color 0.2s linear;
          border-color: dimgrey;
      }

      select {
        font-size: 11pt;
        flex-grow: 1;
        border: none;
        padding: 2px 15px;
        padding: 2px 15px 2px 40px;
        color: #696158;
        border-radius: 8px;
        background-color: transparent;
        appearance: none;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23696158' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: left 10px center;
        background-size: 24px;
      }
        
      select.disabled {
          transition: background-color 0.2s linear;
          background-color: lightgray;
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
    }

    div .error {
      display: none;
      height: auto;
      width: auto;
      padding: 5px 5px 5px 8px;
      margin-bottom: 0;

      & span {
        color: var(--theme-error-color);
      }

      &.shown {
        display: block;
      }
    }
  `;

  @property({type: Boolean, reflect: true}) required: boolean = false;
  @property({type: Boolean, reflect: true}) disabled: boolean = false; // Added disabled property
  @property({type: String}) name: string = ""; // Name of the dropdown element
  @property({type: String}) accessor value: string = "";
  @property({type: String, attribute: "error-message"}) accessor errorMessage: string = ""; // Public version, used to set the default error message
  @property({type: String}) placeholder: string = "Select an option"; // Placeholder text for the dropdown

  @state() accessor _hasChanged: boolean = false;
  @state() accessor _showError: boolean = false;
  @state() accessor _errorMessage: string = ""; // private version, used in scripting for custom messages.

  @query("select") accessor _selectElement!: HTMLSelectElement;
  @queryAssignedElements({selector: "option", flatten: true})
  accessor _options = Array<HTMLElement>();

  constructor() {
    super();

    // Set the default error message
    this._errorMessage = this.errorMessage;
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    this.dispatchEvent(new Event("update-complete", { bubbles: true, composed: true }));
  }

  // Render the dropdown with a single value
  render() {
    return html`
      <div>
<!--        <div class="select-container ${classMap({error: this._showError})}">-->
        <div class="${classMap({
            "select-container": true,
            disabled: this.disabled
        })}">
          <select name=${this.name} .value="${this.value}" ?required=${this.required}>
            <option value="" disabled selected>${this.placeholder}</option>
          </select>
          <slot @slotchange="${this.handleSlotChange}"></slot>
        </div>
        <div id="error-message" class=${classMap({error: true, shown: this._showError})}>
          <span>${this._errorMessage}</span>
        </div>
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
    // // Check if the value is empty and the element is required
    // if (this.required && !this.disabled) {
    //   if (this.value !== "") return true;
    //   else return false;
    // }
    // // Default to true if the element is not required and is enabled
    // else return true;

    return this._selectElement.checkValidity();
  }

  displayError(message: string): void {
    // If message is empty, display the default error message.
    // Otherwise, display the custom message.
    if (message === "" || !message) this._errorMessage = this.errorMessage;
    else this._errorMessage = message;

    // Display the message
    this._showError = true;
  }

  clearError(): void {
    // Hide the error message
    this._showError = false;

    // Reset the error message to the default.
    this._errorMessage = this.errorMessage;
  }

  setValue(value: string): void {
    // TODO Make sure this updates the front end display
    this._selectElement.value = value;
  }
}
