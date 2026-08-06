/*=====================================================
        El Rincon del Sabor v0.0
        SISTEMA DE GESTION VENTAS
======================================================*/

/*=====================================================
            NÚMERO DE PEDIDO
======================================================*/

function generarNumeroPedido() {

    const pedidoElemento = document.getElementById("numeroPedido");

    if (!pedidoElemento) return;

    const numero = String(numeroPedido).padStart(4, "0");

    pedidoElemento.textContent = numero;

}


/*=====================================================
        PRECIO DEL ADICIONAL
======================================================*/

function asignarPrecioExtra() {

    const lista = document.getElementById("nombreExtra");
    const precio = document.getElementById("precioExtra");

    if (!lista || !precio) return;

    precio.value = lista.value;

}

/*=====================================================
            CALCULAR PEDIDO
======================================================*/
function calcularPedido() {

    const cliente =
        document.getElementById("cliente").value.trim();

    const producto =
        document.getElementById("producto");

    const nombreProducto =
        producto.options[
            producto.selectedIndex
        ].text;

    const precioProducto =
        Number(producto.value);

    const salsa =
        document.getElementById("salsa").value;
    const proteinas =
        document.getElementById("proteinas").value;

    const cantidad =
        Number(
            document.getElementById("cantidad").value
        );

    let subtotal = precioProducto;

    let adicionales = [];

    document
        .querySelectorAll(
            'input[name="extra"]:checked'
        )
        .forEach(extra => {

            subtotal += Number(extra.value);

            adicionales.push(
                extra.parentElement.textContent.trim()
            );

        });

    const total =
        subtotal * cantidad;

    const resumen =
        document.getElementById(
            "resumenCompra"
        );

    if (resumen) {

        resumen.innerHTML = `

            <p>
                🍧 <strong>${nombreProducto}</strong>
            </p>

            <p>
                📦 Cantidad: ${cantidad}
            </p>

            <p>
                ➕ Adicionales: ${adicionales.length}
            </p>

            <p>
                🥤 Salsa: ${salsa}
            </p>
<p>
                🥤 proteinas: ${proteinas}
            </p>

            <hr>

            <h2 style="color:#27ae60">
                💰 $${total.toLocaleString("es-CO")}
            </h2>

        `;

    }

    mostrarResumen(
        cliente,
        nombreProducto,
        salsa,
        proteinas,
        adicionales,
        cantidad,
        total
    );

    return total;

}
/*=====================================================
                MOSTRAR RESUMEN
======================================================*/

function mostrarResumen(
    cliente,
    producto,
    salsa,
    proteinas,
    adicionales,
    cantidad,
    total
) {

    const resultado = document.getElementById("resultado");

    if (!resultado) return;

    resultado.style.display = "block";

    resultado.innerHTML = `

        <h2>🧾 Resumen del Pedido</h2>

        <p><strong>Cliente:</strong> ${cliente}</p>

        <p><strong>Producto:</strong> ${producto}</p>

        <p><strong>Salsa:</strong> ${salsa}</p>

        <p><strong>Proteinas:</strong> ${proteinas}</p>
        <p>
            <strong>Adicionales:</strong>
            ${adicionales.length > 0 ? adicionales.join(", ") : "Ninguno"}
        </p>

        <p><strong>Cantidad:</strong> ${cantidad}</p>

        <hr>

        <h2 class="total">

            Total: $${total.toLocaleString("es-CO")}

        </h2>

    `;

}

/*=====================================================
                REALIZAR PEDIDO
======================================================*/

