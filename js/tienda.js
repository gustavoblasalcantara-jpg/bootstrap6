/**
 * ============================================================
 * tienda.js — Pastelería Delicia (Bootstrap 6 · Semana 10)
 * ============================================================
 * Se carga con type="module": todo lo declarado aquí tiene ALCANCE DE MÓDULO
 * (no crea variables globales en window).
 *
 * Conceptos de la semana que se usan en este archivo:
 *  - Funciones flecha ........ soles, tarjetaProducto, aplicarDescuento
 *  - Parámetro rest .......... sumar(...numeros)
 *  - Parámetro por defecto ... agregar(producto, cantidad = 1), aplicarDescuento(total, porcentaje = 10)
 *  - Closure ................. crearCarrito() guarda "items" en una variable privada
 *  - Recursividad ............ contarUnidades(lista)
 */

// Bootstrap 6 no crea window.bootstrap: sus componentes se IMPORTAN.
// (Es la misma URL del <script> del HTML, así que el navegador lo descarga una sola vez.)
import { Toast, Drawer, Dialog } from "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js";

/* ============================================================
   1. Datos del catálogo
   ============================================================ */
const productos = [
  // Tortas
  { id: 1, nombre: "Torta de chocolate", categoria: "Tortas", precio: 65, emoji: "🎂", descripcion: "Bizcocho húmedo con fudge y ganache. 12 porciones.", etiqueta: "Más vendido", foto: "https://loremflickr.com/480/360/chocolate,cake?lock=1" },
  { id: 2, nombre: "Torta tres leches", categoria: "Tortas", precio: 58, emoji: "🍰", descripcion: "Clásica, bañada en tres leches y merengue.", etiqueta: "", foto: "https://loremflickr.com/480/360/tresleches,cake?lock=2" },
  { id: 3, nombre: "Selva negra", categoria: "Tortas", precio: 70, emoji: "🍒", descripcion: "Chocolate, crema chantilly y cerezas.", etiqueta: "", foto: "https://loremflickr.com/480/360/blackforest,cake?lock=3" },
  // Panes
  { id: 4, nombre: "Pan de yema (6 u.)", categoria: "Panes", precio: 4.5, emoji: "🍞", descripcion: "Suave y dorado, recién salido del horno.", etiqueta: "", foto: "https://loremflickr.com/480/360/bread,bun?lock=4" },
  { id: 5, nombre: "Croissant de mantequilla", categoria: "Panes", precio: 3.5, emoji: "🥐", descripcion: "Hojaldrado, con mantequilla de verdad.", etiqueta: "Nuevo", foto: "https://loremflickr.com/480/360/croissant?lock=5" },
  { id: 6, nombre: "Pan integral", categoria: "Panes", precio: 6, emoji: "🥖", descripcion: "Con avena y linaza. 500 g.", etiqueta: "", foto: "https://loremflickr.com/480/360/wholegrain,bread?lock=6" },
  // Postres
  { id: 7, nombre: "Alfajores (caja x6)", categoria: "Postres", precio: 12, emoji: "🍪", descripcion: "Rellenos de manjar blanco, con azúcar en polvo.", etiqueta: "Más vendido", foto: "https://loremflickr.com/480/360/alfajores,cookies?lock=7" },
  { id: 8, nombre: "Pie de limón", categoria: "Postres", precio: 8, emoji: "🥧", descripcion: "Masa crocante, crema de limón y merengue.", etiqueta: "", foto: "https://loremflickr.com/480/360/lemon,pie?lock=8" },
  { id: 9, nombre: "Cupcakes (x4)", categoria: "Postres", precio: 14, emoji: "🧁", descripcion: "Vainilla y chocolate con buttercream.", etiqueta: "", foto: "https://loremflickr.com/480/360/cupcakes?lock=9" },
  { id: 10, nombre: "Suspiro a la limeña", categoria: "Postres", precio: 7, emoji: "🍮", descripcion: "Manjar blanco con merengue al oporto.", etiqueta: "", foto: "https://loremflickr.com/480/360/caramel,dessert?lock=10" },
  // Reto 1: categoría nueva "Salados" (4 productos)
  { id: 11, nombre: "Empanada de carne", categoria: "Salados", precio: 5, emoji: "🥟", descripcion: "Carne jugosa, huevo y aceituna.", etiqueta: "Nuevo", foto: "https://loremflickr.com/480/360/empanada?lock=11" },
  { id: 12, nombre: "Pan con chicharrón", categoria: "Salados", precio: 9, emoji: "🥪", descripcion: "Con camote frito y salsa criolla.", etiqueta: "Nuevo", foto: "https://loremflickr.com/480/360/sandwich,pork?lock=12" },
  { id: 13, nombre: "Empanada de pollo", categoria: "Salados", precio: 5, emoji: "🥟", descripcion: "Pollo deshilachado con ají amarillo.", etiqueta: "", foto: "https://loremflickr.com/480/360/empanadas?lock=13" },
  { id: 14, nombre: "Quiche de espinaca", categoria: "Salados", precio: 10, emoji: "🥧", descripcion: "Porción individual con queso fresco.", etiqueta: "", foto: "https://loremflickr.com/480/360/quiche?lock=14" },
];

