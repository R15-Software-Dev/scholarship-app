import {
  LitElement,
  html,
  css,
  CSSResultGroup,
  HTMLTemplateResult,
} from "lit-element";
import {customElement, property, state, query, queryAll} from "lit-element/decorators.js";
import {InputElement} from "./InputElement";
import {classMap} from "lit/directives/class-map.js";

@customElement("check-box")
export class Checkbox extends LitElement implements InputElement {
  static styles?: CSSResultGroup = css`
    div .container {
      &.disabled {
        pointer-events: none;
      }
    }
      
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
      
    input.disabled {
      pointer-events: none;
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
        
        &.disabled {
            transition: background-color 0.2s linear;
            background-color: dimgrey;
            pointer-events: none;
        }
    }

    /* On mouse-over, add a grey background color */

    .radio:hover input ~ .checkdot {
      background-color: #ccc;
        &.disabled {
            transition: background-color 0.2s linear;
            background-color: dimgrey;
            pointer-events: none;
        }
    }

    /* When the checkbox is checked, add a green background */

    .radio input:checked ~ .checkdot {
      background-color: var(--theme-primary-color);
      transition: background-color 0.2s linear;
        
        &.disabled {
            transition: background-color 0.2s linear;
            background-color: dimgrey;
            pointer-events: none;
        }
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

    .checkbox {
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

        &.disabled {
            transition: background-color 0.2s linear;
            background-color: dimgrey;
        }
    }

    /* On mouse-over, add a grey background color */

    .checkbox:hover input ~ .checkmark {
      background-color: #ccc;
        &.disabled {
            transition: background-color 0.2s linear;
            background-color: dimgrey;
        }
    }

    /* When the checkbox is checked, add a green background */

    .checkbox input:checked ~ .checkmark {
      background-color: var(--theme-primary-color);
      transition: background-color 0.2s linear;
      /*change background-color to var(--theme-primary-color)*/

        &.disabled {
            transition: background-color 0.2s linear;
            background-color: dimgrey;
        }
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

    div .error {
      display: none;
      height: auto;
      width: auto;
      padding: 5px 5px 5px 8px;
      margin-bottom: 0;

      & span {
        color: var(--theme-error-color);
      }

      &.shown {
        display: block;
      }
    }
  `;

  @property({type: Boolean, reflect: true}) accessor required: boolean = false;
  @property({type: Boolean, reflect: true}) accessor disabled: boolean = false;
  @property({type: String, reflect: true})
    // accessor value: string = "";
  get value(): string {
    return this.getValue();
  }
  set value(newValue: string | string[]) {
    this.checkValue(newValue);
  }
  @property({type: String, reflect: true}) accessor name: string = "";
  @property({type: String}) accessor inputType: string = "checkbox"; //default type is checkbox if undefined
  @property({type: String}) radioOptions: string = '[]'; // Receive the radio button options as a JSON string
  @property({type: String}) selectedCheckbox: string[] = []; // Keep track of selected checkbox options
  @property({type: String}) checkboxOptions: string = '[]'; // Receive the checkbox options as a JSON string
  @property({type: String}) otherRadio: String = ''; // Radio button with text field for custom response

  @state() accessor _hasChanged: boolean = false;
  @state() accessor _errorShown: boolean = false;
  @state() accessor _errorMessage: string = "";

  @queryAll('input') accessor _checkboxList: Array<HTMLInputElement>;


