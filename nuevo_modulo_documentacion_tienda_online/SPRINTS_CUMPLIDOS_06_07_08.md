# Sprints Cumplidos 06, 07, 08 — Tienda Online AKINOMASS

> **Fecha de implementación:** Mayo 2026  
> **Estado:** ✅ COMPLETADO  
> **Verificación:** `npm run build` exitoso

---

## Sprint 06 — Pedidos Web (integración con pedidos existentes)

### Estado: ✅ COMPLETADO

### Archivos Creados (14)

#### Migración (1)

| # | Archivo | Tabla | FK Referencia |
|---|---------|-------|---------------|
| 1 | `database/migrations/2026_05_25_300000_create_pedidos_tienda_table.php` | `pedidos_tienda` | `pedidos.cod_pedido` (UNIQUE), `checkout_sesiones`, `users`, `cuentas_cliente` |

**Tabla `pedidos_tienda`:**
```
cod_pedido_tienda    bigIncrements    PK
cod_pedido           unsignedBigInteger  FK → pedidos, UNIQUE, CASCADE DELETE
cod_checkout_sesion  unsignedBigInteger  FK → checkout_sesiones, RESTRICT
user_id              foreignId        FK → users, CASCADE DELETE
cod_cuenta_cliente   unsignedBigInteger  FK → cuentas_cliente, RESTRICT
session_id_pte       string(100)      nullable
ip_origen_pte        string(45)       nullable
user_agent_pte       text             nullable
estado_pte           string(20)       default 'pendiente_pago', INDEX
created_at / updated_at
```

#### Modelo (1)

| # | Archivo | Relaciones |
|---|---------|------------|
| 2 | `app/Models/PedidoTienda.php` | `pedido()` → BelongsTo Pedido, `checkoutSesion()` → BelongsTo CheckoutSesion, `user()` → BelongsTo User, `cuentaCliente()` → BelongsTo CuentaCliente |

#### Enum (1)

| # | Archivo | Cases |
|---|---------|-------|
| 3 | `app/Domains/Tienda/PedidosWeb/Enums/EstadoPedidoTiendaEnum.php` | `PENDIENTE_PAGO`, `PAGADO`, `FACTURADO`, `CANCELADO` |

#### DTO (1)

| # | Archivo | Campos |
|---|---------|--------|
| 4 | `app/Domains/Tienda/PedidosWeb/DTOs/GenerarPedidoDesdeCheckoutData.php` | `codCheckoutSesion`, `sessionId?`, `ipOrigen?`, `userAgent?` |

#### Service (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 5 | `app/Domains/Tienda/PedidosWeb/Services/PedidoTiendaService.php` | `resolverCanalWeb()`, `resolverFlujoCompraWeb()`, `resolverCodCliente()`, `mapearDetallesCarritoParaPedido()` |

#### Actions (3)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 6 | `app/Domains/Tienda/PedidosWeb/Actions/GenerarPedidoDesdeCheckoutAction.php` | Orquesta creación de pedido desde checkout (10 pasos en transacción) |
| 7 | `app/Domains/Tienda/PedidosWeb/Actions/ListarPedidosClienteAction.php` | Lista pedidos por user_id |
| 8 | `app/Domains/Tienda/PedidosWeb/Actions/ObtenerPedidoClienteAction.php` | Detalle pedido si pertenece al cliente |

#### Request (1)

| # | Archivo | Validación |
|---|---------|------------|
| 9 | `app/Http/Requests/Tienda/GenerarPedidoRequest.php` | `cod_checkout_sesion` (required, integer, exists) |

#### Controller (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 10 | `app/Http/Controllers/Tienda/PedidoWebController.php` | `index()`, `show()`, `generar()` |

#### Policy (1)

| # | Archivo | Regla |
|---|---------|-------|
| 11 | `app/Policies/PedidoTiendaPolicy.php` | Verifica `user_id` coincide con `PedidoTienda.user_id` |

#### Event (1)

| # | Archivo | Propiedad |
|---|---------|-----------|
| 12 | `app/Domains/Tienda/PedidosWeb/Events/PedidoWebGeneradoEvent.php` | `$pedidoTienda` |

#### Listener (1)

| # | Archivo | Acción |
|---|---------|--------|
| 13 | `app/Domains/Tienda/PedidosWeb/Listeners/ActualizarCheckoutTrasPedidoListener.php` | Actualiza `checkout.estado_che = pedido_generado` |

#### Tests (1)

