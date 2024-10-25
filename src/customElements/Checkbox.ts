import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    HTMLTemplateResult,
  } from "lit-element";
  import { customElement, property, query } from "lit-element/decorators.js";
  import { InputElement } from "./InputElement";

  @customElement("check-box") 
  export class Checkbox extends LitElement{
    static styles?: CSSResultGroup = css`
    /* CONTAINER FOR RADIO ELEMENT */
     .radio {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;       
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        user-select: none;
        }

        /* Hide the browser's default radio button */
      .radio input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
        }

      /* Create a custom radio button */
      .checkdot {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 50%;
        }

      /* On mouse-over, add a grey background color */
      .radio:hover input ~ .checkdot {
        background-color: #ccc;
        }

      /* When the checkbox is checked, add a green background */
      .radio input:checked ~ .checkdot {
        background-color: #0b6623;
        }

      /* Create the checkmark/indicator (hidden when not checked) */
      .checkdot:after {
        content: "";
        position: absolute;
        display: none;
        }

      /* Show the checkmark when checked */
      .radio input:checked ~ .checkdot:after {
        display: block;
        }

      /* Style the checkmark/indicator */
      .radio .checkdot:after {
        top: 9px;
        left: 9px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
        }

    /* CONTAINER FOR CHECKBOX ELEMENT */
      .checkbox{
      display: block;
      position: relative;
      padding-left: 35px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 22px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    /* Hide the browser's default checkbox */
    .checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    /* Create a custom checkbox */
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 25px;
      width: 25px;
      border-radius: 3px;
      border-style: solid;
      border-width: 1px;
      background-color: #eee;
    }

    /* On mouse-over, add a grey background color */
    .checkbox:hover input ~ .checkmark {
      background-color: #ccc;
    }

    /* When the checkbox is checked, add a blue background */
    .checkbox input:checked ~ .checkmark {
      background-color: #0b6623;
      /*change background-color to var(--theme-primary-color)*/
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    /* Show the checkmark when checked */
    .checkbox input:checked ~ .checkmark:after {
      display: block;
    }

    /* Style the checkmark/indicator */
    .checkbox .checkmark:after {
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    `

  @property({ type: Boolean, reflect: true }) accessor disabled: boolean = false;    
  @property({ type: String, reflect: true }) accessor name: string = "";
  @property({ type: Boolean, reflect: true }) accessor required: boolean = false;

  @property({ type: String }) accessor inputType: string = "checkbox"; //default type is checkbox if undefined

  @property({ type: String }) selectedRadio: string = ''; // Keep track of selected radio option
  @property({ type: String }) radioOptions: string = '[]'; // Receive the radio button options as a JSON string
  
  @property({ type: String }) selectedCheckbox: string[] = []; // Keep track of selected checkbox options
  @property({ type: String }) checkboxOptions: string = '[]'; // Receive the checkbox options as a JSON string

  @property({ type: String }) otherCheckbox: string = ''; // Checkbox with text field for custom response

  @property({ type: String }) otherRadio: String = ''; // Radio button with text field for custom response


  // Method to render checkbox options
  private renderCheckbox(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.checkboxOptions); // Parse the JSON string to array
    return html`
      <div>
        ${optionsArray.map(
          (option: string) => html`
              <label class="checkbox">
                  ${option}
                     <input
                        type="checkbox"
                        name="checkbox-group"
                        value="${option}"
                        ?checked="${this.selectedCheckbox.includes(option)}"
                        @change="${this.checkboxSelect}"
                      />
                    <span class="checkmark"></span>
                </label>
                `
                    )}
                </div>
            `;
  }

  //Method for checkbox with textbox option
  private renderCheckboxOther(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.checkboxOptions); // Parse the JSON string to array
    return html`
      <div>
        ${optionsArray.map(
          (option: string) => html`
              <label class="checkbox">
                  ${option}
                     <input
                        type="checkbox"
                        name="checkboxgroup"
                        value="${option}"
                        ?checked="${this.selectedCheckbox.includes(option)}"
                        @change="${this.checkboxSelect}"
                      />
                    <span class="checkmark"></span>
                </label>
                `
                    )}
        <label class="checkbox">
            <input 
              type="checkbox" 
              name="checkboxgroup" 
              ?checked="${this.otherCheckbox}"/>
                <outlined-text-field 
                  name="checkboxgroup" 
                  placeholder="Enter text here">
                </outlined-text-field>
          <span class="checkmark"></span>
        </label>

      </div>
    `
  }

  // Method to render radio button
  private renderRadio(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.radioOptions); // Parse the JSON string to array
    return html`
      <div>
        ${optionsArray.map(
          (option: string) => html`
              <label class="radio">
                  ${option}
                     <input
                        type="radio"
                        name="radiobutton"
                        value="${option}"
                        ?checked="${this.selectedRadio === option}"
                        @change="${this.radioChange}"
                      />
                    <span class="checkdot"></span>
                </label>
                `
                    )}
                </div>
            `;
  }

  //Method for radio button with textbox option
  private renderRadioOther(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.radioOptions); // Parse the JSON string to array
    return html`

      <div>
      ${optionsArray.map(
          (option: string) => html`
              <label class="radio">
                  ${option}
                     <input
                        type="radio"
                        name="radiogroup"
                        value="${option}"
                        ?checked="${this.selectedRadio === option}"
                        @change="${this.radioChange}"
                      />
                    <span class="checkdot"></span>
                </label>
                `
                    )}

            <label class="radio">
            <input
              type="radio"
              name="radiogroup"
              value="${this.getValue}
              ?checked="${this.selectedRadio }"
              @change="${this.radioChange}" 
            />
              <outlined-text-field 
                name="radiogroup" 
                placeholder="Enter text here">
              </outlined-text-field>
                
          <span class="checkdot"></span>
        </label>

      </div> 
    `
  }



  // Main render method to choose between rendering a checkbox or a radio button
  protected render(): HTMLTemplateResult {
    if (this.inputType === "checkbox") {
      return this.renderCheckbox();
    } 
      else if (this.inputType === "radio") {
      return this.renderRadio();
    } 
      else if (this.inputType === "checkbox-text"){
      return this.renderCheckboxOther();
    }
    else if (this.inputType === "radio-text"){
      return this.renderRadioOther();
    }
      else {
      // Handle invalid input
      return html`<p>Invalid input type. Please specify 'checkbox' or 'radio'.</p>`;
    }
  }


// Event listener to determine which radio button is clicked
private radioChange(event: Event) {
  const target = event.target as HTMLInputElement;
  this.selectedRadio = target.value;
  // For testing
  console.log(this.selectedRadio);

  this.dispatchEvent(new CustomEvent('change', { detail: { value: this.selectedRadio } }));
}


// Event listener for which checkboxes are clicked
private checkboxSelect(event: Event) {
  const checkboxes = this.shadowRoot?.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
  // Reset selectedOptions array
  this.selectedCheckbox = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      // If the checkbox is checked, add its value to the selectedOptions array
      this.selectedCheckbox.push(checkbox.value);
    }
  });
  // For testing
  console.log(this.selectedCheckbox);
  }


  getValue(): string {
    //placeholder 
    return this.name;
  }
  checkValidity(): boolean {
    //placeholder
    return this.required;
  }
  displayError(message: string): void{

  }
  clearError(): void{

  }
  
}