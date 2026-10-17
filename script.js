
/* =========================================
   1. PERSONALIZACIÓN
   Cambia estos valores por los que quieras.
========================================= */

const CONFIG = {
  destinatario: "persona especial",
  remitente: "Alguien que piensa en ti",

  cantidadCorazones: 22,
  cantidadConfeti: 90
};

/* =========================================
   2. REFERENCIAS A LOS ELEMENTOS DEL HTML
========================================= */

const intro = document.getElementById("intro");
const gift = document.getElementById("gift");
const giftButton = document.getElementById("gift-button");
const openButton = document.getElementById("open-button");
const replayButton = document.getElementById("replay-button");
const surprise = document.getElementById("surprise");
const hint = document.getElementById("hint");

const recipientName = document.getElementById("recipient-name");
const senderName = document.getElementById("sender-name");

const heartsContainer = document.getElementById("hearts-container");
const confettiContainer = document.getElementById("confetti-container");

/* =========================================
   3. CONFIGURACIÓN INICIAL
========================================= */

let isOpen = false;
let heartTimer = null;
let heartGeneration = 0;

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

recipientName.textContent = CONFIG.destinatario;
senderName.textContent = CONFIG.remitente;

/* =========================================
   4. ABRIR EL REGALO
========================================= */

function openGift() {
  if (isOpen) return;

  isOpen = true;

  // Detener la animación flotante del regalo.
  gift.style.animation = "none";

  // Animar la tapa mediante una transición CSS.
  const lid = gift.querySelector(".gift-lid");

  lid.style.transition =
    "transform 0.75s cubic-bezier(.2,.8,.2,1)";

  lid.style.transform = "translate(-12px, -65px) rotate(-28deg)";

  // Mostrar un mensaje mientras se abre.
  hint.textContent = "Preparando una pequeña sorpresa... 💗";

  openButton.disabled = true;
  giftButton.disabled = true;

  if (!reducedMotion) {
    launchConfetti();
  }

  // Esperar para revelar la carta.
  window.setTimeout(() => {
    intro.classList.add("hidden");

    surprise.classList.remove("hidden");
    surprise.removeAttribute("inert");
    surprise.setAttribute("aria-hidden", "false");

    hint.textContent = "Tu sorpresa está lista.";

    surprise.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center"
    });
  }, reducedMotion ? 0 : 850);
}

/* =========================================
   5. CREAR CORAZONES FLOTANTES
========================================= */

function createHeart() {
  const heart = document.createElement("span");

  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.5 ? "♥" : "♡";

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${12 + Math.random() * 22}px`;
  heart.style.setProperty(
    "--duration",
    `${5 + Math.random() * 5}s`
  );

  heart.style.setProperty(
    "--drift",
    `${Math.random() * 100 - 50}px`
  );

  heartsContainer.appendChild(heart);

  // Eliminar el elemento cuando termina la animación.
  heart.addEventListener("animationend", () => {
    heart.remove();
  }, { once: true });
}

function startHearts() {
  if (reducedMotion || heartTimer !== null) return;

  const generation = ++heartGeneration;

  // Crear algunos corazones iniciales.
  for (let i = 0; i < 5; i++) {
    createHeart();
  }

  heartTimer = window.setInterval(() => {
    if (generation !== heartGeneration) return;

    // Evitar crear demasiados elementos.
    if (heartsContainer.childElementCount < 30) {
      createHeart();
    }
  }, 500);
}

function stopHearts() {
  heartGeneration++;

  if (heartTimer !== null) {
    window.clearInterval(heartTimer);
    heartTimer = null;
  }

  heartsContainer.replaceChildren();
}

/* =========================================
   6. EFECTO DE CONFETI
========================================= */

function launchConfetti() {
  const colors = [
    "#f28eb5",
    "#d8b8f8",
    "#fff0bc",
    "#b9e8d2",
    "#ffffff"
  ];

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.cantidadConfeti; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.setProperty(
      "--duration",
      `${2 + Math.random() * 2.5}s`
    );

    piece.style.setProperty(
      "--drift",
      `${Math.random() * 180 - 90}px`
    );

    piece.style.animationDelay = `${Math.random() * 0.8}s`;

    fragment.appendChild(piece);

    piece.addEventListener("animationend", () => {
      piece.remove();
    }, { once: true });
  }

  confettiContainer.appendChild(fragment);
}

/* =========================================
   7. VOLVER A LA SORPRESA INICIAL
========================================= */

function resetGift() {
  isOpen = false;

  stopHearts();

  confettiContainer.replaceChildren();

  // Restablecer la tapa del regalo.
  const lid = gift.querySelector(".gift-lid");

  lid.style.transition = "none";
  lid.style.transform = "";

  // Recuperar la animación de flotación.
  gift.style.animation = "";

  // Mostrar la introducción y ocultar la carta.
  surprise.classList.add("hidden");
  surprise.setAttribute("aria-hidden", "true");
  surprise.setAttribute("inert", "");

  intro.classList.remove("hidden");

  hint.textContent =
    "Toca el regalo para descubrir tu sorpresa 💌";

  openButton.disabled = false;
  giftButton.disabled = false;

  // Reiniciar la animación de entrada.
  intro.style.animation = "none";
  void intro.offsetWidth;
  intro.style.animation = "";

  giftButton.focus();
}

/* =========================================
   8. EVENTOS DE LOS BOTONES
========================================= */

giftButton.addEventListener("click", openGift);
openButton.addEventListener("click", openGift);
replayButton.addEventListener("click", resetGift);

/* =========================================
   9. INICIAR LA EXPERIENCIA
========================================= */

startHearts();