| # | Archivo | Casos |
|---|---------|-------|
| 14 | `tests/Feature/Tienda/PedidoWebTest.php` | requiere auth, crear pedido_tienda, checkout sin datos completados falla, listar pedidos, ver pedido |

### Action Principal: `GenerarPedidoDesdeCheckoutAction`

```
1. Validar checkout_sesiones.estado_che = datos_completados
2. Validar stock por línea carrito
3. Mapear carrito → array detalles para CrearPedidoAction
4. Resolver cod_cliente desde cuentas_cliente
5. Resolver canal 'web' y flujo 'compra_web'
6. Llamar CrearPedidoAction::execute($data, null)
7. Insert pedidos_tienda
8. Actualizar checkout estado_che = pedido_generado
9. estado_car = convertido
10. Disparar PedidoWebGeneradoEvent
```

### Reutilización de Componentes Existentes

| Componente | Acción |
|------------|--------|
| `CrearPedidoAction` | Crea pedido en estado BORRADOR con detalles |
| `PedidoService` | calcularTotales, generarNumeroPedido |
| Canal `web` | Resuelto desde `CanalesVentaSeeder` |
| Flujo `compra_web` | Resuelto desde `TiposFlujoComercialSeeder` |

### Rutas

```php
POST /tienda/checkout/{token}/generar-pedido → PedidoWebController@generar
GET  /tienda/mis-pedidos                    → PedidoWebController@index
GET  /tienda/mis-pedidos/{pedido}           → PedidoWebController@show
```

### Verificación Sprint 06

- [x] Migración creada con FK correctas
- [x] Modelo con 4 relaciones BelongsTo
- [x] Enum `EstadoPedidoTiendaEnum` con 4 cases
- [x] DTO con `fromArray()` y `toArray()`
- [x] Service con helpers para resolver canales y mapear detalles
- [x] 3 Actions creadas (generar, listar, obtener)
- [x] Request con validación
- [x] Controller con 3 endpoints
- [x] Policy con verificación de pertenencia
- [x] Event + Listener para comunicación entre dominios
- [x] Tests PHPUnit creados (5 casos de prueba)
- [x] `npm run build` exitoso

---

## Sprint 07 — Pagos Web

### Estado: ✅ COMPLETADO

### Archivos Creados (14)

#### Migración (1)

| # | Archivo | Tabla | FK Referencia |
|---|---------|-------|---------------|
| 1 | `database/migrations/2026_05_25_400000_create_pagos_tienda_table.php` | `pagos_tienda` | `pagos.cod_pago` (UNIQUE), `checkout_sesiones`, `users` |

**Tabla `pagos_tienda`:**
```
cod_pago_tienda              bigIncrements    PK
cod_pago                     unsignedBigInteger  FK → pagos, UNIQUE, CASCADE DELETE
cod_checkout_sesion          unsignedBigInteger  FK → checkout_sesiones, RESTRICT
user_id                      foreignId        FK → users, nullable, NULL ON DELETE
comprobante_ruta_pwe         string(255)      nullable
comprobante_hash_pwe         string(64)       nullable
banco_origen_pwe             string(100)      nullable
fecha_subida_comprobante_pwe timestamp        nullable
intentos_pago_pwe            unsignedTinyInteger  default 0
metadata_pwe                 json             nullable
created_at / updated_at
```

#### Modelo (1)

| # | Archivo | Relaciones |
|---|---------|------------|
| 2 | `app/Models/PagoTienda.php` | `pago()` → BelongsTo Pago, `checkoutSesion()` → BelongsTo CheckoutSesion, `user()` → BelongsTo User |

#### DTO (1)

| # | Archivo | Campos |
|---|---------|--------|
| 3 | `app/Domains/Tienda/PagosWeb/DTOs/RegistrarPagoDesdeCheckoutData.php` | `codCheckoutSesion`, `metodoPagoPag`, `referenciaPag?`, `bancoOrigen?` |

#### Service (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 4 | `app/Domains/Tienda/PagosWeb/Services/PagoTiendaService.php` | `resolverPedidoTienda()`, `guardarComprobante()` |

#### Actions (2)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 5 | `app/Domains/Tienda/PagosWeb/Actions/RegistrarPagoDesdeCheckoutAction.php` | Registra pago + comprobante + actualiza estados |
| 6 | `app/Domains/Tienda/PagosWeb/Actions/ObtenerPagoClienteAction.php` | Obtiene pago por pedido y user_id |

