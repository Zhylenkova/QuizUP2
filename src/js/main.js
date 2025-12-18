import { Router } from './router.js';
import './components/app-shell.js';

import './components/ui-card.js';
import './components/ui-button.js';
import './components/ui-progress.js';
import './components/ui-select.js';

import './pages/login-page.js';
import './pages/dashboard-page.js';
import './pages/quiz-page.js';
import './pages/results-page.js';
import './pages/profile-page.js';

const routes = {
  '/login': 'login-page',
  '/': 'dashboard-page',
  '/quiz': 'quiz-page',
  '/results': 'results-page',
  '/profile': 'profile-page',
};

new Router(routes).start();
