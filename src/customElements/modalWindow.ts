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

    @query('#modal-container') modalContainer!: HTMLElement;
    @query('#open') openButton!: HTMLElement;
    @query('#cancel') cancelButton!: HTMLElement;
    @query('#save') saveButton!: HTMLElement;

    protected render(): HTMLTemplateResult {
        return html`
        <button id="open">
            Add+
        </button>

        <div class="modal-container" id="modal-container">
            <div class="modal">
                <p>
                    Information section
                </p>
                <button id="cancel">
                    Cancel
                </button>
                <button id="save">
                    Save
                </button>
            </div>
        </div>
    `;
    }
        
    Update() {
        this.openButton.addEventListener('click', () => {
            this.showModal();
          });

        this.cancelButton.addEventListener('click', () => {
            this.hideModal();
          });
          
        this.saveButton.addEventListener('click', () => {
            this.hideModal();
        });
    
    }

    showModal() {
        this.modalContainer.classList.add("show");
    }

    hideModal() {
        this.modalContainer.classList.remove("show");
    }
}