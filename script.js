// ==================== Firebase Setup ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7Z-wAv-fPTWw0x3nuu34jYVB5QPdLTg8",
  authDomain: "quizresults-7e1c4.firebaseapp.com",
  databaseURL: "https://quizresults-7e1c4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizresults-7e1c4",
  storageBucket: "quizresults-7e1c4.firebasestorage.app",
  messagingSenderId: "1058483420175",
  appId: "1:1058483420175:web:fc86e519f9cba4c5f8777a",
  measurementId: "G-LG36FL4Y4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================== Global Variables ====================
let selectedQuiz = [];
let timer;
let timeLeft = 900; // 15 minutes

// ==================== Start Quiz ====================
window.startQuiz = async function() {
    const name = document.getElementById('studentName').value.trim();
    const type = document.getElementById('quizType').value;
    if(!name || !type){
        alert("Please enter your name and select quiz type.");
        return;
    }

    let fileName = "";
    if(type === "preposition") fileName = "preposition.json";
    else if(type === "tagQuestion") fileName = "tagQuestion.json";
    else if(type === "connectors") fileName = "connectors.json";
    else if(type === "rightVerbs") fileName = "rightFormOfVerbs.json";
    else fileName = "suffPrefix.json";

    try {
        const response = await fetch(fileName);
        const questionsArray = await response.json();

        // Random 20 questions
        selectedQuiz = questionsArray.sort(() => 0.5 - Math.random()).slice(0, 20);

        // Switch Sections
        document.getElementById('start-section').style.display = "none";
        document.getElementById('leaderboard-section').style.display = "none";
        document.getElementById('quiz-section').style.display = "block";

        // Render Questions
        const form = document.getElementById('quizForm');
        form.innerHTML = "";
        selectedQuiz.forEach((q,i)=>{
            const div = document.createElement('div');
            div.className = "question";
            div.id = `qdiv${i}`;
            div.innerHTML = `<label>Q${i+1}: ${q.sentence}</label>
                             <input type="text" name="q${i}" autocomplete="off" />`;
            form.appendChild(div);
        });

        startTimer();
    } catch(err) {
        console.error("Failed to load quiz JSON:", err);
        alert("Could not load quiz questions. Please check your JSON files.");
    }
}

// ==================== Timer ====================
function startTimer() {
    updateTimerDisplay();
    timer = setInterval(()=>{
        timeLeft--;
        updateTimerDisplay();
        if(timeLeft <=0){
            clearInterval(timer);
            submitQuiz();
        }
    },1000);
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft/60);
    const sec = timeLeft % 60;
    document.getElementById('timer').innerText = `Time Left: ${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

// ==================== Submit Quiz & Save to Firebase ====================
window.submitQuiz = async function() {
    clearInterval(timer);
    const formData = new FormData(document.getElementById('quizForm'));
    let score = 0;

    // submitQuiz
    selectedQuiz.forEach((q,i)=>{
        const userAnswer = formData.get(`q${i}`)?.trim();
        const div = document.getElementById(`qdiv${i}`);
        div.querySelectorAll('p.feedback').forEach(p => p.remove());

        // রুলস চেক করা: যদি JSON-এ rule থাকে, তবে সেটা ভেরিয়েবলে রাখব
        const ruleText = q.rule ? `<br><small class="rule-text">💡 Rule: ${q.rule}</small>` : "";

        if(userAnswer && userAnswer.toLowerCase() === q.answer.toLowerCase()) {
            score++;
            // সঠিক হলে শুধু উত্তর দেখাবে (চাইলে এখানেও ruleText যোগ করতে পারো)
            div.innerHTML += `<p class="feedback green">✓ Correct. Answer: <b>${q.answer}</b></p>`;
        } else {
            // ভুল হলে উত্তর + রুলস দেখাবে
            div.innerHTML += `<p class="feedback red">✗ Wrong. You: <b>${userAnswer || '-'}</b> | Ans: <b>${q.answer}</b> ${ruleText}</p>`;
        }
    });

    const studentName = document.getElementById('studentName').value;
    const quizType = document.getElementById('quizType').value;

    // Show Result Text
    document.getElementById('result').innerText = `${studentName}, you scored ${score} out of ${selectedQuiz.length}`;
    
    // Disable inputs
    document.querySelectorAll('#quizForm input').forEach(input => input.disabled = true);
    
    // Show Buttons
    document.getElementById('restartBtn').style.display = "inline-block";
    document.getElementById('viewLeaderboardBtn').style.display = "inline-block";

    // --- FIREBASE SAVE ---
    try {
        await addDoc(collection(db, "leaderboard"), {
            name: studentName,
            score: score,
            quizType: quizType,
            total: selectedQuiz.length,
            timestamp: new Date()
        });
        console.log("Score Saved to Firebase!");
    } catch (e) {
        console.error("Error adding score: ", e);
        alert("Could not save score to database.");
    }
}

// ==================== Restart Quiz ====================
window.restartQuiz = function() {
    clearInterval(timer);
    timeLeft = 900;

    document.getElementById('quizForm').innerHTML = "";
    document.getElementById('result').innerText = "";
    document.getElementById('quiz-section').style.display = "none";
    document.getElementById('restartBtn').style.display = "none";
    document.getElementById('viewLeaderboardBtn').style.display = "none";
    document.getElementById('leaderboard-section').style.display = "none";
    document.getElementById('start-section').style.display = "block";
    document.getElementById('quizType').value = "";
}

// ==================== Leaderboard Logic ====================
window.showLeaderboard = async function() {
    const listDiv = document.getElementById('leaderboard-list');
    listDiv.innerHTML = "Loading scores...";
    
    document.getElementById('start-section').style.display = "none";
    document.getElementById('quiz-section').style.display = "none";
    document.getElementById('result').innerText = "";
    document.getElementById('leaderboard-section').style.display = "block";

    try {
        // Get Top 20 scores ordered by score descending
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        
        listDiv.innerHTML = ""; // Clear loading text
        
        if(querySnapshot.empty){
            listDiv.innerHTML = "<p>No scores available yet.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const div = document.createElement('div');
            div.className = "leaderboard-item";
            div.innerHTML = `
                <span>${data.name} <small style="color:#888">(${data.quizType})</small></span>
                <span class="score-badge">${data.score}/${data.total}</span>
            `;
            listDiv.appendChild(div);
        });

    } catch(err) {
        console.error("Error fetching leaderboard:", err);
        listDiv.innerHTML = "Failed to load leaderboard.";
    }
}

window.closeLeaderboard = function() {
    document.getElementById('leaderboard-section').style.display = "none";
    document.getElementById('start-section').style.display = "block";
}
