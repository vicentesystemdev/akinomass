# Sprint 06 — Pedidos web (integración con pedidos existentes)

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-06 |
| **Duración estimada** | 4–5 días |
| **Perfil** | Backend (Marcelo — pedidos) |
| **Rama** | `feature/tienda-06-pedidos-web` |
| **Depende de** | Sprint 05 |
| **Habilita** | 07, 11 |

---

## Objetivo

Generar `pedidos` + `detalles_pedido` usando Actions existentes del dominio Comercial, y registrar metadata en `pedidos_tienda`.

---

## Migración: `pedidos_tienda`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_pedido_tienda` | `bigIncrements` | NO | — | PK |
| `cod_pedido` | `unsignedBigInteger` | NO | — | FK → `pedidos`, **UNIQUE** |
| `cod_checkout_sesion` | `unsignedBigInteger` | NO | — | FK → `checkout_sesiones` |
| `user_id` | `foreignId` | NO | — | FK → `users` |
| `cod_cuenta_cliente` | `unsignedBigInteger` | NO | — | FK → `cuentas_cliente` |
| `session_id_pte` | `string(100)` | SÍ | `null` | |
| `ip_origen_pte` | `string(45)` | SÍ | `null` | |
| `user_agent_pte` | `text` | SÍ | `null` | |
| `estado_pte` | `string(20)` | NO | `pendiente_pago` | INDEX |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

### Enum: `EstadoPedidoTiendaEnum`

| Case | Valor |
|------|-------|
| `PENDIENTE_PAGO` | `pendiente_pago` |
| `PAGADO` | `pagado` |
| `FACTURADO` | `facturado` |
| `CANCELADO` | `cancelado` |

---

## Action principal: `GenerarPedidoDesdeCheckoutAction`

### Pasos (transacción DB)

| Paso | Acción |
|------|--------|
| 1 | Validar `checkout_sesiones.estado_che = datos_completados` |
| 2 | Validar stock por línea carrito |
| 3 | Mapear carrito → array `detalles` para `CrearPedidoAction` |
| 4 | Resolver `cod_cliente` desde `cuentas_cliente` |
| 5 | Resolver canal `web` y flujo `compra_web` |
| 6 | Llamar `CrearPedidoAction::execute($data, $codUsuarioResponsable)` |
| 7 | `cod_usuario_responsable` = `null` o usuario sistema (config) |
| 8 | Insert `pedidos_tienda` |
| 9 | Actualizar checkout `estado_che = pedido_generado` |
| 10 | `estado_car = convertido` |

### Mapeo a `CrearPedidoAction`

| Campo pedido | Valor |
|--------------|-------|
| `cod_cliente` | de cuenta cliente |
| `cod_canal_venta` | ID canal `web` |
| `cod_tipo_flujo_comercial` | ID flujo `compra_web` |
| `estado_ped` | `borrador` (inicial) |
| `detalles[].cod_producto` | del carrito |
| `detalles[].cantidad` | `cantidad_dca` |
| `detalles[].precio_unitario` | `precio_unitario_dca` |

**Reutilizar:** `app/Domains/Comercial/Pedidos/Actions/CrearPedidoAction.php`

---

## Política de confirmación pedido

| Evento | Quién | Action |
|--------|-------|--------|
| Tras pago confirmado (Sprint 07) | Staff o listener | `ConfirmarPedidoAction` |
| Descuento stock | Listener existente / inventario | según arquitectura actual |

**Condición P10:** validar stock en paso 2; descontar al confirmar pedido.

---

## Rutas

| Método | Ruta | Permiso |
|--------|------|---------|
| POST | `/tienda/checkout/{token}/generar-pedido` | `checkout.completar` |

---

## Área cliente — consulta (lectura)

| Action | Descripción |
|--------|-------------|
| `ListarPedidosClienteAction` | Pedidos por `cod_cliente` del user |
| `ObtenerPedidoClienteAction` | Detalle si pertenece al cliente |

**Condición:** Policy verifica `pedidos_tienda.user_id` o `cod_cliente`.

---

## Condiciones

| # | Condición |
|---|-----------|
| 1 | No duplicar lógica de totales; usar `PedidoService` |
| 2 | No INSERT directo en `pedidos` desde controller |
| 3 | Un checkout → un pedido (unique por `cod_checkout_sesion`) |
| 4 | Pedido visible en admin `/pedidos` sin cambios de UI admin |

---

## Criterios de aceptación

- [ ] Checkout completado genera fila en `pedidos` + `detalles_pedido`.
- [ ] Fila `pedidos_tienda` enlazada.
- [ ] Admin ve pedido en listado existente.
- [ ] Cliente ve pedido en `ListarPedidosClienteAction`.
- [ ] Stock insuficiente → rollback y error 422.
- [ ] Tests integración con `CrearPedidoAction` mockeado o BD test.
