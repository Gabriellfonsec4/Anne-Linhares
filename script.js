// Ano do rodapé
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Menu
const menu = document.querySelector(".menu");
const links = document.querySelector(".links");

function setMenu(open) {
  links.classList.toggle("open", open);
  menu.classList.toggle("is-open", open);

  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");

  menu
    .querySelector("path")
    .setAttribute(
      "d",
      open ? "M7 7l18 18M25 7 7 25" : "M5 10h22M5 16h22M5 22h22",
    );
}

menu.addEventListener("click", () => {
  setMenu(!links.classList.contains("open"));
});

links.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) {
    setMenu(false);
  }
});

// Inspirações interativas
const looks = [
  {
    image: "assets/resultado-1.webp",
    alt: "Loiro iluminado",
    title: "Luz na medida certa",
    description:
      "Um loiro iluminado que valoriza o rosto e traz leveza ao visual.",
    message: "loiro iluminado",
  },
  {
    image: "assets/resultado-2.webp",
    alt: "Mechas em cabelo ondulado",
    title: "Movimento e dimensão",
    description:
      "Mechas que acompanham as ondas e revelam profundidade a cada movimento.",
    message: "mechas com movimento",
  },
  {
    image: "assets/resultado-3.webp",
    alt: "Cabelo loiro longo",
    title: "Uma nova fase",
    description: "Um visual luminoso para marcar o começo de um novo capítulo.",
    message: "transformação do cabelo",
  },
];

document.querySelectorAll(".look-option").forEach((button) => {
  button.addEventListener("click", () => {
    const look = looks[Number(button.dataset.look)];

    if (!look) return;

    document.querySelectorAll(".look-option").forEach((option) => {
      const selected = option === button;

      option.classList.toggle("active", selected);
      option.setAttribute("aria-pressed", String(selected));
    });

    const image = document.getElementById("look-image");

    image.src = look.image;
    image.alt = look.alt;

    document.getElementById("look-title").textContent = look.title;
    document.getElementById("look-description").textContent = look.description;

    const message = `Olá, equipe do Studio Anne Linhares! Vi a inspiração de ${look.message} no site e gostaria de conversar.`;

    document.getElementById("look-link").href =
      `https://wa.me/5521969942633?text=${encodeURIComponent(message)}`;
  });
});

// Ampliação das fotos
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector("button");

let lastTrigger;

document.querySelectorAll("button.result[data-image]").forEach((button) => {
  button.addEventListener("click", () => {
    lastTrigger = button;

    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.querySelector("img").alt;

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("image-locked");

    lightboxClose.focus();
  });
});

function closeImage() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");

  lightboxImage.removeAttribute("src");
  document.body.classList.remove("image-locked");

  lastTrigger?.focus();
}

lightboxClose.addEventListener("click", closeImage);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeImage();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);

    if (lightbox.classList.contains("open")) {
      closeImage();
    }
  }

  if (event.key === "Tab" && lightbox.classList.contains("open")) {
    event.preventDefault();
    lightboxClose.focus();
  }
});

// Navegação da galeria
const track = document.getElementById("gallery-track");
const cards = Array.from(track.children);

const prev = document.querySelector(".gallery-prev");
const next = document.querySelector(".gallery-next");
const count = document.querySelector(".gallery-count");
const progress = document.querySelector(".gallery-progress i");

let galleryIndex = 0;

function updateGallery() {
  const left = track.getBoundingClientRect().left;

  let nearest = 0;
  let distance = Infinity;

  cards.forEach((card, index) => {
    const current = Math.abs(card.getBoundingClientRect().left - left);

    if (current < distance) {
      distance = current;
      nearest = index;
    }
  });

  const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;

  if (atEnd && track.scrollWidth > track.clientWidth + 2) {
    nearest = cards.length - 1;
  }

  galleryIndex = nearest;

  count.innerHTML =
    `${String(nearest + 1).padStart(2, "0")} ` +
    `<small>/ ${String(cards.length).padStart(2, "0")}</small>`;

  progress.style.transform = `scaleX(${(nearest + 1) / cards.length})`;

  prev.disabled = track.scrollLeft <= 2;
  next.disabled = atEnd;
}

function moveGallery(index) {
  const card = cards[Math.max(0, Math.min(index, cards.length - 1))];

  const target =
    track.scrollLeft +
    card.getBoundingClientRect().left -
    track.getBoundingClientRect().left;

  track.scrollTo({
    left: target,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}

prev.addEventListener("click", () => {
  moveGallery(galleryIndex - 1);
});

next.addEventListener("click", () => {
  moveGallery(galleryIndex + 1);
});

let galleryFrame;

track.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(galleryFrame);
    galleryFrame = requestAnimationFrame(updateGallery);
  },
  { passive: true },
);

window.addEventListener("resize", updateGallery);

updateGallery();

// Vídeos: carregados somente ao tocar no card
const filmDialog = document.querySelector(".film-dialog");
const filmPlayer = document.getElementById("film-player");

let filmTrigger;

function closeFilm() {
  filmPlayer.pause();

  if (filmDialog.open) {
    filmDialog.close();
  }
}

filmDialog.addEventListener("close", () => {
  filmPlayer.pause();

  filmPlayer.removeAttribute("src");
  filmPlayer.removeAttribute("poster");
  filmPlayer.load();

  document.getElementById("film-error").hidden = true;
  document.body.classList.remove("film-locked");

  filmTrigger?.focus();
});

document.querySelectorAll(".film-open").forEach((button) => {
  button.addEventListener("click", () => {
    filmTrigger = button;

    document.getElementById("film-title").textContent = button.dataset.title;

    document.getElementById("film-error").hidden = true;

    document.getElementById("film-download").href = button.dataset.video;

    filmPlayer.poster = button.dataset.poster;
    filmPlayer.src = button.dataset.video;

    filmDialog.showModal();
    document.body.classList.add("film-locked");

    filmPlayer.play().catch(() => {
      // Os controles permanecem disponíveis se o navegador
      // bloquear a reprodução automática.
    });
  });
});

document.querySelector(".film-close").addEventListener("click", closeFilm);

filmPlayer.addEventListener("error", () => {
  document.getElementById("film-error").hidden = false;
});

document
  .querySelector(".film-fullscreen")
  .addEventListener("click", async () => {
    try {
      if (filmPlayer.webkitEnterFullscreen) {
        filmPlayer.webkitEnterFullscreen();
      } else if (filmPlayer.requestFullscreen) {
        await filmPlayer.requestFullscreen();
      }
    } catch {
      // O player continua disponível no modal.
    }
  });
