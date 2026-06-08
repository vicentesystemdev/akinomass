# Sprint INC-04 — Aprobación o rechazo administrativo del pedido

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-04 |
| Tipo | Backend + Dashboard Admin |
| Depende de | Pedido web base, checkout base, reservas temporales |
| Objetivo | Separar la aprobación del pedido de la validación del pago |

---

## 1. Qué se añade

Se añade un paso administrativo antes de validar el pago:

```txt
Admin acepta o rechaza pedido.
```

Aceptar pedido no descuenta stock físico.  
Rechazar pedido libera reservas y finaliza el flujo.

---

## 2. Lo que NO se rehace

No se vuelve a crear:

- Pedido web base.
- Tabla base de pedidos.
- Tabla base de pedidos_tienda si ya existe.
- Back-office completo de pedidos.

---

## 3. Nuevos estados requeridos para pedido tienda

Si `pedidos_tienda` ya existe, estos estados deben añadirse a nivel de Enum/código:

```txt
pendiente_revision
aceptado
rechazado
pendiente_validacion_pago
pago_observado
pago_rechazado
confirmado
facturado
cancelado
expirado
```

> Nota: Si la tabla `pedidos_tienda` ya existe con columna `estado_pte`, no se crea otra tabla. Solo se amplía la lógica del enum y validaciones.

---

## 4. Regla principal

```txt
Aceptar pedido = permite continuar a revisión de pago.
Aceptar pedido NO descuenta stock físico.
Rechazar pedido = cancela flujo y libera reservas.
```

---

## 5. Actions nuevas

```txt
AceptarPedidoTiendaAction
RechazarPedidoTiendaAction
CancelarPedidoTiendaAction
ExpirarPedidoTiendaAction
```

---

## 6. Lógica de aceptar pedido

### Precondiciones

```txt
pedido_tienda.estado_pte = pendiente_revision
checkout_sesiones.estado_che = pago_registrado o pedido_generado
reservas activas existentes
```

### Resultado

```txt
pedido_tienda.estado_pte = aceptado
pago.estado_pago_pag = pendiente o en_revision
checkout_sesiones.estado_che = pago_registrado
```

### Mensaje al cliente

```txt
Tu pedido fue aceptado. Estamos verificando tu pago.
```

---

## 7. Lógica de rechazar pedido

### Precondiciones

```txt
pedido_tienda.estado_pte = pendiente_revision
```

### Resultado

```txt
pedido_tienda.estado_pte = rechazado
checkout_sesiones.estado_che = cancelado
reservas_stock_carrito.estado_res = liberada
pago.estado_pago_pag = anulado
```

### Mensaje al cliente

```txt
Tu pedido fue rechazado. Los productos fueron liberados.
```

---

## 8. Validaciones

| Caso | Validación |
|---|---|
| Pedido no está pendiente | No aceptar/rechazar |
| Pedido ya confirmado | No modificar |
| Pedido ajeno a flujo tienda | No aplicar |
| Admin sin permiso | 403 |
| Rechazo sin motivo | No permitir |
| Pago ya aceptado | No rechazar pedido |

---

## 9. Permisos nuevos

```txt
pedidos_tienda.revisar
pedidos_tienda.aceptar
pedidos_tienda.rechazar
```

---

## 10. Interacción con tablas existentes y nuevas

| Tabla | Interacción |
|---|---|
| `pedidos` | Puede mantenerse en borrador/pendiente hasta pago aceptado |
| `pedidos_tienda` | Cambia estado web del pedido |
| `checkout_sesiones` | Cambia estado según aceptación/rechazo |
| `pagos` | Si pedido rechazado, pago queda anulado |
| `reservas_stock_carrito` | Se liberan al rechazar pedido |
| `users` | Admin responsable de revisión |

---

## 11. Auditoría

Debe auditarse:

```txt
Pedido aceptado
Pedido rechazado
Motivo de rechazo
Usuario admin responsable
Fecha/hora
```

---

## 12. Criterios de aceptación

- Admin puede aceptar pedido pendiente.
- Aceptar pedido no descuenta stock físico.
- Admin puede rechazar pedido pendiente con motivo.
- Rechazar pedido libera reservas.
- Cliente ve estado actualizado.
- No se puede rechazar pedido ya confirmado.
