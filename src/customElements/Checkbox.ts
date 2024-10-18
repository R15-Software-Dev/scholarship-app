import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("check-box")
export class Checkbox extends LitElement {
    static styles?: CSSResultGroup = css`
    .container{
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 16;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    }

    /* Hide the browser's default checkbox */
    .container input {
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
    .container:hover input ~ .checkmark {
    background-color: #ccc;
    }

    /* When the checkbox is checked, add a green background */
    .container input:checked ~ .checkmark {
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
    .container input:checked ~ .checkmark:after {
    display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    }`

    @property({ type: Boolean, reflect: true}) accessor checked: boolean = false;

    protected render(): HTMLTemplateResult {
        return html`
        <div>
            <label class="container">
                <input type="checkbox" @click=${this.getCheckedStatus}>
                <slot></slot>
                <span class="checkmark"> </span>
            </label>
        </div>
        `
    }

    getCheckedStatus(){
        if (this.checked) {
            return "checked";
        }
        else {
            return "unchecked";
        }

    }
}
