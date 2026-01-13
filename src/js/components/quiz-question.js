export class QuizQuestion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(questionData) {
    this._data = questionData;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._data) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    const { category, difficulty, type, question } = this._data;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 2rem;
        }
        .meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: var(--text-secondary, #a0a0a0);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .difficulty.easy { color: var(--success-color, #4caf50); }
        .difficulty.medium { color: #ff9800; }
        .difficulty.hard { color: var(--error-color, #cf6679); }
        
        h2 {
          font-size: 1.25rem;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          h2 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
          .meta {
            font-size: 0.75rem;
          }
        }
      </style>
      
      <div class="meta">
        <span class="category">${category}</span>
        <span>•</span>
        <span class="difficulty ${difficulty}">${difficulty}</span>
      </div>
      
      <h2>${question}</h2>
      <div id="options-container">
        <!-- Answer options injected by parent or slot -->
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('quiz-question', QuizQuestion);
