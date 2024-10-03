import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import {
  customElement,
  property,
  queryAssignedElements,
  query,
  state,
} from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { OutlinedTextField } from "./OutlinedTextField";

@customElement("form-question")
export class FormQuestion extends LitElement {
  static styles: CSSResultGroup = css`
    div {
      display: flex;
      flex-direction: column;
      margin: 10px;
      margin-bottom: 30px;
      backrgound-color: inherit;
    }
  `;

  @property({ type: String }) accessor type: string = "";
  @property({ type: String }) accessor name: string = "";
  @property({ type: String }) accessor id: string = "";
  @property({ type: Boolean }) accessor required: boolean = false;
  @property({ type: String }) accessor label: string = "";
  @property({ type: Boolean }) accessor disabled: boolean = false;
  @property({ type: String, attribute: "suffix-text" }) accessor suffixText =
    "";
  @property({ type: String, attribute: "prefix-text" }) accessor prefixText =
    "";
  // @property({type: String}) accessor value: string = "";
  @property({ type: ElementInternals }) accessor internals: ElementInternals;

  @query("outlined-text-field") private accessor _input: OutlinedTextField;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  checkValidity(): boolean {
    return this._input.checkValidity();
  }

  set value(newValue: string) {
    this._input.value = newValue;
  }

  get value() {
    return this._input.value;
  }

  protected render(): HTMLTemplateResult {
    // This element MUST be used within a FormSection or HTMLFormElement.
    return html`
      <div>
        <label for=${this.name}
          ><h3><slot></slot></h3
        ></label>
        <outlined-text-field
          placeholder=${this.label}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          suffix-text="${this.suffixText}"
          prefix-text="${this.prefixText}"
          type=${this.type}
          id=${this.id}
        ></outlined-text-field>
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
      font-size: x-large;
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
      console.log(`Found user input control: ${question}`);
      console.log(`Assumed value: ${question.value}`);
      console.log(`Question ID: ${question.name}`);
      // if (!input.reportValidity()) send = false;
      formData.append(question.name, question.value);
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

    // First check if values are valid by calling checkValidity on
    // all the form's inputs.
    let submittable = true;
    this._questions.forEach((question) => {
      // Check validity of questions.
      if (!question.checkValidity()) {
        console.log(`Question ${question.name} is not valid.`);
        submittable = false;
      }
    });

    // If the form has invalid responses, do not submit the form and display
    // the error prompts underneath all the questions.
    if (!submittable) return;

    // Build the FormData to send to the API.
    const formData = new FormData();

    this._questions.forEach((question) => {
      formData.set(question.name, question.value);
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
            <span class=${classMap({ shown: this._checkShown })}>&#10003;</span>
          </div>
        </form>
      </div>
    `;
  }
}
