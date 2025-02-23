import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import {
  customElement,
  property,
  query,
  queryAll,
  queryAssignedElements,
  state,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {InputElement} from "./InputElement";
import {SmallOutlinedTextField} from "./TextField";


export type ModalReturn = {
  [key: string]: string
}

@customElement("modal-window")
export class ModalWindow extends LitElement {
  static styles: CSSResultGroup = css`
    * {
      box-sizing: border-box;
    }

    body {
      margin: 5px;
      padding: 5px;
    }

    button {
      background-color: #0b6623;
      border-color: #0b6623;
      border-radius: 3px;
      color: #fff;
      transition-duration: 0.4s;
    }

    /*Maybe change this to the ripple effect */
    button:hover {
      background-color: #fff;
      color: black;
    }
    .modal-container {
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      opacity: 0;
      pointer-events: none;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      z-index: 99;
      transition: opacity 150ms linear;
        
      &.show {
        pointer-events: all;
        opacity: 1;
      }
    }
      
    .modal {
      background-color: #fff;
      border-radius: 5px;
      padding: 30px 50px;
      width: 600px;
      max-width: 100%;
      text-align: center;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
    }

    .modal p {
      font-size: 20px;
    }
      
    small-outlined-text-field {
      margin: 10px;
    }
  `;
  @property({ type: Boolean }) accessor _modalVisible: boolean = false;

  @query("#modal-container") _modalContainer!: HTMLDivElement;
  @query("#open") _openButton!: HTMLButtonElement;
  @query("#cancel") _cancelButton!: HTMLButtonElement;
  @query("#save") _saveButton!: HTMLButtonElement;
  @query("form") _form!: HTMLFormElement;
  //Array of inputs, Assigned Elements gets elements in slots
  @queryAssignedElements({ selector: "small-outlined-text-field", flatten: true })
  accessor _inputs!: InputElement[];

  protected render(): HTMLTemplateResult {
    return html`
      <div
        class="modal-container ${classMap({ show: this._modalVisible })}"
        id="modal-container"
      >
        <div class="modal">
          <form @submit=${this.saveEvent}>
            <slot name="header"> </slot>
            <slot></slot>
            <action-button id="cancel" @click=${this.cancelEvent}>Cancel</action-button>
            <action-button id="save" type="submit">Save</action-button>
          </form>
        </div>
      </div>
    `;
  }

  showModal() {
    this._modalVisible = true;
  }

  hideModal() {
    this._modalVisible = false;
  }

  // Clears any entries made in the modal
  cancelEvent() {
    // Goes through each slot and replaces with empty string
    this._inputs.forEach((input) => {
      input.value = "";
    });
    this.hideModal(); // Hides modal after resetting form
  }

  // Method will be triggered upon clicking the 'Save' button
  saveEvent(event: SubmitEvent) {
    event.preventDefault(); // Prevents any default form submissions

    // Collects form data
    const data = this.getInformation();

    // Hide modal
    this.hideModal();
    this.clearInformation();

    // Add data to event, then allow the event to bubble
    this.dispatchEvent(
      new CustomEvent("submit", { detail: data, bubbles: true }),
    );
  }

  // Collects form data and returns it as JSON
  getInformation(): ModalReturn {
    const returnValue: ModalReturn = {};
    // Loop collecting data
    this._inputs.forEach((input: InputElement) => {
      returnValue[input.name] = input.getValue(); // Add input information to formData
    });
    return returnValue;
  }

  clearInformation(): void {
    this._inputs.forEach((input: InputElement) => {
      input.value = "";
    });
  }
}
