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
import { FormQuestion } from "./Forms";


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
      top: 50px;
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
      border-radius: 7px;
      padding: 30px 50px;
      width: 600px;
      max-width: 100%;
      max-height: 66%;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
      overflow-y: scroll;
      z-index: 100;
    }

    .modal p {
      font-size: 20px;
    }
      
    small-outlined-text-field {
      margin: 10px;
    }
  `;
  @property({ type: Boolean }) accessor _modalVisible: boolean = false;

  @query("#modal-container") accessor _modalContainer!: HTMLDivElement;
  @query(".modal") accessor _modal: HTMLDivElement;
  @query("#open") accessor _openButton!: HTMLButtonElement;
  @query("#cancel") accessor _cancelButton!: HTMLButtonElement;
  @query("#save") accessor _saveButton!: HTMLButtonElement;
  @query("form") accessor _form!: HTMLFormElement;
  //Array of inputs, Assigned Elements gets elements in slots
  @queryAssignedElements({ selector: "form-question", flatten: true })
  accessor questions!: FormQuestion[];

  protected render(): HTMLTemplateResult {
    return html`
      <div
        class="modal-container ${classMap({ show: this._modalVisible })}"
        id="modal-container"
      >
        <div class="modal">
          <form>
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
    this._modal.scrollTo(0, 0);
  }

  hideModal() {
    this._modalVisible = false;
  }

  async showModalAsync(): Promise<ModalReturn> {
    // Show the modal and wait for the submission event.

    this.showModal();
    return new Promise(
      resolve => {
        this._form.onsubmit = (e) => {
          const response = this.saveEvent(e);
          if (response != null) {
            this._form.onsubmit = null;
            this.hideModal();
            this.clearInformation();
            resolve(response);
          }
        }
      }
    );
  }

  // Clears any entries made in the modal
  cancelEvent() {
    // Goes through each slot and replaces with empty string
    this.hideModal(); // Hides modal after resetting form
    this.clearInformation();
  }

  // Method will be triggered upon clicking the 'Save' button
  saveEvent(event: SubmitEvent): ModalReturn {
    event.preventDefault(); // Prevents any default form submissions

    if (this.reportValidity()) {
      // Collects form data
      const data = this.getInformation();

      // Hide modal
      this.hideModal();

      return data;
    } else {
      return null;
    }
  }

  // Collects form data and returns it as JSON
  getInformation(): ModalReturn {
    const returnValue: ModalReturn = {};
    // Loop collecting data
    this.questions.forEach((question) => {
      console.log(question.input.name);
      returnValue[question.input.name] = question.input.getValue(); // Add input information to formData
    });
    return returnValue;
  }

  checkValidity(): boolean {
    let valid = true;
    this.questions.forEach(question => {
      // Check if the question is valid.
      valid = question.checkValidity();
    });
    return valid;
  }

  reportValidity(): boolean {
    let valid = true;
    this.questions.forEach(question => {
      // Check if question is valid.
      if (!question.checkValidity()) {
        question.input.displayError("Invalid input.");
        valid = false;
      } else {
        question.input.clearError();
      }
    })
    return valid;
  }

  clearInformation(): void {
    this.questions.forEach((question) => {
      question.input.value = "";
      question.input.clearError();
    });
  }

  setQuestionValues(obj: ModalReturn) {
    // Sets the values of the questions within the modal window.
    // Logs errors but skips questions that do not match.
    this.questions.forEach((question) => {
      try {
        question.input.value = obj[question.input.name];
      } catch (e) {
        console.error(e);
      }
    })
  }
}