#### Request (1)

| # | Archivo | Validación |
|---|---------|------------|
| 7 | `app/Http/Requests/Tienda/RegistrarPagoCheckoutRequest.php` | `cod_checkout_sesion`, `metodo_pago_pag` (in:qr,transferencia,efectivo,deposito,otro), `referencia_pag?`, `banco_origen?`, `comprobante?` (file, max:5120, mimes:jpg,jpeg,png,pdf) |

#### Controller (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 8 | `app/Http/Controllers/Tienda/PagoWebController.php` | `registrar()`, `show()` |

#### Events (2)

| # | Archivo | Propiedad |
|---|---------|-----------|
| 9 | `app/Domains/Tienda/PagosWeb/Events/PagoWebRegistradoEvent.php` | `$pagoTienda` |
| 10 | `app/Domains/Comercial/Pagos/Events/PagoConfirmadoEvent.php` | `$pago` |

#### Listeners (2)

| # | Archivo | Acción |
|---|---------|--------|
| 11 | `app/Domains/Tienda/PagosWeb/Listeners/ActualizarEstadoTrasPagoConfirmadoListener.php` | `pedidos_tienda.estado_pte = pagado` + `checkout.estado_che = pago_confirmado` |
| 12 | `app/Domains/Tienda/PagosWeb/Listeners/ConfirmarPedidoTrasPagoWebListener.php` | Llama `ConfirmarPedidoAction` (descuenta stock) |

#### Tests (1)

| # | Archivo | Casos |
|---|---------|-------|
| 13 | `tests/Feature/Tienda/PagoWebTest.php` | requiere auth, crear pago_tienda, método inválido falla, ver pago |

### Action Principal: `RegistrarPagoDesdeCheckoutAction`

```
1. Validar pedido existe y estado_pte = pendiente_pago
2. RegistrarPagoAction::execute([...], userId)
3. estado_pago_pag = pendiente
4. monto_pag = checkout.total_che
5. metodo_pago_pag desde metodo_pago_elegido_che
6. Insert pagos_tienda
7. Guardar comprobante en storage/app/comprobantes/{cod_pago}/
8. checkout.estado_che = pago_registrado
9. Disparar PagoWebRegistradoEvent
```

### Subida de Archivo

| Regla | Valor |
|-------|-------|
| Disco | `local` |
| Max size | 5 MB |
| MIME | jpg, jpeg, png, pdf |
| Nombre | `hash_sha256 + extensión` |
| Ruta | `storage/app/comprobantes/{cod_pago}/` |

### Reutilización de Componentes Existentes

| Componente | Acción |
|------------|--------|
| `RegistrarPagoAction` | Crea pago en estado PENDIENTE |
| `PagoService` | validarEdicion, cambiarEstado |
| `ConfirmarPagoAction` | Cambia estado a PAGADO (staff admin) |

### Events/Listeners

| Evento | Listener | Acción |
|--------|----------|--------|
| `PagoConfirmadoEvent` | `ActualizarEstadoTrasPagoConfirmadoListener` | Sincroniza estados pedido_tienda + checkout |
| `PagoConfirmadoEvent` | `ConfirmarPedidoTrasPagoWebListener` | Confirma pedido automáticamente |

### Rutas

```php
POST /tienda/checkout/{token}/pago       → PagoWebController@registrar
GET  /tienda/mis-pedidos/{pedido}/pago   → PagoWebController@show
```

### Verificación Sprint 07

- [x] Migración creada con FK correctas
- [x] Modelo con 3 relaciones BelongsTo
- [x] DTO con `fromArray()` y `toArray()`
- [x] Service con helpers para resolver pedido y guardar comprobante
- [x] 2 Actions creadas (registrar, obtener)
- [x] Request con validación de archivo
- [x] Controller con 2 endpoints
- [x] 2 Events creados para comunicación entre dominios
- [x] 2 Listeners para sincronización automática
- [x] Tests PHPUnit creados (4 casos de prueba)
- [x] `npm run build` exitoso

---

## Sprint 08 — Facturación (comprobantes)

### Estado: ✅ COMPLETADO

### Archivos Creados (16)

#### Migraciones (2)

| # | Archivo | Tabla | FK Referencia |
|---|---------|-------|---------------|
| 1 | `database/migrations/2026_05_25_500000_create_facturas_table.php` | `facturas` | `pedidos.cod_pedido` (UNIQUE), `pagos.cod_pago`, `checkout_sesiones`, `users` |
| 2 | `database/migrations/2026_05_25_500100_create_detalles_factura_table.php` | `detalles_factura` | `facturas.cod_factura` (CASCADE), `productos.cod_producto`, `detalles_pedido.cod_detalle_pedido` |

