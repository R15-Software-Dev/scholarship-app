import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, queryAssignedElements, query } from "lit/decorators.js";
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
  
  @property({type: String}) accessor type: string = "";
  @property({type: String}) accessor name: string = "";
  @property({type: String}) accessor id: string = "";
  @property({type: Boolean}) accessor required: boolean = false;
  @property({type: String}) accessor label: string = "";
  @property({type: String}) accessor domain: string = "";
  @property({type: Boolean}) accessor disabled: boolean = false;
  // @property({type: String}) accessor value: string = "";
  @property({type: ElementInternals}) accessor internals: ElementInternals;

  @query("outlined-text-field") private accessor _input: OutlinedTextField;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  get value() {
    return this._input.value;
  }

  protected render(): HTMLTemplateResult {
    // This element MUST be used within a FormSection or HTMLFormElement.
    return html`
      <div>
        <label for=${this.name}><h3><slot></slot></h3></label>
        <outlined-text-field
          placeholder=${this.label}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          suffix-text=${this.domain}
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
      border-radius: 7px;
      background-color: inherit;
      box-shadow: 0 0 6px rgb(173, 170, 179);
      padding: 20px;
      margin-left: auto;
      margin-right: auto;
      width: 800px;
    }

    h1 {
      margin: 10px;
      margin-top: 15px;
    }

    action-button {
      margin: 10px;
    }
  `;

  @property({type: String}) accessor header: string = "";
  @property({type: String}) accessor name: string = "";
  @property({type: String}) accessor id: string = "";

  @query("form") accessor _formElement: HTMLFormElement;
  @queryAssignedElements({selector: "form-question", flatten: true})
    accessor _questions: FormQuestion[];

  private disableForm(): void {
    const questions = this._questions;

    questions.forEach(question => {
      question.setAttribute('disabled', "true");
    });
  }

  private enableForm(): void {
    const questions = this._questions;

    questions.forEach(question => {
      question.removeAttribute('disabled');
    });
  }

  private handleForm(event: SubmitEvent): void {
    event.preventDefault();
    console.log("Attempting to submit form.");

    // Build the object that will send the data to the server.
    const formData = new FormData();
    formData.append('formId', this._formElement.id);

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

    console.log(`Built FormData object: ${JSON.stringify(Object.fromEntries(formData))}`);

    // Assuming there are no errors, send data to Google's backend.
    if (send) {
      this.disableForm();

      // We need to ignore this line due to the fact that this is only available in the
      // Apps Script webapp runtime. It will not compile if we don't ignore it.
      // @ts-ignore
      google.script.run
        .withSuccessHandler(() => {
          console.log("SUCCESS");
        })
        .withFailureHandler(() => {
          console.log("FAILED");
        })
        .processForm(JSON.stringify(Object.fromEntries(formData)));

      this.enableForm();
    }
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr>
        <form id=${this.id} name=${this.name} @submit=${this.handleForm}>
          <slot></slot>
          <action-button type="submit" form="formIdHere">Submit</action-button>
        </form>
      </div>
    `;
  }
}