function realizarPedido() {

    /*=========================================
            VALIDAR CAJA ABIERTA
    =========================================*/

    if (!cajaAbierta) {

        alert("⚠ Debe abrir la caja antes de registrar pedidos.");
        return;

    }

    // Mostrar resumen del pedido

    calcularPedido();

    // Obtener datos del formulario

    const cliente =
        document.getElementById("cliente").value.trim();

    if (cliente === "") {

        alert("Ingrese el nombre del cliente.");
        return;

    }

    const telefono =
        document.getElementById("telefono").value.trim();

    if (telefono.length !== 10) {

        alert("Ingrese un número de celular válido.");
        return;

    }

    if (!telefono.startsWith("3")) {

        alert("El número celular debe iniciar por 3.");
        return;

    }

    /*=========================================
        VALIDAR TIPO DE CLIENTE
    =========================================*/

    const tipoCliente =
        document.getElementById("tipoCliente").value;

    if (tipoCliente === "") {

        alert("Seleccione el tipo de cliente.");
        return;

    }

    /*=========================================
            VALIDAR CURSO
    =========================================*/

    const curso =
        document.getElementById("curso").value.trim();

    if (curso === "") {

        alert("Ingrese el curso.");
        return;

    }

    const ahora = new Date();

     /*=========================================
                CREAR PEDIDO
    =========================================*/

    const pedido = {

        numero: numeroPedido,
        fecha: ahora.toLocaleDateString("es-CO"),
        hora: ahora.toLocaleTimeString("es-CO", {

            hour: "2-digit",

            minute: "2-digit"

        }),

        cliente: cliente,

        telefono: telefono,

        producto: document.getElementById("producto").selectedOptions[0].text,

       tipoCliente: document.getElementById("tipoCliente").value,

       curso: document.getElementById("curso").value.trim(),

        total: obtenerTotal(),

        metodoPago: document.getElementById("metodoPago").value,

        estado: "En preparación"

    };

    /*=========================================
                GUARDAR PEDIDO
    =========================================*/

    pedidos.push(pedido);

    ultimoPedido = pedido;

    /*=========================================
                ACTUALIZAR CAJA
    =========================================*/

    ventasCaja += pedido.total;

    totalPedidosCaja++;

    switch (pedido.metodoPago) {

        case "Efectivo":
            totalEfectivo += pedido.total;
            break;

        case "Nequi":
            totalNequi += pedido.total;
            break;

        case "Daviplata":
            totalDaviplata += pedido.total;
            break;

        case "Transferencia":
            totalTransferencia += pedido.total;
            break;

        case "Tarjeta":
            totalTarjeta += pedido.total;
            break;

    }

    guardarCaja();

    actualizarCaja();

    /*=========================================
            REGISTRAR CLIENTE
    =========================================*/

    registrarCliente(

        cliente,

        telefono,

        pedido.producto,

        pedido.total

    );

    /*=========================================
            GENERAR TICKET
    =========================================*/

    generarTicket(pedido);

    /*=========================================
            GUARDAR INFORMACIÓN
    =========================================*/

    guardarPedidos();

    /*=========================================
            ACTUALIZAR SISTEMA
    =========================================*/

    actualizarDashboard();

    actualizarReportes();

    actualizarHistorial();

    actualizarPedidosProceso();

    /*=========================================
            NUEVO CONSECUTIVO
    =========================================*/

    numeroPedido++;

    generarNumeroPedido();

    /*=========================================
            LIMPIAR FORMULARIO
    =========================================*/

    limpiarFormulario();

    /*=========================================
            MENSAJE FINAL
    =========================================*/

    alert("✅ Pedido registrado correctamente.");

}
/*=====================================================
                LIMPIAR FORMULARIO
======================================================*/
function limpiarFormulario() {

    document.getElementById("cliente").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("tipoCliente").selectedIndex = 0;
    document.getElementById("curso").value = "";

    document.getElementById("producto").selectedIndex = 0;

    document.getElementById("salsa").selectedIndex = 0;
     document.getElementById("proteinas").selectedIndex = 0;
    
    document.getElementById("cantidad").value = 1;

    document
        .querySelectorAll('input[name="extra"]')
        .forEach(check => check.checked = false);

    const nombreExtra =
        document.getElementById("nombreExtra");

    if (nombreExtra) {
        nombreExtra.selectedIndex = 0;
    }

    const precioExtra =
        document.getElementById("precioExtra");

    if (precioExtra) {
        precioExtra.value = "";
    }

    const resumen =
        document.getElementById("resumenCompra");

    if (resumen) {

        resumen.innerHTML = `
            <p>
                🍧Seleccione un producto y pulse
                "Calcular Total"
            </p>
        `;

    }

    const resultado =
        document.getElementById("resultado");

    if (resultado) {

        resultado.style.display = "none";
        resultado.innerHTML = "";

    }

}
/*=====================================================
                OBTENER TOTAL DEL PEDIDO
======================================================*/
function obtenerTotal() {

    const producto = Number(
        document.getElementById("producto").value
    );

    let subtotal = producto;

    document
        .querySelectorAll('input[name="extra"]:checked')
        .forEach(extra => {

            subtotal += Number(extra.value);

        });

    const campoPrecioExtra =
        document.getElementById("precioExtra");

    const precioExtra =
        campoPrecioExtra
            ? Number(campoPrecioExtra.value || 0)
            : 0;

    subtotal += precioExtra;

    const cantidad = Number(
        document.getElementById("cantidad").value
    );

    return subtotal * cantidad;

}
/*=====================================================
                ELIMINAR PEDIDO
======================================================*/

function eliminarPedido(indice) {

    const confirmar = confirm(

        "¿Desea eliminar este pedido?"

    );

    if (!confirmar) {

        return;

    }

    pedidos.splice(indice, 1);

    guardarPedidos();

    actualizarDashboard();

    actualizarReportes();

    actualizarHistorial();

    actualizarPedidosProceso();

    actualizarCaja();

    actualizarClientes();

    alert("✅ Pedido eliminado correctamente.");

}
/*=====================================================
                PEDIDO LISTO
======================================================*/

function pedidoListo(indice) {

    // Validar que el pedido exista

    if (!pedidos[indice]) {

        return;

    }

    pedidos[indice].estado = "Listo para entregar";

    guardarPedidos();

    actualizarDashboard();

    actualizarReportes();

    actualizarHistorial();

    actualizarPedidosProceso();

    actualizarCaja();

}

/*=====================================================
                ENTREGAR PEDIDO
======================================================*/

function entregarPedido(indice) {

    // Validar que el pedido exista

    if (!pedidos[indice]) {

        return;

    }

    // Validar estado

    if (pedidos[indice].estado !== "Listo para entregar") {

        alert("⚠ Primero marque el pedido como LISTO.");

        return;

    }

    pedidos[indice].estado = "Entregado";

    guardarPedidos();

    actualizarDashboard();

    actualizarReportes();

    actualizarHistorial();

    actualizarPedidosProceso();

    actualizarCaja();

    alert("✅ Pedido entregado correctamente.");

}