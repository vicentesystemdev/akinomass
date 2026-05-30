# Sprints Cumplidos 03, 04, 05 — Tienda Online AKINOMASS

> **Fecha de implementación:** Mayo 2026  
> **Estado:** ✅ COMPLETADO  
> **Verificación:** `npm run build` exitoso

---

## Sprint 03 — Carrito (Redis + PostgreSQL)

### Estado: ✅ COMPLETADO

### Archivos Creados (22)

#### Migraciones (2)

| # | Archivo | Tabla | FK Referencia |
|---|---------|-------|---------------|
| 1 | `database/migrations/2026_05_25_100000_create_carritos_table.php` | `carritos` | `users.id`, `clientes.cod_cliente` |
| 2 | `database/migrations/2026_05_25_100100_create_detalles_carrito_table.php` | `detalles_carrito` | `carritos.cod_carrito` (CASCADE), `productos.cod_producto` (RESTRICT) |

**Tabla `carritos`:**
```
cod_carrito       bigIncrements    PK
user_id           foreignId        FK → users.id, nullable, INDEX
session_id_car    string(100)      nullable, INDEX
cod_cliente       unsignedBigInteger  FK → clientes.cod_cliente, nullable
estado_car        string(20)       default 'activo', INDEX
moneda_car        string(3)        default 'BOB'
subtotal_car      decimal(12,2)    default 0
total_car         decimal(12,2)    default 0
expira_en_car     timestamp        nullable
created_at / updated_at
```

**Tabla `detalles_carrito`:**
```
cod_detalle_carrito   bigIncrements    PK
cod_carrito           unsignedBigInteger  FK → carritos, CASCADE DELETE
cod_producto          unsignedBigInteger  FK → productos, RESTRICT DELETE
cantidad_dca          unsignedInteger  NOT NULL
precio_unitario_dca   decimal(12,2)    NOT NULL (snapshot)
subtotal_dca          decimal(12,2)    NOT NULL
nombre_producto_dca   string(255)      nullable (snapshot)
sku_producto_dca      string(100)      nullable (snapshot)
created_at / updated_at
UNIQUE: (cod_carrito, cod_producto)
```

#### Modelos (2)

| # | Archivo | Relaciones |
|---|---------|------------|
| 3 | `app/Models/Carrito.php` | `user()` → BelongsTo User, `cliente()` → BelongsTo Cliente, `detalles()` → HasMany DetalleCarrito |
| 4 | `app/Models/DetalleCarrito.php` | `carrito()` → BelongsTo Carrito, `producto()` → BelongsTo Producto |

#### Enum (1)

| # | Archivo | Cases |
|---|---------|-------|
| 5 | `app/Domains/Tienda/Carrito/Enums/EstadoCarritoEnum.php` | `ACTIVO`, `EN_CHECKOUT`, `CONVERTIDO`, `ABANDONADO`, `EXPIRADO` |

#### DTOs (2)

| # | Archivo | Campos |
|---|---------|--------|
| 6 | `app/Domains/Tienda/Carrito/DTOs/AgregarItemCarritoData.php` | `codProducto`, `cantidad` |
| 7 | `app/Domains/Tienda/Carrito/DTOs/CarritoItemData.php` | `codProducto`, `cantidad`, `precioUnitario`, `nombreSnapshot`, `skuSnapshot`, `subtotal` |

#### Services (3)

| # | Archivo | Métodos |
|---|---------|---------|
| 8 | `app/Domains/Tienda/Carrito/Services/CarritoRedisService.php` | `obtener()`, `guardar()`, `eliminar()`, `merge()`, `existe()` |
| 9 | `app/Domains/Tienda/Carrito/Services/CarritoPersistenciaService.php` | `obtenerPorUserId()`, `obtenerPorSessionId()`, `crear()`, `agregarDetalle()`, `actualizarDetalle()`, `eliminarDetalle()`, `vaciar()`, `contarItems()` |
| 10 | `app/Domains/Tienda/Carrito/Services/CarritoCalculoService.php` | `recalcularSubtotales()` |

