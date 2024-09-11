import { LitElement, html, css, CSSResultGroup, HTMLTemplateResult } from 'lit-element';
import { customElement, property, query } from 'lit-element/decorators.js';

@customElement('multi-entry')
export class MultiEntry extends LitElement {
  static styles?: CSSResultGroup = css``;

  @property({type: Boolean, reflect: true}) accessor required: boolean = false;
  @property({type: {}}) private accessor _entries: Array<any> = [];
  @query('slot[name="entries"]') private accessor _entriesSlot: HTMLSlotElement;

  protected render(): HTMLTemplateResult {
    return html`
      <!-- Button allows user to add an entry -->
      <div class="container">
        <p>Start entry element:</p>
        <slot name="entries"></slot>
        <action-button @click=${this.addEntry}>Add</action-button>
      </div>
    `;
  }

  addEntry(): void {
    // Create an entry element and append it to the entries array.
    const entry = document.createElement('div');
    entry.slot = 'entries';
    this._entries.push(entry);

    // Give the new element some content.
    const entryContent = document.createElement('p');
    entryContent.textContent = 'Testing info!';
    entry.appendChild(entryContent);

    // Render the element.
    this._entriesSlot.appendChild(entry);
  }
}