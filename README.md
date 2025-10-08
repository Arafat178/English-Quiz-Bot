# English-Quiz-Bot
Interactive English Grammar Quiz Bot with Randomized Article & Preposition Questions, Timer, and Top Score Leaderboard using Firebase Realtime Database.

# English Grammar Quiz Bot

This is an **interactive web-based English grammar quiz** that tests users on **articles** and **prepositions** with **randomized questions**.  

## Features
- **Randomized Questions**: 20 questions (10 articles + 10 prepositions) picked randomly from JSON files.
- **Timer Functionality**: 10-minute countdown for each quiz session.
- **Scoring System**: Real-time scoring with feedback for correct and wrong answers.
- **Firebase Integration**:  
  - Saves student name, score, and submission date in Firebase Realtime Database.  
  - Displays **Top 50 scores** in a pop-up leaderboard table.
- **Modern UI**: Dark theme with clean, eye-catching design.
- **Responsive**: Works on both desktop and mobile devices.

## How to Use
1. Clone the repository.  
2. Open `index.html` in a web browser.  
3. Enter your name and start the quiz.  
4. Complete 20 questions within 10 minutes.  
5. Submit and view your score, then check the Top Students leaderboard.

## Technologies
- HTML / CSS / JavaScript (ES6 modules)  
- Firebase Realtime Database  
- Fetch API for dynamic JSON questions  

## Future Enhancements
- Add more question categories (verbs, adjectives, idioms).  
- Enable multiple difficulty levels.  
- Add user authentication for personalized progress tracking.


