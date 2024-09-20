import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("modal")
export class modalWindow extends LitElement {
    static styles: CSSResultGroup = css`
    *{
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
    top: 0;
    left: 0;
    height: 100vh;
    width:100vw;
    }
    /* Class*/
    .modal-container.show {
    pointer-events: all;
    opacity: 1;
    }
    .modal {
    background-color: #fff;
    border-radius: 5px;
    padding: 30px 50px;
    width: 600px;
    max-width: 100%;
    text-align:center;
    }

    .modal p {
    font-size: 20px;
    }
    `;
    @property({type: Boolean}) accessor _modalVisible: boolean = false;

    @query('#modal-container') _modalContainer!: HTMLDivElement;
    @query('#open') _openButton!: HTMLButtonElement;
    @query('#cancel') _cancelButton!: HTMLButtonElement;
    @query('#save') _saveButton!: HTMLButtonElement;
    //@query('form-question') private accessor
    //private int _year : C# underscore means private variable
    //accessor automatically creates _formQuestions 
    //make modalVisible a property to alter

    protected render(): HTMLTemplateResult {
        return html`
        <button id="open" @click="${this.showModal}">
            Add+
        </button>
        
        <div class="modal-container ${classMap({show: this._modalVisible})}"  id="modal-container">
            <div class="modal">
                <form>
                    <slot name="header"> </slot>

                    <slot name="content"> </slot>
                </form>
                <button id="cancel" @click="${this.cancelEvent}>
                    Cancel
                </button>
                <button id="save" @click="${this.saveEvent}">
                    Save
                </button>
            </div>
        </div>
    `;
    }
    // Get and show the information from the modal window
    // Save button: create a method as part of the modal window. Allow us to have a return value on one of the functions. That function will be called from MultipleEntry element, modal.getInformation. 
    // getInformation() { showModal(); waits until the form submits, when the form submits, hide the modal and return all the data as a JSON (retyrn {dataAsJson}) object return something: }
    // use @submit function

    //convert into class map
    showModal() {
        this._modalVisible = true;
    }

    hideModal() {
        this._modalVisible = false;
    }

    // Clears any entries made in the modal
    cancelEvent(){
        const form = this.shadowRoot?.querySelector('form') as HTMLFormElement;
        form.reset();
        this.hideModal(); // Hides modal after resetting form
    }
    
    // Method will be triggered upon clicking the 'Save' button
    saveEvent(event: Event){
       
        event.preventDefault(); // Prevents any default form submissions

        const data = this.getInformation();
        console.log(data); // DEBUGGING

        this.hideModal(); // Hide modal after saving

    }


    // Collects form data and returns it as JSON
    getInformation() {

        const form = this.shadowRoot?.querySelector('form') as HTMLFormElement; // Selects form element

        const formData = new FormData(form); // Collects all input fields within the form
        const dataObject: Record<string, string> = {}; // Ensures that keys (names of form fields) and values (form data values) are strings

        formData.forEach((value, key) => {
            dataObject[key] = value.toString(); // Convert values in form to strings
        });

        return JSON.stringify(dataObject); // Returns data as JSON string
    }
}
