export class AnswerOption extends HTMLElement {
  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListener('click', this._handleClick.bind(this));
  }

  _handleClick(e) {
    if (this.getAttribute('state') !== 'idle') {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const text = this.textContent;
    const state = this.getAttribute('state') || 'idle';

    let icon = '';
    if (state === 'correct') icon = '✓';
    if (state === 'wrong') icon = '✗';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 0.75rem;
        }
        button {
          width: 100%;
          text-align: left;
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid transparent;
          background-color: var(--surface-color, #1e1e1e);
          color: var(--text-color, #e0e0e0);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: inherit;
        }
        
        button:not([disabled]):hover {
          background-color: rgba(255,255,255,0.05);
          transform: translateX(4px);
        }

        
        button.selected {
          border-color: var(--primary-color, #bb86fc);
          background-color: rgba(187, 134, 252, 0.1);
        }

        button.correct {
          border-color: var(--success-color, #4caf50);
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success-color, #4caf50);
        }

        button.wrong {
          border-color: var(--error-color, #cf6679);
          background-color: rgba(207, 102, 121, 0.1);
          color: var(--error-color, #cf6679);
        }
        
        
        :host([disabled]) button {
             opacity: 0.5;
             cursor: default;
             pointer-events: none;
        }

        .icon {
          font-weight: bold;
        }
      </style>
      
      <button class="${state}" ${state !== 'idle' ? 'disabled' : ''}>
        <span><slot></slot></span>
        <span class="icon">${icon}</span>
      </button>
    `;
  }
}

customElements.define('answer-option', AnswerOption);
