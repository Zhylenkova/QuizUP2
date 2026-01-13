import { store } from '../store.js';
import { fetchQuestions } from '../api.js';
import { audio } from '../audio.js';

export class QuizPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.loading = true;
        this.error = null;
        this.locked = false; 
        this.timer = null;
    }

    connectedCallback() {
        this.render();
        this.startQuiz();
    }

    disconnectedCallback() {
        if (this.timer) clearTimeout(this.timer);
        if (this.qTimer) clearInterval(this.qTimer);
    }

    async startQuiz() {
        this.loading = true;
        this.error = null;
        this.render();

        try {
            const settings = store.getState().settings;
            this.mode = settings.mode || 'standard';
            this.difficulty = settings.difficulty || 'medium';

            this.questions = await fetchQuestions(
                settings.amount,
                settings.category,
                settings.difficulty
            );
            this.currentIndex = 0;
            this.score = 0;
            this.loading = false;
            this.render();

            this.startQuestionTimer();

        } catch (e) {
            this.error = this.mapError(e.message);
            this.loading = false;
            this.render();
        }
    }

    startQuestionTimer() {
        if (this.mode !== 'speed') return;

        this.timeLeft = 10;
        this.updateTimerUI();

        if (this.qTimer) clearInterval(this.qTimer);

        this.qTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();

            if (this.timeLeft <= 0) {
                clearInterval(this.qTimer);
                this.handleAnswer(null, false); // Time out = wrong
            }
        }, 1000);
    }

    updateTimerUI() {
        const el = this.shadowRoot.querySelector('.timer-display');
        if (el) {
            el.textContent = `${this.timeLeft}s`;
            if (this.timeLeft <= 3) el.style.color = 'var(--error-color, red)';
            else el.style.color = 'var(--text-color)';
        }
    }

    mapError(msg) {
        if (msg.includes('Code: 1')) return "Not enough questions in this category for the selected amount. Try reducing the number of questions.";
        if (msg.includes('Code: 2')) return "Invalid parameter. Please check settings.";
        if (msg.includes('Code: 3')) return "Session Token not found.";
        if (msg.includes('Code: 4')) return "Token Empty. Resetting.";
        return msg;
    }

    handleAnswer(selectedOption, isCorrect) {
        if (this.locked) return;
        this.locked = true;
        if (this.qTimer) clearInterval(this.qTimer); // Stop timer

        // Update UI to show correct/wrong
        const options = this.shadowRoot.querySelectorAll('answer-option');
        options.forEach(opt => {
            const optText = opt.textContent;
            const isThisCorrect = opt.dataset.correct === 'true';
            const isThisSelected = opt.textContent === selectedOption;

            if (isThisCorrect) {
                opt.setAttribute('state', 'correct');
            } else if (isThisSelected && !isCorrect && selectedOption !== null) {
                opt.setAttribute('state', 'wrong');
            } else {
                opt.setAttribute('state', 'idle'); // effectively disabled due to lock
                opt.setAttribute('disabled', '');
            }
        });

        // Highlight if timed out (show correct)
        if (selectedOption === null) {
            // Maybe just show correct?
            options.forEach(opt => {
                if (opt.dataset.correct === 'true') opt.setAttribute('state', 'correct');
            });
            audio.playWrong(); // Time out sound
        } else {
            if (isCorrect) {
                this.score++;
                audio.playCorrect();
            } else {
                audio.playWrong();
            }
        }

        // Wait and advance
        this.timer = setTimeout(() => {
            this.nextQuestion();
        }, 1500); // 1.5s delay
    }

    nextQuestion() {
        this.currentIndex++;
        this.locked = false;

        if (this.currentIndex >= this.questions.length) {
            this.finishQuiz();
        } else {
            this.render();
            this.startQuestionTimer();
        }
    }

    finishQuiz() {
        if (this.timer) clearTimeout(this.timer); // Cancel any pending move
        if (this.qTimer) clearInterval(this.qTimer);

        const settings = store.getState().settings;
        // We use the current index as the total answered if ending early
        // But check if we just answered the current one (locked)
        let totalQuestions = this.currentIndex;
        if (this.locked) {
            // If locked, we logically finished this question but haven't moved to next yet
            totalQuestions += 1;
        }

        // Edge case: if totalQuestions is 0 (ended immediately), avoid 0/0
        if (totalQuestions === 0 && this.score === 0) totalQuestions = 1; // 0/1

        const runData = {
            score: this.score,
            total: totalQuestions, // Only count what we saw
            category: settings.category,
            mode: this.mode,
            at: new Date().toISOString()
        };
        store.saveLastRun(runData);
        window.location.hash = '/results';
    }

    render() {
        // Loading State
        if (this.loading) {
            this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; text-align: center; margin-top: 3rem; }
          .spinner { font-size: 2rem; margin-bottom: 1rem; animation: spin 1s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
        </style>
        <div class="spinner">⏳</div>
        <p>Loading questions from Open Trivia DB...</p>
      `;
            return;
        }

        // Error State
        if (this.error) {
            this.shadowRoot.innerHTML = `
         <style>
           :host { display: block; text-align: center; color: var(--error-color, red); padding: 2rem; }
           h3 { color: var(--text-color); }
           p { color: var(--text-secondary); margin-bottom: 2rem; }
         </style>
         <h3>Oops!</h3>
         <p>${this.error}</p>
         <div style="display: flex; gap: 1rem; justify-content: center;">
            <ui-button onclick="window.location.hash='/'">Adjust Settings</ui-button>
            <ui-button variant="ghost" onclick="window.location.reload()">Try Again</ui-button>
         </div>
       `;
            return;
        }

        // Quiz State
        if (!this.questions || this.questions.length === 0) {
            return; // Should not happen unless API returns empty
        }

        const currentQ = this.questions[this.currentIndex];

        // Build Timer HTML if mode is speed
        const timerHtml = this.mode === 'speed'
            ? `<div class="timer-display" style="font-size: 1.5rem; font-weight: bold; margin-left: auto;">${this.timeLeft || 10}s</div>`
            : '';

        this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .progress-container { margin-bottom: 2rem; }
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
      </style>

      <div class="top-bar">
        <div style="flex: 1; margin-right: 1rem;">
             <ui-progress value="${this.currentIndex + 1}" max="${this.questions.length}"></ui-progress>
        </div>
        ${timerHtml}
      </div>

      <quiz-question></quiz-question>
      
      <div style="margin-top: 2rem; text-align: right;">
        <ui-button variant="danger" id="end-btn" style="width: auto; display: inline-block;">End Quiz Early</ui-button>
      </div>
    `;

        const questionEl = this.shadowRoot.querySelector('quiz-question');
        questionEl.data = currentQ;
        questionEl.innerHTML = '';

        // Bind End Button
        this.shadowRoot.querySelector('#end-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to finish the quiz now? Unanswered questions will not be counted.')) {
                this.finishQuiz();
            }
        });

        // Inject options into the slot of quiz-question
        // We do this by appending to questionEl because it has a slot

        currentQ.options.forEach(optText => {
            const el = document.createElement('answer-option');
            el.textContent = optText;

            // Store correctness metadata for logic (not visible to user in DOM easily unless inspected)
            if (optText === currentQ.correctAnswer) {
                el.dataset.correct = 'true';
            }

            el.addEventListener('click', () => {
                this.handleAnswer(optText, optText === currentQ.correctAnswer);
            });

            questionEl.appendChild(el);
        });
    }
}

customElements.define('quiz-page', QuizPage);
