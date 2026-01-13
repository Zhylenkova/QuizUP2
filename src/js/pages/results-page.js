import { store } from '../store.js';

export class ResultsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.state = store.getState();
    this.render();

    this.shadowRoot.querySelector('#replay-btn').addEventListener('click', () => {
      window.location.hash = '/quiz';
    });

    this.shadowRoot.querySelector('#home-btn').addEventListener('click', () => {
      window.location.hash = '/';
    });
  }

  render() {
    const { lastRun } = this.state;

    if (!lastRun) {
      // Fallback if accessed directly
      window.location.hash = '/';
      return;
    }

    const percentage = lastRun.total > 0 ? Math.round((lastRun.score / lastRun.total) * 100) : 0;

    let message = "Good effort!";
    let subMessage = "Keep practicing to improve!";
    if (percentage >= 90) { message = "Outstanding!"; subMessage = "You're a master at this!"; }
    else if (percentage >= 70) { message = "Great Job!"; subMessage = "You really know your stuff."; }
    else if (percentage >= 50) { message = "Well Done!"; subMessage = "You're getting there."; }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; text-align: center; }
        .score-circle {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: var(--surface-color);
          border: 3px solid var(--surface-border);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 2rem auto;
          position: relative;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          .score-circle {
            width: 140px;
            height: 140px;
            margin: 1rem auto;
          }
          .score-value {
            font-size: 2.5rem;
          }
          h1 {
            font-size: 1.5rem;
          }
        }
        .score-circle::before {
            content: '';
            position: absolute;
            top: -3px; left: -3px; right: -3px; bottom: -3px;
            border-radius: 50%;
            background: conic-gradient(var(--primary-color) ${percentage}%, transparent 0);
            z-index: -1;
            opacity: 0.8;
        }
        .score-value {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1;
          color: var(--text-color);
        }
        .score-total {
          font-size: 1.2rem;
          color: var(--text-secondary);
        }
        .accuracy {
            font-size: 1.2rem;
            color: var(--secondary-color);
            margin-bottom: 2rem;
            font-weight: 600;
        }
        .actions {
          display: grid;
          gap: 1rem;
          max-width: 300px;
          margin: 0 auto;
        }
        @media (max-width: 600px) {
          .actions {
            max-width: 100%;
          }
        }
        h1 { margin-bottom: 0.5rem; }
        .sub-msg { color: var(--text-secondary); margin-bottom: 1rem; }
      </style>

      <h1>${message}</h1>
      <div class="sub-msg">${subMessage}</div>
      
      <div class="score-circle">
        <div class="score-value">${lastRun.score}</div>
        <div class="score-total">/ ${lastRun.total}</div>
      </div>
      
      <div class="accuracy">Accuracy: ${percentage}%</div>
      
      <p>Category: ${this.getCategoryName(lastRun.category)}</p>

      <div class="actions">
        <ui-button id="replay-btn">Play Again</ui-button>
        <ui-button variant="ghost" id="home-btn">Back to Dashboard</ui-button>
    `;
  }

  getCategoryName(id) {
    if (!id) return "All Categories";
    // Reuse map ideally or just show ID/generic for now as map is internal to dashboard
    // For simplicity, we can duplicate the map or move it to utils/store.
    // I'll just return ID if unknown for now to save space, or simple switch.
    const map = {
      '9': 'General Knowledge',
      '17': 'Science & Nature',
      '18': 'Computers',
      '23': 'History',
      '21': 'Sports',
      '22': 'Geography',
      '11': 'Film',
      '12': 'Music'
    };
    return map[id] || `Category ${id}`;
  }
}

customElements.define('results-page', ResultsPage);
