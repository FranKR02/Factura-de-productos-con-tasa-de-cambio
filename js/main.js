//////////////////////-----_OBJETOS----///////////////////////////////////////
class Cliente {
    static id = 0;
    constructor(nombre, cedula, telefono) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.telefono = telefono;
        //Se incremente cada que se crea un objet
        this.id = Cliente.id++;
    }
    //Getters y Setters
    setCedula(cedula) {
        this.cedula = cedula;
    }
    getCedula() {
        return this.cedula;
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    getNombre() {
        return this.nombre;
    }
    setTelefono(telefono) {
        this.telefono = telefono;
    }
    getTelefono() {
        return this.telefono;
    }
    getId() {
        return this.id;
    }
}
class Producto {
    static id = 0;
    constructor(nombre, precio, cantidad) {
        this.id = Producto.id++;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;

    }
    //Getters y setters
    getId() {
        return this.id;
    }
    getCantidad() {
        return this.cantidad;
    }
    setCantidad(cantidad) {
        this.cantidad = cantidad;
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    getNombre() {
        return this.nombre;
    }
    setPrecio(precio) {
        this.precio = precio;
    }
    getPrecio() {
        return this.precio;
    }
    //Desde la clase calculamos la tasa de cambio para modificar los valores del precio
    //antes de hacer cuentas
    calcularTasaCambio(tasaCambio, precio) {
        //La clase tasa nos devuelve el precio casteado
        if (tasaCambio == "dolar") {
            this.precio = Tasa.dolar(precio);
        } else if (tasaCambio == "euro") {
            this.precio = Tasa.euro(precio);
        } else if (tasaCambio == "peso") {
            this.precio = Tasa.peso(precio);
        }
    }
    //calcularPrecioTotal es para saber el total del precio del producto
    //  cantidad*precio
    calcularPrecioTotal(precio) {
        let precioTotal = precio * this.cantidad;
        return precioTotal;
    }
}
class Tasa {
    static peso(valor) {
        return valor;
    }
    static dolar(valor) {
        let precio = (0.00026 * valor) / 1;
        precio = precio.toFixed(2);
        return precio;
    }
    static euro(valor) {
        let precio = (0.00024 * valor) / 1;
        precio = precio.toFixed(2);
        return precio;
    }
}
class Factura {
    constructor(Cliente, Producto, tasaCambio) {
        //Variable para obtener la fecha actual
        this.fecha = this.getFecha();
        //Variables con la referencia de los objetos
        this.cliente = Cliente;
        this.productos = Producto;
        this.tasaCambio = tasaCambio;
        //Variables a usar
        this.subTotales = [];
        this.precioTotal = 0;
        //Llamos al metodo calcularSubtotal en este constructor para tener el valor
        this.calcularSubtotal();
    }
    getFecha() {
        //Obtenemos el dia, mes, año
        let date = new Date();
        let dia = date.getDate();
        let mes = date.getMonth() + 1;
        let año = date.getFullYear();
        let fecha = dia + "/" + mes + "/" + año;
        return fecha;
    }
    calcularSubtotal() {
        let producto;
        let precio;
        //Recorremos el array de productos y los guardamos en el array de subtotales
        for (let i = 0; i < this.productos.length; i++) {
            producto = this.productos[i][0];
            precio = producto.getPrecio();
            this.subTotales.push(producto.calcularPrecioTotal(producto.getPrecio(), producto.getCantidad()));
        }
        //Llamos al metodo calcularTotal al ya tener el subtotal
        //-----Al usar localStorage no se puede acceder a los metodos-----////
        this.calcularTotal();
    }
    calcularTotal() {
        let precio = 0;
        //Recorremos el arreglo de subtotales y sumamos los valores dando el total
        for (let i = 0; i < this.subTotales.length; i++) {
            precio += this.subTotales[i];
        }
        //En el caso de las tasas limitamos los decimales en 2
        precio = precio.toFixed(2);
        this.precioTotal = precio;
    }
}
////////////////////--DECLARACION DE VARIABLES Y METODOS PARA EL MANEJO---///////////////////
//Declaramos las variables globales para acceder desde cualquier metodo
let productosArreglo;
let cliente;
let factura;
//Iniciamos las variables globales
function iniciarValores() {
    //El valor por defecto de la cantidad es 0, no se ha seleccionado nada
    productosArreglo = [
        [new Producto("Gaseosa", 3000, 0)],
        [new Producto("Arroz 1Lb", 4000, 0)],
        [new Producto("Detergente 4L", 33000, 0)],
        [new Producto("Cubeta huevos", 10000, 0)],
        [new Producto("Paquete papas", 2000, 0)],
        [new Producto("Leche 1L", 2100, 0)]
    ];
}
//El metodo cambioTasa será el 1ero en ejecutarse, desde éste llamamos a iniciarValores
function cambioTasa() {
    iniciarValores();
    let cards = document.getElementById('cards');
    //Obtenemos el valor de la tasa y según este, lo imprimimos
    if (cards != null) {
        let tasa = document.getElementById('tasaCambio').value;
        cards.innerHTML = "";
        //Los valores del metodo agregarProductos son la tasa, el simbolo y un numero
        //para saber si se llamo al metodo desde otro o si la tasa cambió naturalmente
        if (tasa === "peso") {
            agregarProductos(tasa, "$", 0);
        } else if (tasa === "dolar") {
            agregarProductos(tasa, "USD", 0);
        } else {
            agregarProductos(tasa, "€", 0);
        }
    }
}
//Recibe el valor de la tasa en string, el simbolo de la tasa y un numero, explicado mas adelante
function agregarProductos(tasa, indiceTasa, numero) {
    //Obtenemos el elemento de las cards y lo dejamos vacio
    let cards = document.getElementById('cards');
    cards.innerHTML = "";
    //Recorremos el arreglo de productos y agregamos los valores al html
    for (let i = 0; i < productosArreglo.length; i++) {
        //Si la tasa cambio naturalmente obtendremos un 0 (el usuario cambia la tasa), si es un 1, es porque agregamos este valor desde otro metodo (llamamos el metodo desde otro, no cambia la tas)
        if (numero == 0) {
            //Calculamos la tasa de cambio, no retorna un valor pero se precio toma el valor casteado
            productosArreglo[i][0].calcularTasaCambio(tasa, productosArreglo[i][0].getPrecio());
        }
        //Agregamos los productos con los cards, HTML y Bootstrap puro
        cards.innerHTML += `
        <div class='col-4 mt-2 mb-2'>
            <div class='card' style='width:19rem; height:100%'>
                <img class='card-img-top' src='src/` + productosArreglo[i][0].getNombre() + `.jpg' style='height:200px;'>
                <div class='card-body'>
                    <h5 class='card-title text-center'>` + productosArreglo[i][0].getNombre() +
                    `<p class='card-subtitle mt-1'>` + productosArreglo[i][0].getPrecio() + indiceTasa + `</p>
                    <p class='card-subtitle mt-1'>` + `Cantidad ` + productosArreglo[i][0].getCantidad() + `</p>
                    </h5>
                    <div class='text-center'>
                        <button class='btn btn-dark text-center fw-bolder' onclick='quitarCantidad(` + productosArreglo[i][0].getId() + `)'>-</button>
                        <button class='btn btn-dark text-center fw-bolder' onclick='agregarCantidad(` + productosArreglo[i][0].getId() + `)'>+</button>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

function agregarCantidad(id) {
    let cantidad;
    //Recorremos el arreglo de productos buscando el id, en caso de encontrarlo suma 1 a la cantidad
    //Al guardar la referencia no hay necesidad de volver a crear el objeto
    for (let i = 0; i < productosArreglo.length; i++) {
        if (productosArreglo[i][0].getId() == id) {
            cantidad = productosArreglo[i][0].getCantidad();
            cantidad++;
            productosArreglo[i][0].setCantidad(cantidad);
        }
    }
    //Obtenemos el valor de la tasa y llamamos al metodo agregarProductos, enviamos 1 en el 3er parametro
    let tasaC = document.getElementById('tasaCambio').value;
    if (tasaC === "peso") {
        agregarProductos(tasaC, "$", 1);
    } else if (tasaC === "dolar") {
        agregarProductos(tasaC, "USD", 1);
    } else {
        agregarProductos(tasaC, "€", 1);
    }
}
function quitarCantidad(id) {
    let cantidad;
    //Recorremos el arreglo de productos buscando el id, en caso de encontrarlo resta 1 a la cantidad
    //Al guardar la referencia no hay necesidad de volver a crear el objeto
    for (let i = 0; i < productosArreglo.length; i++) {
        if (productosArreglo[i][0].getCantidad() > -1) {
            //Condicion para no tener valores de cantidad negativos
            if (productosArreglo[i][0].getId() == id && productosArreglo[i][0].getCantidad() != 0) {
                cantidad = productosArreglo[i][0].getCantidad();
                productosArreglo[i][0].setCantidad(cantidad - 1);
            }
        } else {
            break;
        }
    }
    //Obtenemos el valor de la tasa y llamamos al metodo agregarProductos, enviamos 1 en el 3er parametro
    let tasaC = document.getElementById('tasaCambio').value;
    if (tasaC === "peso") {
        agregarProductos(tasaC, "$", 1);
    } else if (tasaC === "dolar") {
        agregarProductos(tasaC, "USD", 1);
    } else {
        agregarProductos(tasaC, "€", 1);
    }
}

///////////////////////---METODOS DE LA FACTURA///////////////////////////////////
function generarFactura() {
    //Limpiamos el localStorage para no tener mas valores
    localStorage.clear();
    let nombre = document.getElementById('nombreUsuario').value;
    let cedula = document.getElementById('cedulaUsuario').value;
    let telefono = document.getElementById('telefonoUsuario').value;
    let tasa = document.getElementById('tasaCambio').value;
    //Obtenemos los valores del modal y la tasa, creamos los objetos cliente y factura
    cliente = new Cliente(nombre, cedula, telefono);
    factura = new Factura(cliente, productosArreglo, tasa);
    //Guardamos los objetos cliente y factura en el localStorage
    //Al usar 2 paginas, lo valores de un clase se resetean, se necesita una BD o el navegador
    //para guarda al menos el id, en este caso, los valores de los objetos
    //Se deben guardar como JSON, se castean
    localStorage.setItem("usuario", JSON.stringify(cliente));
    localStorage.setItem("factura", JSON.stringify(factura));
    //Nos redirigimos a la pagina factura
    window.location.href = "factura.html";

}
//Al resetear los valores cuando se carga otra pagina, lo que se quiera guardar debe estar en una BD o 
//en el navegador
//Este metodo se ejecuta cuando se cargue el body de factura.html
function imprimirFactura() {
    //Obtenemos los json guardados y casteamos para obtener un objeto
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    let facturaFinal = JSON.parse(localStorage.getItem("factura"));
    //Elementos HTML
    let fecha = document.getElementById('fecha');
    let nombre = document.getElementById('nombre');
    let cedula = document.getElementById('cedula');
    let telefono = document.getElementById('telefono');
    let tasa = document.getElementById('tasa');
    let tasaCambio;

    //If para elegir el simbolo, se me olvido guardarlo :c
    if (facturaFinal.tasaCambio == "euro") {
        tasaCambio = "€";
    } else if (facturaFinal.tasaCambio == "dolar") {
        tasaCambio = "USD";
    } else {
        tasaCambio = "$";
    }
    //Ponemos los datos del usuario en los elementos del HTML
    fecha.innerHTML = facturaFinal.fecha;
    tasa.innerHTML = tasaCambio;
    nombre.innerHTML = usuario.nombre;
    cedula.innerHTML = usuario.cedula;
    telefono.innerHTML = usuario.telefono;
    //Metodos de impresion
    imprimirProductos(facturaFinal, tasaCambio);
    imprimirSubtotal(facturaFinal, tasaCambio);
    imprimirTotal(facturaFinal, tasaCambio);
}
function imprimirProductos(factura, tasaCambio){
    let productos = document.getElementById('productos');
    //En el objeto Factura esta la referencia de los productos
    //Recorremos los producto e imprimimos
    for (let i = 0; i < factura.productos.length; i++) {
        productos.innerHTML += `
        <div class="col-6">`+ factura.productos[i][0].nombre + `</div>
        <div class="col-6 text-end">` + factura.productos[i][0].precio + tasaCambio + `</div>`;
    }
}
function imprimirSubtotal(factura, tasaCambio) {
    let subTotal = document.getElementById('subTotal')
    //En el objeto Factura esta el array de subTotales
    //Recorremos los subTotales e imprimimos
    productos.innerHTML += `<h3 class='text-center'>Subtotal</h3>`
    for (let i = 0; i < factura.subTotales.length; i++) {
        if(factura.productos[i][0].cantidad != 0){
            productos.innerHTML += `
            <div class="col-6">`+ factura.productos[i][0].nombre + ` (` + factura.productos[i][0].cantidad + `)</div>
            <div class="col-6 text-end">` + factura.subTotales[i] + tasaCambio + `</div>`;
        }
    }
}
function imprimirTotal(factura, tasaCambio) {
    let total = document.getElementById('total')
    //En el objeto Factura esta la variable total
    total.innerHTML += `<h3 class='text-center'>Total</h3>`
    total.innerHTML += `
        <div class="col-6 text-end">Total:</div>
        <div class="col-6 text-end mb-5">` + factura.precioTotal + tasaCambio + `</div>`;

}

//La tasa de cambio es el 1er metodo en llamarse, automatica o manualmente
cambioTasa(0);