const MONTO_MINIMO_DESCUENTO = 100; // S/
const CLAVE_STORAGE = "delicia_carrito";

/* ============================================================
   2. Funciones utilitarias (flecha, rest, recursividad)
   ============================================================ */

// Flecha con return implícito
const soles = (monto) => `S/ ${monto.toFixed(2)}`;

// Parámetro REST: recibe cualquier cantidad de números
const sumar = (...numeros) => numeros.reduce((acumulado, n) => acumulado + n, 0);

// Reto 2: flecha con parámetro por defecto
const aplicarDescuento = (total, porcentaje = 10) => total - (total * porcentaje) / 100;

// Recursividad: caso base (lista vacía) + llamada a sí misma con el resto
function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

// Quita tildes y mayúsculas para que "pie" encuentre "Pié" y "limon" encuentre "limón"
const normalizar = (texto) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/* ============================================================
   3. Carrito con CLOSURE (la lista "items" es privada)
   ============================================================ */
function crearCarrito(itemsIniciales = []) {
  let items = itemsIniciales; // nadie fuera de esta función puede tocarla directamente

  const guardar = () => {
    try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
  };

  return {
    // Parámetro por defecto: si no se indica cantidad, agrega 1
    agregar(producto, cantidad = 1) {
      const existente = items.find((it) => it.id === producto.id);
      if (existente) existente.cantidad += cantidad;
      else items.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, emoji: producto.emoji, cantidad });
      guardar();
    },
    cambiar(id, delta) {
      const item = items.find((it) => it.id === id);
      if (!item) return;
      item.cantidad += delta;
      if (item.cantidad <= 0) items = items.filter((it) => it.id !== id);
      guardar();
    },
    quitar(id) { items = items.filter((it) => it.id !== id); guardar(); },
    vaciar() { items = []; guardar(); },
    lista: () => items.map((it) => ({ ...it })), // copia: el exterior no modifica el original
    subtotal: () => sumar(...items.map((it) => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items),
  };
}

function leerCarritoGuardado() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || "[]");
    // Solo se aceptan productos que existen en el catálogo, con su precio actual
    return datos
      .filter((it) => productos.some((p) => p.id === it.id) && it.cantidad > 0)
      .map((it) => {
        const p = productos.find((x) => x.id === it.id);
        return { id: p.id, nombre: p.nombre, precio: p.precio, emoji: p.emoji, cantidad: Math.min(99, Math.floor(it.cantidad)) };
      });
  } catch {
    return [];
  }
}

const carrito = crearCarrito(leerCarritoGuardado());

/* ============================================================
   4. Referencias al DOM y aviso (Toast de Bootstrap 6 · reto 4)
   ============================================================ */
const $ = (selector) => document.querySelector(selector);
const lista = $("#listaProductos");
const filtros = $("#filtros");
const buscador = $("#buscador");
const toast = Toast.getOrCreateInstance($("#toastAviso"));

const avisar = (mensaje) => {
  $("#toastTexto").textContent = mensaje;
  toast.show();
};

// Crea un elemento con clase y texto (sin innerHTML: evita inyección de código)
const crear = (etiqueta, clase = "", texto = "") => {
  const nodo = document.createElement(etiqueta);
  if (clase) nodo.className = clase;
  if (texto) nodo.textContent = texto;
  return nodo;
};

/* ============================================================
   5. Catálogo: tarjetas, filtros (nav pills) y buscador
   ============================================================ */
let categoriaActiva = "Todos";

