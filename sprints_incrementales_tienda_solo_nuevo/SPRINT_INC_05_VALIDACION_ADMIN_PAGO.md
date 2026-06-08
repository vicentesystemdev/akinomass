# Sprint INC-05 — Validación administrativa del pago

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-05 |
| Tipo | Backend + Dashboard Admin |
| Depende de | Aprobación administrativa del pedido, pagos web base |
| Objetivo | Permitir aceptar, observar o rechazar pagos desde el dashboard |

---

## 1. Qué se añade

Se añade un flujo formal de revisión del pago:

```txt
Aceptar pago
Observar pago
Rechazar pago
```

El stock físico se descuenta únicamente cuando el admin acepta el pago.

---

## 2. Lo que NO se rehace

No se vuelve a crear:

- Registro base de pago.
- Subida base de comprobante.
- Tabla base `pagos`.
- Tabla base `pagos_tienda` si ya existe.
- Panel completo de pagos.

---

## 3. Estados de pago requeridos

A nivel de enum/lógica:

```txt
pendiente
en_revision
observado
rechazado
pagado
anulado
```

---

## 4. Regla principal

```txt
Pago aceptado = pedido confirmado + stock físico descontado.
Pago observado = cliente debe corregir/subir nuevo comprobante.
Pago rechazado = cliente puede resubir comprobante o cancelar.
```

---

## 5. Actions nuevas

```txt
AceptarPagoPedidoTiendaAction
ObservarPagoPedidoTiendaAction
RechazarPagoPedidoTiendaAction
MarcarPagoEnRevisionAction
```

---

## 6. Lógica de aceptar pago

Debe ejecutarse con:

```php
DB::transaction(function () {
    // lockForUpdate()
});
```

### Resultado

```txt
pagos.estado_pago_pag = pagado
pedidos_tienda.estado_pte = confirmado
pedidos.estado_ped = confirmado
checkout_sesiones.estado_che = pago_confirmado
reservas_stock_carrito.estado_res = convertida_pedido
stock físico descontado
```

---

## 7. Lógica de observar pago

### Requisito

El admin debe ingresar motivo.

### Resultado

```txt
pagos.estado_pago_pag = observado
pedidos_tienda.estado_pte = pago_observado
checkout_sesiones.estado_che = pago_registrado
```

### Mensaje al cliente

```txt
Tu comprobante fue observado. Puedes subir un nuevo comprobante.
```

---

## 8. Lógica de rechazar pago

### Requisito

El admin debe ingresar motivo.

### Resultado

```txt
pagos.estado_pago_pag = rechazado
pedidos_tienda.estado_pte = pago_rechazado
checkout_sesiones.estado_che = pago_registrado
```

### Mensaje al cliente

```txt
Tu pago fue rechazado. Puedes subir un nuevo comprobante si corresponde.
```

---

## 9. Validaciones

| Caso | Validación |
|---|---|
| Pedido no aceptado | No validar pago |
| Pago ya aceptado | No aceptar otra vez |
| Pago observado sin motivo | No permitir |
| Pago rechazado sin motivo | No permitir |
| Admin sin permiso | 403 |
| Stock insuficiente al aceptar pago | Detener confirmación |
| Pago aceptado | No permitir resubida |

---

## 10. Permisos nuevos

```txt
pagos_tienda.revisar
pagos_tienda.aceptar
pagos_tienda.observar
pagos_tienda.rechazar
```

---

## 11. Interacción con tablas existentes y nuevas

| Tabla | Interacción |
|---|---|
| `pagos` | Cambia estado del pago |
| `pagos_tienda` | Guarda metadata de revisión |
| `pedidos_tienda` | Cambia estado según resultado del pago |
| `pedidos` | Se confirma solo cuando el pago es aceptado |
| `inventarios` | Se descuenta stock físico solo al aceptar pago |
| `reservas_stock_carrito` | Se convierten en pedido al aceptar pago |
| `checkout_sesiones` | Cambia estado del flujo |

---

## 12. Auditoría

Auditar:

```txt
Pago aceptado
Pago observado
Pago rechazado
Motivo
Admin responsable
Fecha/hora
```

---

## 13. Criterios de aceptación

- Admin puede aceptar pago de pedido aceptado.
- Al aceptar pago se descuenta stock físico.
- Pago aceptado dos veces no duplica descuento.
- Admin puede observar pago con motivo.
- Cliente ve observación y puede corregir.
- Admin puede rechazar pago con motivo.
- Cliente ve rechazo y puede resubir si está permitido.
