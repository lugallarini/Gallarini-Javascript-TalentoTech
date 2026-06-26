
const CLAVE_CARRITO = "urbanoClothesCarrito";
const DESCUENTO_VERANO = 0.20; 

function obtenerCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    mostrarAviso(`${producto.nombre} agregado al carrito`);
}

function cambiarCantidad(id, delta) {
    const carrito = obtenerCarrito();
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(p => p.id !== id);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito() {
    if (obtenerCarrito().length === 0) return;
    if (!confirm("¿Vaciar todo el carrito?")) return;
    guardarCarrito([]);
    renderizarCarrito();
}

function calcularTotales(carrito) {
    const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const descuento = subtotal * DESCUENTO_VERANO;
    const total = subtotal - descuento;
    return { subtotal, descuento, total };
}

function actualizarContadorCarrito() {
    const contador = document.querySelector(".contador-carrito");
    if (!contador) return;
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? "inline-block" : "none";
}

function mostrarAviso(mensaje) {
    const aviso = document.createElement("div");
    aviso.className = "aviso-toast";
    aviso.textContent = mensaje;
    document.body.appendChild(aviso);

    setTimeout(() => aviso.classList.add("aviso-toast--visible"), 10);
    setTimeout(() => {
        aviso.classList.remove("aviso-toast--visible");
        setTimeout(() => aviso.remove(), 300);
    }, 2200);
}

function renderizarCarrito() {
    const contenedor = document.querySelector(".itemsCarrito");
    if (!contenedor) return; // no estamos en carrito.html

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="carritoVacio">Tu carrito está vacío. <a href="../pages/tienda.html">Ir a la tienda</a></p>`;
    } else {
        contenedor.innerHTML = carrito.map(item => `
            <div class="itemCarrito">
                <img src="${item.imagen}" alt="${item.nombre}" class="imgItemCarrito">
                <div class="detallesItem">
                    <h4>${item.nombre}</h4>
                    <p class="precioItem">$${item.precio.toLocaleString("es-AR")}</p>
                    <div class="cantidadItem">
                        <button class="btnCantidad" data-id="${item.id}" data-delta="-1">-</button>
                        <span class="numeroItem">${item.cantidad}</span>
                        <button class="btnCantidad" data-id="${item.id}" data-delta="1">+</button>
                    </div>
                </div>
                <button class="btnEliminar" data-id="${item.id}" title="Eliminar">✕</button>
            </div>
        `).join("");
    }

    const { subtotal, descuento, total } = calcularTotales(carrito);
    const resumen = document.querySelector(".resumenCarrito");
    if (resumen) {
        resumen.innerHTML = `
            <div class="resumenLinea"><span>Subtotal</span><span>$${subtotal.toLocaleString("es-AR")}</span></div>
            <div class="resumenLinea descuento"><span>Descuento 20% verano</span><span>- $${descuento.toLocaleString("es-AR")}</span></div>
            <div class="resumenLinea total"><span>Total</span><span>$${total.toLocaleString("es-AR")}</span></div>
        `;
    }
}

document.addEventListener("click", (e) => {
    if (e.target.matches(".btnCantidad")) {
        const id = e.target.dataset.id;
        const delta = Number(e.target.dataset.delta);
        cambiarCantidad(id, delta);
    }

    if (e.target.matches(".btnEliminar")) {
        eliminarDelCarrito(e.target.dataset.id);
    }

    if (e.target.matches("#btnVaciar")) {
        vaciarCarrito();
    }

    if (e.target.matches("#btnComprar")) {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        alert("¡Gracias por tu compra! (simulado para esta entrega)");
        guardarCarrito([]);
        renderizarCarrito();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    renderizarCarrito();
});