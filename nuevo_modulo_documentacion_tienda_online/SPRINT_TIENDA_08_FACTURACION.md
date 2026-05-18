# Sprint 08 — Facturación (comprobantes)

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-08 |
| **Duración estimada** | 4–5 días |
| **Perfil** | Backend senior |
| **Rama** | `feature/tienda-08-facturacion` |
| **Depende de** | Sprint 07 |
| **Habilita** | 11, 12 |

---

## Objetivo

Emitir comprobante/factura interna tras pedido confirmado y pago validado, con líneas snapshot en `detalles_factura`.

---

## Migración 1: `facturas`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_factura` | `bigIncrements` | NO | — | PK |
| `cod_pedido` | `unsignedBigInteger` | NO | — | FK → `pedidos`, **UNIQUE** |
| `cod_pago` | `unsignedBigInteger` | SÍ | `null` | FK → `pagos` |
| `cod_checkout_sesion` | `unsignedBigInteger` | SÍ | `null` | FK → `checkout_sesiones` |
| `numero_factura_fac` | `string(30)` | NO | — | **UNIQUE** |
| `tipo_comprobante_fac` | `string(20)` | NO | `recibo` | INDEX |
| `estado_fac` | `string(20)` | NO | `borrador` | INDEX |
| `fecha_emision_fac` | `date` | NO | — | |
| `documento_cliente_fac` | `string(30)` | NO | — | Snapshot |
| `razon_social_cliente_fac` | `string(255)` | NO | — | |
| `direccion_fiscal_fac` | `text` | SÍ | `null` | |
| `subtotal_fac` | `decimal(12,2)` | NO | — | |
| `descuento_fac` | `decimal(12,2)` | NO | `0` | |
| `impuesto_fac` | `decimal(12,2)` | NO | `0` | |
| `total_fac` | `decimal(12,2)` | NO | — | |
| `moneda_fac` | `string(3)` | NO | `BOB` | |
| `codigo_control_fac` | `string(100)` | SÍ | `null` | Fiscal futuro |
| `observacion_fac` | `text` | SÍ | `null` | |
| `emitida_por_user_id` | `foreignId` | SÍ | `null` | Staff |
| `anulada_en_fac` | `timestamp` | SÍ | `null` | |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

### Enums

**EstadoFacturaEnum:** `borrador`, `emitida`, `anulada`  
**TipoComprobanteEnum:** `factura`, `recibo`, `nota_credito`

---

## Migración 2: `detalles_factura`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_detalle_factura` | `bigIncrements` | NO | — | PK |
| `cod_factura` | `unsignedBigInteger` | NO | — | FK CASCADE |
| `cod_producto` | `unsignedBigInteger` | SÍ | `null` | FK → `productos` |
| `cod_detalle_pedido` | `unsignedBigInteger` | SÍ | `null` | FK → `detalles_pedido` |
| `descripcion_dfa` | `string(255)` | NO | — | |
| `cantidad_dfa` | `unsignedInteger` | NO | — | |
| `precio_unitario_dfa` | `decimal(12,2)` | NO | — | |
| `subtotal_dfa` | `decimal(12,2)` | NO | — | |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

---

## Actions

| Action | Descripción |
|--------|-------------|
| `EmitirFacturaDesdePedidoAction` | Crea factura + líneas desde `detalles_pedido` |
| `AnularFacturaAction` | `estado_fac = anulada` |
| `GenerarNumeroFacturaService` | `FAC-{YEAR}-{SECUENCIA}` |
| `ObtenerFacturaClienteAction` | Lectura para área cliente |

---

## Disparador

| Condición | Acción |
|-----------|--------|
| `pedidos.estado_ped = confirmado` AND `pagos.estado_pago_pag = pagado` | Emitir factura |
| Implementación | Listener `EmitirFacturaTrasConfirmacionListener` |

Actualizar:

- `pedidos_tienda.estado_pte = facturado`
- `checkout_sesiones.estado_che = completado` (si no lo está)

---

## Numeración

| Formato | Ejemplo |
|---------|---------|
| `FAC-{YYYY}-{000001}` | FAC-2026-000042 |

Secuencia en tabla o cache Redis con lock.

---

## Rutas

| Método | Ruta | Auth | Permiso |
|--------|------|------|---------|
| GET | `/tienda/mis-pedidos/{pedido}/factura` | Cliente | `cuenta.ver_pedido` |
| GET | `/admin/facturas/{factura}` | Staff | nuevo `facturas.ver` (opcional v2) |

**v1:** cliente solo descarga/ve PDF HTML Inertia; admin puede usar módulo futuro.

---

## PDF / impresión (opcional v1)

| Opción | Esfuerzo |
|--------|----------|
| Vista print-friendly React | Bajo |
| DomPDF Laravel | Medio |

**Recomendación v1:** vista `Tienda/FacturaShow.jsx` imprimible.

---

## Condiciones

| # | Condición |
|---|-----------|
| 1 | Una factura `emitida` por pedido (unique `cod_pedido`) |
| 2 | No modificar `pedidos` / `pagos` al emitir |
| 3 | Anulación no borra filas; marca estado |
| 4 | P03: sin integración SIN en v1 |

---

## Criterios de aceptación

- [ ] Pedido confirmado + pago pagado → factura `emitida`.
- [ ] Líneas coinciden con `detalles_pedido`.
- [ ] Cliente accede solo a su factura.
- [ ] `numero_factura_fac` único.
- [ ] Tests emisión y anulación.
