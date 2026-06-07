# Sprint INC-09 — QA, pruebas y concurrencia

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-09 |
| Tipo | QA / Testing / Integración |
| Depende de | Todos los sprints incrementales |
| Objetivo | Validar que las nuevas funcionalidades no rompan el módulo tienda ni el back-office |

---

## 1. Qué se prueba

Solo se prueban las nuevas funcionalidades incrementales:

- Reservas temporales de stock.
- Expiración de reservas.
- Configuración dinámica de tiempos.
- Checkout editable.
- Cancelación controlada.
- Aprobación/rechazo de pedido.
- Validación de pago.
- Resubida de comprobantes.
- Descuento definitivo de stock.
- Concurrencia con `lockForUpdate()`.

---

## 2. Lo que NO se prueba como funcionalidad nueva

No se vuelve a probar como sprint principal:

- CRUD base de productos.
- Catálogo base.
- Login base.
- Carrito base simple.
- Checkout base simple.
- Pedidos base.
- Pagos base.

Solo se hacen pruebas de regresión donde interactúan con las nuevas funcionalidades.

---

## 3. Matriz QA funcional

| ID | Caso | Resultado esperado |
|---|---|---|
| QA-01 | Cliente agrega producto al carrito | Se crea reserva activa |
| QA-02 | Otro cliente ve el mismo producto | Stock disponible reducido |
| QA-03 | Reserva vence | Stock disponible vuelve a subir |
| QA-04 | Cliente elimina producto | Reserva liberada |
| QA-05 | Cliente reduce cantidad | Se libera diferencia |
| QA-06 | Cliente aumenta cantidad con stock | Reserva aumenta |
| QA-07 | Cliente aumenta cantidad sin stock | Error 422 |
| QA-08 | Cliente inicia checkout | Reservas se extienden |
| QA-09 | Cliente vuelve al carrito | Reservas se mantienen |
| QA-10 | Cliente cancela compra | Reservas se liberan |
| QA-11 | Admin cambia tiempo carrito | Nuevas reservas usan nuevo tiempo |
| QA-12 | Admin cambia tiempo checkout | Nuevos checkouts usan nuevo tiempo |
| QA-13 | Admin acepta pedido | No se descuenta stock físico |
| QA-14 | Admin rechaza pedido | Reservas liberadas |
| QA-15 | Admin observa pago | Cliente puede resubir comprobante |
| QA-16 | Admin rechaza pago | Cliente puede resubir comprobante |
| QA-17 | Cliente resube comprobante | Pago vuelve a pendiente |
| QA-18 | Admin acepta pago | Stock físico se descuenta |
| QA-19 | Admin acepta pago dos veces | No se duplica descuento |
| QA-20 | Pago aceptado | Cliente no puede resubir comprobante |

---

## 4. Pruebas de concurrencia

### CONC-01 — Dos clientes reservan último stock

```txt
Stock físico = 1
Cliente A intenta reservar 1
Cliente B intenta reservar 1 al mismo tiempo
```

Resultado esperado:

```txt
Solo uno reserva.
El otro recibe error de stock insuficiente.
```

---

### CONC-02 — Admin acepta pago dos veces

```txt
Dos requests simultáneos aceptan el mismo pago.
```

Resultado esperado:

```txt
Solo una transacción descuenta stock.
La otra se rechaza por estado ya pagado.
```

---

### CONC-03 — Reserva vence mientras cliente intenta checkout

Resultado esperado:

```txt
No se genera pedido si la reserva venció.
Se pide revisar carrito.
```

---

## 5. Pruebas de seguridad

| ID | Caso | Resultado |
|---|---|---|
| SEC-01 | Cliente intenta ver pedido ajeno | 403 |
| SEC-02 | Cliente intenta resubir pago ajeno | 403 |
| SEC-03 | Cliente intenta resubir pago aceptado | 422/403 |
| SEC-04 | Usuario sin permiso acepta pedido | 403 |
| SEC-05 | Usuario sin permiso acepta pago | 403 |
| SEC-06 | Archivo inválido | Rechazado |
| SEC-07 | Comprobante privado | No accesible sin autorización |

---

## 6. Pruebas de regresión

| Módulo | Verificar |
|---|---|
| Catálogo | Stock visible considera reservas |
| Carrito | Sigue agregando/eliminando productos |
| Checkout | No genera pedido con reserva vencida |
| Pedidos admin | No se rompe flujo manual |
| Pagos admin | Estados nuevos no rompen listado |
| Inventario | Stock físico no cambia hasta pago aceptado |
| Facturación | Solo se emite tras pago aceptado |
| Roles | Cliente no accede dashboard |

---

## 7. Pruebas automatizadas sugeridas

```txt
tests/Feature/Tienda/ReservasStockTest.php
tests/Feature/Tienda/ConfiguracionTiendaTest.php
tests/Feature/Tienda/CheckoutEditableTest.php
tests/Feature/Tienda/AdminPedidoTiendaTest.php
tests/Feature/Tienda/AdminPagoTiendaTest.php
tests/Feature/Tienda/ComprobantesPagoTiendaTest.php
tests/Feature/Tienda/StockDefinitivoTest.php
tests/Feature/Tienda/ConcurrenciaStockTest.php
```

---

## 8. Checklist pre-merge

```txt
php artisan migrate
php artisan db:seed --class=ConfiguracionTiendaSeeder
php artisan test --filter=Tienda
php artisan route:list --path=tienda
php artisan route:list --path=dashboard/configuraciones
npm run build
```

---

## 9. Criterios de cierre

- Reservas temporales funcionan.
- Expiración libera stock disponible.
- Admin configura tiempos desde dashboard.
- Cliente puede editar checkout antes de generar pedido.
- Admin aprueba/rechaza pedido.
- Admin acepta/observa/rechaza pago.
- Cliente puede resubir comprobante.
- Stock físico se descuenta solo al aceptar pago.
- No existe doble descuento por concurrencia.
- Todas las pruebas críticas pasan.
