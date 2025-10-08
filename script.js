import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getDatabase, ref, push, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config
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
const analytics = getAnalytics(app);
const db = getDatabase(app);

let timerInterval;
let timeLeft = 600;

// Utility shuffle
function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }

// Pick N random items
function pickRandom(arr, n) { return shuffle([...arr]).slice(0, n); }

// Build Quiz
async function buildQuiz() {
  const area = document.getElementById("questions");
  area.innerHTML = "";

  const articles = await (await fetch("article.json")).json();
  const prepositions = await (await fetch("preposition.json")).json();

  // Articles
  const articleTitle = document.createElement("h3");
  articleTitle.className = "section-title";
  articleTitle.textContent = "Article Questions";
  area.appendChild(articleTitle);

  pickRandom(articles, 10).forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "q";
    div.innerHTML = `<label>${i+1}. ${q.question.replace("_","<u>_____</u>")}</label>
                     <input type="text" data-ans="${q.answer}">`;
    area.appendChild(div);
  });

  // Prepositions
  const prepTitle = document.createElement("h3");
  prepTitle.className = "section-title";
  prepTitle.textContent = "Preposition Questions";
  area.appendChild(prepTitle);

  pickRandom(prepositions, 10).forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "q";
    div.innerHTML = `<label>${i+1}. ${q.question.replace("_","<u>_____</u>")}</label>
                     <input type="text" data-ans="${q.answer}">`;
    area.appendChild(div);
  });
}

// Timer
function startTimer() {
  const timerDisplay = document.getElementById("timer");
  timeLeft = 600;

  timerInterval = setInterval(() => {
    const min = Math.floor(timeLeft/60);
    const sec = timeLeft%60;
    timerDisplay.textContent = `Time left: ${min}:${sec.toString().padStart(2,"0")}`;
    timeLeft--;
    if(timeLeft < 0) { clearInterval(timerInterval); alert("Time is up!"); grade(); }
  }, 1000);
}

// Grade & Save to Firebase
async function grade() {
  clearInterval(timerInterval);
  const inputs = document.querySelectorAll("#questions input");
  let correct = 0;
  const results = document.getElementById("resultsContainer");
  results.innerHTML = "";

  inputs.forEach((inp,i) => {
    const ans = inp.dataset.ans.trim().toLowerCase();
    const val = inp.value.trim().toLowerCase();
    const ok = ans===val;
    if(ok) correct++;
    const div = document.createElement("div");
    div.className = ok?"correct":"wrong";
    div.innerHTML = `Q${i+1}: Your answer = <b>${val||"(none)"}</b> | Correct = <b>${ans||"(no answer)"}</b>`;
    results.appendChild(div);
  });

  const summary = document.createElement("div");
  summary.innerHTML = `<b>Score:</b> ${correct}/${inputs.length} (${Math.round(correct/inputs.length*100)}%)`;
  results.prepend(summary);

  // Save to Firebase
  const studentName = document.getElementById("studentName").value.trim();
  const record = { name: studentName, score: correct, date: new Date().toLocaleString() };
  await push(ref(db,"quizResults"), record);

  document.getElementById("submitBtn").classList.add("hidden");
  document.getElementById("restartBtn").classList.remove("hidden");
}

//top50 showing
document.getElementById("top50Btn").onclick = async () => {
  const tableBody = document.querySelector("#topResultsTable tbody");
  tableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";
  document.getElementById("popup").style.display = "flex";

  try {
    const quizRef = ref(db, "quizResults");
    const snapshot = await get(quizRef);

    if (!snapshot.exists()) {
      tableBody.innerHTML = "<tr><td colspan='4'>No results yet.</td></tr>";
      return;
    }

    const results = Object.values(snapshot.val()); // Convert object of objects to array
    results.sort((a, b) => b.score - a.score); // Descending order by score

    // clear table
    tableBody.innerHTML = "";

    results.slice(0, 20).forEach((r, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${r.name}</td>
        <td>${r.score}</td>
        <td>${r.date}</td>
      `;
      tableBody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
  }
};



//close pop up list of top students
document.getElementById("closePopup").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

// Start Quiz
document.getElementById("startBtn").onclick = async () => {
  const name = document.getElementById("studentName").value.trim();
  if(!name) return alert("Enter your name!");
  document.getElementById("welcomeMsg").textContent = `Welcome, ${name}! Answer all 20 questions.`;
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("quizSection").classList.remove("hidden");
  await buildQuiz();
  startTimer();
};

// Submit & Restart buttons
document.getElementById("submitBtn").onclick = grade;
document.getElementById("restartBtn").onclick = () => {
  clearInterval(timerInterval);
  document.getElementById("quizSection").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
  document.getElementById("resultsContainer").innerHTML = "";
  document.getElementById("studentName").value = "";
  document.getElementById("restartBtn").classList.add("hidden");
  document.getElementById("submitBtn").classList.remove("hidden");
  document.getElementById("timer").textContent = "Time left: 10:00";
};
