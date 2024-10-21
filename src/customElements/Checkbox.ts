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

  }