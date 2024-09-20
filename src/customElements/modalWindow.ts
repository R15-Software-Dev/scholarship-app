import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, query, queryAll, queryAssignedElements, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("modal-window")
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
    @query('form') _form!: HTMLFormElement;
    //Array of inputs, Assigned Elements gets elements in slots
    @queryAssignedElements({selector: "input", flatten: true, slot:"content"}) accessor _inputs!: HTMLInputElement[]; 

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
                <button id="cancel" @click=${this.cancelEvent}>
                    Cancel
                </button>
                <button id="save" @click=${this.saveEvent}>
                    Save
                </button>
            </div>
        </div>
    `;
    }

    showModal() {
        this._modalVisible = true;
    }

    hideModal() {
        this._modalVisible = false;
    }

    // Clears any entries made in the modal
    cancelEvent(){
        const form = this._form;
        // Goes through each slot and replaces with empty string
        this._inputs.forEach((input) => {
            input.value = "";
        });
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

        const form = this._form; // Selects form element

        const formData = new FormData(form); // Collects all input fields within the form
        // Loop collecting data
        this._inputs.forEach((input) => {
            formData.set(input.name, input.value); // Add input information to formData
        });
        
        return JSON.stringify(Object.fromEntries(formData.entries())); // Returns data as JSON string
    }
}
