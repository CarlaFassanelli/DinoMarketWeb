document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("lista-productos");
    const rutaJSON = "./assets/data/productos.json";
    const carritoTabla = document.querySelector("#lista-carrito tbody");
    const btnVaciarCarrito = document.getElementById("vaciar-carrito");
    const carrito = [];

    // Teléfono destino WhatsApp
    const telefono = "5492622445228"; // Cambiar por el número real

    // ---------- FUNCIÓN PARA CONVERTIR CATEGORÍAS A CLASES SEGURAS ----------
    const slugify = str => (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quitar tildes
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");

    // ========== CARGAR PRODUCTOS DESDE JSON ==========
    async function cargarProductos() {
        try {
            const respuesta = await fetch(rutaJSON);
            if (!respuesta.ok) throw new Error("Error al cargar el JSON");

            const productos = await respuesta.json();
            mostrarProductosPorCategoria(productos);
        } catch (error) {
            console.error(error);
            contenedorProductos.innerHTML = `<p class="error-msg">Error al cargar productos 😢</p>`;
        }
    }

    // ========== MOSTRAR PRODUCTOS AGRUPADOS POR CATEGORÍA ==========
    function mostrarProductosPorCategoria(productos) {
        contenedorProductos.innerHTML = "";

        const categorias = [...new Set(productos.map(p => p.categoria))];

        categorias.forEach(categoria => {
            const slugCategoria = slugify(categoria);

            const section = document.createElement("section");
            section.classList.add("categoria-section", slugCategoria);
            section.id = slugCategoria; // importante para scroll desde buscador

            const titulo = document.createElement("h3");
            titulo.classList.add("categoria-titulo");
            titulo.textContent = categoria;

            const grid = document.createElement("div");
            grid.classList.add("product-grid");

            const productosCategoria = productos.filter(p => p.categoria === categoria);

            productosCategoria.forEach(producto => {
                const card = document.createElement("article");
                card.classList.add("product-card", slugCategoria); // 👈 clase de categoría

                card.innerHTML = `
                    <img src="${producto.img}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="description">${producto.descripcion}</p>
                    <p class="price">$${producto.precio.toFixed(2)}</p>
                    <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
                `;
                grid.appendChild(card);
            });

            section.appendChild(titulo);
            section.appendChild(grid);
            contenedorProductos.appendChild(section);
        });

        // Asignar eventos de los botones
        document.querySelectorAll(".btn-agregar").forEach(btn =>
            btn.addEventListener("click", agregarAlCarrito)
        );
    }

    // ========== AGREGAR AL CARRITO ==========
    function agregarAlCarrito(e) {
        const card = e.target.closest(".product-card");
        const nombre = card.querySelector("h3").textContent;
        const precio = parseFloat(card.querySelector(".price").textContent.replace("$", ""));
        const img = card.querySelector("img").src;

        const producto = carrito.find(item => item.nombre === nombre);
        if (producto) {
            producto.cantidad++;
        } else {
            carrito.push({ nombre, precio, img, cantidad: 1 });
        }

        actualizarCarrito();
    }

    // ========== ACTUALIZAR TABLA DEL CARRITO ==========
    function actualizarCarrito() {
        carritoTabla.innerHTML = "";

        carrito.forEach((item, index) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><img src="${item.img}" width="40"></td>
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>${item.cantidad}</td>
                <td><button class="btn-eliminar" data-index="${index}">❌</button></td>
            `;
            carritoTabla.appendChild(fila);
        });

        document.querySelectorAll(".btn-eliminar").forEach(btn =>
            btn.addEventListener("click", eliminarDelCarrito)
        );

        const btnComprar = document.getElementById("btn-comprar");
        if (btnComprar) btnComprar.addEventListener("click", enviarWhatsApp);
    }

    // ========== ELIMINAR PRODUCTO ==========
    function eliminarDelCarrito(e) {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    // ========== VACIAR CARRITO ==========
    btnVaciarCarrito.addEventListener("click", () => {
        carrito.length = 0;
        actualizarCarrito();
    });

    // ========== ENVIAR A WHATSAPP ==========
    function enviarWhatsApp() {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío 😅");
            return;
        }

        let mensaje = "🦖 *Pedido Dinomarket* 🦖%0A%0A";
        carrito.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}%0A`;
        });

        const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        mensaje += `%0A💰 *Total:* $${total.toFixed(2)}%0A%0A📦 Enviar mi pedido.`;

        const url = `https://wa.me/${telefono}?text=${mensaje}`;
        window.open(url, "_blank");
    }

    cargarProductos();
});
