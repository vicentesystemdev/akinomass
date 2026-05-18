# Sprint 01 — Infraestructura base tienda

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-01 |
| **Duración estimada** | 2–3 días |
| **Perfil** | Backend senior |
| **Rama** | `feature/tienda-01-infraestructura` |
| **Depende de** | Sprint 00 |
| **Habilita** | 02, 03, 04, 09 |

---

## Objetivo

Preparar dominio vacío, Redis para carritos, roles/permisos **Cliente**, seeders de catálogo comercial web y variables de entorno documentadas.

---

## Entregables backend

| Archivo / carpeta | Acción |
|-------------------|--------|
| `app/Domains/Tienda/` | Crear estructura base + README |
| `app/Domains/Tienda/TiendaServiceProvider.php` | Registrar en `bootstrap/providers.php` |
| `config/database.php` | Conexión Redis `cart` |
| `.env.example` | `REDIS_CART_DB=2` |
| `database/seeders/TiendaRolesSeeder.php` | Rol Cliente + permisos |
| `database/seeders/TiposFlujoComercialSeeder.php` | Agregar `compra_web` (si P11 = sí) |
| `database/seeders/DatabaseSeeder.php` | Llamar `TiendaRolesSeeder` |

---

## Estructura de carpetas `app/Domains/Tienda/`

```txt
app/Domains/Tienda/
├── README.md
├── TiendaServiceProvider.php
├── Catalogo/
├── Carrito/
├── Checkout/
├── Cuenta/
├── PedidosWeb/
├── PagosWeb/
├── Facturacion/
├── Enums/
└── Shared/
```

---

## Redis — conexión `cart`

### Configuración

| Variable | Valor default | Descripción |
|----------|---------------|-------------|
| `REDIS_CART_DB` | `2` | Índice lógico Redis (no es otra BD PostgreSQL) |
| `REDIS_CART_PREFIX` | `akinomass:cart:` | Prefijo de claves (opcional) |
| `REDIS_CART_TTL_GUEST` | `1209600` | 14 días en segundos |
| `REDIS_CART_TTL_USER` | `2592000` | 30 días |

### Bloque en `config/database.php`

```php
'cart' => [
    'url' => env('REDIS_URL'),
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'password' => env('REDIS_PASSWORD'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_CART_DB', '2'),
],
```

### Convención de claves

| Patrón | Uso |
|--------|-----|
| `{prefix}guest:{session_id}` | Carrito invitado |
| `{prefix}user:{user_id}` | Carrito usuario logueado |

---

## Rol y permisos Spatie

### Rol nuevo

| Rol | Guard | Descripción |
|-----|-------|-------------|
| `Cliente` | `web` | Comprador tienda online |

### Permisos nuevos

| Permiso | Descripción |
|---------|-------------|
| `tienda.ver` | Ver catálogo y producto |
| `carrito.ver` | Ver carrito propio |
| `carrito.gestionar` | Agregar, quitar, actualizar cantidades |
| `checkout.iniciar` | Iniciar sesión checkout |
| `checkout.completar` | Finalizar compra |
| `cuenta.ver` | Ver área cliente |
| `cuenta.ver_pedidos` | Listar pedidos propios |
| `cuenta.ver_pedido` | Detalle pedido propio |
| `cuenta.gestionar_direcciones` | CRUD direcciones |

### Matriz rol → permisos

| Permiso | Cliente |
|---------|:-------:|
| `tienda.ver` | ✓ |
| `carrito.*` | ✓ |
| `checkout.*` | ✓ |
| `cuenta.*` | ✓ |
| `dashboard.ver` | ✗ |
| `pedidos.crear` (admin) | ✗ |

**Condición:** middleware `role:Cliente` en rutas tienda; staff mantiene roles actuales.

---

## Seeder tipo flujo `compra_web` (opcional)

| Campo | Valor |
|-------|-------|
| `nombre_tip` | Compra web |
| `codigo_tip` | `compra_web` |
| `activo_tip` | `true` |

Canal existente a usar: `codigo_can = web` (ya en `CanalesVentaSeeder`).

---

## Middleware y rutas (esqueleto)

| Middleware alias | Clase sugerida |
|------------------|---------------|
| `cliente` | `EnsureUserIsCliente` |
| `staff` | Existente o `EnsureUserIsStaff` |

Archivo vacío: `routes/tienda.php` incluido desde `bootstrap/app.php` o `routes/web.php`.

---

## Condiciones / restricciones

| # | Condición |
|---|-----------|
| 1 | No crear tablas SQL en este sprint (solo config + seeders + carpetas) |
| 2 | No modificar permisos de roles staff existentes |
| 3 | `TiendaRolesSeeder` idempotente (`firstOrCreate`) |
| 4 | Documentar en `app/Domains/Tienda/README.md` |

---

## Criterios de aceptación

- [ ] `php artisan db:seed --class=TiendaRolesSeeder` sin error.
- [ ] Rol `Cliente` visible en BD (`roles`).
- [ ] `Redis::connection('cart')->ping()` o `set/get` de prueba en tinker.
- [ ] `REDIS_CART_DB` documentado en `.env.example`.
- [ ] Estructura `app/Domains/Tienda/` creada.
- [ ] `php artisan config:clear` sin error.

---

## Comandos verificación

```bash
php artisan db:seed --class=TiendaRolesSeeder
php artisan tinker
# >>> \Illuminate\Support\Facades\Redis::connection('cart')->set('test', 'ok');
# >>> \Illuminate\Support\Facades\Redis::connection('cart')->get('test');
```

---

## Estimación tareas

| Tarea | Horas |
|-------|-------|
| Estructura dominio + provider | 2 |
| Redis config + doc | 2 |
| TiendaRolesSeeder | 2 |
| Middleware esqueleto + routes file | 2 |
| PR + revisión | 2 |
| **Total** | **~10h** |