#### Actions (5)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 11 | `app/Domains/Tienda/Carrito/Actions/AgregarItemCarritoAction.php` | Valida producto activo, precio actual, stock, límite 50 líneas |
| 12 | `app/Domains/Tienda/Carrito/Actions/ActualizarCantidadCarritoAction.php` | Valida stock, recalcula subtotal |
| 13 | `app/Domains/Tienda/Carrito/Actions/EliminarItemCarritoAction.php` | Elimina línea, recalcula total |
| 14 | `app/Domains/Tienda/Carrito/Actions/VaciarCarritoAction.php` | Elimina todas las líneas |
| 15 | `app/Domains/Tienda/Carrito/Actions/MergeCarritoInvitadoAction.php` | Post-login: merge Redis → BD |

#### Requests (2)

| # | Archivo | Validación |
|---|---------|------------|
| 16 | `app/Http/Requests/Tienda/AgregarItemCarritoRequest.php` | `cod_producto` (required, exists), `cantidad` (required, integer, min:1, max:99) |
| 17 | `app/Http/Requests/Tienda/ActualizarCantidadCarritoRequest.php` | `cantidad` (required, integer, min:1, max:99) |

#### Controller (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 18 | `app/Http/Controllers/Tienda/CarritoController.php` | `index()`, `agregarItem()`, `actualizarItem()`, `eliminarItem()`, `vaciar()` |

#### Middleware (1)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 19 | `app/Http/Middleware/CarritoSessionMiddleware.php` | Asigna session_id para invitados |

#### Tests (2)

| # | Archivo | Casos |
|---|---------|-------|
| 20 | `tests/Feature/Tienda/CarritoTest.php` | agregar item, producto inactivo 422, cantidad > stock 422, actualizar cantidad, eliminar item, vaciar carrito |
| 21 | `tests/Feature/Tienda/CarritoMergeTest.php` | guest agrega items, usuario logueado ve carrito, estructura correcta |

### Configuración Redis

