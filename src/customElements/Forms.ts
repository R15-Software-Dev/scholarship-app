import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import {
  customElement,
  property,
  queryAssignedElements,
  query,
  state,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { InputElement } from "./InputElement";
import { ActionButton } from "./ActionButton";
import { MultiEntry } from "./MultipleEntry";

// Utility function to check if a string is valid Base64
function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (e) {
    return false;
  }
}

@customElement("form-question")
export class FormQuestion extends LitElement {
  static styles: CSSResultGroup = css`
    div {
      display: flex;
      flex-direction: column;
      margin: 10px;
      margin-bottom: 30px;
      background-color: inherit;
    }
  `;

  // Even though this returns an array, we will only ever use the first element
  // that we find. Only one input element per question.
  @queryAssignedElements( ) accessor _inputList!: Array<InputElement>;

  // After render, for accessibility, we want to set the label's "for" attribute
  @query("label") private accessor _label!: HTMLLabelElement;

  constructor() {
    super();

    // Wait for shadow root to render before setting up the label element.
    // Use this.updateComplete
    this.updateComplete.then(() => {
      this._label.setAttribute("for", this.input.id);
    });
  }

  // Allows the form that this question is a part of to check the validity
  // of the input. Really just shorthand for input.checkValidity().
  checkValidity(): boolean {
    return this.input.checkValidity();
  }

  // Allows other elements to get an instance of the input element.
  get input(): InputElement {
    return this._inputList[0];
  }

  // Method to process the input value as a file or regular value
  processInputValue(): FormDataEntryValue {
    const value = this.input.getValue();
    if (isBase64(value)) {
      const byteCharacters = atob(value);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArrays]);
      return new File([blob], "uploaded_file", { type: "application/octet-stream" });
    } else {
      return value;
    }
  }


  protected render(): HTMLTemplateResult {
    // This element MUST be used within a FormSection or HTMLFormElement.
    return html`
      <div>
        <!-- Headers should be contained here. -->
        <label>
          <slot name="header">
            <h2>No question header found</h2>
          </slot>
        </label>

        <!-- This is where our input element will go -->
        <!-- This is queried as the default slot. -->
        <slot>
          <p>No input element found</p>
        </slot>
      </div>
    `;
  }
}

@customElement("form-section")
export class FormSection extends LitElement {
  static styles?: CSSResultGroup = css`
    div {
      &.container {
        border-radius: 7px;
        background-color: inherit;
        box-shadow: 0 0 6px rgb(173, 170, 179);
        padding: 20px;
        margin-left: auto;
        margin-right: auto;
        width: 800px;
      }

      &.buttoncontainer {
        width: auto;
        border-radius: 0;
        display: flex;
        flex-direction: row;
        gap: 10px;
        align-items: center;
      }
        
    }

    h1 {
      margin: 10px;
      margin-top: 15px;
    }

    action-button {
      margin: 10px;
    }

    span {
      display: none;
      font-size: small;
      &.shown {
        display: block;
      }
    }
    .loading {
        display: none;
        &.shown {
            display: block;
        }
    }
  `;

  @property({ type: String }) accessor header: string = "";
  @property({ type: String }) accessor name: string = "";
  @property({ type: String }) accessor id: string = "";
  @property({ type: String }) accessor action: string = "";
  @property({ type: String }) accessor method: string = "";
  @state() protected accessor _checkShown: boolean = false;
  @state() private accessor _loading: boolean = false;


  @query("form")
    accessor _formElement: HTMLFormElement;
  @queryAssignedElements({ selector: "form-question", flatten: true })
    accessor _questions: FormQuestion[];
  @query("action-button")
    accessor _buttonElement: ActionButton;
  @queryAssignedElements({ selector: "multi-entry" })
    accessor _multiEntries: MultiEntry[];  // There should only ever be one per section for now.

  private disableForm(): void {
    const questions = this._questions;

    this._loading = true; // Show loading icon
    questions.forEach((question) => {
      this._buttonElement.disabled = true;
      question.input.disabled = true;
    });
    this._multiEntries.forEach((multiEntry) => {
      multiEntry.disabled = true;
    });
  }

  private enableForm(): void {
    const questions = this._questions;

    this._loading = false; // Hide loading icon
    questions.forEach((question) => {
      this._buttonElement.disabled = false;
      question.input.disabled = false;
    });
    this._multiEntries.forEach((multiEntry) => {
      multiEntry.disabled = false;
    });
  }

  handleForm(event: SubmitEvent): void {
    let submittable = true;
    let formData = new FormData();

    event.preventDefault();
    this.disableForm();

    try {
      if (this._multiEntries.length > 0) {
        console.log("Running form with multi entries");
        this._multiEntries.forEach(entry => {
          formData.set(entry.name, entry.getValue());
        });
      } else {
        // build general question data.
        // Clears error messages when input is valid
        this._questions.forEach((question) => question.input.clearError());

        // First check if values are valid by calling checkValidity on
        // all the form's inputs.
        this._questions.forEach((question) => {
          // Check validity of questions.
          if (!question.checkValidity()) {
            console.log(`Question ${question.input.name} is not valid.`);
            question.input.displayError("Invalid input");
            submittable = false;
          }
        });

        if (submittable) {
          this._questions.forEach((question) => {
            formData.set(question.input.name, question.processInputValue());
          });
        }
      }

      if (submittable) {
        console.log("information to submit: ")
        console.log(Object.fromEntries(formData));
        fetch(this.action, {
          method: this.method,
          body: JSON.stringify(Object.fromEntries(formData.entries())),
        })
          .then((response) => response.json)
          .then((data) => {
            console.log("Success: " + data);
            this.dispatchEvent(new Event("submit-complete", {bubbles: true, composed: true}));
            this._checkShown = true;
          })
      }
    } catch (e) {
      console.error(`An error occurred: ${e}`);
    } finally {
      this.enableForm();
    }
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div class="container">
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr />
        <form
          id=${this.id}
          name=${this.name}
          action=${this.action}
          method=${this.method}
          @submit=${this.handleForm}
        >
          <slot></slot>
          <div class="buttoncontainer">
            <action-button type="submit" form=${this.id}>Submit</action-button>
            <span class=${classMap({ shown: this._checkShown })}> Response recorded </span>
            <div class="loading ${classMap({ shown: this._loading })}">
                <img src="./images/small_loader.gif" alt="Loading..." />
            </div>
          </div>
        </form>
      </div>
    `;
  }
}
