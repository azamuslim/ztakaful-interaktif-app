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
  {
  q: "Apakah beza utama antara Takaful dan Insurans?",
  options: [
    "Takaful berdasarkan perkongsian risiko, insurans jual beli risiko",
    "Takaful lebih mahal dari insurans",
    "Insurans tidak perlu bayar tuntutan"
  ],
  answer: "Takaful berdasarkan perkongsian risiko, insurans jual beli risiko"
},

{
  q: "Dalam Takaful, peserta menyumbang ke dalam?",
  options: [
    "Tabarru' (dana bersama)",
    "Akaun syarikat",
    "Akaun pelaburan riba"
  ],
  answer: "Tabarru' (dana bersama)"
},

{
  q: "Konsep mana digunakan dalam pengurusan dana Takaful?",
  options: [
    "Wadiah & Tabarru'",
    "Riba & Gharar",
    "Jual beli risiko"
  ],
  answer: "Wadiah & Tabarru'"
},

{
  q: "Dalam insurans konvensional, keuntungan syarikat datang dari?",
  options: [
    "Sumbangan peserta",
    "Perkongsian untung",
    "Perbezaan premium dan tuntutan (risk transfer)"
  ],
  answer: "Perbezaan premium dan tuntutan (risk transfer)"
},

{
  q: "Apakah maksud 'risk sharing' dalam takaful?",
  options: [
    "Peserta saling membantu membayar tuntutan",
    "Syarikat ambil alih semua risiko",
    "Tiada risiko"
  ],
  answer: "Peserta saling membantu membayar tuntutan"
},
  {
  q: "Takaful tidak dibenarkan melabur dalam pelaburan tidak patuh syariah.",
  options: ["Betul", "Salah"],
  answer: "Betul"
},

{
  q: "Insurans dan Takaful menggunakan konsep yang sama.",
  options: ["Betul", "Salah"],
  answer: "Salah"
},

{
  q: "Dalam Takaful, lebihan keuntungan boleh diagih balik kepada peserta.",
  options: ["Betul", "Salah"],
  answer: "Betul"
},

{
  q: "Insurans konvensional bebas dari unsur riba.",
  options: ["Betul", "Salah"],
  answer: "Salah"
},
{
  q: "Takaful itu konsep apa?",
  options: [
    "Tolong-menolong (ta'awun)",
    "Berniaga risiko",
    "Pelaburan saham"
  ],
  answer: "Tolong-menolong (ta'awun)"
},

{
  q: "Kalau berlaku kemalangan, pampasan takaful datang dari?",
  options: [
    "Dana Tabarru' (sumbangan peserta lain)",
    "Tabung kerajaan",
    "Wang syarikat sahaja"
  ],
  answer: "Dana Tabarru' (sumbangan peserta lain)"
},

{
  q: "Takaful patuh syariah kerana?",
  options: [
    "Ada panel syariah",
    "Ada insentif",
    "Nama dia arab"
  ],
  answer: "Ada panel syariah"
},


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