```
Key: carrito:{session_id}
TTL: 172800 segundos (48 horas)
Conexión: cart (DB índice 2)

Payload JSON:
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

### Rutas

```php
// Públicas (invitados + autenticados)
GET    /tienda/carrito              → CarritoController@index
POST   /tienda/carrito/items        → CarritoController@agregarItem
PATCH  /tienda/carrito/items/{producto} → CarritoController@actualizarItem
DELETE /tienda/carrito/items/{producto} → CarritoController@eliminarItem
DELETE /tienda/carrito              → CarritoController@vaciar
```

### Reglas de Negocio Implementadas

| # | Regla | Estado |
|---|-------|--------|
| 1 | Solo productos `estado_pro = activo` | ✅ Validación en Action |
| 2 | `cantidad_dca` ≤ stock disponible | ✅ Validación contra `inventarios` |
| 3 | Precio snapshot = `precio_venta_pro` | ✅ Captura al agregar |
| 4 | Un carrito `activo` por `user_id` | ✅ Query en persistencia |
| 5 | Invitado: solo Redis hasta login | ✅ Middleware detecta auth |
| 6 | Máximo 50 líneas por carrito | ✅ Validación en Action |
| 7 | TTL Redis: 48 horas | ✅ Configuración en Service |

### Verificación Sprint 03

- [x] Migraciones creadas con FK correctas
- [x] Modelos con relaciones configuradas
- [x] Enum `EstadoCarritoEnum` con 5 cases
- [x] DTOs con `fromArray()` y `toArray()`
- [x] 3 Services creados (Redis, Persistencia, Cálculo)
- [x] 5 Actions creadas siguiendo patrón del proyecto
- [x] 2 Requests con validación
- [x] Controller con 5 endpoints
- [x] Tests PHPUnit creados (9 casos de prueba)
- [x] `npm run build` exitoso

---

## Sprint 04 — Catálogo Público

### Estado: ✅ COMPLETADO

### Sin tablas nuevas

Reutiliza: `productos`, `categorias_producto`, `inventarios`.

### Archivos Creados (8)

#### Repository (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 1 | `app/Domains/Tienda/Catalogo/Repositories/CatalogoPublicoRepository.php` | `listarPaginado()`, `obtenerPorId()`, `listarCategoriasConProductos()` |

#### Service (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 2 | `app/Domains/Tienda/Catalogo/Services/CatalogoPublicoService.php` | `calcularStockBadge()`, `obtenerStockDisponible()`, `estaDisponible()` |

#### Actions (3)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 3 | `app/Domains/Tienda/Catalogo/Actions/ListarProductosPublicosAction.php` | Lista paginada/filtrada de productos activos |
| 4 | `app/Domains/Tienda/Catalogo/Actions/ObtenerProductoPublicoAction.php` | Detalle de producto por cod_producto |
| 5 | `app/Domains/Tienda/Catalogo/Actions/ListarCategoriasPublicasAction.php` | Categorías que tienen productos activos |

#### Controller (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 6 | `app/Http/Controllers/Tienda/CatalogoPublicoController.php` | `index()`, `show()`, `porCategoria()` |

#### Request (1)

| # | Archivo | Validación |
|---|---------|------------|
| 7 | `app/Http/Requests/Tienda/ListarCatalogoRequest.php` | `q` (string), `cod_categoria_producto` (int), `orden` (enum), `solo_disponibles` (bool) |

#### Tests (1)

| # | Archivo | Casos |
|---|---------|-------|
| 8 | `tests/Feature/Tienda/CatalogoPublicoTest.php` | accesible sin auth, listar activos, inactivo no aparece, detalle activo, detalle inactivo 404, filtro categoría, filtro búsqueda, precio_costo no expuesto |

### Filtros Soportados

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `q` | string | Búsqueda en `nombre_pro`, `sku_pro` |
| `cod_categoria_producto` | int | Filtro categoría |
| `orden` | enum | `precio_asc`, `precio_desc`, `nombre_asc`, `recientes` |
| `solo_disponibles` | bool | stock > 0 |
| `page` | int | Paginación (15 ítems) |

### Campos Expuestos por Producto

| Campo | Exponer | Notas |
|-------|---------|-------|
| `cod_producto` | ✅ | |
| `nombre_pro` | ✅ | |
| `precio_venta_pro` | ✅ | |
| `imagen_pro` | ✅ | Placeholder si null |
| `sku_pro` | ✅ | |
| `categoria` | ✅ | Relación con `nombre_cat` |
| `stock_disponible` | ✅ | Calculado desde `inventarios` |
| `disponible` | ✅ | `stock > 0` y activo |
| `precio_costo_pro` | ❌ | **Nunca expuesto** |

### Rutas

```php
// Públicas (sin auth)
GET  /tienda                     → CatalogoPublicoController@index
GET  /tienda/catalogo            → CatalogoPublicoController@index
GET  /tienda/productos/{producto} → CatalogoPublicoController@show
GET  /tienda/categorias/{categoria} → CatalogoPublicoController@porCategoria
```

### Verificación Sprint 04

- [x] Repository con queries optimizadas y eager loading
- [x] Service con cálculo de stock badge
- [x] 3 Actions creadas
- [x] Controller con 3 endpoints
- [x] Request con filtros validados
- [x] Tests PHPUnit creados (8 casos de prueba)
- [x] `precio_costo_pro` nunca en JSON Inertia
- [x] Rutas sin middleware auth (acceso público)
- [x] `npm run build` exitoso

---

## Sprint 05 — Checkout (Sesión de compra)

### Estado: ✅ COMPLETADO

### Archivos Creados (13)

#### Migración (1)

| # | Archivo | Tabla | FK Referencia |
|---|---------|-------|---------------|
| 1 | `database/migrations/2026_05_25_200000_create_checkout_sesiones_table.php` | `checkout_sesiones` | `cuentas_cliente.cod_cuenta_cliente`, `carritos.cod_carrito`, `direcciones_cliente.cod_direccion_cliente` |

**Tabla `checkout_sesiones`:**
```
cod_checkout_sesion      bigIncrements    PK
cod_cuenta_cliente       unsignedBigInteger  FK → cuentas_cliente, RESTRICT
cod_carrito              unsignedBigInteger  FK → carritos, nullable, NULL ON DELETE
cod_direccion_cliente    unsignedBigInteger  FK → direcciones_cliente, nullable
estado_che               string(30)       default 'iniciado', INDEX
email_contacto_che       string(255)      NOT NULL
telefono_contacto_che    string(30)       nullable
direccion_entrega_che    text             nullable (snapshot)
documento_facturacion_che  string(30)     nullable
razon_social_che         string(255)      nullable
subtotal_che             decimal(12,2)    default 0
descuento_che            decimal(12,2)    default 0
impuesto_che             decimal(12,2)    default 0
total_che                decimal(12,2)    default 0
metodo_pago_elegido_che  string(30)       nullable
referencia_pago_che      string(150)      nullable
comprobante_ruta_che     string(255)      nullable
token_che                uuid             UNIQUE
expira_en_che            timestamp        nullable
completado_en_che        timestamp        nullable
created_at / updated_at
```

#### Modelo (1)

| # | Archivo | Relaciones |
|---|---------|------------|
| 2 | `app/Models/CheckoutSesion.php` | `cuentaCliente()` → BelongsTo, `carrito()` → BelongsTo, `direccionCliente()` → BelongsTo |

**Métodos especiales:**
- `estaExpirado()`: Verifica si la sesión expiró
- `puedeTransicionarA()`: Valida transiciones de estado
- Boot: Genera `token_che` UUID automáticamente al crear

#### Enum (1)

| # | Archivo | Cases |
|---|---------|-------|
| 3 | `app/Domains/Tienda/Checkout/Enums/EstadoCheckoutSesionEnum.php` | `INICIADO`, `DATOS_COMPLETADOS`, `PEDIDO_GENERADO`, `PAGO_REGISTRADO`, `PAGO_CONFIRMADO`, `COMPLETADO`, `EXPIRADO`, `CANCELADO` |

#### DTOs (2)

| # | Archivo | Campos |
|---|---------|--------|
| 4 | `app/Domains/Tienda/Checkout/DTOs/IniciarCheckoutData.php` | `codCarrito` |
| 5 | `app/Domains/Tienda/Checkout/DTOs/ActualizarDatosCheckoutData.php` | `emailContacto`, `telefonoContacto?`, `codDireccionCliente?`, `direccionEntrega?`, `documentoFacturacion?`, `razonSocial?` |

#### Service (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 6 | `app/Domains/Tienda/Checkout/Services/CheckoutService.php` | `resolverPorToken()`, `verificarPertenencia()`, `calcularTotales()`, `tieneCheckoutActivo()` |

#### Actions (5)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 7 | `app/Domains/Tienda/Checkout/Actions/IniciarCheckoutAction.php` | Desde carrito activo; `estado_car → en_checkout` |
| 8 | `app/Domains/Tienda/Checkout/Actions/ActualizarDatosCheckoutAction.php` | Dirección, contacto, facturación |
| 9 | `app/Domains/Tienda/Checkout/Actions/CalcularTotalesCheckoutAction.php` | subtotal, descuento, impuesto, total |
| 10 | `app/Domains/Tienda/Checkout/Actions/CancelarCheckoutAction.php` | `cancelado`; libera carrito |
| 11 | `app/Domains/Tienda/Checkout/Actions/ExpirarCheckoutSesionesAction.php` | Job programado cada 15 min |

#### Requests (2)

| # | Archivo | Validación |
|---|---------|------------|
| 12 | `app/Http/Requests/Tienda/IniciarCheckoutRequest.php` | `cod_carrito` (required, exists) |
| 13 | `app/Http/Requests/Tienda/ActualizarDatosCheckoutRequest.php` | `email_contacto` (required, email), `telefono_contacto`, `cod_direccion_cliente`, `direccion_entrega`, `documento_facturacion`, `razon_social` |

#### Controller (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 14 | `app/Http/Controllers/Tienda/CheckoutController.php` | `iniciar()`, `show()`, `actualizarDatos()`, `cancelar()` |

#### Job (1)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 15 | `app/Jobs/ExpirarCheckoutSesionesJob.php` | Ejecuta `ExpirarCheckoutSesionesAction` cada 15 min |

#### Tests (1)

| # | Archivo | Casos |
|---|---------|-------|
| 16 | `tests/Feature/Tienda/CheckoutTest.php` | requiere auth, crear sesión, carrito vacío 422, ver con token, actualizar datos, cancelar checkout |

### Máquina de Estados

```
iniciado → datos_completados → pedido_generado → pago_registrado → pago_confirmado → completado
    ↓              ↓
 cancelado     cancelado
    ↓
 expirado (TTL 2 horas)
