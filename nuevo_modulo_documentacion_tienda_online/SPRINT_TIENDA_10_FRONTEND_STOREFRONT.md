# Sprint 10 — Frontend storefront (catálogo + carrito)

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-10 |
| **Duración estimada** | 5–7 días |
| **Perfil** | Frontend (Victor + apoyo) |
| **Rama** | `feature/tienda-10-frontend-storefront` |
| **Depende de** | 03, 04, 09 (APIs listas) |
| **Habilita** | 11 |

---

## Objetivo

UI pública Modern Earth: home, catálogo, detalle producto, carrito; layouts separados del admin.

---

## Alcance archivos (permitido)

| Ruta | Acción |
|------|--------|
| `resources/js/Layouts/StorefrontLayout.jsx` | Crear |
| `resources/js/Layouts/CustomerLayout.jsx` | Crear (base; completar en 11) |
| `resources/js/Pages/Tienda/**` | Crear |
| `resources/js/Components/Tienda/**` | Crear |
| `resources/css/app.css` | Ajustes tienda |
| `tailwind.config.js` | Colores tienda (si no están) |

**Prohibido:** `app/Domains`, migrations, `routes` sin coordinación backend (acordar rutas en PR conjunto).

---

## Paleta (INSTRUCCIONES_FRONTEND)

| Token | Hex | Uso |
|-------|-----|-----|
| Primario | `#3C473A` | Header tienda, footer |
| Acción | `#D77A61` | CTA, agregar carrito |
| Fondo | `#FDF6F0` | Body |
| Texto | `#2B221E` | Tipografía |

---

## Páginas

| Página | Ruta | Auth |
|--------|------|------|
| `Tienda/Home.jsx` | `/` o `/tienda` | No |
| `Tienda/Catalogo.jsx` | `/tienda/catalogo` | No |
| `Tienda/ProductoShow.jsx` | `/tienda/productos/{id}` | No |
| `Tienda/Carrito.jsx` | `/tienda/carrito` | No* |
| `Tienda/Auth/Login.jsx` | `/tienda/login` | guest |
| `Tienda/Auth/Register.jsx` | `/tienda/registro` | guest |

\*Ver carrito invitado; CTA checkout → login.

---

## Componentes `resources/js/Components/Tienda/`

| Componente | Props principales |
|------------|-------------------|
| `StorefrontHeader.jsx` | `cartCount`, `auth` |
| `ProductCard.jsx` | `producto`, `onAddToCart` |
| `ProductGrid.jsx` | `productos[]` |
| `CatalogFilters.jsx` | categorías, búsqueda |
| `CartLineItem.jsx` | línea, qty, remove |
| `CartSummary.jsx` | subtotal, CTA checkout |
| `EmptyCart.jsx` | — |

Reutilizar si existen: `PrimaryActionButton`, `EmptyState` de `Components/UI/`.

---

## StorefrontLayout — estructura

| Zona | Contenido |
|------|-----------|
| Header | Logo, nav Catálogo, Carrito (badge count), Login/Registro o Mi cuenta |
| Main | `{children}` |
| Footer | Links legales, contacto |

**Responsive:** menú hamburguesa móvil; `transition-all duration-200`.

---

## Integración Inertia — carrito

| Acción | Método | preserveScroll |
|--------|--------|----------------|
| Agregar | `router.post('/tienda/carrito/items', {...})` | true |
| Actualizar qty | `router.patch(...)` | true |
| Eliminar | `router.delete(...)` | true |

**Loading:** botones disabled + "Procesando..." (`processing` de useForm).

---

## Estados vacíos y errores

| Caso | UI |
|------|-----|
| Catálogo sin resultados | `EmptyState` |
| Carrito vacío | `EmptyCart` + link catálogo |
| Error validación | borde rojo + mensaje bajo campo |
| Stock 0 | Badge "Agotado", botón disabled |

---

## Condiciones UX

| # | Condición |
|---|-----------|
| 1 | No calcular totales en JS; mostrar `subtotal` del backend |
| 2 | No hardcodear permisos como única seguridad |
| 3 | `npm run build` sin errores |
| 4 | No Bootstrap/MUI/shadcn |

---

## Criterios de aceptación

- [ ] Catálogo responsive con filtros.
- [ ] Detalle producto con agregar al carrito funcional.
- [ ] Carrito muestra líneas invitado y autenticado.
- [ ] Checkout CTA redirige a login si guest.
- [ ] Estética Modern Earth consistente.
- [ ] Build CI pasa.

---

## Coordinación backend

| Endpoint necesario | Sprint |
|--------------------|--------|
| GET catálogo | 04 |
| GET producto | 04 |
| CRUD carrito | 03 |
| Auth pages props | 09 |
