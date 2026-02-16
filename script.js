const button = document.getElementById("zone");
const cardsContainer = document.getElementById("cards");
const statusEl = document.getElementById("status");

const API_URL = "https://ghibliapi.vercel.app/films";

function setStatus(message) {
  statusEl.textContent = message || "";
}

function clearCards() {
  cardsContainer.innerHTML = "";
}

function createFilmCard(film) {
  const card = document.createElement("div");
  card.className = "card";

  // Selon l'API, tu peux avoir image ou movie_banner (ou aucun)
  const imgUrl = film.image || film.movie_banner || "";

  const img = document.createElement("img");
  img.src = imgUrl;
  img.alt = film.title || "Film Ghibli";
  // si jamais l'image ne charge pas, on évite l'icône cassée
  img.onerror = () => {
    img.removeAttribute("src");
    img.style.height = "160px";
  };

  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("h2");
  title.textContent = film.title || "Sans titre";

  const desc = document.createElement("p");
  desc.textContent = film.description || "Pas de description.";

  content.appendChild(title);
  content.appendChild(desc);

  card.appendChild(img);
  card.appendChild(content);

  return card;
}

async function fetchFilms() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function handleClick() {
  try {
    button.disabled = true;
    setStatus("Chargement des films...");
    clearCards();

    const films = await fetchFilms();

    // Afficher tous les films (pas aléatoire)
    films.forEach((film) => {
      const card = createFilmCard(film);
      cardsContainer.appendChild(card);
    });

    setStatus(`✅ ${films.length} films affichés.`);
  } catch (err) {
    console.error(err);
    setStatus("❌ Erreur : impossible de charger les films. Réessaie.");
  } finally {
    button.disabled = false;
  }
}

button.addEventListener("click", handleClick);
