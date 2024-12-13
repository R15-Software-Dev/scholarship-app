import {
    LitElement,
    html,
    css,
    CSSResultGroup,
    HTMLTemplateResult,
  } from "lit-element";
  import { customElement, property, state, query, queryAll } from "lit-element/decorators.js";
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
        border-radius: 1px;
        border-style: solid;
        border-width: 1px;
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
        background-color: var(--theme-primary-color);
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

    /* When the checkbox is checked, add a green background */
    .checkbox input:checked ~ .checkmark {
      background-color: var(--theme-primary-color);
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
  @property({ type: Boolean, reflect: true }) accessor required: boolean = false;
  @property({ type: Boolean, reflect: true }) accessor disabled: boolean = false;    
  @property({ type: String, reflect: true }) accessor value: string = "";

  @state() accessor _hasChanged: boolean = false;
  @state() accessor _showError: boolean = false;
  @state() accessor _errorMessage: string = "";

  @property({ type: String }) accessor inputType: string = "checkbox"; //default type is checkbox if undefined

  @property({ type: String }) radioOptions: string = '[]'; // Receive the radio button options as a JSON string
  
  @property({ type: String }) selectedCheckbox: string[] = []; // Keep track of selected checkbox options
  @property({ type: String }) checkboxOptions: string = '[]'; // Receive the checkbox options as a JSON string

  @property({ type: String }) otherRadio: String = ''; // Radio button with text field for custom response

  @queryAll('input') accessor _checkboxList: Array<HTMLInputElement>;


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
                        @change="${this.optionSelect}"
                      />
                    <span class="checkmark"></span>
                </label>
                `
                    )}
                </div>
            `;
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
                        ?checked="${this.selectedCheckbox.includes(option)}"
                        @change="${this.optionSelect}"
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
                        ?checked="${this.selectedCheckbox.includes(option)}"
                        @change="${this.optionSelect}"
                      />
                    <span class="checkdot"></span>
                </label>
                `
                    )}

            <label class="radio">
            <input
              type="radio"
              name="radiogroup"
              value="other"
              ?checked="${this.selectedCheckbox}"
              @change="${this.optionSelect}" 
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
    else if (this.inputType === "radio-text"){
      return this.renderRadioOther();
    }
      else {
      // Handle invalid input
      return html`<p>Invalid input type. Please specify 'checkbox' or 'radio'.</p>`;
    }
  }


private optionSelect(event: Event)
{
  const checkboxes = this._checkboxList;
  // Reset selectedOptions array
  this.selectedCheckbox = [];
  this._checkboxList.forEach((checkbox) => {
    if (checkbox.checked) {
      // If the checkbox is checked, add its value to the selectedOptions array
      this.selectedCheckbox.push(checkbox.value);
    }
  });
}

  getValue(): string {
    return JSON.stringify(this.selectedCheckbox);
  }

  checkValidity(): boolean {
    // Check if the value is empty and the element is required
    if (this.required && !this.disabled) {
      if (this.value !== "") return true;
      else return false;
    }
    // Default to true if the element is not required and is enabled
    else return true;
  }
  displayError(message: string): void{

  }
  clearError(): void{

  }
  
}