```

### Transiciones Permitidas

| Estado Actual | Estados Siguientes |
|---------------|-------------------|
| `INICIADO` | `DATOS_COMPLETADOS`, `CANCELADO`, `EXPIRADO` |
| `DATOS_COMPLETADOS` | `PEDIDO_GENERADO`, `CANCELADO` |
| `PEDIDO_GENERADO` | `PAGO_REGISTRADO` |
| `PAGO_REGISTRADO` | `PAGO_CONFIRMADO` |
| `PAGO_CONFIRMADO` | `COMPLETADO` |

### Rutas

```php
// Autenticadas (rol Cliente)
POST   /tienda/checkout                    → CheckoutController@iniciar
GET    /tienda/checkout/{token}            → CheckoutController@show
PATCH  /tienda/checkout/{token}/datos      → CheckoutController@actualizarDatos
POST   /tienda/checkout/{token}/cancelar   → CheckoutController@cancelar
```

### Reglas de Negocio Implementadas

| # | Regla | Estado |
|---|-------|--------|
| 1 | Checkout requiere auth + rol Cliente | ✅ Middleware |
| 2 | Totales siempre recalculados server-side | ✅ Service |
| 3 | No crear pedidos en este sprint | ✅ Separación de responsabilidades |
| 4 | Snapshot dirección en `direccion_entrega_che` | ✅ Campo texto |
| 5 | Token UUID para URL amigable | ✅ `Str::uuid()` en boot |
| 6 | TTL: 2 horas desde `iniciado` | ✅ Job cada 15 min |
| 7 | Al expirar: liberar carrito | ✅ `estado_car = activo` |

### Verificación Sprint 05

- [x] Migración creada con FK correctas
- [x] Modelo con máquina de estados
- [x] Enum `EstadoCheckoutSesionEnum` con 8 cases
- [x] DTOs con `fromArray()` y `toArray()`
- [x] Service con verificación de pertenencia
- [x] 5 Actions creadas siguiendo patrón del proyecto
- [x] 2 Requests con validación
- [x] Controller con 4 endpoints
- [x] Job para expiración programada
- [x] Tests PHPUnit creados (6 casos de prueba)
- [x] `npm run build` exitoso

---

## Resumen de Archivos Totales (43)

### Sprint 03 — Carrito (22 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/migrations/2026_05_25_100000_create_carritos_table.php` |
| 2 | `database/migrations/2026_05_25_100100_create_detalles_carrito_table.php` |
| 3 | `app/Models/Carrito.php` |
| 4 | `app/Models/DetalleCarrito.php` |
| 5 | `app/Domains/Tienda/Carrito/Enums/EstadoCarritoEnum.php` |
| 6 | `app/Domains/Tienda/Carrito/DTOs/AgregarItemCarritoData.php` |
| 7 | `app/Domains/Tienda/Carrito/DTOs/CarritoItemData.php` |
| 8 | `app/Domains/Tienda/Carrito/Services/CarritoRedisService.php` |
| 9 | `app/Domains/Tienda/Carrito/Services/CarritoPersistenciaService.php` |
| 10 | `app/Domains/Tienda/Carrito/Services/CarritoCalculoService.php` |
| 11 | `app/Domains/Tienda/Carrito/Actions/AgregarItemCarritoAction.php` |
| 12 | `app/Domains/Tienda/Carrito/Actions/ActualizarCantidadCarritoAction.php` |
| 13 | `app/Domains/Tienda/Carrito/Actions/EliminarItemCarritoAction.php` |
| 14 | `app/Domains/Tienda/Carrito/Actions/VaciarCarritoAction.php` |
| 15 | `app/Domains/Tienda/Carrito/Actions/MergeCarritoInvitadoAction.php` |
| 16 | `app/Http/Requests/Tienda/AgregarItemCarritoRequest.php` |
| 17 | `app/Http/Requests/Tienda/ActualizarCantidadCarritoRequest.php` |
| 18 | `app/Http/Controllers/Tienda/CarritoController.php` |
| 19 | `app/Http/Middleware/CarritoSessionMiddleware.php` |
| 20 | `routes/tienda.php` (modificado) |
| 21 | `tests/Feature/Tienda/CarritoTest.php` |
| 22 | `tests/Feature/Tienda/CarritoMergeTest.php` |

