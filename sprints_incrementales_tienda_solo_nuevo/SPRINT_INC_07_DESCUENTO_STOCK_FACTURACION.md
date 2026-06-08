# Sprint INC-07 — Descuento definitivo de stock y cierre del flujo

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-07 |
| Tipo | Backend / Inventario / Facturación |
| Depende de | Validación administrativa del pago, reservas temporales |
| Objetivo | Descontar stock físico solo al aceptar el pago y cerrar correctamente el flujo |

---

## 1. Qué se añade

Se añade la regla final del flujo:

```txt
El stock físico real solo se descuenta cuando el admin acepta el pago.
```

Luego se confirma el pedido y se habilita la emisión del comprobante/factura interna.

---

## 2. Lo que NO se rehace

No se vuelve a implementar:

- Inventario base.
- Pedidos base.
- Pagos base.
- Facturación base.
- Listeners base si ya existen.

---

## 3. Regla principal

```txt
Aceptar pedido NO descuenta stock físico.
Aceptar pago SÍ descuenta stock físico.
```

---

## 4. Action crítica

```txt
DescontarStockDefinitivoPedidoWebAction
```

Debe ejecutarse dentro de:

```php
DB::transaction(function () {
    // lockForUpdate()
});
```

---

## 5. Lógica al aceptar pago

1. Bloquear `pedido_tienda`.
2. Bloquear `pago`.
3. Validar que el pago no esté pagado.
4. Bloquear inventarios por producto.
5. Validar stock físico suficiente.
6. Descontar stock físico.
7. Marcar reservas como `convertida_pedido`.
8. Cambiar pago a `pagado`.
9. Cambiar pedido tienda a `confirmado`.
10. Cambiar pedido base a `confirmado`.
11. Cambiar checkout a `pago_confirmado`.
12. Disparar evento para comprobante/factura.

---

## 6. Validación de idempotencia

El sistema debe impedir doble descuento.

Validaciones:

```txt
Si pago.estado_pago_pag = pagado → no volver a descontar.
Si pedido_tienda.estado_pte = confirmado/facturado → no volver a descontar.
Si reservas ya están convertida_pedido → no volver a convertir.
```

---

## 7. Stock insuficiente al aceptar pago

Aunque exista reserva, debe validarse stock físico real por seguridad.

Si no hay stock suficiente:

```txt
No aceptar pago.
No confirmar pedido.
No descontar parcialmente.
Mostrar alerta al admin.
Mantener pago en revisión.
Registrar auditoría.
```

---

## 8. Eventos sugeridos

```txt
PagoTiendaAceptado
PedidoTiendaConfirmado
StockPedidoWebDescontado
FacturaTiendaSolicitada
```

Listeners:

```txt
DescontarStockPedidoWebListener
ConvertirReservasPedidoWebListener
EmitirFacturaPedidoWebListener
NotificarClientePagoAceptadoListener
RegistrarAuditoriaListener
```

---

## 9. Interacción con tablas existentes y nuevas

| Tabla | Interacción |
|---|---|
| `inventarios` | Descuento físico definitivo |
| `movimientos_inventario` | Registrar salida por pedido web si existe módulo |
| `pedidos` | Cambia a confirmado |
| `pedidos_tienda` | Cambia a confirmado/facturado |
| `pagos` | Cambia a pagado |
| `pagos_tienda` | Guarda revisión aceptada |
| `reservas_stock_carrito` | Cambia a convertida_pedido |
| `facturas` | Se emite después de confirmar pago |
| `detalles_factura` | Líneas snapshot |

---

## 10. Auditoría

Auditar:

```txt
Pago aceptado
Stock descontado
Producto
Cantidad
Pedido
Pago
Admin responsable
Fecha/hora
```

---

## 11. Criterios de aceptación

- Aceptar pedido no descuenta stock.
- Aceptar pago descuenta stock físico.
- El descuento no se duplica si se repite la acción.
- Si falta stock, no se confirma el pago.
- Las reservas pasan a convertida_pedido.
- El cliente ve pago aceptado y pedido confirmado.
- Se dispara emisión de comprobante/factura interna.
