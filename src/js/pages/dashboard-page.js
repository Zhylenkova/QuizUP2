import { store } from '../store.js';

export class DashboardPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.state = store.getState();
    this.render();

    // Bind Events
    this.shadowRoot.querySelector('#start-btn').addEventListener('click', () => {
      window.location.hash = '/quiz';
    });

    this.shadowRoot.querySelector('#profile-btn').addEventListener('click', () => {
      window.location.hash = '/profile';
    });

    this.shadowRoot.querySelector('ui-select').addEventListener('change', (e) => {
      // e.detail is string value
      const val = e.detail === 'null' ? null : parseInt(e.detail, 10);
      store.setCategory(val);
    });

    // Logout
    this.shadowRoot.querySelector('#logout-btn').addEventListener('click', () => {
      store.logout();
      window.location.hash = '/login';
    });
  }

  render() {
    const { user, settings } = this.state;
    const categories = [
      { value: 'null', label: 'Any Category' },
      { value: '9', label: 'General Knowledge' },
      { value: '17', label: 'Science & Nature' },
      { value: '18', label: 'Computers' },
      { value: '23', label: 'History' },
      { value: '21', label: 'Sports' },
      { value: '22', label: 'Geography' },
      { value: '11', label: 'Film' },
      { value: '12', label: 'Music' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .welcome {
          margin-bottom: 2rem;
          text-align: center;
        }
        .actions {
          display: grid;
          gap: 1rem;
        }
        .setting-row {
            margin-bottom: 1.5rem;
        }
        .setting-row label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-secondary, #b3b3b3);
            font-size: 0.9rem;
        }
        .setting-row input {
            width: 100%;
            padding: 1rem;
            background: var(--bg-color);
            border: var(--surface-border);
            box-sizing: border-box;
            color: var(--text-color);
            border-radius: 12px;
        }

        .logout-container {
          margin-top: 2rem;
          text-align: center;
        }

        .setting-row label:has(input[value="easy"]) {
          color: #22c55e; 
        }

        .setting-row label:has(input[value="medium"]) {
          color: #f59e0b; 
        }

        .setting-row label:has(input[value="hard"]) {
          color: #ef4444; 
        }

        .setting-row label:has(input[value="easy"]:checked) {
          background: rgba(34, 197, 94, 0.15);
          border-radius: 10px;
          padding: 0.4rem 0.6rem;
        }

        .setting-row label:has(input[value="medium"]:checked) {
          background: rgba(245, 158, 11, 0.15);
          border-radius: 10px;
          padding: 0.4rem 0.6rem;
        }

        .setting-row label:has(input[value="hard"]:checked) {
          background: rgba(239, 68, 68, 0.15);
          border-radius: 10px;
          padding: 0.4rem 0.6rem;
        }

      </style>

      <div class="welcome">
        <h2>Hello, ${user ? user.name : 'Guest'}!</h2>
        <p>Ready to challenge yourself today?</p>
      </div>

      <ui-card>
        <h3>Quiz Settings</h3>
        
        <div class="setting-row">
            <label>Number of Questions</label>
            <input type="number" id="amount-input" min="1" max="50" value="${settings.amount}">
        </div>

        <div class="setting-row">
            <label>Game Mode</label>
            <div style="display: flex; gap: 1rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="radio" name="mode" value="standard" ${settings.mode === 'standard' ? 'checked' : ''}>
                    Standard
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="radio" name="mode" value="speed" ${settings.mode === 'speed' ? 'checked' : ''}>
                    Speed Run ⚡
                </label>
            </div>
        </div>

        <div class="setting-row">
          <label>Difficulty</label>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="difficulty" value="easy" ${settings.difficulty === 'easy' ? 'checked' : ''}>
              Easy
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="difficulty" value="medium" ${settings.difficulty === 'medium' ? 'checked' : ''}>
              Medium
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="radio" name="difficulty" value="hard" ${settings.difficulty === 'hard' ? 'checked' : ''}>
              Hard
            </label>
          </div>
        </div>

        
        <ui-select label="Choose Category"></ui-select>
        
        <div class="actions">
          <ui-button id="start-btn">Start Quiz</ui-button>
          <ui-button variant="ghost" id="profile-btn">View Profile</ui-button>
        </div>
      </ui-card>
      
      <div class="logout-container">
        <ui-button variant="danger" id="logout-btn">Logout</ui-button>
      </div>
    `;

    // Populate Select
    const select = this.shadowRoot.querySelector('ui-select');
    select.options = categories;
    select.value = settings.category === null ? 'null' : settings.category.toString();

    // Bind Amount
    const amountInput = this.shadowRoot.querySelector('#amount-input');
    amountInput.addEventListener('change', (e) => {
      store.setAmount(e.target.value);
    });

    // Bind Mode
    const modeInputs = this.shadowRoot.querySelectorAll('input[name="mode"]');
    modeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) store.setMode(e.target.value);
      });
    });

    const diffInputs = this.shadowRoot.querySelectorAll('input[name="difficulty"]');
    diffInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) store.setDifficulty(e.target.value);
      });
    });

  }
}

customElements.define('dashboard-page', DashboardPage);
