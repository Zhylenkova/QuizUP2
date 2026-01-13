
const META_KEY = 'quiz_app_meta_v1';
const USER_KEY_PREFIX = 'quiz_app_user_';


const getInitialState = () => ({
    user: null,
    settings: {
        amount: 10,
        category: null,
        mode: 'standard',
        difficulty: 'medium'
    },
    lastRun: null,
    history: [],
    theme: 'dark',
    achievements: [],
});

class Store extends EventTarget {
    constructor() {
        super();
        this.meta = this.loadMeta();
        this.state = this.loadUser(this.meta.lastUser);


        if (this.state.theme) {

        }

        this.achievementMeta = [
            { id: 'first_win', name: 'First Steps', desc: 'Complete your first quiz', icon: '🐣' },
            { id: 'perfect_10', name: 'Perfect 10', desc: 'Get 10/10 in a quiz', icon: '🎯' },
            { id: 'speedster', name: 'Speedster', desc: 'Score >80% in Speed Run mode', icon: '⚡' },
            { id: 'scholar', name: 'Scholar', desc: 'Play 10 games', icon: '🎓' },
            { id: 'master', name: 'Trivia Master', desc: 'Get 100% accuracy in a 50-question quiz', icon: '👑' }
        ];
    }

    loadMeta() {
        try {
            const stored = localStorage.getItem(META_KEY);
            return stored ? JSON.parse(stored) : { lastUser: null };
        } catch (e) {
            return { lastUser: null };
        }
    }

    loadUser(username) {
        if (!username) return getInitialState();

        try {
            const key = USER_KEY_PREFIX + username;
            const stored = localStorage.getItem(key);
            // Merge stored data with initial state to ensure defaults exist
            if (stored) {
                const parsed = JSON.parse(stored);
                // Ensure Arrays are initialized if data is old
                return {
                    ...getInitialState(),
                    ...parsed,
                    user: { name: username } 
                };
            }
        } catch (e) {
            console.error('Failed to load user', e);
        }

        return { ...getInitialState(), user: { name: username } };
    }

    save() {
        // 1. Save Active User Data
        if (this.state.user && this.state.user.name) {
            const key = USER_KEY_PREFIX + this.state.user.name;
            localStorage.setItem(key, JSON.stringify(this.state));
        }

        // 2. Save Meta (Active Session)
        const meta = { lastUser: this.state.user ? this.state.user.name : null };
        localStorage.setItem(META_KEY, JSON.stringify(meta));

        this.dispatchEvent(new CustomEvent('state-changed', { detail: this.state }));
    }

    // --- Actions ---

    login(name) {
        // Save previous user if needed (handled by save actions usually, but ensure consistency)
        this.save();

        // Switch context
        this.state = this.loadUser(name);
        this.save(); // Persist the switch immediately
    }

    logout() {
        this.save(); // Save current before exit
        this.state = getInitialState();
        this.save(); // Clear meta
    }

    setCategory(categoryId) {
        this.state.settings.category = categoryId;
        this.save();
    }

    setDifficulty(difficulty) {
        const allowed = ['easy', 'medium', 'hard'];
        const val = (difficulty || '').toLowerCase();

        if (!allowed.includes(val)) return;

        this.state.settings.difficulty = val;
        this.save();
    }


    setAmount(amount) {
        let val = parseInt(amount, 10);
        if (isNaN(val) || val < 1) val = 5;
        if (val > 50) val = 50;
        this.state.settings.amount = val;
        this.save();
    }

    setMode(mode) {
        this.state.settings.mode = mode;
        this.save();
    }

    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') return;
        this.state.theme = theme;
        this.save();
    }

    saveLastRun(runData) {
        this.state.lastRun = runData;
        this.state.history.push(runData);
        if (this.state.history.length > 50) {
            this.state.history.shift();
        }

        // Check Achievements
        this.checkAchievements(runData);

        this.save();
    }

    checkAchievements(run) {
        const { score, total, mode } = run;
        const accuracy = total > 0 ? (score / total) : 0;
        const historyLen = this.state.history.length;
        const newUnlocks = [];

        const unlock = (id) => {
            if (!this.state.achievements) this.state.achievements = [];
            if (!this.state.achievements.includes(id)) {
                this.state.achievements.push(id);
                newUnlocks.push(id);
            }
        };

        if (historyLen >= 1) unlock('first_win');
        if (score === 10 && total === 10) unlock('perfect_10');
        if (historyLen >= 10) unlock('scholar');
        if (mode === 'speed' && accuracy >= 0.8) unlock('speedster');
        if (total === 50 && accuracy === 1.0) unlock('master');
    }

    clearHistory() {
        this.state.history = [];
        this.state.lastRun = null;
        this.state.achievements = [];
        this.save();
    }

    getAchievements() {
        const unlocked = this.state.achievements || [];
        return this.achievementMeta.map(meta => ({
            ...meta,
            unlocked: unlocked.includes(meta.id)
        }));
    }

    getStats() {
        const { history } = this.state;
        if (!history || history.length === 0) return null;

        const totalGames = history.length;
        const totalQuestions = history.reduce((sum, run) => sum + run.total, 0);
        const totalScore = history.reduce((sum, run) => sum + run.score, 0);
        const avgScore = Math.round(totalScore / totalGames);
        const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
        const bestScore = history.reduce((max, run) => Math.max(max, run.score), 0);

        return {
            totalGames,
            totalQuestions,
            totalScore,
            avgScore,
            accuracy,
            bestScore
        };
    }

    getState() {
        return { ...this.state };
    }
}

export const store = new Store();