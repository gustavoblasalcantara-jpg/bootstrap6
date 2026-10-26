# Pastelería Delicia · Tienda en línea con Bootstrap 6

Proyecto de **Diseño Web · Semana 10** (Mg. Ing. Guillermo Eduardo Peña García).
Tienda con catálogo filtrable, buscador, carrito persistente y formulario de torta personalizada,
hecha con **Bootstrap 6.0.0-alpha.1 por CDN** y JavaScript en módulos.

## Estructura

```
pasteleria-delicia-bootstrap6/
├── index.html      ← estructura + clases Bootstrap 6
├── css/
│   └── estilos.css ← colores de la marca (variables --bs-primary-*)
└── js/
    └── tienda.js   ← catálogo, carrito y funciones de la semana
```

## Cómo abrirlo

Abre `index.html` con **Live Server** (clic derecho → *Open with Live Server*).
Con doble clic (`file://`) no funciona, porque el JavaScript de Bootstrap 6 es un módulo ES.
Necesitas internet (Bootstrap se carga por CDN) y un navegador actualizado
(Chrome/Edge 130+, Firefox 132+, Safari 18+).

## Componentes de Bootstrap 6 usados

| Sección | Componente |
|---|---|
| Menú superior | Navbar `md:navbar-expand` + Drawer |
| Productos | Grilla `row-cols-1 sm:row-cols-2 lg:row-cols-3 xl:row-cols-4` + Card + Badge |
| Filtros | Nav pills |
| Buscador | Input group + Form control |
| Carrito | Drawer + List group + Botones (`btn-solid`, `btn-subtle`, `btn-text`) |
| Confirmación | Dialog (`<dialog>` nativo) |
| Pedido especial | Form control + Alert |
| Avisos | Toast |

## Funciones de la semana 10 (`js/tienda.js`)

- **Alcance de módulo:** `type="module"`; nada queda en `window`.
- **Funciones flecha:** `soles`, `tarjetaProducto`, `aplicarDescuento`.
- **Parámetro rest:** `sumar(...numeros)`.
- **Parámetro por defecto:** `agregar(producto, cantidad = 1)`.
- **Closure:** `crearCarrito()` guarda los productos en una variable privada.
- **Recursividad:** `contarUnidades(lista)`.
- **Import de Bootstrap 6:** `import { Toast, Drawer, Dialog } from "…bootstrap.bundle.min.js"`.

## Reto resuelto

1. Categoría nueva **Salados**, con 4 productos: empanada de carne, pan con chicharrón, empanada de pollo y quiche.
2. `aplicarDescuento(total, porcentaje = 10)`, que se aplica cuando el subtotal supera S/ 100.
3. Paleta rojo cambiando solo las variables `--bs-primary-*` en `css/estilos.css`.
4. El aviso flotante es el componente **Toast** de Bootstrap 6.

## Publicar en GitHub Pages

1. Crea un repositorio público, por ejemplo `pasteleria-delicia`, y sube estos archivos.
2. En el repositorio ve a **Settings → Pages**.
3. En **Source** elige *Deploy from a branch*, rama `main`, carpeta `/ (root)`, y guarda.
4. En 1 o 2 minutos queda en `https://TU-USUARIO.github.io/pasteleria-delicia/`. Enlaza esa dirección en tu portafolio.

## Fuentes

- getbootstrap.com/docs/6.0: Quickstart CDN, componentes y guía de migración v5 → v6.
- Código fuente oficial: github.com/twbs/bootstrap (tag `v6.0.0-alpha.1`).
