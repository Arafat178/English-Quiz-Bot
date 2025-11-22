# English Grammar Quiz Bot 🏆

An **interactive web-based English grammar quiz** designed to test students on various grammatical topics. It features randomized questions, a countdown timer, and a **real-time global leaderboard** powered by **Firebase Cloud Firestore**.

## 🚀 Features

  - **Topic Selection**: Choose from 4 specific categories:
      - Prepositions
      - Tag Questions
      - Connectors
      - Prefix & Suffix
  - **Randomized Questions**: The system automatically picks **20 random questions** from a larger database (JSON files) for every session.
  - **Timer System**: A **15-minute countdown** timer creates a real exam environment.
  - **Instant Feedback**:
      - Shows ✅ Correct answers in green.
      - Shows ❌ Wrong answers in red with the correct solution.
  - **Global Leaderboard (Firebase)**:
      - Automatically saves student Name, Score, and Quiz Type to the cloud.
      - Displays the **Top 20 Scorers** sorted by highest marks.
  - **Modern UI**: Fully responsive **Dark Mode** design with neon accents for a premium look.

## 🛠️ Technologies Used

  - **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules).
  - **Backend (Database)**: Firebase Cloud Firestore.
  - **Data Handling**: Fetch API to load external JSON question banks.

## 📖 How to Use

1.  **Enter Name**: Type your name in the input box.
2.  **Select Topic**: Choose a grammar topic from the dropdown menu.
3.  **Start Quiz**: The timer will start immediately.
4.  **Answer**: Fill in the blanks for 20 questions.
5.  **Submit**: Click submit before the time runs out to see your result.
6.  **Leaderboard**: Click the "View Leaderboard" button to see where you stand among other students.

## 📂 Project Structure

```bash
English-Quiz-Bot/
│
├── index.html          # Main user interface
├── style.css           # Dark theme styling
├── script.js           # Game logic & Firebase integration
├── preposition.json    # Question bank
├── tagQuestion.json    # Question bank
├── connectors.json     # Question bank
└── suffPrefix.json     # Question bank
```

## ⚙️ Setup & Installation

To run this project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/english-quiz-bot.git
    ```
2.  **Configure Firebase**:
      - Create a project in [Firebase Console](https://console.firebase.google.com/).
      - Create a **Cloud Firestore** database (Start in Test Mode).
      - Copy your `firebaseConfig` object into `script.js`.
3.  **Run the project**:
      - Since this project uses ES6 Modules (`import/export`), you cannot simply double-click `index.html`.
      - You must use a local server (e.g., **Live Server** extension in VS Code).

## 🔮 Future Enhancements

  - [ ] Add more grammar categories (Right form of verbs, Articles).
  - [ ] Add sound effects for correct/wrong answers.
  - [ ] Implement an Admin Panel to add questions easily without editing JSON files.
  - [ ] Mobile App version using React Native.

-----

### 👨‍💻 Author

Developed by **Arafat** *Mechanical Engineering Student & Programmer*
