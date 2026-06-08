# Sprint INC-01 — Reservas temporales de stock

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-01 |
| Tipo | Backend / Inventario / Carrito |
| Depende de | Carrito base, productos, inventarios |
| Objetivo | Añadir reserva temporal de stock al carrito sin descontar stock físico definitivo |

---

## 1. Qué se añade

Se añade una capa de **reserva temporal de stock** para que cuando un cliente agregue productos al carrito, el stock disponible visible para otros clientes disminuya.

La reserva no representa una venta final. Es un bloqueo temporal.

---

## 2. Lo que NO se rehace

No se vuelve a crear:

- Carrito base.
- Detalles de carrito base.
- CRUD básico del carrito.
- Catálogo público.
- Inventario base.

---

## 3. Regla principal

```txt
Stock físico real = stock registrado en inventario
Stock reservado = suma de reservas activas no expiradas
Stock disponible = stock físico real - stock reservado
```

El stock físico real **no se descuenta** al agregar al carrito.

---

## 4. Tabla nueva recomendada

### `reservas_stock_carrito`

| Columna | Tipo | Null | Descripción |
|---|---:|:---:|---|
| `cod_reserva_stock_carrito` | bigIncrements | NO | PK |
| `cod_carrito` | unsignedBigInteger | NO | FK hacia `carritos` |
| `cod_detalle_carrito` | unsignedBigInteger | SÍ | FK hacia `detalles_carrito` |
| `cod_producto` | unsignedBigInteger | NO | FK hacia `productos` |
| `user_id` | foreignId | SÍ | Usuario cliente si existe |
| `session_id_res` | string(100) | SÍ | Sesión para invitado |
| `cantidad_res` | unsignedInteger | NO | Cantidad reservada |
| `estado_res` | string(30) | NO | Estado de reserva |
| `expira_en_res` | timestamp | NO | Fecha/hora de vencimiento |
| `confirmada_en_res` | timestamp | SÍ | Cuando se convierte en pedido confirmado |
| `liberada_en_res` | timestamp | SÍ | Cuando se libera o expira |
| `created_at` | timestamp | SÍ | Laravel |
| `updated_at` | timestamp | SÍ | Laravel |

### Estados de reserva

```txt
activa
expirada
liberada
convertida_pedido
cancelada
```

---

## 5. Migración sugerida

```php
Schema::create('reservas_stock_carrito', function (Blueprint $table) {
    $table->bigIncrements('cod_reserva_stock_carrito');

    $table->unsignedBigInteger('cod_carrito');
    $table->unsignedBigInteger('cod_detalle_carrito')->nullable();
    $table->unsignedBigInteger('cod_producto');

    $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->string('session_id_res', 100)->nullable();

    $table->unsignedInteger('cantidad_res');
    $table->string('estado_res', 30)->default('activa')->index();

    $table->timestamp('expira_en_res')->index();
    $table->timestamp('confirmada_en_res')->nullable();
    $table->timestamp('liberada_en_res')->nullable();

    $table->timestamps();

    $table->foreign('cod_carrito')->references('cod_carrito')->on('carritos')->cascadeOnDelete();
    $table->foreign('cod_detalle_carrito')->references('cod_detalle_carrito')->on('detalles_carrito')->nullOnDelete();
    $table->foreign('cod_producto')->references('cod_producto')->on('productos');

    $table->index(['cod_producto', 'estado_res', 'expira_en_res']);
    $table->index(['cod_carrito', 'estado_res']);
});
```

---

## 6. Lógica obligatoria con transacción y bloqueo

Toda operación de reserva debe usar:

```php
DB::transaction(function () {
    // lockForUpdate()
});
```

### Al agregar producto

1. Bloquear producto/inventario con `lockForUpdate()`.
2. Calcular reservas activas no expiradas.
3. Validar stock disponible.
4. Crear o actualizar `detalle_carrito`.
5. Crear o actualizar `reserva_stock_carrito`.
6. Recalcular totales del carrito.

### Al actualizar cantidad

1. Bloquear carrito, detalle e inventario.
2. Validar diferencia adicional.
3. Aumentar o reducir reserva.
4. Si se reduce cantidad, liberar la diferencia.
5. Recalcular totales.

### Al eliminar producto

1. Marcar reserva como `liberada`.
2. Eliminar o desactivar línea del carrito.
3. Recalcular totales.

---

## 7. Actions nuevas

```txt
AgregarItemCarritoConReservaAction
ActualizarCantidadCarritoConReservaAction
EliminarItemCarritoLiberandoReservaAction
VaciarCarritoLiberandoReservasAction
ExpirarReservasCarritoAction
CalcularStockDisponibleConReservasAction
```

---

## 8. Services nuevos

```txt
ReservaStockCarritoService
StockDisponibleTiendaService
```

### Responsabilidad de `StockDisponibleTiendaService`

```txt
stock_disponible = inventario.stock_actual - reservas activas no expiradas
```

---

## 9. Validaciones

| Caso | Validación |
|---|---|
| Producto inactivo | No reservar |
| Stock disponible insuficiente | Error 422 |
| Reserva vencida | No permitir checkout |
| Carrito convertido | No permitir edición |
| Cantidad cero | Liberar reserva |
| Producto eliminado del carrito | Liberar reserva |

---

## 10. Interacción con tablas existentes

| Tabla existente | Interacción |
|---|---|
| `productos` | Se valida producto activo |
| `inventarios` | Se consulta stock físico con bloqueo |
| `carritos` | Se asocia la reserva al carrito |
| `detalles_carrito` | Se asocia reserva a línea de carrito |
| `users` | Se asocia reserva a cliente autenticado |

---

## 11. Criterios de aceptación

- Cliente X agrega producto y se crea reserva activa.
- Cliente Y ve stock disponible reducido.
- Si la reserva vence, el stock disponible vuelve a subir.
- El stock físico real no se descuenta al agregar al carrito.
- Dos clientes compitiendo por el último stock no pueden reservar por encima del disponible.
- Toda operación crítica usa `DB::transaction()` y `lockForUpdate()`.