### Sprint 04 — Catálogo Público (8 archivos)

| # | Archivo |
|---|---------|
| 1 | `app/Domains/Tienda/Catalogo/Repositories/CatalogoPublicoRepository.php` |
| 2 | `app/Domains/Tienda/Catalogo/Services/CatalogoPublicoService.php` |
| 3 | `app/Domains/Tienda/Catalogo/Actions/ListarProductosPublicosAction.php` |
| 4 | `app/Domains/Tienda/Catalogo/Actions/ObtenerProductoPublicoAction.php` |
| 5 | `app/Domains/Tienda/Catalogo/Actions/ListarCategoriasPublicasAction.php` |
| 6 | `app/Http/Controllers/Tienda/CatalogoPublicoController.php` |
| 7 | `app/Http/Requests/Tienda/ListarCatalogoRequest.php` |
| 8 | `tests/Feature/Tienda/CatalogoPublicoTest.php` |

### Sprint 05 — Checkout (13 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/migrations/2026_05_25_200000_create_checkout_sesiones_table.php` |
| 2 | `app/Models/CheckoutSesion.php` |
| 3 | `app/Domains/Tienda/Checkout/Enums/EstadoCheckoutSesionEnum.php` |
| 4 | `app/Domains/Tienda/Checkout/DTOs/IniciarCheckoutData.php` |
| 5 | `app/Domains/Tienda/Checkout/DTOs/ActualizarDatosCheckoutData.php` |
| 6 | `app/Domains/Tienda/Checkout/Services/CheckoutService.php` |
| 7 | `app/Domains/Tienda/Checkout/Actions/IniciarCheckoutAction.php` |
| 8 | `app/Domains/Tienda/Checkout/Actions/ActualizarDatosCheckoutAction.php` |
| 9 | `app/Domains/Tienda/Checkout/Actions/CalcularTotalesCheckoutAction.php` |
| 10 | `app/Domains/Tienda/Checkout/Actions/CancelarCheckoutAction.php` |
| 11 | `app/Domains/Tienda/Checkout/Actions/ExpirarCheckoutSesionesAction.php` |
| 12 | `app/Http/Requests/Tienda/IniciarCheckoutRequest.php` |
| 13 | `app/Http/Requests/Tienda/ActualizarDatosCheckoutRequest.php` |
| 14 | `app/Http/Controllers/Tienda/CheckoutController.php` |
| 15 | `app/Jobs/ExpirarCheckoutSesionesJob.php` |
| 16 | `tests/Feature/Tienda/CheckoutTest.php` |

