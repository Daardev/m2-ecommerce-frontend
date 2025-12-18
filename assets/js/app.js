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

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('descuentoAplicado', JSON.stringify(descuentoAplicado));
}

cargarCarrito();

console.log(catalogo[0].nombre)

const esPageProductos = window.location.pathname.includes('productos.html');

function renderizarCatalogo() {
  let divCatalogo = document.getElementById("catalogo");
  if (!divCatalogo) return;

  let productos = '';

  if (esPageProductos) {
    // Renderizado para productos
    catalogo.forEach((prod) => {
      productos += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 border-0 rounded-4 overflow-hidden shadow productos-index">
          <a href="./producto1.html">
            <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}">
          </a>
          <div class="card-body bg-light">
            <h5 class="card-title text-dark fw-bold">${prod.nombre}</h5>
            <p class="card-text text-secondary">${prod.descripcion}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="precio">${formatearPrecio(prod.precio)}</span>
              <button class="enlaces" onclick="agregarProductos(${prod.id})">Agregar <i class="fa-solid fa-cart-plus"></i></button>
            </div>
          </div>
        </div>
      </div>
      `;
    });
  } else {
    // Renderizado para index
    catalogo.forEach((prod) => {
      productos += `
      <div class="item d-flex flex-column productos-index">
        <a href="./producto1.html">
          <img src="${prod.img}" alt="${prod.nombre}">
        </a>
        <div class="card-content d-flex flex-column">
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <div class="d-flex justify-content-between">
            <span class="precio">${formatearPrecio(prod.precio)}</span>
            <button class="enlaces" onclick="agregarProductos(${prod.id})">Agregar <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
      `;
    });
  }

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
  const modalConfirmacion = bootstrap.Modal.getInstance(document.getElementById('modalConfirmacion'));
  if (modalConfirmacion) {
    modalConfirmacion.hide();
  }

  setTimeout(() => {
    abrirCarrito();
  }, 300);
}

function contadorCarrito() {
  const contador = document.getElementById('contador');
  const carritoIcon = document.querySelector('.fa-cart-shopping');
  contador.textContent = carrito.length;

  if (carrito.length > 0) {
    carritoIcon.classList.add('cart-animate');
    contador.classList.add('pulse');

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

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <p class="text-center text-white">
        Tu carrito está vacío
      </p>
    `;
    totalSpan.textContent = formatearPrecio(0);
    return;
  }

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

  totalSpan.textContent = formatearPrecio(calcularTotal());
}

function calcularTotal() {
  let total = 0;

  carrito.forEach(prod => {
    total += prod.precio;
  });

  if (descuentoAplicado === true) {
    total = total * 0.85;
  }

  return Math.round(total);
}

function aplicarDescuento() {
  const input = document.getElementById('codigo-descuento');
  const codigo = input.value.trim().toUpperCase();

  if (codigo === 'DESC15') {
    descuentoAplicado = true;
    guardarCarrito();
    renderizarCarrito();
    alert('Descuento del 15% aplicado');
  } else {
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

function mostrarModal(tipo) {
  const modalAuth = new bootstrap.Modal(document.getElementById('modalAuth'));
  modalAuth.show();

  if (tipo === 'login') {
    mostrarFormulario('login');
  } else if (tipo === 'registro') {
    mostrarFormulario('registro');
  }
}

function mostrarFormulario(tipo) {
  const formLogin = document.getElementById('form-login-container');
  const formRegistro = document.getElementById('form-registro-container');
  const btnLogin = document.getElementById('btn-mostrar-login');
  const btnRegistro = document.getElementById('btn-mostrar-registro');

  if (tipo === 'login') {
    formLogin.style.display = 'block';
    formRegistro.style.display = 'none';
    btnLogin.classList.add('active');
    btnLogin.classList.remove('btn-outline-primary');
    btnLogin.classList.add('btn-primary');
    btnRegistro.classList.remove('active', 'btn-primary');
    btnRegistro.classList.add('btn-outline-primary');
  } else if (tipo === 'registro') {
    formLogin.style.display = 'none';
    formRegistro.style.display = 'block';
    btnRegistro.classList.add('active');
    btnRegistro.classList.remove('btn-outline-primary');
    btnRegistro.classList.add('btn-primary');
    btnLogin.classList.remove('active', 'btn-primary');
    btnLogin.classList.add('btn-outline-primary');
  }
}

// Iniciar sesión
function iniciarSesion(usuario, password) {
  if (password === PASSWORD_MAESTRA) {
    usuarioLogueado = true;
    console.log("Usuario logueado:", usuario);

    const modalAuth = bootstrap.Modal.getInstance(document.getElementById('modalAuth'));
    if (modalAuth) modalAuth.hide();

    actualizarEstadoLogin(usuario);
    alert(`¡Bienvenido ${usuario}!`);

  } else {
    console.warn("Credenciales inválidas");
    alert("Contraseña incorrecta");
  }
}

function manejarSubmitLogin(event) {
  event.preventDefault();

  const usuario = document.getElementById('login-usuario').value.trim();
  const password = document.getElementById('login-password').value;

  if (!usuario || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  iniciarSesion(usuario, password);

  if (usuarioLogueado) {
    document.getElementById('form-login').reset();
  }
}

// Registrar nuevo usuario
function registrarUsuario(event) {
  event.preventDefault();
  
  const usuario = document.getElementById('registro-usuario').value.trim();
  const password = document.getElementById('registro-password').value;
  const confirmPassword = document.getElementById('registro-confirm-password').value;
  
  if (!usuario || !password || !confirmPassword) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  if (password.length < 4) {
    alert('La contraseña debe tener al menos 4 caracteres');
    return;
  }
  
  // Simular registro exitoso
  console.log(`Usuario "${usuario}" registrado`);
  alert(`¡Cuenta creada! Ahora puedes iniciar sesión`);
  
  // Cambiar al formulario de login
  document.getElementById('form-registro').reset();
  mostrarFormulario('login');
}

// Cerrar sesión
function cerrarSesion() {
  usuarioLogueado = false;
  console.log('Sesión cerrada');
  actualizarEstadoLogin();
  alert('Sesión cerrada correctamente');
}

// Actualizar interfaz según estado de login
function actualizarEstadoLogin(nombreUsuario = '') {
  const btnLogin = document.getElementById('btn-login');
  const btnPerfil = document.getElementById('btn-perfil');

  if (usuarioLogueado) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnPerfil) {
      btnPerfil.style.display = 'block';
      btnPerfil.innerHTML = `
        <button class="btn btn-link nav-link text-white dropdown-toggle" data-bs-toggle="dropdown">
          <i class="fa-solid fa-user"></i> ${nombreUsuario || 'Usuario'}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#" onclick="cerrarSesion()"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a></li>
        </ul>
      `;
    }
  } else {
    if (btnLogin) btnLogin.style.display = 'block';
    if (btnPerfil) btnPerfil.style.display = 'none';
  }
}
