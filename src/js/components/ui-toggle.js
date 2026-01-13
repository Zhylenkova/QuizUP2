import { store } from '../store.js';

export class UiToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.btn = this.shadowRoot.querySelector('button');
    this.btn.addEventListener('click', () => this.toggle());

    this.updateState(store.getState().theme);

    store.addEventListener('state-changed', (e) => {
      this.updateState(e.detail.theme);
    });
  }

  toggle() {
    const current = store.getState().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    store.setTheme(next);
  }

  updateState(theme) {
    if (this.btn) {
      this.btn.textContent = theme === 'dark' ? '🌙' : '☀️';
      this.btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          background: rgba(255,255,255,0.05);
          border: var(--surface-border, 1px solid rgba(255,255,255,0.1));
          color: var(--text-color, #fff);
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        button:hover {
          background-color: var(--primary-color);
          box-shadow: 0 0 10px var(--primary-color);
          border-color: transparent;
          color: #fff;
          transform: rotate(15deg);
        }
      </style>
      <button type="button"></button>
    `;
  }
}

customElements.define('ui-toggle', UiToggle);
