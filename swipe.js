// =========================
// KART SWIPE (MOBİL & MOUSE)
// =========================

let startX = 0;
let isDragging = false;

// Kart container elementini al
const cardContainerEl = document.getElementById("cardContainer");

// Dokunmatik başlangıç
cardContainerEl.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

cardContainerEl.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const touchX = e.touches[0].clientX;
  const diff = touchX - startX;
  const card = cardContainerEl.querySelector(".card");
  if (card) card.style.transform = `translateX(${diff}px) rotate(${diff/20}deg)`;
});

cardContainerEl.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  handleSwipe(diff);
  isDragging = false;
});

// Mouse drag (desktop)
cardContainerEl.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  isDragging = true;
});

cardContainerEl.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const diff = e.clientX - startX;
  const card = cardContainerEl.querySelector(".card");
  if (card) card.style.transform = `translateX(${diff}px) rotate(${diff/20}deg)`;
});

cardContainerEl.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  const diff = e.clientX - startX;
  handleSwipe(diff);
  isDragging = false;
});

function handleSwipe(diff) {
  const card = cardContainerEl.querySelector(".card");
  if (!card) return;

  if (diff > 100) {
    // Sağa kaydır: doğru
    checkAnswer(currentCards[currentIndex], currentCards[currentIndex]);
    showToast("➡️ Doğru olarak kaydırıldı!");
  } else if (diff < -100) {
    // Sola kaydır: yanlış
    checkAnswer({} , currentCards[currentIndex]); // boş nesne yanlış
    showToast("⬅️ Yanlış olarak kaydırıldı!");
  }

  // Kartı sıfırla ve sonraki göster
  if (card) card.style.transform = "translateX(0) rotate(0deg)";
  currentIndex++;
  if (currentIndex < currentCards.length) {
    setTimeout(showCard, 300);
  } else if (isQuizMode) {
    setTimeout(endQuiz, 300);
  }
}
