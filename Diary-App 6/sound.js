// =========================
// SES / MÜZİK
// =========================
let bgMusic = new Audio("assets/sounds/day_and_light.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.35;
let musicPlaying = false;

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    if (typeof showToast === "function") showToast("🎵 Müzik durdu");
  } else {
    bgMusic.play().then(() => {
      musicPlaying = true;
      if (typeof showToast === "function") showToast("🎵 Müzik çalıyor");
    }).catch(() => {
      if (typeof showToast === "function") showToast("🔒 Tarayıcı engelledi, önce etkileşim gerekli");
    });
  }
}

const musicBtn = document.getElementById("musicBtn");
if (musicBtn) musicBtn.addEventListener("click", toggleMusic);

// TTS
function pronounceWord(word) {
  if (!word) return;
  const u = new SpeechSynthesisUtterance(word);
  switch (window.selectedLanguage) {
    case "en_US":
    case "en_UK":
      u.lang = "en-US"; break;
    case "de":
      u.lang = "de-DE"; break;
    case "nl":
      u.lang = "nl-NL"; break;
    case "tr":
    default:
      u.lang = "tr-TR"; break;
  }
  speechSynthesis.speak(u);
  if (typeof showToast === "function") showToast(`🔊 "${word}" telaffuz edildi`);
}
