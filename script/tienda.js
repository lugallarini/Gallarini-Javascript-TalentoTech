/* ============================================
   TIENDA — js/tienda.js
   Trae productos desde FakeStoreAPI y arma la grilla
   dinámicamente. Cada card tiene su botón "Agregar".
   Solo corre en tienda.html.
   ============================================ */

const URL_API = "https://fakestoreapi.com/products/category/women's%20clothing";

async function cargarProductos() {
    const contenedor = document.querySelector(".grillaProductos");
    if (!contenedor) return; // no estamos en tienda.html

    contenedor.innerHTML = `<p class="cargando">Cargando productos...</p>`;

    try {
        const respuesta = await fetch(URL_API);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const productosApi = await respuesta.json();
        renderizarProductos(productosApi, contenedor);

    } catch (error) {
        console.error("Error al cargar productos:", error);
        contenedor.innerHTML = `
            <p class="errorCarga">
                No se pudieron cargar los productos. Probá recargar la página.
            </p>
        `;
    }
}

function renderizarProductos(productosApi, contenedor) {
    if (productosApi.length === 0) {
        contenedor.innerHTML = `<p class="cargando">No hay productos disponibles.</p>`;
        return;
    }

    contenedor.innerHTML = productosApi.map(producto => {
        const precioConDescuento = (producto.price * 0.8).toFixed(2);

        return `
            <div class="producto">
                <div class="producto-imagen-wrapper">
                    <img src="${producto.image}" alt="${producto.title}" class="imgProducto">
                </div>
                <div class="producto-info">
                    <h3>${producto.title}</h3>
                    <p class="producto-descripcion">${producto.description.slice(0, 80)}...</p>
                    <div class="producto-precio-fila">
                        <span class="precio-tachado">$${producto.price}</span>
                        <span class="precio-actual">$${precioConDescuento}</span>
                    </div>
                    <button
                        class="btnAgregar"
                        data-id="${producto.id}"
                        data-nombre="${producto.title.replace(/"/g, '&quot;')}"
                        data-precio="${precioConDescuento}"
                        data-imagen="${producto.image}"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// --- Delegación de eventos para el botón "Agregar" ---

document.addEventListener("click", (e) => {
    if (!e.target.matches(".btnAgregar")) return;

    const boton = e.target;
    const producto = {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: Number(boton.dataset.precio),
        imagen: boton.dataset.imagen
    };

    agregarAlCarrito(producto); // función definida en carrito.js
});

document.addEventListener("DOMContentLoaded", cargarProductos);