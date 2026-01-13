import { store } from '../store.js';

export class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.subscribe();
  }

  subscribe() {
    store.addEventListener('state-changed', (e) => {
      this.updateTheme(e.detail.theme);
    });
    this.updateTheme(store.getState().theme);
  }

  updateTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        header {
          background-color: rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: var(--text-color, #fff);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        @media (max-width: 600px) {
          header {
            padding: 0.75rem 1rem;
          }
        }
        .icon-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--surface-border);
            color: var(--text-color);
            border-radius: 50%;
            width: 40px; height: 40px;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.2s;
        }
        .icon-btn:hover {
            background: var(--primary-color);
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 0 10px var(--primary-color);
        }
        h1 {
          margin: 0;
          font-size: 1.5rem;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
        }
        @media (max-width: 600px) {
          h1 {
            font-size: 1.25rem;
          }
        }
        main {
          flex: 1;
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          main {
            padding: 0.5rem;
          }
        }
        footer {
          text-align: center;
          padding: 1rem;
          font-size: 0.8rem;
          color: var(--text-secondary, #aaa);
        }
      </style>

      <header>
        <h1>QuizUP</h1>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button id="header-profile-btn" class="icon-btn" aria-label="Profile">👤</button>
            <ui-toggle></ui-toggle>
        </div>
      </header>

      <main id="router-outlet">
        <!-- Routed content goes here -->
      </main>

      <footer>
        &copy; ${new Date().getFullYear()} QuizUP. Built with Vanilla JS.
      </footer>
    `;

    const profBtn = this.shadowRoot.querySelector('#header-profile-btn');
    profBtn.addEventListener('click', () => {
      window.location.hash = '/profile';
    });


  }
}

customElements.define('app-shell', AppShell);
