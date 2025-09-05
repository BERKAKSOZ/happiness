// =========================
// DURUMLAR & DOM REFERANSLARI
// =========================
let currentCards = [];
let currentIndex = 0;
let selectedLanguage = "tr";
let selectedCategory = "all";
let correctCount = 0;
let wrongCount = 0;
let points = 0;
let isQuizMode = false;
let quizTime = 30;
let quizTimer = null;

const cardContainer = document.getElementById("cardContainer");
const optionsContainer = document.getElementById("optionsContainer");
const messageBox = document.getElementById("messageBox");

const languageSelect = document.getElementById("languageSelect");
const categorySelect = document.getElementById("categorySelect");
const startQuizBtn = document.getElementById("startQuizBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

// Quiz panel
const quizPanel = document.getElementById("quizPanel");
const quizCardContainer = document.getElementById("quizCardContainer");
const quizOptionsContainer = document.getElementById("quizOptionsContainer");
const quizMessageBox = document.getElementById("quizMessageBox");
const quizTimeSpan = document.getElementById("quizTime");
const quizCorrectSpan = document.getElementById("quizCorrect");
const quizWrongSpan = document.getElementById("quizWrong");
const quizPointsSpan = document.getElementById("quizPoints");

// =========================
// BAŞLANGIÇ
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadCards();
  updateStats();
});

// =========================
// YARDIMCI
// =========================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast-message";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2300);
}

// =========================
// KARTLARI YÜKLE & GÖSTER
// =========================
function loadCards() {
  let all = getAllCards();
  if (selectedCategory !== "all") {
    all = all.filter(c => c.category === selectedCategory);
  }
  shuffleArray(all);
  currentCards = all;
  currentIndex = 0;
  showCard();
}

function showCard() {
  const card = currentCards[currentIndex];
  if (!card) {
    cardContainer.innerHTML = `<p>⚠️ Kart bulunamadı!</p>`;
    optionsContainer.innerHTML = "";
    return;
  }

  cardContainer.innerHTML = `
    <div class="card">
      <img src="${card.image}" alt="Card image" />
      <h2>${card.hint_tr}</h2>
      <p class="example">💬 ${card.example_en || ""}</p>
      <button onclick="addToFavorites()">⭐ Favorilere Ekle</button>
    </div>
  `;

  generateOptions(card);
  messageBox.innerHTML = "";
}

function generateOptions(correctCard) {
  optionsContainer.innerHTML = "";

  const pool = [...currentCards];
  shuffleArray(pool);
  const options = pool.slice(0, Math.min(3, pool.length));
  if (!options.includes(correctCard) && options.length > 0) options[0] = correctCard;
  shuffleArray(options);

  options.forEach(card => {
    const btn = document.createElement("div");
    btn.className = "option-card";
    btn.textContent = card[selectedLanguage] || card.hint_tr;
    btn.onclick = () => checkAnswer(card, correctCard);
    optionsContainer.appendChild(btn);
  });
}

// =========================
function checkAnswer(selected, correct) {
  if (selected === correct) {
    correctCount++;
    points += 10;
    messageBox.innerHTML = `<span style="color: green">✔️ Doğru!</span>`;
  } else {
    wrongCount++;
    messageBox.innerHTML = `<span style="color: red">❌ Yanlış!</span>`;
  }

  updateStats();
  if (typeof saveStats === "function") saveStats();

  if (isQuizMode) {
    if (currentIndex >= 4) {
      endQuiz();
    } else {
      currentIndex++;
      setTimeout(showQuizCard, 650);
    }
  } else {
    currentIndex++;
    setTimeout(showCard, 650);
  }
}

// =========================
// FAVORİLER
// =========================
function addToFavorites() {
  const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
  const cur = currentCards[currentIndex];
  if (!fav.find(c => c.hint_tr === cur.hint_tr)) {
    fav.push(cur);
    localStorage.setItem("favorites", JSON.stringify(fav));
    showToast("⭐ Favorilere eklendi!");
  }
}

// =========================
// QUIZ
// =========================
function startQuiz() {
  if (!currentCards || currentCards.length === 0) loadCards();

  isQuizMode = true;
  correctCount = 0;
  wrongCount = 0;
  points = 0;
  currentIndex = 0;
  shuffleArray(currentCards);

  // Panel durumları
  quizPanel.classList.remove("hidden");
  startQuizBtn.disabled = true;
  showToast("🧠 Quiz modu başladı! 5 soru, 30 saniye.");

  showQuizCard();

  quizTime = 30;
  quizTimeSpan.textContent = quizTime;
  if (quizTimer) clearInterval(quizTimer);
  quizTimer = setInterval(() => {
    quizTime--;
    quizTimeSpan.textContent = quizTime;
    if (quizTime <= 0) endQuiz();
  }, 1000);
}

