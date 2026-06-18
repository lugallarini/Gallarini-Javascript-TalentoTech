document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formContacto");
    if (!formulario) return;

    const mensajeEstado = document.querySelector("#estadoFormulario");

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const botonEnviar = formulario.querySelector("button[type='submit']");
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
        mensajeEstado.textContent = "";
        mensajeEstado.className = "estadoFormulario";

        try {
            const datos = new FormData(formulario);

            const respuesta = await fetch(formulario.action, {
                method: "POST",
                body: datos,
                headers: { "Accept": "application/json" }
            });

            if (respuesta.ok) {
                mensajeEstado.textContent = "¡Gracias! Tu mensaje fue enviado correctamente.";
                mensajeEstado.classList.add("estadoFormulario--ok");
                formulario.reset();
            } else {
                throw new Error("Respuesta no exitosa de Formspree");
            }

        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            mensajeEstado.textContent = "Hubo un problema al enviar tu mensaje. Intentá de nuevo.";
            mensajeEstado.classList.add("estadoFormulario--error");

        } finally {
            botonEnviar.disabled = false;
            botonEnviar.textContent = "Enviar mensaje";
        }
    });
});