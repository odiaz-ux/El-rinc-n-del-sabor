/*=====================================================
        El Rincon del Sabor v0.0
        SISTEMA PROFESIONAL DE VENTAS
======================================================*/

/*=====================================================
            BASE DE DATOS DE CLIENTES
======================================================*/

let clientes = [];

/*=====================================================
            GUARDAR CLIENTES
======================================================*/

function guardarClientes() {

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

}

/*=====================================================
            CARGAR CLIENTES
======================================================*/

function cargarClientes() {

    const datos = localStorage.getItem("clientes");

    if (datos) {

        clientes = JSON.parse(datos);

    } else {

        clientes = [];

    }

}

/*=====================================================
            REGISTRAR CLIENTE
======================================================*/

function registrarCliente(cliente, telefono, producto, total) {

    let clienteExistente = clientes.find(

        c => c.telefono === telefono

    );

    if (clienteExistente) {

        // Actualizar datos del cliente

        clienteExistente.compras++;

        clienteExistente.totalComprado += total;

        clienteExistente.ultimaCompra = new Date().toLocaleDateString("es-CO");

        clienteExistente.productoFavorito = producto;

    } else {

        // Crear nuevo cliente

        clientes.push({

            nombre: cliente,

            telefono: telefono,

            compras: 1,

            totalComprado: total,

            primeraCompra: new Date().toLocaleDateString("es-CO"),

            ultimaCompra: new Date().toLocaleDateString("es-CO"),

            productoFavorito: producto

        });

    }

    guardarClientes();

    actualizarClientes();

}

/*=====================================================
            ACTUALIZAR TABLA DE CLIENTES
======================================================*/

function actualizarClientes() {

    const contenedor = document.getElementById("clientes");

    // Verificar que exista el contenedor

    if (!contenedor) return;

    if (clientes.length === 0) {

        contenedor.innerHTML = `

            <div class="sin-clientes">

                👥 No hay clientes registrados.

            </div>

        `;

        return;

    }

    let tabla = `

        <table class="tabla-clientes">

            <thead>

                <tr>

                    <th>Cliente</th>

                    <th>Celular</th>

                    <th>Compras</th>

                    <th>Total Comprado</th>

                </tr>

            </thead>

            <tbody>

    `;

    clientes.forEach(cliente => {

        tabla += `

            <tr>

                <td>${cliente.nombre}</td>

                <td>${cliente.telefono}</td>

                <td>${cliente.compras}</td>

                <td>$${cliente.totalComprado.toLocaleString("es-CO")}</td>

            </tr>

        `;

    });

    tabla += `

            </tbody>

        </table>

    `;

    contenedor.innerHTML = tabla;

}