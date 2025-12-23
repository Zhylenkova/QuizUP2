# QuizUP 🧠

A feature-rich single-page quiz application built entirely with **Vanilla JavaScript**, **Web Components**, and modern **CSS**.


## ✨ Features

-   **🎯 Multiple Game Modes**
    -   **Standard**: Take your time and answer at your own pace.
    -   **⚡ Speed Run**: Race against the clock with a 10-second timer per question!
-   **🎨 Dynamic Theming**
    -   Beautiful **Dark/Light mode** support with glassmorphism and gradient aesthetics.
-   **👤 Multi-User Support**
    -   Create unique profiles for different users.
    -   History, stats, and settings are isolated per user.
-   **🏆 Gamification**
    -   **Achievements System**: Unlock badges like "Speedster", "Perfect 10", and "Trivia Master".
    -   **Smart Recommendations**: The app analyzes your weak spots and suggests categories to improve.
    -   **Detailed Statistics**: Visual breakdowns of your accuracy, best scores, and progress.
-   **🔊 Immersive Experience**
    -   Sound effects for interactions and game events.
    -   Haptic feedback (vibrations) on mobile devices.
-   **⚙️ Customizability**
    -   Choose from over 20+ Categories (Science, History, Sports, etc.).
    -   Adjust question count (1-50 questions).

## 🚀 Getting Started

No build tools or package managers required! This is a pure standard web project.

1.  **Clone the repository** (or download the files).
2.  **Open `index.html`** in your browser.
    *   *Note: For best results with ES modules, use a local server (e.g., Live Server in VS Code).*

### Recommended Development Setup
If you have Node.js installed, you can serve the app easily:

```bash
npx serve .
```

## 🛠️ Technology Stack

-   **Core**: HTML5, Modern CSS3, ECMAScript 2020+
-   **Architecture**: Web Components (Custom Elements & Shadow DOM)
-   **State Management**: Custom Store with `localStorage` persistence
-   **Routing**: Custom Hash-based Router
-   **API**: [Open Trivia DB](https://opentdb.com/)
-   **Assets**: Zero external image dependencies (CSS & Emoji based UI) -> *Wait, we used an emoji based UI.*

## 📂 Project Structure

```
src/
├── js/
│   ├── components/   # Reusable UI Web Components (ui-button, ui-card...)
│   ├── pages/        # Route components (quiz-page, profile-page...)
│   ├── api.js        # Open Trivia DB integration
│   ├── router.js     # Hash-based routing logic
│   ├── store.js      # State management & Persistence
│   └── audio.js      # Audio & Haptics manager
├── styles/
│   └── base.css      # Design system variables & global styles
└── index.html        # Entry point
```

## 📄 License

Open Source. Built for fun and learning!
