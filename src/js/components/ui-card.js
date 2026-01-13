export class UiCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--surface-color, #1e1e1e);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: var(--surface-border, 1px solid transparent);
          color: var(--text-color, #e0e0e0);
          border-radius: var(--border-radius, 16px);
          box-shadow: var(--shadow-sm);
          padding: 2rem;
          margin-bottom: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        :host([hoverable]:hover) {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        ::slotted(input) {
          'width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          line-height: 1.2;
          box-sizing: border-box;
          text-align: center;
        }'
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('ui-card', UiCard);
