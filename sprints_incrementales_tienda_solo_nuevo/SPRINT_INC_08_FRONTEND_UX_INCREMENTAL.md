# Sprint INC-08 — Mejoras UX incrementales para cliente y admin

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-08 |
| Tipo | Frontend Cliente + Dashboard Admin |
| Depende de | Sprints incrementales backend |
| Objetivo | Añadir interfaces y mensajes para reservas, tiempos, aprobación de pedido, validación de pago y resubida |

---

## 1. Qué se añade

Se añaden mejoras visuales y funcionales sobre las pantallas existentes.

---

## 2. Lo que NO se rehace

No se rehace:

- Storefront completo.
- Catálogo completo.
- Carrito base.
- Checkout base.
- Área cliente base.
- Dashboard admin base.

---

## 3. Mejoras en carrito

Añadir:

```txt
Temporizador de reserva.
Mensaje de productos reservados.
Stock disponible calculado con reservas.
Alerta de reserva vencida.
Botón actualizar carrito.
```

Mensaje recomendado:

```txt
Tus productos están reservados por tiempo limitado.
```

---

## 4. Mejoras en checkout

Añadir botones:

```txt
Volver al carrito
Agregar más productos
Actualizar cantidades
Cancelar compra
Continuar pago
```

Mostrar temporizador:

```txt
Tienes X minutos para completar tu compra.
```

---

## 5. Mejoras en Mi Cuenta / Mis Pedidos

Mostrar estados claros:

| Estado | Mensaje |
|---|---|
| `pendiente_revision` | Tu pedido está pendiente de revisión |
| `aceptado` | Tu pedido fue aceptado. Estamos revisando tu pago |
| `rechazado` | Tu pedido fue rechazado |
| `pago_observado` | Tu comprobante fue observado |
| `pago_rechazado` | Tu pago fue rechazado |
| `confirmado` | Tu pago fue aceptado y tu pedido confirmado |
| `facturado` | Tu comprobante interno está disponible |

---

## 6. Resubida de comprobante

Mostrar botón:

```txt
Subir nuevo comprobante
```

Solo cuando:

```txt
pago = observado o rechazado
pedido no confirmado
pedido no facturado
```

---

## 7. Dashboard admin — revisión de pedido

En detalle del pedido tienda añadir sección:

```txt
Revisión del pedido
```

Botones:

```txt
Aceptar pedido
Rechazar pedido
```

Si rechaza, motivo obligatorio.

---

## 8. Dashboard admin — revisión de pago

En detalle del pedido/pago añadir sección:

```txt
Validación del pago
```

Botones:

```txt
Aceptar pago
Observar pago
Rechazar pago
```

Si observa o rechaza, motivo obligatorio.

---

## 9. Dashboard admin — historial de comprobantes

Mostrar:

```txt
Intento
Fecha subida
Archivo
Estado
Observación
Admin revisor
Fecha revisión
```

---

## 10. Validaciones UX

| Caso | Comportamiento |
|---|---|
| Reserva vencida | Redirigir/revisar carrito |
| Stock insuficiente | Mostrar cantidad disponible |
| Pago observado | Mostrar motivo y botón resubir |
| Pago aceptado | Ocultar resubida |
| Pedido rechazado | Ocultar acciones de pago |
| Checkout expirado | Bloquear avance |

---

## 11. Criterios de aceptación

- Cliente ve temporizador de reserva.
- Cliente ve temporizador de checkout.
- Cliente puede volver al carrito desde checkout.
- Cliente puede resubir comprobante si corresponde.
- Admin puede aceptar/rechazar pedido desde UI.
- Admin puede aceptar/observar/rechazar pago desde UI.
- Admin puede ver historial de comprobantes.
