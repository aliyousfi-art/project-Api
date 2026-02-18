
const dropdown = document.getElementById("dropdown");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

function openDropdown() {
  dropdown.classList.add("open");
  dropdownBtn.setAttribute("aria-expanded", "true");
}
function closeDropdown() {
  dropdown.classList.remove("open");
  dropdownBtn.setAttribute("aria-expanded", "false");
}
function toggleDropdown() {
  dropdown.classList.contains("open") ? closeDropdown() : openDropdown();
}

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown();
});

document.addEventListener("click", () => closeDropdown());
dropdownMenu.addEventListener("click", () => closeDropdown());

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDropdown();
});


const button = document.getElementById("zone");
const cardsContainer = document.getElementById("cards");
const statusEl = document.getElementById("status");

const API_URL = "https://ghibliapi.vercel.app/films";

function setStatus(msg) {
  statusEl.textContent = msg || "";
}
function clearFilms() {
  cardsContainer.innerHTML = "";
}

function createFilmCard(film) {
  const card = document.createElement("div");
  card.className = "card";

  const imgUrl = film.image || film.movie_banner || "";
  const img = document.createElement("img");
  img.alt = film.title || "Film Ghibli";
  if (imgUrl) img.src = imgUrl;

  const content = document.createElement("div");
  content.className = "card-content";

  const title = document.createElement("h3");
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
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

button.addEventListener("click", async () => {
  try {
    button.disabled = true;
    setStatus("Chargement des films...");
    clearFilms();

    const films = await fetchFilms();
    films.forEach((film) => cardsContainer.appendChild(createFilmCard(film)));

    setStatus(`✅ ${films.length} films affichés.`);
  } catch (err) {
    console.error(err);
    setStatus("❌ Erreur API. Réessaie.");
  } finally {
    button.disabled = false;
  }
});


function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("postsContainer");
const postTitle = document.getElementById("postTitle");
const postText = document.getElementById("postText");
const postImageUrl = document.getElementById("postImageUrl");
const postImageFile = document.getElementById("postImageFile");

function createPostElement({ title, text, image }) {
  const post = document.createElement("article");
  post.className = "post";

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    post.appendChild(img);
  }

  const body = document.createElement("div");
  body.className = "post-body";

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = text;

  const actions = document.createElement("div");
  actions.className = "actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn danger";
  deleteBtn.type = "button";
  deleteBtn.textContent = "Supprimer";
  deleteBtn.addEventListener("click", () => {
    // SUPPRESSION POST + IMAGE (#8)
    post.remove();
  });

  actions.appendChild(deleteBtn);
  body.appendChild(h3);
  body.appendChild(p);
  body.appendChild(actions);

  post.appendChild(body);
  return post;
}

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = postTitle.value.trim();
  const text = postText.value.trim();
  if (!title || !text) return;

  let image = "";
  const url = postImageUrl.value.trim();
  const file = postImageFile.files[0];

  if (file) image = await fileToDataURL(file);
  else if (url) image = url;

  const postEl = createPostElement({ title, text, image });
  postsContainer.prepend(postEl);

  postForm.reset();
});


const galleryForm = document.getElementById("galleryForm");
const galleryGrid = document.getElementById("galleryGrid");
const galleryImageUrl = document.getElementById("galleryImageUrl");
const galleryImageFile = document.getElementById("galleryImageFile");

function createGalleryItem(image) {
  const item = document.createElement("div");
  item.className = "gallery-item";

  const img = document.createElement("img");
  img.src = image;
  img.alt = "Image galerie";

  const del = document.createElement("button");
  del.className = "btn danger";
  del.type = "button";
  del.textContent = "X";
  del.addEventListener("click", () => {
    // SUPPRESSION IMAGE (#8)
    item.remove();
  });

  item.appendChild(img);
  item.appendChild(del);
  return item;
}

galleryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let image = "";
  const url = galleryImageUrl.value.trim();
  const file = galleryImageFile.files[0];

  if (file) image = await fileToDataURL(file);
  else if (url) image = url;

  if (!image) return;

  galleryGrid.prepend(createGalleryItem(image));
  galleryForm.reset();
});
