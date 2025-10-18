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
    updateCarousel((currentIndex + 1) % slides.length);
  });

  prevButton.addEventListener("click", () => {
    updateCarousel((currentIndex - 1 + slides.length) % slides.length);
  });

  indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => updateCarousel(index));
  });

  // Auto-slide cada 5 segundos
  setInterval(() => {
    updateCarousel((currentIndex + 1) % slides.length);
  }, 5000);
});


/* ==============================
   PANEL LATERAL DEL CARRITO
============================== */
const abrirCarritoBtn = document.getElementById("abrir-carrito");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const panelCarrito = document.getElementById("panel-carrito");
const carritoOverlay = document.getElementById("overlay");

function cerrarPanel() {
  panelCarrito.classList.remove("open");
  carritoOverlay.classList.remove("visible");
}

abrirCarritoBtn?.addEventListener("click", () => {
  panelCarrito.classList.add("open");
  carritoOverlay.classList.add("visible");
});

cerrarCarritoBtn?.addEventListener("click", cerrarPanel);
carritoOverlay?.addEventListener("click", cerrarPanel);


/* ==============================
   MENÚ DE CATEGORÍAS RESPONSIVE
============================== */
const btnCategorias = document.getElementById("btn-categorias");
const menuWrapper = document.getElementById("menu-wrapper");
const btnCerrar = document.getElementById("btn-cerrar");
const linksCategorias = document.querySelectorAll("#menu-categorias a");

// Crear overlay para menú móvil
const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

// Mostrar / ocultar menú
btnCategorias?.addEventListener("click", () => {
  const isExpanded = btnCategorias.getAttribute("aria-expanded") === "true";
  btnCategorias.setAttribute("aria-expanded", !isExpanded);

  if (window.innerWidth > 768) {
    menuWrapper.hidden = isExpanded;
  } else {
    menuWrapper.classList.toggle("show");
    overlay.classList.toggle("active");
  }
});

// Cerrar menú con botón de cierre o overlay
function cerrarMenuCategorias() {
  menuWrapper.classList.remove("show");
  overlay.classList.remove("active");
  btnCategorias.setAttribute("aria-expanded", "false");
  menuWrapper.hidden = true;
}

btnCerrar?.addEventListener("click", cerrarMenuCategorias);
overlay?.addEventListener("click", cerrarMenuCategorias);

// Cerrar al hacer clic fuera (solo desktop)
document.addEventListener("click", (event) => {
  if (
    window.innerWidth > 768 &&
    !btnCategorias.contains(event.target) &&
    !menuWrapper.contains(event.target)
  ) {
    cerrarMenuCategorias();
  }
});

// 🟢 Redirección al presionar una categoría
linksCategorias.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtener destino del enlace
    const destino = document.querySelector(link.getAttribute("href"));
    if (destino) {
      cerrarMenuCategorias();
      // Desplazamiento suave hacia la categoría elegida
      destino.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

