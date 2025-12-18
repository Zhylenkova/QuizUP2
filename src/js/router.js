export class Router {
    constructor(routes) {
        this.routes = routes;
    }   
    start() {
        window.addEventListener('hashchange', () => this.render());
        if (!location.hash) location.hash = '#/';
        this.render();
    }
    getPath() {
        return location.hash.slice(1) || '/';
    }
    render() {
        const path = this.getPath();
        const tag = this.routes[path] || this.routes['/'];
        document.querySelector('app-shell').setPage(tag, path);
    }
}