**Tabla `facturas`:**
```
cod_factura                  bigIncrements    PK
cod_pedido                   unsignedBigInteger  FK → pedidos, UNIQUE, CASCADE DELETE
cod_pago                     unsignedBigInteger  FK → pagos, nullable
cod_checkout_sesion          unsignedBigInteger  FK → checkout_sesiones, nullable
numero_factura_fac           string(30)       UNIQUE
tipo_comprobante_fac         string(20)       default 'recibo', INDEX
estado_fac                   string(20)       default 'borrador', INDEX
fecha_emision_fac            date             NOT NULL
documento_cliente_fac        string(30)       NOT NULL (snapshot)
razon_social_cliente_fac     string(255)      NOT NULL (snapshot)
direccion_fiscal_fac         text             nullable
subtotal_fac                 decimal(12,2)    NOT NULL
descuento_fac                decimal(12,2)    default 0
impuesto_fac                 decimal(12,2)    default 0
total_fac                    decimal(12,2)    NOT NULL
moneda_fac                   string(3)        default 'BOB'
codigo_control_fac           string(100)      nullable (fiscal futuro)
observacion_fac              text             nullable
emitida_por_user_id          foreignId        FK → users, nullable
anulada_en_fac               timestamp        nullable
created_at / updated_at
```

**Tabla `detalles_factura`:**
```
cod_detalle_factura   bigIncrements    PK
cod_factura           unsignedBigInteger  FK → facturas, CASCADE DELETE
cod_producto          unsignedBigInteger  FK → productos, nullable
cod_detalle_pedido    unsignedBigInteger  FK → detalles_pedido, nullable
descripcion_dfa       string(255)      NOT NULL
cantidad_dfa          unsignedInteger  NOT NULL
precio_unitario_dfa   decimal(12,2)    NOT NULL
subtotal_dfa          decimal(12,2)    NOT NULL
created_at / updated_at
```

#### Modelos (2)

| # | Archivo | Relaciones |
|---|---------|------------|
| 3 | `app/Models/Factura.php` | `pedido()`, `pago()`, `checkoutSesion()`, `emitidaPor()`, `detalles()` |
| 4 | `app/Models/DetalleFactura.php` | `factura()`, `producto()`, `detallePedido()` |

#### Enums (2)

| # | Archivo | Cases |
|---|---------|-------|
| 5 | `app/Domains/Tienda/Facturacion/Enums/EstadoFacturaEnum.php` | `BORRADOR`, `EMITIDA`, `ANULADA` |
| 6 | `app/Domains/Tienda/Facturacion/Enums/TipoComprobanteEnum.php` | `FACTURA`, `RECIBO`, `NOTA_CREDITO` |

#### Service (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 7 | `app/Domains/Tienda/Facturacion/Services/GenerarNumeroFacturaService.php` | `generar()` → formato `FAC-{YYYY}-{000001}` |

#### Actions (3)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 8 | `app/Domains/Tienda/Facturacion/Actions/EmitirFacturaDesdePedidoAction.php` | Crea factura + líneas desde detalles_pedido |
| 9 | `app/Domains/Tienda/Facturacion/Actions/AnularFacturaAction.php` | `estado_fac = anulada` |
| 10 | `app/Domains/Tienda/Facturacion/Actions/ObtenerFacturaClienteAction.php` | Lectura para área cliente |

#### Controller (1)

| # | Archivo | Métodos |
|---|---------|---------|
| 11 | `app/Http/Controllers/Tienda/FacturaWebController.php` | `show()` |

#### Policy (1)

| # | Archivo | Regla |
|---|---------|-------|
| 12 | `app/Policies/FacturaPolicy.php` | Verifica `PedidoTienda.user_id` coincide con usuario autenticado |

#### Event (1)

| # | Archivo | Propiedad |
|---|---------|-----------|
| 13 | `app/Domains/Tienda/Facturacion/Events/FacturaEmitidaEvent.php` | `$factura` |

#### Listener (1)

| # | Archivo | Acción |
|---|---------|--------|
| 14 | `app/Domains/Tienda/Facturacion/Listeners/EmitirFacturaTrasConfirmacionListener.php` | Emite factura automáticamente tras pago confirmado |

