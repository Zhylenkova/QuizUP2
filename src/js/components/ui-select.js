export class UiSelect extends HTMLElement {
  static get observedAttributes() {
    return ['label'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._options = [];
  }

  set options(value) {
    this._options = value;
    this.render();
  }

  get value() {
    const select = this.shadowRoot.querySelector('select');
    return select ? select.value : null;
  }

  set value(val) {
    const select = this.shadowRoot.querySelector('select');
    if (select) select.value = val;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const label = this.getAttribute('label') || 'Select Option';

    // Generate options HTML
    const optionsHtml = this._options.map(opt =>
      `<option value="${opt.value}">${opt.label}</option>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary, #a0a0a0);
        }
        select {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          background-color: var(--bg-color, #121212);
          color: var(--text-color, #e0e0e0);
          border: var(--surface-border, 1px solid rgba(255,255,255,0.1));
          font-family: inherit;
          font-size: 1rem;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        select:focus {
          outline: none;
          border-color: var(--primary-color, #bb86fc);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }
        /* Custom arrow workaround could be added here, simplified for now */
      </style>
      <label>${label}</label>
      <select>
        ${optionsHtml}
      </select>
    `;

    this.shadowRoot.querySelector('select').addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('change', { detail: e.target.value }));
    });
  }
}

customElements.define('ui-select', UiSelect);
