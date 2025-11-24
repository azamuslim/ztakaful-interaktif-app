let score = localStorage.getItem("quizScore") || 0;
document.getElementById("totalScore").textContent = score;
document.getElementById("score").textContent = score;

const questions = [
  {
    q: "Minyak enjin perlu ditukar setiap?",
    options: ["1 tahun sekali", "5,000 - 10,000 km", "Tak perlu tukar"],
    answer: "5,000 - 10,000 km"
  },
  {
    q: "Kenapa tayar kereta perlu angin cukup?",
    options: ["Supaya lawa", "Elak haus tak sekata", "Tak penting"],
    answer: "Elak haus tak sekata"
  }
];

let current = 0;

// Show quiz
function loadQuestion() {
  const question = questions[current];
  document.getElementById("question").textContent = question.q;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  question.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected == questions[current].answer) {
    score++;
    alert("✅ Betul!");
  } else {
    alert("❌ Salah!");
  }

  localStorage.setItem("quizScore", score);
  document.getElementById("score").textContent = score;
  document.getElementById("totalScore").textContent = score;

  current = (current + 1) % questions.length;
  loadQuestion();
}

// Teka Part
const parts = [
  { img: "engine.png", answer: "enjin" },
  { img: "tire.png", answer: "tayar" },
  { img: "headlight.png", answer: "lampu hadapan" }
];

let partIndex = 0;

function checkGuess() {
  const input = document.getElementById("guessInput").value.toLowerCase();
  const correct = parts[partIndex].answer;

  if (input.includes(correct)) {
    document.getElementById("guessResult").textContent = "✅ Betul! Ini ialah " + correct;
    partIndex = (partIndex + 1) % parts.length;
    document.getElementById("partImage").src = parts[partIndex].img;
  } else {
    document.getElementById("guessResult").textContent = "❌ Cuba lagi.";
  }
}

// Tabs
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = "none");
  document.getElementById(tabId).style.display = "block";
}

// Reset Score
function resetScore() {
  if(confirm("Reset semua skor?")){
    localStorage.setItem("quizScore", 0);
    location.reload();
  }
}

// Init
loadQuestion();