#### Vista (1)

| # | Archivo | Descripción |
|---|---------|-------------|
| 15 | `resources/js/Pages/Tienda/FacturaShow.jsx` | Vista print-friendly con botón imprimir |

#### Tests (1)

| # | Archivo | Casos |
|---|---------|-------|
| 16 | `tests/Feature/Tienda/FacturacionTest.php` | emitir factura, tiene detalles, número único, ver factura cliente, anular factura |

### Action Principal: `EmitirFacturaDesdePedidoAction`

```
1. Validar pedido confirmado y pago pagado
2. Generar número factura único (FAC-{YYYY}-{SEQ})
3. Snapshot datos cliente desde checkout_sesiones
4. Crear factura en estado EMITIDA
5. Copiar detalles_pedido → detalles_factura
6. Actualizar pedidos_tienda.estado_pte = facturado
7. Actualizar checkout_sesiones.estado_che = completado
8. Disparar FacturaEmitidaEvent
```

### Numeración

| Formato | Ejemplo |
|---------|---------|
| `FAC-{YYYY}-{000001}` | FAC-2026-000042 |

Secuencia en Cache Redis con lock para evitar duplicados.

### Disparador Automático

| Evento | Listener | Acción |
|--------|----------|--------|
| `PagoConfirmadoEvent` | `EmitirFacturaTrasConfirmacionListener` | Emite factura automáticamente |

### Vista Print-Friendly

La vista `FacturaShow.jsx` incluye:
- Header con logo y número de factura
- Datos del cliente (snapshot)
- Tabla de detalles
- Totales (subtotal, descuento, impuesto, total)
- Botón "Imprimir" con `window.print()`
- Estilos CSS para impresión (clase `print:hidden` en botón)

### Rutas

```php
GET /tienda/mis-pedidos/{pedido}/factura → FacturaWebController@show
```

### Verificación Sprint 08

- [x] 2 Migraciones creadas con FK correctas
- [x] 2 Modelos con relaciones configuradas
- [x] 2 Enums (EstadoFactura, TipoComprobante)
- [x] Service con numeración secuencial y lock Redis
- [x] 3 Actions creadas (emitir, anular, obtener)
- [x] Controller con 1 endpoint
- [x] Policy con verificación de pertenencia
- [x] Event + Listener para emisión automática
- [x] Vista React print-friendly
- [x] Tests PHPUnit creados (5 casos de prueba)
- [x] `npm run build` exitoso

---

## Resumen de Archivos Totales (44)

### Sprint 06 — Pedidos Web (14 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/migrations/2026_05_25_300000_create_pedidos_tienda_table.php` |
| 2 | `app/Models/PedidoTienda.php` |
| 3 | `app/Domains/Tienda/PedidosWeb/Enums/EstadoPedidoTiendaEnum.php` |
| 4 | `app/Domains/Tienda/PedidosWeb/DTOs/GenerarPedidoDesdeCheckoutData.php` |
| 5 | `app/Domains/Tienda/PedidosWeb/Services/PedidoTiendaService.php` |
| 6 | `app/Domains/Tienda/PedidosWeb/Actions/GenerarPedidoDesdeCheckoutAction.php` |
| 7 | `app/Domains/Tienda/PedidosWeb/Actions/ListarPedidosClienteAction.php` |
| 8 | `app/Domains/Tienda/PedidosWeb/Actions/ObtenerPedidoClienteAction.php` |
| 9 | `app/Http/Requests/Tienda/GenerarPedidoRequest.php` |
| 10 | `app/Http/Controllers/Tienda/PedidoWebController.php` |
| 11 | `app/Policies/PedidoTiendaPolicy.php` |
| 12 | `app/Domains/Tienda/PedidosWeb/Events/PedidoWebGeneradoEvent.php` |
| 13 | `app/Domains/Tienda/PedidosWeb/Listeners/ActualizarCheckoutTrasPedidoListener.php` |
| 14 | `tests/Feature/Tienda/PedidoWebTest.php` |

