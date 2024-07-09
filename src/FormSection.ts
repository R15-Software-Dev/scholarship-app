import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";

@customElement("form-section")
export class FormSection extends LitElement {
  static styles?: CSSResultGroup = css`
    .container {}
  `;

  @property({type: String})
  accessor header: string = "";

  @property({type: String})
  accessor name: string = "";

  @property({type: String})
  accessor id: string = "";

  @query("form")
  accessor _formElement: HTMLFormElement;

  private disableForm(event: SubmitEvent): void {
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

    // Build the object that will send the data to the server.
    const formData = new FormData();
    formData.append('formId', this._formElement.id);

    // Get the questions from the form.
    const customQuestions = this._formElement.querySelectorAll("form-question");

    let send = true;
    /* for (let i = 0; i < customQuestions.length; i++) {
      const question = customQuestions[i];
      const input = question.inputElement;
      if (!input.reportValidity()) send = false;
      formData.append(input.name, input.value);
    } */

    // Assuming there are no errors, send data to Google's backend.
    if (send) {
      this.disableForm(event);
      /* google.script.run  // For now, ignore this error because google.script.run doesn't exist within node right now.
        .withSuccessHandler(() => {
          console.log("SUCCESS");
          this.enableForm();
        })
        .withFailureHandler(() => {
          console.log("FAILED");
          this.enableForm();
        })
        .processForm(JSON.stringify(Object.fromEntries(formData))); */
    }
  }

  protected render(): HTMLTemplateResult {
    return html`
      <div>
        <!-- Create a box that contains our form. -->
        <h1>${this.header}</h1>
        <hr>
        <form id="form" name="${this.name}">
          <slot></slot>
          <action-button type="submit" @click=${this.disableForm} @submit=${this.handleForm}>Submit</action-button>
        </form>
      </div>
    `;
  }
}
