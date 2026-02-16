// 1 — Récupère les films depuis l’API
async function afficherTout() {
  const zone = document.getElementById("zone");

  const reponse = await fetch("https://ghibliapi.vercel.app/films");
  const films = await reponse.json();

  films.forEach(film => {
    const carte = faireCarte(film);
    zone.appendChild(carte);
  });
}


// 2 — Fabrique une carte pour un film
function faireCarte(film) {
  const carte = document.createElement("div");
  carte.className = "carte";

  const titre = document.createElement("h3");
  titre.textContent = film.title;

  const annee = document.createElement("p");
  annee.textContent = "Année : " + film.release_date;

  const desc = document.createElement("p");
  desc.textContent = film.description;

  carte.appendChild(titre);
  carte.appendChild(annee);
  carte.appendChild(desc);

  return carte; // je rends la carte
}


// 3 — Lance tout quand la page s'ouvre
afficherTout();