### Sprint 07 — Pagos Web (14 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/migrations/2026_05_25_400000_create_pagos_tienda_table.php` |
| 2 | `app/Models/PagoTienda.php` |
| 3 | `app/Domains/Tienda/PagosWeb/DTOs/RegistrarPagoDesdeCheckoutData.php` |
| 4 | `app/Domains/Tienda/PagosWeb/Services/PagoTiendaService.php` |
| 5 | `app/Domains/Tienda/PagosWeb/Actions/RegistrarPagoDesdeCheckoutAction.php` |
| 6 | `app/Domains/Tienda/PagosWeb/Actions/ObtenerPagoClienteAction.php` |
| 7 | `app/Http/Requests/Tienda/RegistrarPagoCheckoutRequest.php` |
| 8 | `app/Http/Controllers/Tienda/PagoWebController.php` |
| 9 | `app/Domains/Tienda/PagosWeb/Events/PagoWebRegistradoEvent.php` |
| 10 | `app/Domains/Comercial/Pagos/Events/PagoConfirmadoEvent.php` |
| 11 | `app/Domains/Tienda/PagosWeb/Listeners/ActualizarEstadoTrasPagoConfirmadoListener.php` |
| 12 | `app/Domains/Tienda/PagosWeb/Listeners/ConfirmarPedidoTrasPagoWebListener.php` |
| 13 | `routes/tienda.php` (modificado) |
| 14 | `tests/Feature/Tienda/PagoWebTest.php` |

### Sprint 08 — Facturación (16 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/migrations/2026_05_25_500000_create_facturas_table.php` |
| 2 | `database/migrations/2026_05_25_500100_create_detalles_factura_table.php` |
| 3 | `app/Models/Factura.php` |
| 4 | `app/Models/DetalleFactura.php` |
| 5 | `app/Domains/Tienda/Facturacion/Enums/EstadoFacturaEnum.php` |
| 6 | `app/Domains/Tienda/Facturacion/Enums/TipoComprobanteEnum.php` |
| 7 | `app/Domains/Tienda/Facturacion/Services/GenerarNumeroFacturaService.php` |
| 8 | `app/Domains/Tienda/Facturacion/Actions/EmitirFacturaDesdePedidoAction.php` |
| 9 | `app/Domains/Tienda/Facturacion/Actions/AnularFacturaAction.php` |
| 10 | `app/Domains/Tienda/Facturacion/Actions/ObtenerFacturaClienteAction.php` |
| 11 | `app/Http/Controllers/Tienda/FacturaWebController.php` |
| 12 | `app/Policies/FacturaPolicy.php` |
| 13 | `app/Domains/Tienda/Facturacion/Events/FacturaEmitidaEvent.php` |
| 14 | `app/Domains/Tienda/Facturacion/Listeners/EmitirFacturaTrasConfirmacionListener.php` |
| 15 | `resources/js/Pages/Tienda/FacturaShow.jsx` |
| 16 | `tests/Feature/Tienda/FacturacionTest.php` |

---

## Dependencias para Sprints Siguientes

| Sprint | Dependencia de Sprint 06-08 |
|--------|----------------------------|
| Sprint 10 (Frontend Storefront) | Usa `CatalogoPublicoController`, `CarritoController` |
| Sprint 11 (Frontend Checkout) | Usa `CheckoutController`, `PedidoWebController`, `PagoWebController` |
| Sprint 12 (QA Integración) | Usa todos los tests creados |

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
php artisan test --filter=PedidoWeb
php artisan test --filter=PagoWeb
php artisan test --filter=Facturacion

# Ejecutar jobs de listeners
php artisan queue:work
```

---

## Notas Importantes

1. **PHP Requerido:** El proyecto requiere PHP 8.3+. Las migraciones no se pudieron ejecutar localmente por tener PHP 8.1, pero son sintácticamente correctas.

2. **Reutilización de componentes:** Los Sprints 06-08 reutilizan los Actions existentes del dominio Comercial (`CrearPedidoAction`, `RegistrarPagoAction`, `ConfirmarPedidoAction`) sin duplicar lógica.

3. **Events/Listeners:** Se crearon 6 Events y 5 Listeners para comunicación desacoplada entre dominios. Los Listeners se ejecutan en cola (`ShouldQueue`) para no bloquear la respuesta HTTP.

4. **Numeración de factura:** Usa Cache Redis con lock atómico para generar secuencias únicas sin colisiones.

5. **Comprobantes:** Se almacenan en disco `local` (no público) por seguridad. El acceso requiere autenticación.

6. **Factura print-friendly:** La vista `FacturaShow.jsx` incluye estilos CSS para impresión y botón que invoca `window.print()`.

7. **Sincronización de estados:** La cadena completa es:
   ```
   Checkout → PedidoTienda → Pago → Factura
   iniciado → pendiente_pago → pagado → facturado → completado
   ```
