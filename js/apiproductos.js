/* =========================================================
   Consumo de la API de productos (dummyjson.com)
   ========================================================= */

var urlAPI = 'https://dummyjson.com'
var productosCargados = []

/* ------------------ Catálogo ------------------ */

function extraerProductos() {

    let endPoint = urlAPI + '/products'

    console.info(endPoint)

    let controlador = new AbortController()
    let temporizador = setTimeout(() => controlador.abort(), 15000)

    fetch(endPoint, { signal: controlador.signal })
        .then(respuesta => respuesta.json())
        .then(respuestaJSON => {
            clearTimeout(temporizador)
            productosCargados = respuestaJSON.products.slice(0, 20)
            mostrarProductos(productosCargados)
            activarBuscador()
        })
        .catch(error => {
            clearTimeout(temporizador)
            console.error('Error al consultar los productos:', error)
            mostrarMensajeError('No fue posible cargar los productos. Verifica tu conexión a internet y recarga la página.')
        })

}

function mostrarProductos(productos) {

    let contenedor = document.getElementById('contenedorProductos')
    contenedor.innerHTML = ''

    if (productos.length === 0) {
        let mensaje = crearNodoConClase('p', 'mensajeVacio', 'No se encontraron productos.')
        adicionarElementoAContenedor(mensaje, contenedor)
        return
    }

    productos.forEach(producto => {
        let tarjeta = crearTarjetaProducto(producto)
        adicionarElementoAContenedor(tarjeta, contenedor)
    })

}

function crearTarjetaProducto(producto) {

    let tarjeta = crearElemento('article')
    tarjeta.classList.add('tarjetaProducto')
    tarjeta.addEventListener('click', () => irADetalle(producto.id))

    let contenedorImagen = crearElemento('div')
    contenedorImagen.classList.add('tarjetaImagen')

    let imagen = crearImagen(producto.thumbnail, producto.title)
    adicionarElementoAContenedor(imagen, contenedorImagen)

    let cuerpo = crearElemento('div')
    cuerpo.classList.add('tarjetaCuerpo')

    let categoria = crearNodoConClase('span', 'categoria', producto.category)
    let nombre = crearNodoConClase('h3', 'nombreProducto', producto.title)

    let filaPrecio = crearElemento('div')
    filaPrecio.classList.add('filaPrecio')

    let precio = crearNodoConClase('span', 'precio', formatearPrecio(producto.price))
    let calificacion = crearNodoConClase('span', 'calificacion', '\u2605 ' + producto.rating)

    adicionarElementoAContenedor(precio, filaPrecio)
    adicionarElementoAContenedor(calificacion, filaPrecio)

    let stock = crearNodoConClase('p', 'stock', 'Stock: ' + producto.stock)

    let boton = crearNodoConClase('button', 'botonProducto', 'Ver producto')
    boton.type = 'button'
    boton.addEventListener('click', evento => {
        evento.stopPropagation()
        irADetalle(producto.id)
    })

    adicionarElementoAContenedor(categoria, cuerpo)
    adicionarElementoAContenedor(nombre, cuerpo)
    adicionarElementoAContenedor(filaPrecio, cuerpo)
    adicionarElementoAContenedor(stock, cuerpo)
    adicionarElementoAContenedor(boton, cuerpo)

    adicionarElementoAContenedor(contenedorImagen, tarjeta)
    adicionarElementoAContenedor(cuerpo, tarjeta)

    return tarjeta

}

function activarBuscador() {

    let buscador = document.getElementById('buscador')
    if (!buscador) {
        return
    }

    buscador.addEventListener('input', () => {
        let texto = buscador.value.toLowerCase().trim()

        let productosFiltrados = productosCargados.filter(producto =>
            producto.title.toLowerCase().includes(texto) ||
            producto.category.toLowerCase().includes(texto)
        )

        mostrarProductos(productosFiltrados)
    })

}

function irADetalle(id) {
    window.location.href = 'producto.html?id=' + id
}

function formatearPrecio(precio) {
    return '$' + Number(precio).toFixed(2)
}

function mostrarMensajeError(mensaje) {

    let contenedor = document.getElementById('contenedorProductos')
    if (!contenedor) {
        return
    }

    contenedor.innerHTML = ''
    let texto = crearNodoConClase('p', 'mensajeVacio', mensaje)
    adicionarElementoAContenedor(texto, contenedor)

}

/* ------------------ Detalle ------------------ */

function extraerProductoDetalle() {

    let parametros = new URLSearchParams(window.location.search)
    let id = parametros.get('id')

    if (id === null || id === '') {
        mostrarErrorDetalle('No se indicó el producto que se desea consultar.')
        return
    }

    let endPoint = urlAPI + '/products/' + id

    console.info(endPoint)

    fetch(endPoint)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Producto no encontrado')
            }
            return respuesta.json()
        })
        .then(producto => mostrarDetalleProducto(producto))
        .catch(error => {
            console.error('Error al consultar el producto:', error)
            mostrarErrorDetalle('No fue posible encontrar el producto solicitado.')
        })

}

function mostrarDetalleProducto(producto) {

    let contenedor = document.getElementById('contenedorDetalle')
    contenedor.innerHTML = ''

    let contenedorImagen = crearElemento('div')
    contenedorImagen.classList.add('detalleImagen')

    let imagen = crearImagen(producto.thumbnail, producto.title)
    adicionarElementoAContenedor(imagen, contenedorImagen)

    let informacion = crearElemento('div')
    informacion.classList.add('detalleInfo')

    let categoria = crearNodoConClase('span', 'categoria', producto.category)
    let nombre = crearNodoConClase('h2', 'detalleNombre', producto.title)
    let precio = crearNodoConClase('p', 'detallePrecio', formatearPrecio(producto.price))
    let descripcion = crearNodoConClase('p', 'detalleDescripcion', producto.description)

    let datos = crearElemento('div')
    datos.classList.add('datosProducto')

    let marca = producto.brand ? producto.brand : 'Sin marca'

    adicionarElementoAContenedor(crearDato('Calificación', '\u2605 ' + producto.rating, 'valorCalificacion'), datos)
    adicionarElementoAContenedor(crearDato('Stock', producto.stock), datos)
    adicionarElementoAContenedor(crearDato('Marca', marca), datos)
    adicionarElementoAContenedor(crearDato('Descuento', producto.discountPercentage + '%'), datos)

    adicionarElementoAContenedor(categoria, informacion)
    adicionarElementoAContenedor(nombre, informacion)
    adicionarElementoAContenedor(precio, informacion)
    adicionarElementoAContenedor(descripcion, informacion)
    adicionarElementoAContenedor(datos, informacion)

    adicionarElementoAContenedor(contenedorImagen, contenedor)
    adicionarElementoAContenedor(informacion, contenedor)

}

function crearDato(etiqueta, valor, claseValor) {

    let bloque = crearElemento('div')
    bloque.classList.add('datoProducto')

    let titulo = crearNodoConClase('p', 'datoEtiqueta', etiqueta)
    let contenido = crearNodoConClase('p', 'datoValor', valor)

    if (claseValor) {
        contenido.classList.add(claseValor)
    }

    adicionarElementoAContenedor(titulo, bloque)
    adicionarElementoAContenedor(contenido, bloque)

    return bloque

}

function mostrarErrorDetalle(mensaje) {

    let contenedor = document.getElementById('contenedorDetalle')
    if (!contenedor) {
        return
    }

    contenedor.innerHTML = ''
    contenedor.classList.add('detalleError')

    let texto = crearNodoConClase('p', 'mensajeError', mensaje)
    adicionarElementoAContenedor(texto, contenedor)

}