  // Method to render checkbox options
  private renderCheckbox(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.checkboxOptions); // Parse the JSON string to array
    return html`
      <div>
        <div class=${classMap({ container: true, disabled: this.disabled })}>
          ${optionsArray.map(
            (option: string) => html`
              <label class="checkbox">
                ${option}
                <input
                  type="checkbox"
                  name="checkbox-group"
                  value="${option}"
                  .checked="${this.selectedCheckbox.includes(option)}"
                  @change="${this.optionSelect}"
                />
                <span class="${classMap({
                    checkmark: true,
                    disabled: this.disabled
                })}"></span>
              </label>
            `
          )}
        </div>
        <div class="error ${classMap({ shown: this._errorShown })}">
          <span>${this._errorMessage}</span>
        </div>
      </div>
    `;
  }

  // Method to render radio button
  private renderRadio(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.radioOptions); // Parse the JSON string to array
    return html`
      <div>
        <div class=${classMap({ container: true, disabled: this.disabled })}>
          ${optionsArray.map(
            (option: string) => html`
              <label class="radio">
                ${option}
                <input
                  class=${classMap({ disabled: this.disabled })}
                  type="radio"
                  name="radiobutton"
                  value="${option}"
                  .checked="${this.selectedCheckbox.includes(option)}"
                  @change="${this.optionSelect}"
                />
                <span class="${classMap({
                    checkdot: true,
                    disabled: this.disabled
                })}"></span>
              </label>
            `
          )}
        </div>
        <div class="error ${classMap({ shown: this._errorShown })}">
          <span>${this._errorMessage}</span>
        </div>
      </div>
    `;
  }

  //Method for radio button with textbox option
  private renderRadioOther(): HTMLTemplateResult {
    const optionsArray = JSON.parse(this.radioOptions); // Parse the JSON string to array
    return html`
      <div>
        <div class=${classMap({ container: true, disabled: this.disabled })}>
          ${optionsArray.map(
            (option: string) => html`
              <label class="radio">
                ${option}
                <input
                  class=${classMap({ disabled: this.disabled })}
                  type="radio"
                  name="radiogroup"
                  value="${option}"
                  .checked="${this.selectedCheckbox.includes(option)}"
                  @change="${this.optionSelect}"
                />
                <span class="checkdot"></span>
              </label>
            `
          )}
  
          <label class="radio">
            <input
              class=${classMap({ disabled: this.disabled })}
              type="radio"
              name="radiogroup"
              value="other"
              .checked="${this.selectedCheckbox}"
              @change="${this.optionSelect}"
            />
            <outlined-text-field
              name="radiogroup"
              placeholder="Enter text here">
            </outlined-text-field>
            <span class="checkdot"></span>
          </label>
  
        </div>
        <div class="error ${classMap({ shown: this._errorShown })}">
          <span>${this._errorMessage}</span>
        </div>
      </div>
    `
  }

  // Main render method to choose between rendering a checkbox or a radio button
  protected render(): HTMLTemplateResult {
    if (this.inputType === "checkbox") {
      return this.renderCheckbox();
    } else if (this.inputType === "radio") {
      return this.renderRadio();
    } else if (this.inputType === "radio-text") {
      return this.renderRadioOther();
    } else {
      // Handle invalid input
      return html`<p>Invalid input type. Please specify 'checkbox' or 'radio'.</p>`;
    }
  }

  private optionSelect() {
    // If this element is disabled, do nothing.
    if (this.disabled) return;
    // Reset selectedOptions array
    this.selectedCheckbox = [];
    this._checkboxList.forEach((checkbox) => {
      if (checkbox.checked) {
        // If the checkbox is checked, add its value to the selectedOptions array
        this.selectedCheckbox.push(checkbox.value);
      }
    });
    this.dispatchEvent(new Event("change"));
  }

  /**
   * Checks a value, or series of values.
   *
   * NOTE: Setting a series of values does NOT currently work.
   * Instead, iterate through an array of strings and do this one at a time instead.
   * @param value
   */
  checkValue(value: string | string[]): void {
    // Run almost the same code as optionSelect()
    // Check the option that matches the value of the string
    if (typeof value == "string" && value.includes('[') && value.includes(']')) {
      // console.log("Parsing value");
      value = JSON.parse(value.toString());  // this turns into a string[]
      // console.log("New value: ");
      // console.log(value);
    }
    this._checkboxList.forEach(checkbox => {
      // console.log(`Checking checkbox ${checkbox.value} against ${value}`);
      if (typeof value === "string") {
        if (value == checkbox.value) {
          checkbox.checked = true;
          this.selectedCheckbox.push(checkbox.value);
          return;
        }
      } else {
        if (value.includes(checkbox.value)) {
          checkbox.checked = true;
          this.selectedCheckbox.push(checkbox.value);
        }
      }
    });
    // Refresh list of selected elements.
    this.optionSelect();
    this.dispatchEvent(new Event("change"));
  }

  getValue(): string {
    // let selected: string[] = []
    // this._checkboxList.forEach((checkbox) => {
    //   if (checkbox.checked) {
    //     // If the checkbox is checked, add its value to the selectedOptions array
    //     selected.push(checkbox.value);
    //   }
    // });
    // return JSON.stringify(selected);
    return JSON.stringify(this.selectedCheckbox);
  }

  checkValidity(): boolean {
    // // Check if the value is empty and the element is required
    // if (this.required && !this.disabled) {
    //   if (this.value !== "") return true;
    //   else return false;
    // }
    // // Default to true if the element is not required and is enabled
    // else return true;
    if (this.required)
      return this.selectedCheckbox.length !== 0;
    return true;
  }

  displayError(message: string): void {
    // Set the error message
    this._errorMessage = message;

    // Display the error
    this._errorShown = true;
  }

  clearError(): void {
    // Reset the error message
    this._errorMessage = "";

    // Hide the error
    this._errorShown = false;
  }
}