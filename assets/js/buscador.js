document.addEventListener("DOMContentLoaded", () => {
  const rutaJSON = "./assets/data/productos.json";
  const buscadorInput = document.getElementById("buscador");
  const btnBuscar = document.getElementById("btn-buscar");

  // Función para buscar productos
  async function buscarProducto() {
    const termino = buscadorInput.value.trim().toLowerCase();
    console.log("Buscando producto:", termino);

    if (termino === "") {
      alert("Por favor, escribe el nombre de un producto 🦖");
      return;
    }

    try {
      const respuesta = await fetch(rutaJSON);
      if (!respuesta.ok) throw new Error("Error al cargar productos");
      const productos = await respuesta.json();

      // Buscar el producto
      const productoEncontrado = productos.find(p =>
        p.nombre.toLowerCase().includes(termino)
      );
      console.log("Producto encontrado:", productoEncontrado);

      if (productoEncontrado) {
        // Obtener la categoría del producto y generar un slug seguro (sin tildes ni caracteres especiales)
        const slugify = str => (str || "")
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // quitar diacríticos (tildes)
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/--+/g, '-')
          .replace(/^-+|-+$/g, '');
        const categoria = slugify(productoEncontrado.categoria);
        console.log("Redirigiendo a la categoría:", categoria);

        // Intentar encontrar la sección por id, por atributo data-category, o con CSS.escape como fallback
        let seccionCategoria = categoria ? document.getElementById(categoria) : null;
        if (!seccionCategoria) seccionCategoria = document.querySelector(`[data-category="${categoria}"]`) || (categoria ? document.querySelector(`#${CSS.escape(categoria)}`) : null);

        if (seccionCategoria) {
          // Desplazar al usuario a la categoría (bloque start para alinear al inicio)
          seccionCategoria.scrollIntoView({ behavior: "smooth", block: "start" });

          // Resaltar temporalmente el producto
          const productosCategoria = seccionCategoria.querySelectorAll(".product-card h3");
          productosCategoria.forEach(h3 => {
            if (h3.textContent.toLowerCase().includes(termino)) {
              const card = h3.closest(".product-card");
              if (card) {
                card.classList.add("resaltado");
                console.log("Resaltando producto:", h3.textContent);

                // Quitar el resaltado luego de unos segundos
                setTimeout(() => card.classList.remove("resaltado"), 3000);
              }
            }
          });
        } else {
          console.warn("No se encontró la sección de la categoría:", categoria);
          alert("No se pudo localizar la sección de la categoría del producto.");
        }
      } else {
        alert("Producto no encontrado 😢");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al buscar el producto.");
    }
  }

  // Eventos
  btnBuscar.addEventListener("click", buscarProducto);
  buscadorInput.addEventListener("keypress", e => {
    if (e.key === "Enter") buscarProducto();
  });
});
