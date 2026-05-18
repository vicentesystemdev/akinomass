# Sprint 03 — Carrito (Redis + PostgreSQL)

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-03 |
| **Duración estimada** | 4–5 días |
| **Perfil** | Backend |
| **Rama** | `feature/tienda-03-carrito` |
| **Depende de** | Sprint 01 |
| **Habilita** | Sprint 05, 10 |

---

## Objetivo

Carrito para invitados (Redis) y usuarios (Redis + tablas `carritos` / `detalles_carrito`), con merge al login y validación de precio/stock en servicio.

---

## Migración 1: `carritos`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_carrito` | `bigIncrements` | NO | — | PK |
| `user_id` | `foreignId` | SÍ | `null` | FK → `users`, INDEX |
| `session_id_car` | `string(100)` | SÍ | `null` | INDEX |
| `cod_cliente` | `unsignedBigInteger` | SÍ | `null` | FK → `clientes` |
| `estado_car` | `string(20)` | NO | `activo` | INDEX |
| `moneda_car` | `string(3)` | NO | `BOB` | — |
| `subtotal_car` | `decimal(12,2)` | NO | `0` | — |
| `total_car` | `decimal(12,2)` | NO | `0` | — |
| `expira_en_car` | `timestamp` | SÍ | `null` | — |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

### Enum: `EstadoCarritoEnum`

| Case | Valor |
|------|-------|
| `ACTIVO` | `activo` |
| `EN_CHECKOUT` | `en_checkout` |
| `CONVERTIDO` | `convertido` |
| `ABANDONADO` | `abandonado` |
| `EXPIRADO` | `expirado` |

---

## Migración 2: `detalles_carrito`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_detalle_carrito` | `bigIncrements` | NO | — | PK |
| `cod_carrito` | `unsignedBigInteger` | NO | — | FK → `carritos`, CASCADE DELETE |
| `cod_producto` | `unsignedBigInteger` | NO | — | FK → `productos` |
| `cantidad_dca` | `unsignedInteger` | NO | — | — |
| `precio_unitario_dca` | `decimal(12,2)` | NO | — | Snapshot |
| `subtotal_dca` | `decimal(12,2)` | NO | — | — |
| `nombre_producto_dca` | `string(255)` | SÍ | `null` | Snapshot |
| `sku_producto_dca` | `string(100)` | SÍ | `null` | Snapshot |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

**UNIQUE:** `(cod_carrito, cod_producto)`

---

## Redis — estructura payload

```json
{
  "actualizado_en": "ISO8601",
  "moneda": "BOB",
  "items": [
    {
      "cod_producto": 1,
      "cantidad": 2,
      "precio_unitario": 149.90,
      "nombre_snapshot": "Producto X",
      "sku_snapshot": "SKU-001"
    }
  ]
}
```

---

## Servicios y Actions

| Clase | Ubicación | Responsabilidad |
|-------|-----------|-----------------|
| `CarritoRedisService` | `Tienda/Carrito/Services/` | get/set/merge TTL Redis |
| `CarritoPersistenciaService` | `Tienda/Carrito/Services/` | CRUD `carritos` + detalles |
| `CarritoCalculoService` | `Tienda/Carrito/Services/` | subtotal, recalcular |
| `AgregarItemCarritoAction` | Actions | Valida producto activo, precio actual, stock |
| `ActualizarCantidadCarritoAction` | Actions | |
| `EliminarItemCarritoAction` | Actions | |
| `VaciarCarritoAction` | Actions | |
| `MergeCarritoInvitadoAction` | Actions | Post-login |
| `ObtenerCarritoActualAction` | Actions | Redis o BD según auth |

---

## Reglas de negocio

| # | Regla |
|---|-------|
| 1 | Solo productos `estado_pro = activo` |
| 2 | `cantidad_dca` ≤ stock disponible (`inventarios`) |
| 3 | Precio snapshot = `precio_venta_pro` al agregar |
| 4 | Un carrito `activo` por `user_id` (cerrar anterior o reutilizar) |
| 5 | Invitado: solo Redis hasta login |
| 6 | Al pasar a checkout: `estado_car = en_checkout` |

---

## API HTTP (borrador rutas)

| Método | Ruta | Auth | Permiso |
|--------|------|------|---------|
| GET | `/tienda/carrito` | opcional | `carrito.ver` si auth |
| POST | `/tienda/carrito/items` | opcional | `carrito.gestionar` |
| PATCH | `/tienda/carrito/items/{producto}` | opcional | `carrito.gestionar` |
| DELETE | `/tienda/carrito/items/{producto}` | opcional | `carrito.gestionar` |
| DELETE | `/tienda/carrito` | opcional | `carrito.gestionar` |

**Condición:** rutas públicas permiten invitado; middleware asigna session_id.

---

## Controller

`app/Http/Controllers/Tienda/CarritoController.php` — solo delega a Actions.

---

## Condiciones técnicas

| # | Condición |
|---|-----------|
| 1 | No descontar inventario en carrito |
| 2 | Recalcular totales en Service, no en React |
| 3 | Tests merge: guest 2 items + user 1 item → 3 líneas o suma cantidades |

---

## Criterios de aceptación

- [ ] Invitado agrega producto → clave Redis existe.
- [ ] Usuario logueado → filas en `carritos` + `detalles_carrito`.
- [ ] Login con carrito guest → merge correcto.
- [ ] Producto inactivo → 422 validación.
- [ ] Cantidad > stock → 422.
- [ ] `php artisan test --filter=Carrito` pasa.

---

## Dependencias de modelos existentes

| Modelo | Uso |
|--------|-----|
| `Producto` | precio, estado, nombre, sku |
| `Inventario` | stock disponible |
