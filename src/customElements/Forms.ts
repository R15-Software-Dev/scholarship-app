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
  `;

  @property({ type: String }) accessor header: string = "";
  @property({ type: String }) accessor name: string = "";
  @property({ type: String }) accessor id: string = "";
  @property({ type: String }) accessor action: string = "";
  @property({ type: String }) accessor method: string = "";
  @state() protected accessor _checkShown: boolean = false;

  @query("form") accessor _formElement: HTMLFormElement;
  @queryAssignedElements({ selector: "form-question", flatten: true })
  accessor _questions: FormQuestion[];

  private disableForm(): void {
    const questions = this._questions;

    questions.forEach((question) => {
      question.setAttribute("disabled", "true");
    });
  }

  private enableForm(): void {
    const questions = this._questions;

    questions.forEach((question) => {
      question.removeAttribute("disabled");
    });
  }

  private handleForm(event: SubmitEvent): void {
    event.preventDefault();
    console.log("Attempting to submit form.");

    // Build the object that will send the data to the server.
    const formData = new FormData();
    formData.append("formId", this._formElement.id);

    // Get the questions from the form.
    const customQuestions = this._questions;

    let send = true;
    console.log(customQuestions);
    console.log(`Got ${customQuestions.length} questions, printing values.`);
    for (let i = 0; i < customQuestions.length; i++) {
      const question = customQuestions[i];
      // if (!input.reportValidity()) send = false;
      formData.append(question.input.name, question.input.getValue());
    }

    console.log(
      `Built FormData object: ${JSON.stringify(Object.fromEntries(formData))}`,
    );

    // Assuming there are no errors, send data to Google's backend.
    if (send) {
      this.disableForm();

      try {
        // Anytime the google backend is referenced, Typescript throws compilation errors.
        // This is because in its current state, "google" is not defined. This is only available
        // within the Apps Script environment. Ignore these lines for now.
        // @ts-ignore
        if (typeof google === "undefined")
          throw new Error(
            "This script is being run outside of the Google scripting environment.",
          );

        // @ts-ignore
        google.script.run
          .withSuccessHandler(() => {
            console.log("SUCCESS");
          })
          .withFailureHandler(() => {
            console.log("FAILED");
          })
          .processForm(JSON.stringify(Object.fromEntries(formData)));
      } catch (e) {
        // Right now, this will only happen when the script is run outside of the
        // Apps Script environment, which provides the "google" keyword.
        console.log(e);
      } finally {
        this.enableForm();
      }
    }
  }

  handleFormAws(event: SubmitEvent): void {
    event.preventDefault();
    this.disableForm();
    this._questions.forEach((question) => question.input.clearError());

    // First check if values are valid by calling checkValidity on
    // all the form's inputs.
    let submittable = true;
    this._questions.forEach((question) => {
      // Check validity of questions.
      if (!question.checkValidity()) {
        console.log(`Question ${question.input.name} is not valid.`);
        question.input.displayError("Invalid input");
        submittable = false;
      }
    });

    // If the form has invalid responses, do not submit the form and display
    // the error prompts underneath all the questions.
    if (!submittable) return;

    // Build the FormData to send to the API.
    const formData = new FormData();

    this._questions.forEach((question) => {
      formData.set(question.input.name, question.input.getValue());
    });

    fetch(this.action, {
      method: this.method,
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    })
      .then((response) => response.json)
      .then((data) => {
        console.log("Success: " + data);
        this._checkShown = true;
      })
      .catch((error) => {
        console.error(`An error occurred: ${error}`);
      });

    this.enableForm();
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
          @submit=${this.handleFormAws}
        >
          <slot></slot>
          <div class="buttoncontainer">
            <action-button type="submit" form=${this.id}>Submit</action-button>
            <span class=${classMap({ shown: this._checkShown })}> Response recorded </span>
          </div>
        </form>
      </div>
    `;
  }
}
