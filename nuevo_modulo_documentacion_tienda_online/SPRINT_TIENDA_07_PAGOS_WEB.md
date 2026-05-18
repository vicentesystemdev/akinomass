# Sprint 07 — Pagos web

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-07 |
| **Duración estimada** | 4–5 días |
| **Perfil** | Backend (Marcelo — pagos) |
| **Rama** | `feature/tienda-07-pagos-web` |
| **Depende de** | Sprint 06 |
| **Habilita** | 08, 11 |

---

## Objetivo

Registrar pago en tabla `pagos` existente, metadata en `pagos_tienda`, subida de comprobante y flujo de confirmación desde back-office.

---

## Migración: `pagos_tienda`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_pago_tienda` | `bigIncrements` | NO | — | PK |
| `cod_pago` | `unsignedBigInteger` | NO | — | FK → `pagos`, **UNIQUE** |
| `cod_checkout_sesion` | `unsignedBigInteger` | NO | — | FK → `checkout_sesiones` |
| `user_id` | `foreignId` | SÍ | `null` | FK → `users` |
| `comprobante_ruta_pwe` | `string(255)` | SÍ | `null` | |
| `comprobante_hash_pwe` | `string(64)` | SÍ | `null` | |
| `banco_origen_pwe` | `string(100)` | SÍ | `null` | |
| `fecha_subida_comprobante_pwe` | `timestamp` | SÍ | `null` | |
| `intentos_pago_pwe` | `unsignedTinyInteger` | NO | `0` | |
| `metadata_pwe` | `json` | SÍ | `null` | |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

---

## Action: `RegistrarPagoDesdeCheckoutAction`

| Paso | Detalle |
|------|---------|
| 1 | Validar pedido existe y `estado_pte = pendiente_pago` |
| 2 | `RegistrarPagoAction::execute([...], $userId)` |
| 3 | `estado_pago_pag = pendiente` |
| 4 | `monto_pag = checkout.total_che` |
| 5 | `metodo_pago_pag` desde `metodo_pago_elegido_che` |
| 6 | Insert `pagos_tienda` |
| 7 | Guardar comprobante en `storage/app/comprobantes/{cod_pago}/` |
| 8 | `checkout.estado_che = pago_registrado` |

**Reutilizar:** `app/Domains/Comercial/Pagos/Actions/RegistrarPagoAction.php`

---

## Subida de archivo

| Regla | Valor |
|-------|-------|
| Disco | `local` o `public` según P15 |
| Max size | 5 MB |
| MIME | jpg, jpeg, png, pdf |
| Nombre | hash + extensión |

| Request | Campos |
|---------|--------|
| `RegistrarPagoCheckoutRequest` | `metodo_pago_pag`, `referencia_pag`, `comprobante` (file, required_if) |

---

## Confirmación (back-office — sin sprint nuevo)

Reutilizar rutas admin existentes:

| Ruta admin | Action |
|------------|--------|
| `POST /pagos/{pago}/confirmar` | `ConfirmarPagoAction` |

### Listener nuevo (recomendado): `ConfirmarPedidoTrasPagoWebListener`

| Evento | `PagoConfirmado` (si existe) o hook en `ConfirmarPagoAction` |
|--------|----------------------------------------------------------------|
| Acción | `ConfirmarPedidoAction` + `pedidos_tienda.estado_pte = pagado` + `checkout.estado_che = pago_confirmado` |

---

## Rutas tienda

| Método | Ruta | Permiso |
|--------|------|---------|
| POST | `/tienda/checkout/{token}/pago` | `checkout.completar` |
| GET | `/tienda/mis-pedidos/{pedido}/pago` | `cuenta.ver_pedido` |

---

## Estados sincronizados

| `pagos.estado_pago_pag` | `pedidos_tienda.estado_pte` | `checkout.estado_che` |
|-------------------------|----------------------------|------------------------|
| `pendiente` | `pendiente_pago` | `pago_registrado` |
| `pagado` | `pagado` | `pago_confirmado` |
| `rechazado` | `pendiente_pago` o `cancelado` | según regla |

---

## Condiciones

| # | Condición |
|---|-----------|
| 1 | Registrar pago ≠ confirmar pedido automáticamente (salvo P07) |
| 2 | Cliente solo ve sus pagos (policy) |
| 3 | Banner UI: "El registro de pago no confirma acreditación bancaria" |
| 4 | No pasarela externa automática |

---

## Criterios de aceptación

- [ ] Cliente sube comprobante → `pagos` + `pagos_tienda`.
- [ ] Staff confirma desde admin → pedido pasa a confirmado (si regla aplica).
- [ ] Pago rechazado no marca pedido como pagado.
- [ ] Archivo no accesible públicamente sin autorización.
- [ ] Tests: registro pago, validación archivo.