// Flecha que devuelve la tarjeta (Card + Badge) de un producto
const tarjetaProducto = (producto) => {
  const col = crear("div", "col");
  const card = crear("article", "card h-100 producto");
  card.dataset.categoria = producto.categoria;

  const imagen = crear("div", `producto-img cat-${normalizar(producto.categoria)}`);
  // Foto real del producto; si no carga, se muestra el emoji de respaldo
  const foto = crear("img", "producto-foto");
  foto.src = producto.foto;
  foto.alt = producto.nombre;
  foto.loading = "lazy";
  foto.addEventListener("error", () => { foto.remove(); imagen.prepend(crear("span", "producto-emoji", producto.emoji)); });
  imagen.append(foto);
  imagen.setAttribute("role", "img");
  imagen.setAttribute("aria-label", producto.nombre);
  if (producto.etiqueta) {
    const tema = producto.etiqueta === "Nuevo" ? "theme-success" : "theme-primary";
    imagen.append(crear("span", `badge ${tema} producto-etiqueta`, producto.etiqueta));
  }

  const cuerpo = crear("div", "card-body d-flex flex-column gap-2");
  cuerpo.append(
    crear("span", "badge badge-outline theme-secondary align-self-start", producto.categoria),
    crear("h3", "producto-nombre", producto.nombre),
    crear("p", "fg-3 fs-sm mb-0", producto.descripcion),
  );

  const pie = crear("div", "d-flex align-items-center justify-content-between mt-auto pt-3");
  pie.append(crear("span", "producto-precio", soles(producto.precio)));
  const boton = crear("button", "btn-solid theme-primary", "Agregar");
  boton.type = "button";
  boton.setAttribute("aria-label", `Agregar ${producto.nombre} al carrito`);
  boton.addEventListener("click", () => {
    carrito.agregar(producto); // usa el parámetro por defecto: cantidad = 1
    pintarCarrito();
    avisar(`${producto.emoji} ${producto.nombre} se agregó al carrito.`);
  });
  pie.append(boton);
  cuerpo.append(pie);

  card.append(imagen, cuerpo);
  col.append(card);
  return col;
};

function pintarFiltros() {
  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria))];
  filtros.replaceChildren(...categorias.map((cat) => {
    const li = crear("li", "nav-item");
    const total = cat === "Todos" ? productos.length : productos.filter((p) => p.categoria === cat).length;
    const btn = crear("button", `nav-link${cat === categoriaActiva ? " active" : ""}`, `${cat} (${total})`);
    btn.type = "button";
    if (cat === categoriaActiva) btn.setAttribute("aria-current", "true");
    btn.addEventListener("click", () => {
      categoriaActiva = cat;
      pintarFiltros();
      pintarProductos();
    });
    li.append(btn);
    return li;
  }));
}

function pintarProductos() {
  const termino = normalizar(buscador.value.trim());
  const visibles = productos.filter((p) => {
    const coincideCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
    const coincideTexto = !termino || normalizar(`${p.nombre} ${p.descripcion} ${p.categoria}`).includes(termino);
    return coincideCategoria && coincideTexto;
  });
  lista.replaceChildren(...visibles.map(tarjetaProducto));
  $("#sinResultados").hidden = visibles.length > 0;
  $("#resultado").textContent = `${visibles.length} ${visibles.length === 1 ? "producto" : "productos"}${categoriaActiva !== "Todos" ? ` en ${categoriaActiva}` : ""}${termino ? ` para “${buscador.value.trim()}”` : ""}`;
}

buscador.addEventListener("input", pintarProductos);

/* ============================================================
   6. Carrito: Drawer + List group + descuento (reto 2)
   ============================================================ */
function calcularTotales() {
  const subtotal = carrito.subtotal();
  const conDescuento = subtotal > MONTO_MINIMO_DESCUENTO;
  const total = conDescuento ? aplicarDescuento(subtotal) : subtotal; // 10 % por defecto
  return { subtotal, conDescuento, descuento: subtotal - total, total };
}

function pintarCarrito() {
  const items = carrito.lista();
  const ul = $("#itemsCarrito");

  if (!items.length) {
    ul.replaceChildren(crear("li", "list-group-item carrito-vacio", "Tu carrito está vacío. ¡Agrega algo rico! 🍰"));
  } else {
    ul.replaceChildren(...items.map((it) => {
      const li = crear("li", "list-group-item item-carrito");
      const info = crear("div", "flex-grow-1");
      info.append(crear("strong", "d-block", `${it.emoji} ${it.nombre}`), crear("span", "fs-sm fg-3", `${soles(it.precio)} c/u · ${soles(it.precio * it.cantidad)}`));

      const controles = crear("div", "d-flex align-items-center gap-2");
      const menos = crear("button", "btn-subtle theme-secondary btn-sm", "−");
      menos.type = "button";
      menos.setAttribute("aria-label", `Quitar uno de ${it.nombre}`);
      menos.addEventListener("click", () => { carrito.cambiar(it.id, -1); pintarCarrito(); });
      const cantidad = crear("span", "cantidad", String(it.cantidad));
      const mas = crear("button", "btn-subtle theme-secondary btn-sm", "+");
      mas.type = "button";
      mas.setAttribute("aria-label", `Agregar uno de ${it.nombre}`);
      mas.addEventListener("click", () => { carrito.cambiar(it.id, 1); pintarCarrito(); });
      const quitar = crear("button", "btn-text theme-danger btn-sm", "✕");
      quitar.type = "button";
      quitar.setAttribute("aria-label", `Eliminar ${it.nombre}`);
      quitar.addEventListener("click", () => { carrito.quitar(it.id); pintarCarrito(); avisar(`Se quitó ${it.nombre}.`); });
      controles.append(menos, cantidad, mas, quitar);

      li.append(info, controles);
      return li;
    }));
  }

  const { subtotal, conDescuento, descuento, total } = calcularTotales();
  $("#subtotal").textContent = soles(subtotal);
  $("#descuento").textContent = `− ${soles(descuento)}`;
  $("#filaDescuento").hidden = !conDescuento;
  $("#total").textContent = soles(total);
  $("#mensajeDescuento").textContent = !items.length
    ? ""
    : conDescuento
      ? "🎉 ¡Ganaste 10 % de descuento!"
      : `Te faltan ${soles(MONTO_MINIMO_DESCUENTO - subtotal + 0.01)} para el 10 % de descuento.`;

  const unidades = carrito.unidades(); // recursivo
  const contador = $("#contadorCarrito");
  contador.textContent = String(unidades);
  contador.classList.remove("rebote"); void contador.offsetWidth; contador.classList.add("rebote");
  $("#btnFinalizar").disabled = !items.length;
  $("#btnVaciar").disabled = !items.length;
}