function showQuizCard() {
  const card = currentCards[currentIndex];
  if (!card) return;

  quizCardContainer.innerHTML = `
    <div class="card">
      <img src="${card.image}" alt="Card image" />
      <h2>${card.hint_tr}</h2>
      <p class="example">💬 ${card.example_en || ""}</p>
      <button onclick="addToFavorites()">⭐ Favorilere Ekle</button>
    </div>
  `;

  generateQuizOptions(card);
  quizMessageBox.innerHTML = "";
  // Panel sayaçlarını güncelle
  quizCorrectSpan.textContent = correctCount;
  quizWrongSpan.textContent = wrongCount;
  quizPointsSpan.textContent = points;
}

function generateQuizOptions(correctCard) {
  quizOptionsContainer.innerHTML = "";

  const pool = [...currentCards];
  shuffleArray(pool);
  const options = pool.slice(0, Math.min(3, pool.length));
  if (!options.includes(correctCard) && options.length > 0) options[0] = correctCard;
  shuffleArray(options);

  options.forEach(card => {
    const btn = document.createElement("div");
    btn.className = "option-card";
    btn.textContent = card[selectedLanguage] || card.hint_tr;
    btn.onclick = () => checkQuizAnswer(card, correctCard);
    quizOptionsContainer.appendChild(btn);
  });
}

function checkQuizAnswer(selected, correct) {
  if (selected === correct) {
    correctCount++;
    points += 10;
    quizMessageBox.innerHTML = `<span style="color: green">✔️ Doğru!</span>`;
  } else {
    wrongCount++;
    quizMessageBox.innerHTML = `<span style="color: red">❌ Yanlış!</span>`;
  }

  // Panel sayaçları
  quizCorrectSpan.textContent = correctCount;
  quizWrongSpan.textContent = wrongCount;
  quizPointsSpan.textContent = points;

  if (currentIndex >= 4) {
    endQuiz();
  } else {
    currentIndex++;
    setTimeout(showQuizCard, 650);
  }
}

function endQuiz() {
  isQuizMode = false;
  startQuizBtn.disabled = false;
  if (quizTimer) clearInterval(quizTimer);
  quizPanel.classList.add("hidden");

  const total = correctCount + wrongCount;
  const score = total ? Math.round((correctCount / total) * 100) : 0;

  // Genel istatistik de güncellensin
  updateStats();
  if (typeof saveStats === "function") saveStats();

  alert(`🎯 Quiz Bitti! Skor: ${score}%\n✅ Doğru: ${correctCount}\n❌ Yanlış: ${wrongCount}`);
  if (typeof notifyQuizEnd === "function") notifyQuizEnd(score);
}

// =========================
// İSTATİSTİK PANELİ
// =========================
function updateStats() {
  document.getElementById("correctCount").textContent = correctCount;
  document.getElementById("wrongCount").textContent = wrongCount;
  document.getElementById("points").textContent = points;
  document.getElementById("goalCount").textContent = correctCount + wrongCount;
}

// =========================
// KENDİ KARTLAR
// =========================
document.getElementById("addCardBtn").addEventListener("click", () => {
  const tr = document.getElementById("customTr").value.trim();
  const en = document.getElementById("customEn").value.trim();
  const cat = document.getElementById("customCategory").value.trim().toLowerCase();
  const ex = document.getElementById("customExample").value.trim();
  const img = document.getElementById("customImage").value.trim();

  if (!tr || !en || !cat || !img) return alert("Tüm alanları doldurun!");

  const newCard = {
    image: img,
    hint_tr: tr,
    en_US: en,
    en_UK: en,
    de: en,
    nl: en,
    category: cat,
    example_en: ex
  };

  addCustomCard(newCard);
  showToast("🎉 Yeni kart eklendi!");
  loadCards();
});

// =========================
// EVENTLER
// =========================
function setupEventListeners() {
  languageSelect.addEventListener("change", e => {
    selectedLanguage = e.target.value;
    if (isQuizMode) showQuizCard(); else showCard();
  });

  categorySelect.addEventListener("change", e => {
    selectedCategory = e.target.value;
    loadCards();
  });

  startQuizBtn.addEventListener("click", startQuiz);

  document.getElementById("viewFavoritesBtn").addEventListener("click", () => {
    const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
    currentCards = fav;
    currentIndex = 0;
    isQuizMode ? showQuizCard() : showCard();
  });

  document.getElementById("pronounceBtn").addEventListener("click", () => {
    const card = currentCards[currentIndex];
    if (!card) return;
    if (typeof pronounceWord === "function") {
      pronounceWord(card[selectedLanguage] || card.hint_tr);
    } else {
      showToast("🔇 Telaffuz kullanılamıyor");
    }
  });

  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch {}
    showToast(isDark ? "🌙 Karanlık tema" : "☀️ Aydınlık tema");
  });
}
  