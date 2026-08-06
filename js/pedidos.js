/*=====================================================
        el rincon del sabor  v4.0
        SISTEMA PROFESIONAL DE VENTAS
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
        ADICIONAL PERSONALIZADO
======================================================*/

function mostrarOtroAdicional() {

    const check = document.getElementById("otroExtra");
    const div = document.getElementById("personalizado");

    if (!check || !div) return;

    if (check.checked) {

        div.style.display = "block";

    } else {

        div.style.display = "none";

        document.getElementById("nombreExtra").selectedIndex = 0;

        document.getElementById("precioExtra").value = "";

    }

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

    const fruta =
        document.getElementById("fruta").value;

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

    if (
        document.getElementById("otroExtra") &&
        document.getElementById("otroExtra").checked
    ) {

        const lista =
            document.getElementById("nombreExtra");

        const nombre =
            lista.options[
                lista.selectedIndex
            ].text;

        const precio =
            Number(
                document.getElementById("precioExtra").value
            );

        if (precio > 0) {

            subtotal += precio;

            adicionales.push(nombre);

        }

    }

    const total =
        subtotal * cantidad;

    const resumen =
        document.getElementById(
            "resumenCompra"
        );

    if (resumen) {

        resumen.innerHTML = `

            <p>
                🍪 <strong>${nombreProducto}</strong>
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
                🍓 Fruta: ${fruta}
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
        fruta,
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
    fruta,
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

        <p><strong>Fruta:</strong> ${fruta}</p>

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

    const cliente = document.getElementById("cliente").value.trim();

    if (cliente === "") {

        alert("Ingrese el nombre del cliente.");
        return;

    }

    const telefono = document.getElementById("telefono").value.trim();

    if (telefono.length !== 10) {

        alert("Ingrese un número de celular válido.");
        return;

    }

    if (!telefono.startsWith("3")) {

        alert("El número celular debe iniciar por 3.");
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

        observaciones: document.getElementById("observaciones").value.trim(),

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

    document.getElementById("observaciones").value = "";

    document.getElementById("producto").selectedIndex = 0;

    document.getElementById("salsa").selectedIndex = 0;

    document.getElementById("fruta").selectedIndex = 0;

    document.getElementById("cantidad").value = 1;

    document
        .querySelectorAll('input[name="extra"]')
        .forEach(check => check.checked = false);

    document.getElementById("otroExtra").checked = false;

    mostrarOtroAdicional();

    const resultado = document.getElementById("resultado");

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

    if (document.getElementById("otroExtra").checked) {

        subtotal += Number(

            document.getElementById("precioExtra").value || 0

        );

    }

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
