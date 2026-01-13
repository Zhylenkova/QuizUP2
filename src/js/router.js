import { store } from './store.js';

const routes = {
    '/': 'dashboard-page',
    '/login': 'login-page',
    '/quiz': 'quiz-page',
    '/results': 'results-page',
    '/profile': 'profile-page',
};

export class Router {
    constructor(outlet) {
        this.outlet = outlet;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        let hash = window.location.hash.slice(1) || '/';

        const user = store.getState().user;

        if (!user && hash !== '/login') {
            window.location.hash = '/login';
            return;
        }

        // Guard: If logged in and trying to go to login, redirect to dashboard
        if (user && hash === '/login') {
            window.location.hash = '/';
            return;
        }

        // Default to dashboard if route unknown
        if (!routes[hash]) {
            window.location.hash = '/';
            return;
        }

        this.render(routes[hash]);
    }

    render(componentName) {
        // Clear outlet
        while (this.outlet.firstChild) {
            this.outlet.removeChild(this.outlet.firstChild);
        }

        // Create new page component
        const page = document.createElement(componentName);
        this.outlet.appendChild(page);
    }
}