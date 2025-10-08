/* ==============================
   CARRUSEL DE OFERTAS DINOMARKET
============================== */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-btn.next");
  const prevButton = document.querySelector(".carousel-btn.prev");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  let currentIndex = 0;

  // Crear indicadores
  slides.forEach((_, index) => {
    const indicator = document.createElement("button");
    if (index === 0) indicator.classList.add("active");
    indicatorsContainer.appendChild(indicator);
  });

  const indicators = Array.from(indicatorsContainer.children);

  function updateCarousel(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    indicators.forEach((dot) => dot.classList.remove("active"));
    indicators[index].classList.add("active");
    currentIndex = index;
  }

  nextButton.addEventListener("click", () => {
    const newIndex = (currentIndex + 1) % slides.length;
    updateCarousel(newIndex);
  });

  prevButton.addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(newIndex);
  });

  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => updateCarousel(index));
  });

  // Auto-slide cada 5 segundos
  setInterval(() => {
    const newIndex = (currentIndex + 1) % slides.length;
    updateCarousel(newIndex);
  }, 5000);
});


// ==========================
// PANEL LATERAL DEL CARRITO
// ==========================
const abrirCarritoBtn = document.getElementById("abrir-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const panelCarrito = document.getElementById("panel-carrito");
const overlay = document.getElementById("overlay");

// Abrir panel
abrirCarritoBtn.addEventListener("click", () => {
    panelCarrito.classList.add("open");
    overlay.classList.add("visible");
});

// Cerrar panel
cerrarCarritoBtn.addEventListener("click", cerrarPanel);
overlay.addEventListener("click", cerrarPanel);

function cerrarPanel() {
    panelCarrito.classList.remove("open");
    overlay.classList.remove("visible");
}
