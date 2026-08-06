/*=====================================================
                GENERAR TICKET
======================================================*/

function generarTicket(pedido) {

    const ticket = document.getElementById("ticket");
    const contenido = document.getElementById("contenidoTicket");

    if (!ticket || !contenido) return;

    ticket.style.display = "block";

    contenido.innerHTML = `

        <div class="ticket-dato">
            <strong>Pedido</strong>
            <span>#${pedido.numero}</span>
        </div>

        <div class="ticket-dato">
            <strong>Fecha</strong>
            <span>${pedido.fecha}</span>
        </div>

        <div class="ticket-dato">
            <strong>Hora</strong>
            <span>${pedido.hora}</span>
        </div>

        <hr>

        <div class="ticket-dato">
            <strong>Cliente</strong>
            <span>${pedido.cliente}</span>
        </div>

        <div class="ticket-dato">
            <strong>Celular</strong>
            <span>${pedido.telefono}</span>
        </div>

        <div class="ticket-dato">
            <strong>Producto</strong>
            <span>${pedido.producto}</span>
        </div>

        <div class="ticket-dato">
            <strong>Método de Pago</strong>
            <span>${obtenerIconoPago(pedido.metodoPago)} ${pedido.metodoPago}</span>
        </div>

        <div class="ticket-dato">
            <strong>Estado</strong>
            <span>${pedido.estado}</span>
        </div>

        <hr>

        <div class="ticket-total">

            TOTAL

            <br>

            <strong>$${pedido.total.toLocaleString("es-CO")}</strong>

        </div>

        <hr>

        <div class="ticket-footer">

            ❤️ Gracias por preferir a BEEHIVE ❤️

            <br>
            Soacha - Cundinamarca

            <br>

            WhatsApp: 300 000 0000

        </div>

    `;

}

/*=====================================================
                IMPRIMIR TICKET
======================================================*/

function imprimirTicket() {

    const ticket = document.getElementById("ticket");

    if (!ticket) return;

    const ventana = window.open("", "_blank");

    ventana.document.write(ticket.innerHTML);

    ventana.document.close();

    ventana.print();

}

/*=====================================================
        ENVIAR WHATSAPP
======================================================*/

function enviarWhatsApp() {

    if (!ultimoPedido) {

        alert("No existe ningún pedido.");

        return;

    }

    let telefono = ultimoPedido.telefono.replace(/\D/g, "");

    if (telefono.length !== 10) {

        alert("Número inválido.");

        return;

    }

    telefono = "57" + telefono;

    const mensaje =

`🍧 *BEEHIVE*

🧾 Pedido #${ultimoPedido.numero}

👤 Cliente:
${ultimoPedido.cliente}

🍧Producto:
${ultimoPedido.producto}

💳 Pago:
${ultimoPedido.metodoPago}

💰 Total:
$${ultimoPedido.total.toLocaleString("es-CO")}

Gracias por preferir a BEEHIVE ❤️`;

    const url =

`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

}

/*=====================================================
            ENVIAR CORREO
======================================================*/

function enviarCorreo() {

    if (!ultimoPedido) {

        alert("No existe ningún pedido.");

        return;

    }

    const asunto =

        `Pedido #${ultimoPedido.numero} - BEEHIVE`;

    const cuerpo =

`Hola ${ultimoPedido.cliente},

Gracias por tu compra.

Pedido: ${ultimoPedido.numero}

Producto:
${ultimoPedido.producto}

Total:
$${ultimoPedido.total.toLocaleString("es-CO")}

Gracias por preferir a BEEHIVE

`;

    window.location.href =

`mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

}

/*=====================================================
            VALIDAR TELÉFONO
======================================================*/

function validarTelefono() {

    const telefono = document.getElementById("telefono");

    const mensaje = document.getElementById("mensajeTelefono");

    if (!telefono || !mensaje) return;

    telefono.value = telefono.value.replace(/\D/g, "");

    if (telefono.value.length === 0) {

        telefono.className = "";

        mensaje.innerHTML = "";

        return;

    }

    if (telefono.value.length < 10) {

        telefono.className = "invalido";

        mensaje.className = "mensaje-validacion error";

        mensaje.innerHTML = "❌ El número debe tener 10 dígitos.";

        return;

    }

    if (telefono.value.length > 10) {

        telefono.value = telefono.value.substring(0, 10);

    }

    if (!telefono.value.startsWith("3")) {

        telefono.className = "invalido";

        mensaje.className = "mensaje-validacion error";

        mensaje.innerHTML =

            "❌ Los celulares en Colombia inician por 3.";

        return;

    }

    telefono.className = "valido";

    mensaje.className = "mensaje-validacion correcto";

    mensaje.innerHTML = "✅ Número válido.";

}
