// =========================
// BONUS: Bildirim & Hızlı Quiz
// =========================
function sendNotification(title, message) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(p => { if (p === "granted") new Notification(title, { body: message }); });
  }
}

function notifyQuizEnd(score) {
  sendNotification("📚 Quiz Bitti!", `Skorunuz: ${score}%`);
}

// Hızlı Quiz (15 sn)
let fastQuizTimer = null;
function startFastQuiz() {
  if (!window.currentCards || window.currentCards.length === 0) loadCards();

  window.isQuizMode = true;
  window.correctCount = 0;
  window.wrongCount = 0;
  window.points = 0;
  window.currentIndex = 0;
  (window.shuffleArray || function(){}) (window.currentCards);

  const startBtn = document.getElementById("startQuizBtn");
  if (startBtn) startBtn.disabled = true;
  if (typeof showToast === "function") showToast("⚡ Hızlı Quiz: 15 saniye!");

  const qp = document.getElementById("quizPanel");
  if (qp) qp.classList.remove("hidden");
  if (typeof showQuizCard === "function") showQuizCard();

  let left = 15;
  const tSpan = document.getElementById("quizTime"); if (tSpan) tSpan.textContent = left;
  if (fastQuizTimer) clearInterval(fastQuizTimer);
  fastQuizTimer = setInterval(() => {
    left--;
    if (tSpan) tSpan.textContent = left;
    if (left <= 0) endFastQuiz();
  }, 1000);
}

function endFastQuiz() {
  const startBtn = document.getElementById("startQuizBtn");
  if (startBtn) startBtn.disabled = false;
  const qp = document.getElementById("quizPanel");
  if (qp) qp.classList.add("hidden");
  if (fastQuizTimer) clearInterval(fastQuizTimer);

  const total = window.correctCount + window.wrongCount;
  const score = total ? Math.round((window.correctCount / total) * 100) : 0;
  if (typeof showToast === "function") showToast(`⚡ Hızlı Quiz Bitti! Skor: ${score}%`);
  notifyQuizEnd(score);
}