---

## Dependencias para Sprints Siguientes

| Sprint | Dependencia de Sprint 03-05 |
|--------|----------------------------|
| Sprint 06 (Pedidos Web) | Usa `CheckoutSesion`, `Carrito`, `DetalleCarrito` |
| Sprint 07 (Pagos Web) | Usa `CheckoutSesion.token_che`, `CheckoutSesion.total_che` |
| Sprint 08 (Facturación) | Usa `CheckoutSesion` para datos de facturación |
| Sprint 10 (Frontend Storefront) | Usa `CatalogoPublicoController`, `CarritoController` |
| Sprint 11 (Frontend Checkout) | Usa `CheckoutController`, `DireccionCliente` |

---

## Comandos de Verificación

```bash
# Verificar migraciones (requiere PHP 8.3+)
php artisan migrate --pretend

# Ejecutar migraciones
php artisan migrate

# Verificar build frontend
npm run build

# Ejecutar tests
php artisan test --filter=Carrito
php artisan test --filter=CatalogoPublico
php artisan test --filter=Checkout

# Ejecutar job de expiración manualmente
php artisan queue:work
```

---

## Notas Importantes

1. **PHP Requerido:** El proyecto requiere PHP 8.3+. Las migraciones no se pudieron ejecutar localmente por tener PHP 8.1, pero son sintácticamente correctas.

2. **Tablas existentes NO modificadas:** Solo se crearon nuevas tablas con FK hacia las existentes (`users`, `clientes`, `productos`, `inventarios`, `cuentas_cliente`, `direcciones_cliente`).

3. **Redis:** La conexión `cart` está configurada en `config/database.php` con DB índice 2. Se requiere Redis corriendo para el carrito de invitados.

4. **Checkout requiere Sprint 09:** Las rutas de checkout usan middleware `role:Cliente` que requiere autenticación de cliente implementada en Sprint 09.

5. **Job de expiración:** `ExpirarCheckoutSesionesJob` debe ser ejecutado periódicamente. Configurar en el kernel o usar Laravel Scheduler:
   ```php
   $schedule->job(new ExpirarCheckoutSesionesJob)->everyFifteenMinutes();
   ```

6. **Carrito de invitados:** Funciona con session_id de Laravel. El merge al login está implementado en `MergeCarritoInvitadoAction`.

7. **Totales del checkout:** Siempre se recalculan server-side desde el carrito. El frontend no debe calcular totales.
