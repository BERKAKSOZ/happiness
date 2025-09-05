// =========================
// İSTATİSTİKLER
// =========================
function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem("dailyStats") || "{}");
    return { correct: s.correct || 0, wrong: s.wrong || 0, points: s.points || 0, goal: s.goal || 0 };
  } catch { return { correct: 0, wrong: 0, points: 0, goal: 0 }; }
}

function saveStats() {
  try {
    const stats = { correct: window.correctCount, wrong: window.wrongCount, points: window.points, goal: (window.correctCount + window.wrongCount) };
    localStorage.setItem("dailyStats", JSON.stringify(stats));
  } catch {}
}

function updateStatsDOM() {
  const s = loadStats();
  const el = (id, v) => { const n = document.getElementById(id); if (n) n.textContent = v; };
  el("correctCount", s.correct);
  el("wrongCount", s.wrong);
  el("points", s.points);
  el("goalCount", s.goal);
}

document.addEventListener("DOMContentLoaded", () => {
  // İlk yüklemede var ise local değerleri ekrana bas
  updateStatsDOM();
});
