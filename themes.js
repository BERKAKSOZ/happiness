// =========================
// SWIPE (MOBİL & MOUSE) - Sadece normal modda
// =========================
let startX = 0;
let dragging = false;
const cardContainerEl = document.getElementById("cardContainer");

function begin(x) { startX = x; dragging = true; }
function move(x) {
  if (!dragging) return;
  const diff = x - startX;
  const card = cardContainerEl?.querySelector(".card");
  if (card) card.style.transform = `translateX(${diff}px) rotate(${diff / 20}deg)`;
}
function end(x) {
  if (!dragging) return;
  const diff = x - startX;
  const card = cardContainerEl?.querySelector(".card");
  if (!card) { dragging = false; return; }

  if (diff > 100) {
    // doğru
    checkAnswer(window.currentCards[window.currentIndex], window.currentCards[window.currentIndex]);
    if (typeof showToast === "function") showToast("➡️ Doğru sayıldı");
  } else if (diff < -100) {
    // yanlış
    checkAnswer({}, window.currentCards[window.currentIndex]);
    if (typeof showToast === "function") showToast("⬅️ Yanlış sayıldı");
  } else {
    // eski konum
    card.style.transform = "translateX(0) rotate(0deg)";
  }
  dragging = false;
}

if (cardContainerEl) {
  cardContainerEl.addEventListener("touchstart", e => begin(e.touches[0].clientX));
  cardContainerEl.addEventListener("touchmove", e => move(e.touches[0].clientX));
  cardContainerEl.addEventListener("touchend", e => end(e.changedTouches[0].clientX));

  cardContainerEl.addEventListener("mousedown", e => begin(e.clientX));
  cardContainerEl.addEventListener("mousemove", e => move(e.clientX));
  cardContainerEl.addEventListener("mouseup", e => end(e.clientX));
}
