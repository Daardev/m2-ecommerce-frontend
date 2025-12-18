//Punto de entrada a mi aplicacion
const catalogo = [{
  id: 1,
  nombre: 'Polera Braderhud negra',
  precio: 20990,
  img: 'assets/img/6.png',
  descripcion: 'Estilo urbano esencial con caída perfecta para ti.',
  descuentoAplicado: false,
},
{
  id: 2,
  nombre: 'Polera Braderhud azul',
  precio: 15990,
  img: 'assets/img/diseño-frente-azul.png',
  descripcion: 'Tono profundo con look relajado,moderno y streetwear.',
  descuentoAplicado: false,
},
{
  id: 3,
  nombre: 'Polera Braderhud blanca',
  precio: 17990,
  img: 'assets/img/5.png',
  descripcion: 'Versátil, minimalista y ideal para cualquier outfit.',
  descuentoAplicado: false,
},
{
  id: 4,
  nombre: 'Polera Braderhud café',
  precio: 17990,
  img: 'assets/img/diseño-finalFRENTE.png',
  descripcion: 'Color cálido con estética streetwear y costuras reforzadas',
  descuentoAplicado: false,
}
];
let carrito = [];
let descuentoAplicado = false;

const PASSWORD_MAESTRA = "1234";
let usuarioLogueado = false;

// Cargar carrito desde localStorage al iniciar
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  const descuentoGuardado = localStorage.getItem('descuentoAplicado');
  
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  
  if (descuentoGuardado) {
    descuentoAplicado = JSON.parse(descuentoGuardado);
  }
  
  contadorCarrito();
  renderizarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('descuentoAplicado', JSON.stringify(descuentoAplicado));
}

// Cargar el carrito al iniciar
cargarCarrito();

console.log(catalogo[0].nombre)

// Funcion renderizar el catalogo
function renderizarCatalogo() {
  let divCatalogo = document.getElementById("catalogo");
  let productos = '';
  catalogo.forEach((prod) => {
    productos += `
    <div class="item d-flex flex-column productos-index">
            <a href="./producto1.html">
              <img src="${prod.img}" alt="">
            </a>
            <div class="card-content d-flex flex-column">
              <h3>${prod.nombre}</h3>
              <p>${prod.descripcion}</p>
              <div class="d-flex justify-content-between">
                <span class="precio">${formatearPrecio(prod.precio)}</span>
                <a class="enlaces" href="#" onclick="agregarProductos(${prod.id})">Agregar <i class="fa-solid fa-cart-plus"></i>
                </a>
              </div>
            </div>
          </div>
    `
  });
  divCatalogo.innerHTML = productos;
}
renderizarCatalogo()

function agregarProductos(id) {
  const producto = catalogo.find((p) => p.id == id);
  if (producto) {
    carrito.push({ ...producto });
  }
  guardarCarrito();
  contadorCarrito();
  renderizarCarrito();

  // Abrir modal de confirmación
  const modal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
  modal.show();
}
function quitarProducto(idProducto) {
  const index = carrito.findIndex(prod => prod.id === idProducto);

  if (index !== -1) {
    carrito.splice(index, 1);
  }

  guardarCarrito();
  contadorCarrito();
  renderizarCarrito();
}

function abrirCarrito() {
  const modalCarrito = new bootstrap.Modal(document.getElementById('modalCarrito'));
  modalCarrito.show();
}

function irAlCarrito() {
  // Cerrar el modal de confirmación primero
  const modalConfirmacion = bootstrap.Modal.getInstance(document.getElementById('modalConfirmacion'));
  if (modalConfirmacion) {
    modalConfirmacion.hide();
  }

  // Esperar a que se cierre antes de abrir el carrito
  setTimeout(() => {
    abrirCarrito();
  }, 300);
}

function contadorCarrito() {
  const contador = document.getElementById('contador');
  const carritoIcon = document.querySelector('.fa-cart-shopping');
  contador.textContent = carrito.length;

  // Agregar animación al ícono del carrito
  if (carrito.length > 0) {
    carritoIcon.classList.add('cart-animate');
    contador.classList.add('pulse');

    // Remover la clase después de la animación
    setTimeout(() => {
      carritoIcon.classList.remove('cart-animate');
      contador.classList.remove('pulse');
    }, 600);
  }
}

function renderizarCarrito() {
  const contenedor = document.getElementById('carrito-body');
  const totalSpan = document.getElementById('total');

  contenedor.innerHTML = '';

  //  Carrito vacío
  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <p class="text-center text-muted">
        Tu carrito está vacío
      </p>
    `;
    totalSpan.textContent = formatearPrecio(0);
    return;
  }

  //  Carrito con productos
  carrito.forEach((prod) => {
    contenedor.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <strong>${prod.nombre}</strong><br>
          <small>${formatearPrecio(prod.precio)}</small>
        </div>
        <button 
          class="btn btn-sm btn-danger"
          onclick="quitarProducto(${prod.id})">
          Eliminar
        </button>
      </div>
    `;
  });

  // Actualizar total
  totalSpan.textContent = formatearPrecio(calcularTotal());
}

function calcularTotal() {
  let total = 0;

  carrito.forEach(prod => {
    total += prod.precio;
  });

  // aplicar descuento del 15% si corresponde
  if (descuentoAplicado === true) {
    total = total * 0.85;
  }

  return Math.round(total);
}

function aplicarDescuento() {
  const input = document.getElementById('codigo-descuento');
  const codigo = input.value.trim().toUpperCase();

  if (codigo === 'DESC15') {
    guardarCarrito();
    descuentoAplicado = true;
    renderizarCarrito();
    alert('Descuento del 15% aplicado');
  } else {
    descuentoAplicado = false;
    alert('Código de descuento inválido');
  }

  input.value = '';
}

function formatearPrecio(valor) {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  });
}
