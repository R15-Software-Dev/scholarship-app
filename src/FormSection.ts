import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { FormQuestion } from "./FormQuestion";

@customElement("form-section")
export class FormSection extends LitElement {
  static styles?: CSSResultGroup = css`
    div {
      border-radius: 7px;
      background-color: white;
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
  `;

  @property({type: String}) accessor header: string = "";
  @property({type: String}) accessor name: string = "";
  @property({type: String}) accessor id: string = "";

  @query("form") accessor _formElement: HTMLFormElement;

  private disableForm(): void {
    const questions = this._formElement.querySelectorAll("form-question");

    questions.forEach(question => {
      question.setAttribute('disabled', "true");
    });
  }

  private enableForm(): void {
    const questions = this._formElement.querySelectorAll("form-question");

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
    const customQuestions: FormQuestion[] = Array.from(this._formElement.querySelectorAll("form-question"));

    let send = true;
    for (let i = 0; i < customQuestions.length; i++) {
      const question: FormQuestion = customQuestions[i];
      const input: string = question.getInput;
      console.log(`Found user input: ${input}`);
      // if (!input.reportValidity()) send = false;
      formData.append(question.name, input);
    } 

    // Assuming there are no errors, send data to Google's backend.
    if (send) {
      this.disableForm();

      // We need to ignore this line due to the fact that this is only available in the
      // Apps Script webapp runtime. It will not compile if we don't ignore it.
      // @ts-ignore
      google.script.run
        .withSuccessHandler(() => {
          console.log("SUCCESS");
          this.enableForm();
        })
        .withFailureHandler(() => {
          console.log("FAILED");
          this.enableForm();
        })
        .processForm(JSON.stringify(Object.fromEntries(formData)));
    }
  }

  private _handleButton(event: Event) {
    console.log("This is a test!");
    this._formElement.requestSubmit();
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr>
        <form id="formIdHere" name="${this.name}" @submit="${this.handleForm}">
          <slot></slot>
          <action-button type="submit" form="formIdHere" @click=${this._handleButton}>Submit</action-button>
        </form>
      </div>
    `;
  }
}