$("#btnVaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
  avisar("Carrito vacío.");
});

// Finalizar: cierra el carrito y abre el Dialog con el resumen
$("#btnFinalizar").addEventListener("click", async () => {
  const items = carrito.lista();
  if (!items.length) return;
  $("#resumenConfirmar").replaceChildren(...items.map((it) => {
    const li = crear("li", "list-group-item d-flex justify-content-between gap-3");
    li.append(crear("span", "", `${it.cantidad} × ${it.nombre}`), crear("span", "", soles(it.precio * it.cantidad)));
    return li;
  }));
  const { conDescuento, descuento, total } = calcularTotales();
  if (conDescuento) {
    const li = crear("li", "list-group-item d-flex justify-content-between fg-success");
    li.append(crear("span", "", "Descuento 10 %"), crear("span", "", `− ${soles(descuento)}`));
    $("#resumenConfirmar").append(li);
  }
  $("#totalConfirmar").textContent = soles(total);
  await Drawer.getOrCreateInstance($("#carrito")).hide(); // en v6, show()/hide() devuelven promesas
  Dialog.getOrCreateInstance($("#dialogConfirmar")).show();
});

$("#btnConfirmar").addEventListener("click", () => {
  const { total } = calcularTotales();
  const unidades = carrito.unidades();
  carrito.vaciar();
  pintarCarrito();
  Dialog.getOrCreateInstance($("#dialogConfirmar")).hide();
  avisar(`✅ Pedido confirmado: ${unidades} ${unidades === 1 ? "producto" : "productos"} por ${soles(total)}. ¡Gracias!`);
});

/* ============================================================
   7. Menú del celular: cerrar el drawer al elegir una sección
   ============================================================ */
document.querySelectorAll("[data-cerrar-menu]").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    const menu = $("#menuPrincipal");
    if (menu.open) Drawer.getOrCreateInstance(menu).hide();
  });
});

/* ============================================================
   8. Pedido especial: Form control + Alert
   ============================================================ */
const form = $("#formPedido");
const fecha = $("#pFecha");
const hoyMas = (dias) => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};
fecha.min = hoyMas(2); // 48 h de anticipación

$("#pCelular").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9); });

const mostrarAlerta = (tema, titulo, texto) => {
  const alerta = crear("div", `alert theme-${tema}`);
  alerta.setAttribute("role", "alert");
  const contenido = crear("div");
  contenido.append(crear("strong", "d-block", titulo), crear("span", "", texto));
  alerta.append(contenido);
  $("#alertaPedido").replaceChildren(alerta);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const campos = [...form.querySelectorAll("[required]")];
  campos.forEach((c) => c.setAttribute("aria-invalid", String(!c.checkValidity())));
  const invalido = campos.find((c) => !c.checkValidity());
  if (invalido) {
    mostrarAlerta("danger", "Revisa el formulario", "Completa los campos marcados. El celular debe tener 9 dígitos y la fecha, al menos 48 h desde hoy.");
    invalido.focus();
    return;
  }
  const datos = Object.fromEntries(new FormData(form));
  const nombre = datos.nombre.trim().split(" ")[0];
  mostrarAlerta("success", `¡Gracias, ${nombre}! 🎂`, `Recibimos tu pedido de torta de ${datos.sabor} (${datos.tamano}) para el ${new Date(`${datos.fecha}T12:00`).toLocaleDateString("es-PE", { day: "numeric", month: "long" })}. Te escribiremos al ${datos.celular}.`);
  form.reset();
  campos.forEach((c) => c.removeAttribute("aria-invalid"));
});

/* ============================================================
   9. Inicio
   ============================================================ */
pintarFiltros();
pintarProductos();
pintarCarrito();
