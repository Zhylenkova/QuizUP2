import { store } from '../store.js';

export class ProfilePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
  this.shadowRoot.addEventListener('click', (e) => {
    const target = e.target.closest('ui-button');
    if (!target) return;

    if (target.id === 'back-btn') {
      window.location.hash = '/';
    }

    if (target.id === 'reset-btn') {
      if (confirm('Are you sure you want to clear your history? This cannot be undone.')) {
        store.clearHistory();
        this.render();
      }
    }
  });

  this.render();
}

  render() {
    const state = store.getState();
    const stats = store.getStats();
    const { user, history } = state;

    // Reverse history to show latest first
    const recentHistory = [...history].reverse().slice(0, 10); // Show last 10

    const historyHTML = recentHistory.map(run => {
      const pct = run.total > 0 ? Math.round((run.score / run.total) * 100) : 0;
      return `
      <div class="history-item">
        <div class="date">${new Date(run.at).toLocaleDateString()}</div>
        <div class="mid-col">
            <div class="cat">${this.getCategoryName(run.category)}</div>
            <div class="sub-date">${new Date(run.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="score-pill ${pct >= 70 ? 'good' : 'avg'}">
            <span class="sc">${run.score}/${run.total}</span>
            <span class="pct">${pct}%</span>
        </div>
      </div>
    `}).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        h2 { margin: 0; font-size: 1.8rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-box {
          background-color: var(--surface-color, #1e1e1e);
          border: var(--surface-border);
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .val { font-size: 2rem; font-weight: 800; color: var(--text-color); margin-bottom: 0.25rem; }
        .label { font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        
        .history-section {
          background-color: var(--surface-color, #1e1e1e);
          border: var(--surface-border);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--surface-border);
        }
        .history-item:last-child { border-bottom: none; }
        
        .date { width: 80px; font-size: 0.9rem; color: var(--text-secondary); }
        .mid-col { flex: 1; text-align: left; padding: 0 1rem; }
        .cat { font-weight: 600; font-size: 0.95rem; margin-bottom: 2px; color: var(--text-color); }
        .sub-date { font-size: 0.75rem; color: var(--text-secondary); }
        
        .score-pill {
            background: rgba(125, 125, 125, 0.1);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            text-align: right;
            min-width: 80px;
            color: var(--text-color);
        }
        .score-pill.good { background: rgba(52, 211, 153, 0.2); color: var(--success-color); }
        .score-pill.avg { background: rgba(251, 113, 133, 0.2); color: var(--error-color); }
        
        .sc { display: block; font-weight: bold; font-size: 1.1rem; }
        .pct { font-size: 0.8rem; opacity: 0.8; }
        
        .empty-msg {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
        }
      </style>

      <div class="header">
        <h2>${user ? user.name : 'User'}'s Profile</h2>
        <ui-button variant="ghost" id="back-btn" style="width: auto;">&larr; Back</ui-button>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="val">${stats ? stats.totalGames : 0}</div>
          <div class="label">Games</div>
        </div>
        <div class="stat-box">
          <div class="val">${stats ? stats.accuracy : 0}%</div>
          <div class="label">Accuracy</div>
        </div>
        <div class="stat-box">
          <div class="val">${stats ? stats.totalQuestions : 0}</div>
          <div class="label">Questions</div>
        </div>
        <div class="stat-box">
          <div class="val">${stats ? stats.bestScore : 0}</div>
          <div class="label">Best Score</div>
        </div>
      </div>

      ${this.renderRecommendations(history)}

      ${this.renderAchievements()}

      <div class="history-section">
        <h3 style="margin-top:0">Recent History</h3>
        ${history.length === 0 ? '<div class="empty-msg">No games played yet.</div>' : historyHTML}
      </div>

      <div style="margin-top: 2rem; text-align: center;">
         <ui-button variant="danger" id="reset-btn" style="width: auto;">Reset History</ui-button>
      </div>
    `;
  }

  renderAchievements() {
    const all = store.getAchievements();
    const unlockedCount = all.filter(a => a.unlocked).length;

    const cards = all.map(a => `
        <div class="ach-card ${a.unlocked ? 'unlocked' : 'locked'}">
            <div class="ach-icon">${a.icon}</div>
            <div class="ach-info">
                <div class="ach-name">${a.name}</div>
                <div class="ach-desc">${a.desc}</div>
            </div>
        </div>
      `).join('');

    return `
        <style>
            .ach-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .ach-card {
                background: var(--surface-color);
                border: var(--surface-border);
                border-radius: 12px;
                padding: 1rem;
                text-align: center;
                opacity: 0.5;
                filter: grayscale(1);
                transition: all 0.3s;
                color: var(--text-color);
            }
            .ach-card.unlocked {
                opacity: 1;
                filter: grayscale(0);
                border-color: var(--primary-color);
                background: var(--surface-color);
                box-shadow: 0 0 10px rgba(139, 92, 246, 0.1);
            }
            .ach-icon { font-size: 2rem; margin-bottom: 0.5rem; }
            .ach-name { font-weight: bold; font-size: 0.9rem; margin-bottom: 0.25rem; color: var(--text-color); }
            .ach-desc { font-size: 0.75rem; color: var(--text-secondary); }
        </style>
        <h3>Achievements (${unlockedCount}/${all.length})</h3>
        <div class="ach-grid">
            ${cards}
        </div>
      `;
  }

  renderRecommendations(history) {
    if (history.length < 3) return '';

    // Calculate avg per category
    const catStats = {};
    history.forEach(run => {
      if (!run.category) return; // Skip "All"
      if (!catStats[run.category]) catStats[run.category] = { sum: 0, count: 0 };

      // Normalized score 0-100
      const pct = run.total > 0 ? (run.score / run.total) * 100 : 0;
      catStats[run.category].sum += pct;
      catStats[run.category].count++;
    });

    let worstCatId = null;
    let minAvg = 101;

    for (const [id, stat] of Object.entries(catStats)) {
      const avg = stat.sum / stat.count;
      if (avg < minAvg) {
        minAvg = avg;
        worstCatId = id;
      }
    }

    if (!worstCatId || minAvg >= 80) {
      if (history.length > 5 && minAvg >= 80) {
        return `
               <div class="recommendation-card success">
                 <h3>🌟 Expert Status</h3>
                 <p>You're doing amazing across the board! Try increasing the difficulty or speed.</p>
               </div>
             `;
      }
      return '';
    }

    const catName = this.getCategoryName(worstCatId);

    return `
        <style>
            .recommendation-card {
                background: var(--surface-color);
                border: 1px solid rgba(255, 235, 59, 0.5);
                border-radius: 16px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: var(--shadow-sm);
            }
            .recommendation-card.success {
                border-color: rgba(52, 211, 153, 0.5);
            }
            .rec-icon { font-size: 2rem; }
            .rec-content h3 { margin: 0 0 0.25rem 0; font-size: 1.1rem; color: var(--text-color); }
            .rec-content p { margin: 0; font-size: 0.9rem; color: var(--text-secondary); }
        </style>
        <div class="recommendation-card">
            <div class="rec-icon">💡</div>
            <div class="rec-content">
                <h3>Recommendation</h3>
                <p>We noticed you could improve in <strong>${catName}</strong> (Avg: ${Math.round(minAvg)}%). Why not try a few rounds?</p>
            </div>
        </div>
      `;
  }

  getCategoryName(id) {
    // Simple duplicate map for independence or could import
    const map = {
      '9': 'Gen Knowledge', '17': 'Science', '18': 'Computers', '23': 'History',
      '21': 'Sports', '22': 'Geography', '11': 'Film', '12': 'Music'
    };
    return map[id] || 'All';
  }
}

customElements.define('profile-page', ProfilePage);
