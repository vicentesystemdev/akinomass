# Sprint 04 — Catálogo público (storefront lectura)

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-04 |
| **Duración estimada** | 3–4 días |
| **Perfil** | Backend + Frontend (Victor — catálogo) |
| **Rama** | `feature/tienda-04-catalogo-publico` |
| **Depende de** | Sprint 01 |
| **Habilita** | Sprint 10 |

---

## Objetivo

Exponer catálogo de productos **solo lectura** para visitantes sin autenticación, filtrando activos y mostrando disponibilidad desde inventario.

---

## Sin tablas nuevas

Reutiliza: `productos`, `categorias_producto`, `inventarios`.

---

## Dominio `app/Domains/Tienda/Catalogo/`

| Clase | Tipo | Responsabilidad |
|-------|------|-----------------|
| `ListarProductosPublicosAction` | Action | Lista paginada/filtrada |
| `ObtenerProductoPublicoAction` | Action | Detalle por `cod_producto` o slug futuro |
| `ListarCategoriasPublicasAction` | Action | Categorías con productos activos |
| `CatalogoPublicoRepository` | Repository | Queries optimizadas, eager load |
| `CatalogoPublicoService` | Service | Filtros, orden, stock badge |

---

## Filtros soportados (v1)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Búsqueda en `nombre_pro`, `sku_pro` |
| `cod_categoria_producto` | int | Filtro categoría |
| `orden` | enum | `precio_asc`, `precio_desc`, `nombre_asc`, `recientes` |
| `solo_disponibles` | bool | stock > 0 |
| `page` | int | Paginación |

---

## Respuesta Inertia — producto listado

| Campo expuesto | Origen | Notas |
|----------------|--------|-------|
| `cod_producto` | `productos` | |
| `nombre_pro` | | |
| `precio_venta_pro` | | **No** exponer `precio_costo_pro` |
| `imagen_pro` | | URL pública |
| `sku_pro` | | |
| `categoria` | relación | `nombre` categoría |
| `stock_disponible` | `inventarios` | entero |
| `disponible` | calculado | `stock > 0` y activo |
| `estado_pro` | | solo si admin; en público filtrar activos |

---

## Rutas

| Método | Ruta | Middleware | Vista React |
|--------|------|------------|-------------|
| GET | `/` o `/tienda` | web | `Tienda/Home` |
| GET | `/tienda/catalogo` | web | `Tienda/Catalogo` |
| GET | `/tienda/productos/{producto}` | web | `Tienda/ProductoShow` |
| GET | `/tienda/categorias/{categoria}` | web | `Tienda/Catalogo` |

**Condición P13:** definir en Sprint 00 si `/` es tienda.

---

## Controller

`app/Http/Controllers/Tienda/CatalogoPublicoController.php`

---

## Reglas de negocio

| # | Regla |
|---|-------|
| 1 | No listar `estado_pro` ≠ `activo` |
| 2 | No exponer costos ni márgenes |
| 3 | Paginación server-side (15–24 ítems) |
| 4 | Cache opcional Redis 5 min listado (Sprint 04 opcional) |

---

## Condiciones seguridad

| # | Condición |
|---|-----------|
| 1 | Rutas sin permiso admin |
| 2 | Rate limiting `throttle:60,1` en búsqueda |
| 3 | No filtrar datos de otros módulos (leads, etc.) |

---

## Criterios de aceptación

- [ ] Visitante abre `/tienda/catalogo` sin login.
- [ ] Producto inactivo → 404 en detalle.
- [ ] Filtro categoría funciona.
- [ ] `precio_costo_pro` nunca en JSON Inertia.
- [ ] Tests feature: listado, detalle, 404.

---

## Frontend (parcial — ver Sprint 10)

| Página | Componentes UI |
|--------|------------------|
| `Catalogo.jsx` | `ProductCard`, grid, filtros |
| `ProductoShow.jsx` | imagen, precio, botón "Agregar al carrito" |

**Condición:** botón agregar llama API Sprint 03 (puede stub hasta integración).
