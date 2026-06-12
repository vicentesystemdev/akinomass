# ARREGLOS_LOGICA_TIENDA.md

## Documentación completa de los Sprints Incrementales del módulo Tienda Online

**Fecha de generación:** 2026-06-08
**Rama:** `dev/marcelo`
**Estado:** 84 tests pasando (177 assertions, 0 fallos)

---

## Tabla de contenidos

1. [Visión general](#1-visión-general)
2. [Arquitectura y convenciones](#2-arquitectura-y-convenciones)
3. [Sprint INC-01 — Reservas temporales de stock](#3-sprint-inc-01--reservas-temporales-de-stock)
4. [Sprint INC-02 — Configuración dinámica de tiempos](#4-sprint-inc-02--configuración-dinámica-de-tiempos)
5. [Sprint INC-03 — Checkout editable y cancelación controlada](#5-sprint-inc-03--checkout-editable-y-cancelación-controlada)
6. [Sprint INC-04 — Aprobación/rechazo administrativo del pedido](#6-sprint-inc-04--aprobaciónrechazo-administrativo-del-pedido)
7. [Sprint INC-05 — Validación administrativa del pago](#7-sprint-inc-05--validación-administrativa-del-pago)
8. [Sprint INC-06 — Resubida e historial de comprobantes](#8-sprint-inc-06--resubida-e-historial-de-comprobantes)
9. [Sprint INC-07 — Descuento definitivo de stock y cierre](#9-sprint-inc-07--descuento-definitivo-de-stock-y-cierre)
10. [Sprint INC-08 — Mejoras UX incrementales](#10-sprint-inc-08--mejoras-ux-incrementales)
11. [Sprint INC-09 — QA, pruebas y concurrencia](#11-sprint-inc-09--qa-pruebas-y-concurrencia)
12. [Flujo completo del usuario](#12-flujo-completo-del-usuario)
13. [Inventario de archivos creados/modificados](#13-inventario-de-archivos-creadosmodificados)
14. [Decisions y fixes técnicos](#14-decisions-y-fixes-técnicos)
15. [Checklist pre-merge](#15-checklist-pre-merge)

---

## 1. Visión general

Los sprints incrementales extendieron el módulo Tienda Online existente con funcionalidades avanzadas de inventario, aprobación administrativa y experiencia de usuario. Estos sprints **solo documentan lo nuevo** — no repiten funcionalidades base del catálogo, carrito, checkout, pedidos, pagos o facturación ya existentes.

### Alcance de los 9 sprints

| Sprint | Nombre | Dependencia |
|--------|--------|-------------|
| INC-01 | Reservas temporales de stock | Carrito base, productos, inventarios |
| INC-02 | Configuración dinámica de tiempos | INC-01 |
| INC-03 | Checkout editable y cancelación controlada | INC-01, INC-02 |
| INC-04 | Aprobación/rechazo administrativo del pedido | INC-01 |
| INC-05 | Validación administrativa del pago | INC-04 |
| INC-06 | Resubida e historial de comprobantes | INC-05 |
| INC-07 | Descuento definitivo de stock y cierre | INC-05, INC-01 |
| INC-08 | Mejoras UX incrementales | Todos los anteriores |
| INC-09 | QA, pruebas y concurrencia | Todos los anteriores |

### Reglas técnicas obligatorias

- **Nunca modificar tablas legacy**
- Todas las operaciones críticas usan `DB::transaction()` + `lockForUpdate()`
- El stock físico se descuenta **solo** cuando el admin acepta el pago (INC-05/INC-07)
- Los valores de configuración nueva aplican solo a reservas/checkouts nuevos, no a los existentes
- Auditoría obligatoria para todas las acciones admin
- Los clientes nunca tienen acceso al dashboard admin

---

## 2. Arquitectura y convenciones

### Patrón de capas

```
Controller → FormRequest → DTO → Action → Service → Repository → Model
```

### Convenciones de nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Tablas | `nombreTabla` en español | `reservas_stock_carrito` |
| Columnas | `nombreColumna_abreviaturaTabla` | `estado_res`, `cod_producto` |
| PKs | `cod_nombre_singular` | `cod_reserva_stock_carrito` |
| Enums | `EstadoNombreEnum` | `EstadoPedidoTiendaEnum` |
| Actions | `VerboSujetoObjetoAction` | `AceptarPagoPedidoTiendaAction` |

### Modelos de datos — Tablas nuevas

| Sprint | Tabla | Descripción |
|--------|-------|-------------|
| INC-01 | `reservas_stock_carrito` | Reservas temporales de stock en carrito |
| INC-02 | `configuraciones_tienda` | Configuración dinámica del store |
| INC-06 | `comprobantes_pago_tienda` | Historial de comprobantes de pago |

### Estados del pedido tienda (expandidos en INC-04)

```
pendiente_revision → aceptado → pendiente_validacion_pago → pago_observado / pago_rechazado → confirmado → facturado
                                                                                                          ↓
                                                                                                        cancelado
```

Estados completos del enum `EstadoPedidoTiendaEnum`:

```php
PENDIENTE_REVISION = 'pendiente_revision'
ACEPTADO = 'aceptado'
RECHAZADO = 'rechazado'
PENDIENTE_VALIDACION_PAGO = 'pendiente_validacion_pago'
PENDIENTE_PAGO = 'pendiente_pago'
PAGO_OBSERVADO = 'pago_observado'
PAGO_RECHAZADO = 'pago_rechazado'
PAGADO = 'pagado'
CONFIRMADO = 'confirmado'
FACTURADO = 'facturado'
CANCELADO = 'cancelado'
EXPIRADO = 'expirado'
```

---

## 3. Sprint INC-01 — Reservas temporales de stock

### Objetivo
Agregar reservas temporales de stock al carrito **sin** descontar stock físico. El stock físico solo se descuenta cuando el admin acepta el pago (INC-07).

### Fórmula de stock disponible

```
Stock físico = inventario.stock_actual
Stock reservado = suma de reservas activas no expiradas
Stock disponible = stock físico - stock reservado
```

### Migración: `reservas_stock_carrito`

```
cod_reserva_stock_carrito (PK)
cod_carrito (FK → carritos)
cod_detalle_carrito (FK nullable → detalles_carrito)
cod_producto (FK → productos)
user_id (FK nullable → users)
session_id_res (string 100 nullable)
cantidad_res (unsigned int)
estado_res (string 30, default 'activa')
expira_en_res (timestamp)
confirmada_en_res (timestamp nullable)
liberada_en_res (timestamp nullable)
created_at, updated_at

Índices:
- (cod_producto, estado_res, expira_en_res)
- (cod_carrito, estado_res)
```

### Enum `EstadoReservaStockEnum`

```php
ACTIVA = 'activa'
EXPIRADA = 'expirada'
LIBERADA = 'liberada'
CONVERTIDA_PEDIDO = 'convertida_pedido'
CANCELADA = 'cancelada'
```

### Servicios creados

- **`ReservaStockCarritoService`** — CRUD de reservas, liberación, conversión a pedido, expiración
- **`StockDisponibleTiendaService`** — Calcula stock disponible: `inventario.stock_actual - reservas activas no expiradas`

### Actions implementadas

| Action | Descripción |
|--------|-------------|
| `AgregarItemCarritoConReservaAction` | Agrega producto al carrito con reserva de stock |
| `ActualizarCantidadCarritoConReservaAction` | Actualiza cantidad y ajusta reserva |
| `EliminarItemCarritoLiberandoReservaAction` | Elimina item y libera reserva |
| `VaciarCarritoLiberandoReservasAction` | Vacía carrito y libera todas las reservas |
| `ExpirarReservasCarritoAction` | Expira reservas vencidas (job programado) |
| `CalcularStockDisponibleConReservasAction` | Calcula stock considerando reservas |

### Lógica crítica (DB::transaction + lockForUpdate)

**Agregar producto:**
1. Bloquear producto/inventario
2. Calcular reservas activas
3. Validar stock disponible
4. Crear/actualizar detalle carrito
5. Crear/actualizar reserva
6. Recalcular totales carrito

**Validaciones:**

| Caso | Resultado |
|------|-----------|
| Producto inactivo | No se crea reserva |
| Stock insuficiente | Error 422 |
| Reserva expirada | No permite checkout |
| Carrito convertido | No permite edición |
| Cantidad cero | Libera reserva |
| Producto eliminado | Libera reserva |

---

## 4. Sprint INC-02 — Configuración dinámica de tiempos

### Objetivo
Permitir al admin configurar tiempos operacionales desde el dashboard sin editar `.env`.

### Migración: `configuraciones_tienda`

```
cod_configuracion_tienda (PK)
clave_cti (string 100, unique)
valor_cti (text)
tipo_cti (string 30, default 'string')
descripcion_cti (text nullable)
activo_cti (boolean, default true)
actualizado_por_user_id (FK nullable → users)
created_at, updated_at
```

### Configuraciones iniciales (Seeder)

| Clave | Valor | Tipo | Descripción | Mín | Máx |
|-------|-------|------|-------------|-----|-----|
| `carrito_reserva_minutos` | 20 | entero | Minutos de reserva en carrito | 5 | 120 |
| `checkout_ttl_minutos` | 30 | entero | TTL del checkout | 10 | 180 |
| `checkout_pago_pendiente_minutos` | 60 | entero | Tiempo para subir comprobante | 10 | 1440 |
| `pago_observado_correccion_minutos` | 1440 | entero | Tiempo para corregir pago observado | 30 | 4320 |
| `pago_rechazado_resubida_minutos` | 1440 | entero | Tiempo para resubir pago rechazado | 30 | 4320 |
| `carrito_permitir_extension` | true | boolean | Permitir extensión de reserva | — | — |
| `carrito_max_extensiones` | 1 | entero | Máximo de extensiones | 0 | 5 |

### Servicios y Actions

- **`ConfiguracionTiendaService`** — Lectura/escritura con cache-first
- **`ActualizarConfiguracionTiendaAction`** — Actualiza valores y limpia cache
- **`ObtenerConfiguracionTiendaAction`** — Lee configuraciones
- **`LimpiarCacheConfiguracionTiendaAction`** — Limpia cache manualmente

### Permisos

- `configuracion_tienda.ver` — Asignado a Administrador
- `configuracion_tienda.editar` — Asignado a Administrador

### Regla
Los nuevos valores aplican **solo** a nuevas reservas/checkouts/muertes. Los existentes mantienen su expiración original.

---

## 5. Sprint INC-03 — Checkout editable y cancelación controlada

### Objetivo
Permitir al cliente editar el carrito durante el checkout antes de generar el pedido.

### Estados editables vs no editables

| Editable | No editable |
|----------|-------------|
| `iniciado` | `pedido_generado` |
| `datos_completados` | `pago_registrado` |
| | `pago_confirmado`, `completado` |
| | `expirado`, `cancelado` |

### Actions implementadas

| Action | Descripción |
|--------|-------------|
| `VolverAlCarritoDesdeCheckoutAction` | Regresa al carrito manteniendo reservas |
| `CancelarCheckoutManteniendoCarritoAction` | Cancela checkout, conserva carrito |
| `CancelarCheckoutLiberandoReservasAction` | Cancela checkout y libera reservas |
| `ActualizarCheckoutTrasCambioCarritoAction` | Sincroniza checkout cuando cambia el carrito |
| `ExtenderReservasAlIniciarCheckoutAction` | Extiende TTL de reservas al iniciar checkout |
| `ExpirarCheckoutSesionesAction` | Expira sesiones abandonadas (job) |

### Funcionalidades

1. **Volver al carrito desde checkout** — Checkout no cancelado, reservas mantenidas
2. **Agregar más productos** — Nuevas reservas creadas, totales recalculados al volver
3. **Aumentar cantidad** — Valida stock adicional (DB::transaction + lockForUpdate)
4. **Disminuir cantidad** — Libera diferencia de reserva, actualiza totales
5. **Cancelar compra** — Dos modos: "volver al carrito" o "cancelar compra" (libera reservas)

### Rutas implementadas

```
POST /tienda/checkout/{token}/volver-carrito
POST /tienda/checkout/{token}/cancelar-compra
POST /tienda/checkout/{token}/extender-reservas
POST /tienda/checkout/{token}/recalcular
```

---

## 6. Sprint INC-04 — Aprobación/rechazo administrativo del pedido

### Objetivo
Separar la aprobación del pedido de la validación del pago. El admin revisa el pedido **antes** de la validación del pago.

### Flujo

```
Cliente genera pedido → pendiente_revision → Admin acepta → aceptado → Cliente sube pago → pendiente_validacion_pago
                                                         → Admin rechaza → rechazado (libera reservas)
```

### Aceptar pedido (NO descuenta stock)

- **Precondición:** `pedido_tienda.estado_pte = pendiente_revision`
- **Resultado:** `pedido_tienda = aceptado`, checkout = `pago_registrado`
- **Mensaje cliente:** "Tu pedido fue aceptado. Estamos verificando tu pago."

### Rechazar pedido (libera reservas)

- **Precondición:** `pedido_tienda.estado_pte = pendiente_revision`
- **Resultado:** `pedido_tienda = rechazado`, checkout = `cancelado`, reservas = `liberada`, pago = `anulado`
- **Mensaje cliente:** "Tu pedido fue rechazado. Los productos fueron liberados."
- **Requiere:** Motivo de rechazo obligatorio

### Actions implementadas

| Action | Descripción |
|--------|-------------|
| `AceptarPedidoTiendaAction` | Acepta pedido, mantiene reservas |
| `RechazarPedidoTiendaAction` | Rechaza pedido, libera reservas, anula pago |
| `CancelarPedidoTiendaAction` | Cancela pedido desde admin |
| `ExpirarPedidoTiendaAction` | Expira pedidos vencidos |

### Permisos

- `pedidos_tienda.revisar`
- `pedidos_tienda.aceptar`
- `pedidos_tienda.rechazar`

### Auditoría
- Pedido aceptado (admin, timestamp)
- Pedido rechazado (admin, timestamp, motivo)

---

## 7. Sprint INC-05 — Validación administrativa del pago

### Objetivo
Permitir al admin aceptar, observar o rechazar pagos. El stock físico se descuenta **solo** cuando el admin acepta el pago.

### Estados de pago

```
pendiente → en_revision → observado → pendiente (resubida)
                → rechazado → pendiente (resubida)
                → pagado
                → anulado
```

### Aceptar pago (DB::transaction + lockForUpdate)

**12 pasos de la acción:**
1. Bloquear pedido_tienda
2. Bloquear pago
3. Validar que el pago no esté ya pagado
4. Bloquear inventarios por producto
5. Validar stock físico suficiente
6. Descontar stock físico
7. Marcar reservas como `convertida_pedido`
8. Cambiar pago a `pagado`
9. Cambiar pedido_tienda a `confirmado`
10. Cambiar pedido base a `confirmado`
11. Cambiar checkout a `pago_confirmado`
12. Disparar evento para comprobante/factura

### Observar pago

- **Requiere:** Motivo obligatorio
- **Resultado:** pago = `observado`, pedido_tienda = `pago_observado`
- **Mensaje:** "Tu comprobante fue observado. Puedes subir un nuevo comprobante."

### Rechazar pago

- **Requiere:** Motivo obligatorio
- **Resultado:** pago = `rechazado`, pedido_tienda = `pago_rechazado`
- **Mensaje:** "Tu pago fue rechazado. Puedes subir un nuevo comprobante si corresponde."

### Actions implementadas

| Action | Descripción |
|--------|-------------|
| `AceptarPagoPedidoTiendaAction` | Acepta pago, descuenta stock, confirma pedido |
| `ObservarPagoPedidoTiendaAction` | Observa pago, notifica al cliente |
| `RechazarPagoPedidoTiendaAction` | Rechaza pago, notifica al cliente |
| `DescontarStockDefinitivoPedidoWebAction` | Descuento definitivo de stock (INC-07) |

### Permisos

- `pagos_tienda.revisar`
- `pagos_tienda.aceptar`
- `pagos_tienda.observar`
- `pagos_tienda.rechazar`

### Idempotencia (prevenir doble descuento)

- Si `pago.estado = pagado` → no vuelve a descontar
- Si `pedido_tienda.estado = confirmado/facturado` → no vuelve a confirmar
- Si reservas ya `convertida_pedido` → no vuelve a convertir

---

## 8. Sprint INC-06 — Resubida e historial de comprobantes

### Objetivo
Permitir al cliente resubir comprobantes de pago cuando el pago es observado o rechazado. Mantener historial de comprobantes (nunca sobrescribir).

### Migración: `comprobantes_pago_tienda`

```
cod_comprobante_pago_tienda (PK)
cod_pago_tienda (FK → pagos_tienda)
ruta_comprobante_cpt (string 255)
hash_comprobante_cpt (string 64 nullable)
mime_cpt (string 100 nullable)
tamano_bytes_cpt (unsigned bigint nullable)
estado_cpt (string 30, default 'pendiente')
observacion_admin_cpt (text nullable)
subido_por_user_id (FK nullable → users)
revisado_por_user_id (FK nullable → users)
subido_en_cpt (timestamp)
revisado_en_cpt (timestamp nullable)
created_at, updated_at
```

### Enum `EstadoComprobanteEnum`

```php
PENDIENTE = 'pendiente'
OBSERVADO = 'observado'
RECHAZADO = 'rechazado'
ACEPTADO = 'aceptado'
REEMPLAZADO = 'reemplazado'
ANULADO = 'anulado'
```

### Lógica de resubida

1. Validar que el pago esté observado o rechazado
2. Validar que el pedido no esté confirmado/facturado
3. Marcar comprobante anterior como `reemplazado`
4. Guardar nuevo archivo
5. Crear registro en `comprobantes_pago_tienda`
6. Incrementar intentos en `pagos_tienda`
7. Cambiar pago a `pendiente`
8. Cambiar pedido_tienda a `pendiente_validacion_pago`

### Validaciones de archivo

- Requerido
- MIME: jpg, jpeg, png, pdf
- Máximo 5 MB
- Debe pertenecer al cliente
- Pago debe estar observado/rechazado
- Pedido no confirmado/facturado

### Actions implementadas

| Action | Descripción |
|--------|-------------|
| `ResubirComprobantePagoTiendaAction` | Resubir comprobante con validaciones |
| `RegistrarHistorialComprobantePagoAction` | Registrar en historial |

---

## 9. Sprint INC-07 — Descuento definitivo de stock y cierre

### Objetivo
Descontar stock físico solo cuando el admin acepta el pago, luego confirmar pedido y habilitar emisión de comprobante interno/factura.

### Regla fundamental

```
Aceptar pedido = NO descuenta stock
Aceptar pago = SÍ descuenta stock
```

### Action: `DescontarStockDefinitivoPedidoWebAction`

Esta action corre **dentro** de la misma transacción que `AceptarPagoPedidoTiendaAction` para garantizar atomicidad.

```php
// En AceptarPagoPedidoTiendaAction::execute()
return DB::transaction(function () use ($pago) {
    // ... validaciones ...

    if ($carrito && $carrito->detalles->isNotEmpty()) {
        $this->descontarStockAction->execute($pedidoTienda, $carrito);
    }

    $pago->update(['estado_pago_pag' => EstadoPagoEnum::PAGADO]);
    $pedido->update(['estado_ped' => 'confirmado']);
    // ... resto de actualizaciones ...

    // Eventos al final de la transacción:
    event(new StockPedidoWebDescontadoEvent($pedidoTiendaFresh));
    event(new PagoTiendaAceptadoEvent($pagoFresh));
    event(new PagoConfirmadoEvent($pagoFresh));
});
```

### Eventos

| Evento | Propósito |
|--------|-----------|
| `PagoTiendaAceptadoEvent` | Auditoría de pago aceptado |
| `StockPedidoWebDescontadoEvent` | Auditoría de stock descontado |
| `PagoConfirmadoEvent` | Triggers existentes (factura, notificaciones) |

### Listeners

| Listener | Evento | Acción |
|----------|--------|--------|
| `RegistrarAuditoriaPagoAceptadoListener` | `PagoTiendaAceptadoEvent` | Registra auditoría |
| `RegistrarAuditoriaStockDescontadoListener` | `StockPedidoWebDescontadoEvent` | Registra auditoría |
| `ActualizarEstadoTrasPagoConfirmadoListener` | `PagoConfirmadoEvent` | Actualiza estados |
| `ConfirmarPedidoTrasPagoWebListener` | `PagoConfirmadoEvent` | Confirma pedido |

### Stock insuficiente al aceptar pago

- No aceptar pago
- No confirmar pedido
- No descontar parcialmente
- Mostrar alerta al admin
- Mantener pago bajo revisión
- Registrar auditoría

---

## 10. Sprint INC-08 — Mejoras UX incrementales

### Objetivo
Agregar mejoras visuales y funcionales a pantallas existentes de reservas, temporizadores, aprobación de pedidos, validación de pagos y resubida de comprobantes.

### Servicio de mensajes: `TiendaMensajeService`

Proporciona mensajes contextuales por estado del pedido y utilidades de tiempo.

```php
// Mensajes por estado
pendiente_revision → "Tu pedido está pendiente de revisión."
aceptado → "Tu pedido fue aceptado. Estamos revisando tu pago."
rechazado → "Tu pedido fue rechazado."
pago_observado → "Tu comprobante fue observado. Por favor revisa los comentarios."
pago_rechazado → "Tu pago fue rechazado. Puedes subir un nuevo comprobante."
confirmado → "Tu pago fue aceptado y tu pedido confirmado."
facturado → "Tu comprobante interno está disponible."
```

### Utilidades de tiempo

```php
obtenerTiempoRestanteMinutos(Carbon $expiraEn): int
obtenerTiempoRestanteSegundos(Carbon $expiraEn): int
formatearTiempoRestante(int $segundos): string  // "5m 30s" o "45s" o "Expirado"
puedeResubirComprobante(EstadoPedidoTiendaEnum, EstadoPagoEnum|string|null): bool
```

### Mejoras en carrito

- Temporizador de cuenta regresiva de reserva
- Mensaje: "Tus productos están reservados por tiempo limitado"
- Stock disponible calculado con reservas
- Alerta de reserva expirada
- Botón actualizar carrito

### Mejoras en checkout

- Botones: Volver al carrito, Agregar más productos, Actualizar cantidades, Cancelar compra, Continuar a pago
- Temporizador: "Tienes X minutos para completar tu compra"

### Mejoras en Mi Cuenta / Mis Pedidos

- Mensajes claros de estado para cada caso
- Botón "Subir nuevo comprobante" solo cuando pago = observado/rechazado

### Dashboard admin — Revisión de pedido

- Sección "Revisión del pedido" con botones Aceptar/Rechazar
- Rechazo requiere motivo obligatorio

### Dashboard admin — Revisión de pago

- Sección "Validación del pago" con botones Aceptar/Observar/Rechazar
- Observación y rechazo requieren motivo obligatorio

### Dashboard admin — Historial de comprobantes

- Número de intento
- Fecha de subida
- Archivo
- Estado
- Observación
- Admin que revisó
- Fecha de revisión

---

## 11. Sprint INC-09 — QA, pruebas y concurrencia

### Objetivo
Validar que las nuevas funcionalidades no rompan el módulo tienda ni el back-office.

### Archivos de test creados

| Archivo | Cobertura |
|---------|-----------|
| `ReservasStockTest.php` | QA-01 a QA-07: Ciclo de vida de reservas |
| `ConfiguracionTiendaTest.php` | QA-11 a QA-14: Configuración dinámica |
| `CheckoutEditableTest.php` | QA-08 a QA-10 + extras |
| `AdminPedidoTiendaTest.php` | QA-13, QA-14 + extras |
| `AdminPagoTiendaTest.php` | QA-15, QA-16, QA-19 + extras |
| `ComprobantesPagoTiendaTest.php` | Historial de comprobantes |
| `StockDefinitivoTest.php` | Comportamiento de stock |
| `ConcurrenciaStockTest.php` | CONC-01 a CONC-03 |

### Matriz QA funcional (20 casos)

| ID | Descripción | Resultado |
|----|-------------|-----------|
| QA-01 | Agregar producto crea reserva | PASS |
| QA-02 | Stock disponible se reduce | PASS |
| QA-03 | Reserva vence, stock sube | PASS |
| QA-04 | Eliminar item libera reserva | PASS |
| QA-05 | Reducir cantidad libera diferencia | PASS |
| QA-06 | Aumentar cantidad con stock | PASS |
| QA-07 | Aumentar cantidad sin stock falla | PASS |
| QA-08 | Iniciar checkout extiende reservas | PASS |
| QA-09 | Volver al carrito mantiene reservas | PASS |
| QA-10 | Cancelar compra libera reservas | PASS |
| QA-11 | Admin cambia tiempo carrito | PASS |
| QA-12 | Admin cambia tiempo checkout | PASS |
| QA-13 | Aceptar pedido NO descuenta stock | PASS |
| QA-14 | Rechazar pedido libera reservas | PASS |
| QA-15 | Observar pago cliente puede resubir | PASS |
| QA-16 | Rechazar pago cliente puede resubir | PASS |
| QA-19 | Aceptar pago dos veces no duplica | PASS |

### Pruebas de concurrencia

| ID | Descripción | Resultado |
|----|-------------|-----------|
| CONC-01 | Dos clientes, último stock — solo uno reserva | PASS |
| CONC-02 | Admin acepta pago dos veces — solo descuenta una vez | PASS |
| CONC-03 | Reserva vence mientras checkout — no genera pedido | PASS |

### Verificación final

```
Tests:    84 passed (177 assertions)
Duration: ~60s
```

---

## 12. Flujo completo del usuario

### Flujo happy path

```
1. Cliente agrega producto al carrito
   → Se crea reserva activa (20 min por defecto)
   → Stock disponible se reduce

2. Cliente inicia checkout
   → Reservas se extienden (30 min por defecto)
   → Sesión checkout creada

3. Cliente completa datos de envío
   → Checkout → datos_completados

4. Cliente genera pedido
   → PedidoTienda creado (estado: pendiente_revision)
   → Checkout → pedido_generado

5. Admin revisa pedido
   → ACEPTA: pedido_tienda = aceptado
   → RECHAZA: pedido_tienda = rechazado, reservas liberadas

6. Cliente sube comprobante de pago
   → PagoTienda creado (estado: pendiente)
   → Pago → pendiente

7. Admin revisa pago
   → ACEPTA: pago = pagado, stock descontado, pedido confirmado
   → OBSERVA: pago = observado, cliente resubir
   → RECHAZA: pago = rechazado, cliente resubir

8. Pedido confirmado → Factura emitida automáticamente
```

### Flujo de resubida de comprobante

```
1. Admin observa/rechaza pago
   → Comprobante anterior = reemplazado
   → Cliente notificado

2. Cliente sube nuevo comprobante
   → Nuevo registro en comprobantes_pago_tienda
   → Intento incrementado
   → Pago = pendiente
   → Pedido = pendiente_validacion_pago

3. Admin revisa nuevo comprobante
   → Ciclo se repite
```

---

## 13. Inventario de archivos creados/modificados

### Total: 197 archivos

| Categoría | Cantidad |
|-----------|----------|
| Tienda Domain (Actions, Services, Events, Listeners, DTOs, Enums) | 84 |
| HTTP Controllers | 14 |
| Form Requests | 10 |
| Middleware | 4 |
| Models | 14 |
| Migrations | 13 |
| Seeders | 2 |
| Routes | 2 |
| Tests | 18 |
| Inventario Domain | 9 |
| Comercial Pedidos | 7 |
| Comercial Pagos | 10 |
| Auditoria Domain | 9 |

### Archivos clave por sprint

#### INC-01 — Reservas

```
app/Models/ReservaStockCarrito.php
app/Domains/Tienda/Carrito/Services/ReservaStockCarritoService.php
app/Domains/Tienda/Carrito/Services/StockDisponibleTiendaService.php
app/Domains/Tienda/Carrito/Enums/EstadoReservaStockEnum.php
app/Domains/Tienda/Carrito/Actions/ExpirarReservasCarritoAction.php
database/migrations/2026_06_06_000001_create_reservas_stock_carrito_table.php
```

#### INC-02 — Configuración

```
app/Models/ConfiguracionTienda.php
app/Domains/Tienda/Configuracion/Services/ConfiguracionTiendaService.php
app/Domains/Tienda/Configuracion/Actions/ActualizarConfiguracionTiendaAction.php
app/Domains/Tienda/Configuracion/Actions/ObtenerConfiguracionTiendaAction.php
app/Http/Controllers/Tienda/ConfiguracionTiendaController.php
app/Http/Requests/Tienda/ActualizarConfiguracionTiendaRequest.php
database/migrations/2026_06_06_000002_create_configuraciones_tienda_table.php
database/seeders/ConfiguracionTiendaSeeder.php
```

#### INC-03 — Checkout editable

```
app/Domains/Tienda/Checkout/Actions/VolverAlCarritoDesdeCheckoutAction.php
app/Domains/Tienda/Checkout/Actions/CancelarCheckoutLiberandoReservasAction.php
app/Domains/Tienda/Checkout/Actions/ActualizarCheckoutTrasCambioCarritoAction.php
app/Domains/Tienda/Checkout/Actions/ExtenderReservasAlIniciarCheckoutAction.php
routes/web.php (rutas de checkout editables)
```

#### INC-04 — Aprobación admin pedido

```
app/Domains/Tienda/PedidosWeb/Enums/EstadoPedidoTiendaEnum.php (expandido a 12 estados)
app/Domains/Tienda/PedidosWeb/Actions/AceptarPedidoTiendaAction.php
app/Domains/Tienda/PedidosWeb/Actions/RechazarPedidoTiendaAction.php
app/Http/Controllers/Tienda/AdminPedidoTiendaController.php
routes/web.php (rutas admin/tienda/pedidos)
```

#### INC-05 — Validación admin pago

```
app/Domains/Tienda/PagosWeb/Actions/AceptarPagoPedidoTiendaAction.php
app/Domains/Tienda/PagosWeb/Actions/ObservarPagoPedidoTiendaAction.php
app/Domains/Tienda/PagosWeb/Actions/RechazarPagoPedidoTiendaAction.php
app/Http/Controllers/Tienda/AdminPagoTiendaController.php
routes/web.php (rutas admin/tienda/pagos)
```

#### INC-06 — Comprobantes

```
app/Models/ComprobantePagoTienda.php
app/Domains/Tienda/PagosWeb/Actions/ResubirComprobantePagoTiendaAction.php
database/migrations/2026_06_06_000003_create_comprobantes_pago_tienda_table.php
```

#### INC-07 — Stock definitivo

```
app/Domains/Tienda/PagosWeb/Actions/DescontarStockDefinitivoPedidoWebAction.php
app/Domains/Tienda/PagosWeb/Events/PagoTiendaAceptadoEvent.php
app/Domains/Tienda/PagosWeb/Events/StockPedidoWebDescontadoEvent.php
app/Domains/Tienda/PagosWeb/Listeners/RegistrarAuditoriaPagoAceptadoListener.php
app/Domains/Tienda/PagosWeb/Listeners/RegistrarAuditoriaStockDescontadoListener.php
app/Domains/Tienda/TiendaServiceProvider.php (wiring de eventos)
```

#### INC-08 — UX

```
app/Domains/Tienda/Mensajes/TiendaMensajeService.php
app/Http/Controllers/Tienda/CarritoController.php (modificado — timer)
app/Http/Controllers/Tienda/CheckoutController.php (modificado — countdown)
app/Http/Controllers/Tienda/CuentaClienteDashboardController.php (modificado — mensajes)
app/Http/Controllers/Tienda/PedidoWebController.php (modificado — comprobantes)
app/Http/Controllers/Tienda/PagoWebController.php (modificado — show())
app/Http/Controllers/Tienda/AdminPagoTiendaController.php (modificado — show())
app/Http/Controllers/Tienda/AdminPedidoTiendaController.php (modificado — show())
app/Models/Carrito.php (modificado — relación reservas)
```

#### INC-09 — Tests

```
tests/Feature/Tienda/ReservasStockTest.php
tests/Feature/Tienda/ConfiguracionTiendaTest.php
tests/Feature/Tienda/CheckoutEditableTest.php
tests/Feature/Tienda/AdminPedidoTiendaTest.php
tests/Feature/Tienda/AdminPagoTiendaTest.php
tests/Feature/Tienda/ComprobantesPagoTiendaTest.php
tests/Feature/Tienda/StockDefinitivoTest.php
tests/Feature/Tienda/ConcurrenciaStockTest.php
tests/Feature/Tienda/TiendaTestCase.php (base test case)
```

---

## 14. Decisions y fixes técnicos

### Decisiones de arquitectura

1. **PedidoTienda estado inicial = `pendiente_revision`** — Requiere revisión admin antes de pago
2. **Descuento de stock solo al aceptar pago** — No al aceptar pedido
3. **Reservas con TTL configurable** — Desde tabla `configuraciones_tienda`
4. **Historial de comprobantes** — Nunca sobrescribir, solo marcar como reemplazado
5. **3 eventos al final de transacción** — Para auditoría/acciones secundarias
6. **`DescontarStockDefinitivoPedidoWebAction`** corre dentro de la misma DB::transaction que `AceptarPagoPedidoTiendaAction`
7. **`ConfirmarPedidoAction` removido de `AceptarPagoPedidoTiendaAction`** — Previene doble descuento de stock

### Fixes técnicos realizados

#### PHP enum como keys en array const

**Problema:** PHP 8.3 no permite usar casos de enum como keys en declaraciones `const`.
**Solución:** Usar `static function` lazy-init con `->value`:

```php
// ANTES (error)
const MENSAJES = [
    EstadoPedidoTiendaEnum::PENDIENTE_REVISION => '...',
];

// DESPUÉS (funciona)
private static array $mensajesPedido = [];
private static function mensajes(): array {
    if (empty(self::$mensajesPedido)) {
        self::$mensajesPedido = [
            EstadoPedidoTiendaEnum::PENDIENTE_REVISION->value => '...',
        ];
    }
    return self::$mensajesPedido;
}
```

#### Tipo de parámetro `puedeResubirComprobante`

**Problema:** `?string` no acepta `EstadoPagoEnum` que viene del model cast.
**Solución:** Cambiar a `EstadoPagoEnum|string|null` y extraer `->value` internamente.

#### `getOriginal()` retorna enum, no string

**Problema:** `$pago->getOriginal('estado_pago_pag')` retorna `EstadoPagoEnum`, no string.
**Solución:** Castear con `?->value` antes de pasar a `registrarAccion()`.

#### Doble descuento de stock

**Problema:** `AceptarPagoPedidoTiendaAction` llamaba `ConfirmarPedidoAction` que también descontaba stock.
**Solución:** Remover `ConfirmarPedidoAction` y actualizar estado del pedido directamente.

#### SQLite vs PostgreSQL `SUBSTRING`

**Problema:** `SUBSTRING(numero_factura_fac FROM 9)` es sintaxis PostgreSQL.
**Solución:** Cambiar a `SUBSTR(numero_factura_fac, 9)` (compatible con ambos).

#### Controllers retornaban RedirectResponse en tests JSON

**Problema:** Tests usaban `postJson` pero controllers retornaban `redirect()->back()` (302).
**Solución:** Agregar `if ($request->expectsJson()) return response()->json(...)` antes del redirect.

#### Test data incompleto

**Problema:** Tests no creaban `DetallePedido`, `PagoTienda` o usaban estados incorrectos de reserva.
**Solución:** Agregar registros faltantes y corregir estados en setUp de tests.

---

## 15. Checklist pre-merge

```bash
# Migraciones
php artisan migrate

# Seed de configuración
php artisan db:seed --class=ConfiguracionTiendaSeeder

# Tests
php artisan test --filter=Tienda

# Rutas
php artisan route:list --path=tienda
php artisan route:list --path=admin/tienda
php artisan route:list --path=configuraciones/tienda

# Frontend build
npm run build
```

### Estado actual

| Item | Estado |
|------|--------|
| Tests | 84/84 pasando |
| Build | Exitoso |
| Migraciones | Todas ejecutadas |
| Seeders | ConfiguracionTiendaSeeder ejecutado |
| Rutas | Todas definidas |
| Permisos | Spatie permissions configurados |
| Eventos | Wired en TiendaServiceProvider |

---

*Documento generado automáticamente desde la implementación de los sprints incrementales del módulo Tienda Online.*
