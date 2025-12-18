const KEY = 'quiz-up-state-v1';

function load() {
    try {return JSON.parse(localStorage.getItem(KEY)) || {};}
    catch {return {};}
}
function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
}
class Store {
    constructor() {
        this.state = load();
        this.state.settings ??= {amount:50, category: null};
        save(this.state);
    }
    getUser() {
        return this.state.user || null;}
        login(name) {
        this.state.user = {name, quizzes: []};
        save(this.state);
    }
    logout(){delete this.state.user; save(this.state);}

    getSettings() {
        return this.state.settings;
    }
    setCategory(categoryIdOrNull) {
        this.state.settings.category = categoryIdOrNull;
        this.state.settings.amount = 50;
        save(this.state);
    }
    setLastRun(run) {
        this.state.lastRun = run;
        save(this.state);
    }
    getLastRun() {return this.state.lastRun || null;}
}
export const store = new Store();