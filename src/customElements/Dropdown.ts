import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("drop-down")
export class Dropdown extends LitElement {
  static styles: CSSResultGroup = css`
    :host {
      font-family: 'Roboto', sans-serif;
    }

    .select-container {
      display: flex;
      flex-direction: row;
      border: 2px solid;
      border-radius: 8px;
      border-color: var(--theme-primary-color);
      background-color: transparent;
      margin-top: 6px;
      height: 48px;
      position: relative;
      transition:
        border-color 400ms ease,
        background-color 400ms ease;
    }

    select {
      font-size: 11pt;
      flex-grow: 1;
      border: none;
      padding: 2px 15px;
      color: #696158;
      border-radius: 8px;
      background-color: transparent;
      appearance: none;
      cursor: pointer;
    }

    select:focus {
      outline: none;
      border-color: var(--theme-primary-color);
    }

    .select-container.errors {
      border-color: var(--theme-error-color);
    }

    .prefix {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      margin-left: 15px;
      opacity: 1;
    }

    .suffix {
      height: auto;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      margin-right: 15px;
      opacity: 1;
    }
  `;



  protected render(): HTMLTemplateResult {
    return html`
      <div class="select-container">
        <span class="prefix">▼</span>
        <select>
        </select>
        <span class="suffix"></span>
      </div>
    `;
  }

  public getValue(){
    
  }
}