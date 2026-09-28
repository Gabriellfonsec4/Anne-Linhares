document.getElementById('year').textContent = new Date().getFullYear();

const menu = document.querySelector('.menu');
const links = document.querySelector('.links');

menu.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
  menu.querySelector('path').setAttribute(
    'd',
    open ? 'M7 7l18 18M25 7 7 25' : 'M5 10h22M5 16h22M5 22h22'
  );
});

links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  links.classList.remove('open');
  menu.classList.remove('is-open');
  menu.querySelector('path').setAttribute('d', 'M5 10h22M5 16h22M5 22h22');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menu');
}));

const looks = [
  {
    image: 'assets/resultado-1.webp',
    alt: 'Loiro iluminado',
    title: 'Luz na medida certa',
    description: 'Um loiro iluminado que valoriza o rosto e traz leveza ao visual.',
    message: 'loiro iluminado'
  },
  {
    image: 'assets/resultado-2.webp',
    alt: 'Mechas em cabelo ondulado',
    title: 'Movimento e dimensão',
    description: 'Mechas que acompanham as ondas e revelam profundidade a cada movimento.',
    message: 'mechas com movimento'
  },
  {
    image: 'assets/resultado-3.webp',
    alt: 'Cabelo loiro longo',
    title: 'Uma nova fase',
    description: 'Um visual luminoso para marcar o começo de um novo capítulo.',
    message: 'transformação do cabelo'
  }
];

const lookImage = document.getElementById('look-image');
const lookTitle = document.getElementById('look-title');
const lookDescription = document.getElementById('look-description');
const lookLink = document.getElementById('look-link');

document.querySelectorAll('.look-option').forEach(button => button.addEventListener('click', () => {
  const look = looks[Number(button.dataset.look)];

  document.querySelectorAll('.look-option').forEach(option => {
    const selected = option === button;
    option.classList.toggle('active', selected);
    option.setAttribute('aria-pressed', String(selected));
  });

  lookImage.src = look.image;
  lookImage.alt = look.alt;
  lookTitle.textContent = look.title;
  lookDescription.textContent = look.description;
  lookLink.href = `https://wa.me/5521969942633?text=${encodeURIComponent(`Olá, Anne! Vi a inspiração de ${look.message} no site e gostaria de conversar.`)}`;
}));

const lightbox = document.querySelector('.lightbox');
let lastTrigger;

document.querySelectorAll('button.result[data-image]').forEach(button => button.addEventListener('click', () => {
  lastTrigger = button;
  lightbox.querySelector('img').src = button.dataset.image;
  lightbox.classList.add('open');
  lightbox.querySelector('button').focus();
}));

function closeImage() {
  lightbox.classList.remove('open');
  lightbox.querySelector('img').removeAttribute('src');
  lastTrigger?.focus();
}

lightbox.querySelector('button').addEventListener('click', closeImage);

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeImage();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) closeImage();
});
const galleryTrack = document.getElementById('gallery-track');
const galleryCards = Array.from(galleryTrack.children);
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
const galleryCount = document.querySelector('.gallery-count');
const galleryProgress = document.querySelector('.gallery-progress i');

let galleryIndex = 0;

function updateGallery() {
  const left = galleryTrack.getBoundingClientRect().left;
  let nearest = 0;
  let distance = Infinity;

  galleryCards.forEach((card, index) => {
    const current = Math.abs(card.getBoundingClientRect().left - left);
    if (current < distance) {
      distance = current;
      nearest = index;
    }
  });

  galleryIndex = nearest;
  galleryCount.innerHTML = `${String(nearest + 1).padStart(2, '0')} <small>/ ${String(galleryCards.length).padStart(2, '0')}</small>`;
  galleryProgress.style.transform = `scaleX(${(nearest + 1) / galleryCards.length})`;
  galleryPrev.disabled = nearest === 0;
  galleryNext.disabled = nearest === galleryCards.length - 1;
}

function moveGallery(index) {
  const next = galleryCards[Math.max(0, Math.min(index, galleryCards.length - 1))];
  const target =
    galleryTrack.scrollLeft +
    next.getBoundingClientRect().left -
    galleryTrack.getBoundingClientRect().left;

  galleryTrack.scrollTo({
    left: target,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

galleryPrev.addEventListener('click', () => moveGallery(galleryIndex - 1));
galleryNext.addEventListener('click', () => moveGallery(galleryIndex + 1));

let galleryFrame;
galleryTrack.addEventListener('scroll', () => {
  cancelAnimationFrame(galleryFrame);
  galleryFrame = requestAnimationFrame(updateGallery);
}, { passive: true });

window.addEventListener('resize', updateGallery);
updateGallery();