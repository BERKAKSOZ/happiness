// =========================
// HAZIR KART VERİLERİ
// =========================
const defaultCards = [
  {
    image: "assets/images/cat.png",
    hint_tr: "Kedi",
    en_US: "Cat",
    en_UK: "Cat",
    de: "Katze",
    nl: "Kat",
    category: "animals",
    example_en: "The cat is sleeping on the sofa."
  },
  {
    image: "assets/images/dog.png",
    hint_tr: "Köpek",
    en_US: "Dog",
    en_UK: "Dog",
    de: "Hund",
    nl: "Hond",
    category: "animals",
    example_en: "The dog barks loudly."
  },
  {
    image: "assets/images/apple.png",
    hint_tr: "Elma",
    en_US: "Apple",
    en_UK: "Apple",
    de: "Apfel",
    nl: "Appel",
    category: "food",
    example_en: "I eat an apple every day."
  },
  {
    image: "assets/images/chair.png",
    hint_tr: "Sandalye",
    en_US: "Chair",
    en_UK: "Chair",
    de: "Stuhl",
    nl: "Stoel",
    category: "objects",
    example_en: "This chair is very comfortable."
  }
];

// =========================
// LOCALSTORAGE KARTLARI
// =========================
function getUserCards() {
  const stored = localStorage.getItem("customCards");
  return stored ? JSON.parse(stored) : [];
}

function addCustomCard(card) {
  const cards = getUserCards();
  cards.push(card);
  localStorage.setItem("customCards", JSON.stringify(cards));
}

function getAllCards() {
  return [...defaultCards, ...getUserCards()];
}
