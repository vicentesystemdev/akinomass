# Sprint INC-03 — Checkout editable, volver al carrito y cancelación controlada

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-03 |
| Tipo | Backend + UX |
| Depende de | Checkout base, reservas temporales, configuración dinámica |
| Objetivo | Permitir que el cliente edite carrito durante checkout antes de generar pedido |

---

## 1. Qué se añade

Se añade comportamiento flexible durante checkout:

- Volver al carrito desde checkout.
- Agregar más productos.
- Aumentar o reducir cantidades.
- Cancelar compra.
- Mantener o liberar reservas según acción.

---

## 2. Lo que NO se rehace

No se vuelve a implementar:

- Checkout base.
- Carrito base.
- Registro cliente.
- Generación base de pedido.
- Frontend completo de checkout.

---

## 3. Regla de edición del checkout

El carrito puede editarse solo si el checkout está en:

```txt
iniciado
datos_completados
```

No puede editarse si está en:

```txt
pedido_generado
pago_registrado
pago_confirmado
completado
expirado
cancelado
```

---

## 4. Funcionalidades nuevas

### 4.1 Volver al carrito

```txt
Cliente vuelve al carrito desde checkout.
El checkout no se cancela definitivamente.
El carrito mantiene sus reservas activas.
```

### 4.2 Agregar más productos

```txt
Cliente vuelve al catálogo.
Agrega más productos.
Se crean nuevas reservas.
Checkout recalcula totales al regresar.
```

### 4.3 Aumentar cantidad

```txt
Se valida stock adicional disponible.
Se usa DB::transaction() y lockForUpdate().
Se actualiza reserva.
```

### 4.4 Reducir cantidad

```txt
Se libera la diferencia de reserva.
Se actualizan totales.
```

### 4.5 Cancelar compra

Dos comportamientos:

```txt
Volver al carrito = mantiene reservas.
Cancelar compra = libera reservas y cancela checkout.
```

---

## 5. Actions nuevas

```txt
VolverAlCarritoDesdeCheckoutAction
CancelarCheckoutManteniendoCarritoAction
CancelarCheckoutLiberandoReservasAction
ActualizarCheckoutTrasCambioCarritoAction
ExtenderReservasAlIniciarCheckoutAction
ExpirarCheckoutConReservasAction
```

---

## 6. Validaciones

| Caso | Validación |
|---|---|
| Checkout ajeno | 403 |
| Checkout expirado | No editable |
| Checkout completado | No editable |
| Pedido ya generado | No editar carrito |
| Nueva cantidad > stock disponible | Error 422 |
| Reserva vencida | Solicitar revisar carrito |
| Cancelar compra | Liberar reservas |

---

## 7. Interacción con tablas existentes y nuevas

| Tabla | Interacción |
|---|---|
| `checkout_sesiones` | Se actualiza estado y expiración |
| `carritos` | Cambia entre activo/en_checkout/cancelado |
| `detalles_carrito` | Se actualizan cantidades |
| `reservas_stock_carrito` | Se extienden, actualizan o liberan reservas |
| `productos` | Se valida disponibilidad |
| `inventarios` | Se bloquea para validar stock disponible |

---

## 8. Reglas de expiración

Al iniciar checkout:

```txt
Las reservas activas se extienden hasta el vencimiento del checkout.
```

Al expirar checkout:

```txt
checkout = expirado
reservas = expiradas o liberadas
carrito = expirado o abandonado
```

---

## 9. Criterios de aceptación

- Cliente puede volver al carrito desde checkout.
- Cliente puede agregar productos adicionales antes de generar pedido.
- Cliente puede aumentar cantidad si hay stock disponible.
- Cliente puede reducir cantidad y liberar stock reservado.
- Cliente puede cancelar compra y liberar reservas.
- No se permite editar carrito cuando ya existe pedido generado.
