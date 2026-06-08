# Sprint INC-06 — Resubida e historial de comprobantes de pago

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-06 |
| Tipo | Backend + Cliente + Admin |
| Depende de | Validación administrativa del pago |
| Objetivo | Permitir al cliente resubir comprobantes cuando el pago sea observado o rechazado |

---

## 1. Qué se añade

Se añade la posibilidad de que el cliente suba un nuevo comprobante si el pago fue:

```txt
observado
rechazado
```

También se añade historial de comprobantes para no sobrescribir evidencia anterior.

---

## 2. Lo que NO se rehace

No se vuelve a crear:

- Pago base.
- Checkout base.
- Área cliente base.
- Subida inicial de comprobante si ya existe.

---

## 3. Tabla nueva recomendada

### `comprobantes_pago_tienda`

| Columna | Tipo | Null | Descripción |
|---|---:|:---:|---|
| `cod_comprobante_pago_tienda` | bigIncrements | NO | PK |
| `cod_pago_tienda` | unsignedBigInteger | NO | FK hacia `pagos_tienda` |
| `ruta_comprobante_cpt` | string(255) | NO | Ruta del archivo |
| `hash_comprobante_cpt` | string(64) | SÍ | Hash del archivo |
| `mime_cpt` | string(100) | SÍ | MIME |
| `tamano_bytes_cpt` | unsignedBigInteger | SÍ | Tamaño |
| `estado_cpt` | string(30) | NO | Estado del comprobante |
| `observacion_admin_cpt` | text | SÍ | Observación del admin |
| `subido_por_user_id` | foreignId | SÍ | Cliente que subió |
| `revisado_por_user_id` | foreignId | SÍ | Admin que revisó |
| `subido_en_cpt` | timestamp | NO | Fecha subida |
| `revisado_en_cpt` | timestamp | SÍ | Fecha revisión |
| `created_at` | timestamp | SÍ | Laravel |
| `updated_at` | timestamp | SÍ | Laravel |

---

## 4. Estados del comprobante

```txt
pendiente
observado
rechazado
aceptado
reemplazado
anulado
```

---

## 5. Migración sugerida

```php
Schema::create('comprobantes_pago_tienda', function (Blueprint $table) {
    $table->bigIncrements('cod_comprobante_pago_tienda');

    $table->unsignedBigInteger('cod_pago_tienda');

    $table->string('ruta_comprobante_cpt', 255);
    $table->string('hash_comprobante_cpt', 64)->nullable();
    $table->string('mime_cpt', 100)->nullable();
    $table->unsignedBigInteger('tamano_bytes_cpt')->nullable();

    $table->string('estado_cpt', 30)->default('pendiente')->index();
    $table->text('observacion_admin_cpt')->nullable();

    $table->foreignId('subido_por_user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->foreignId('revisado_por_user_id')->nullable()->constrained('users')->nullOnDelete();

    $table->timestamp('subido_en_cpt');
    $table->timestamp('revisado_en_cpt')->nullable();

    $table->timestamps();

    $table->foreign('cod_pago_tienda')->references('cod_pago_tienda')->on('pagos_tienda')->cascadeOnDelete();

    $table->index(['cod_pago_tienda', 'estado_cpt']);
});
```

---

## 6. Actions nuevas

```txt
ResubirComprobantePagoTiendaAction
RegistrarHistorialComprobantePagoAction
MarcarComprobanteComoReemplazadoAction
AceptarComprobantePagoAction
ObservarComprobantePagoAction
RechazarComprobantePagoAction
```

---

## 7. Lógica de resubida

Cuando el cliente resube:

```txt
1. Validar que el pago esté observado o rechazado.
2. Validar que el pedido no esté confirmado/facturado.
3. Marcar comprobante anterior como reemplazado si corresponde.
4. Guardar nuevo archivo.
5. Crear registro en comprobantes_pago_tienda.
6. Incrementar intentos en pagos_tienda.
7. Cambiar pago a pendiente.
8. Cambiar pedido_tienda a pendiente_validacion_pago.
```

---

## 8. Validaciones del archivo

| Campo | Validación |
|---|---|
| Archivo | requerido |
| MIME | jpg, jpeg, png, pdf |
| Tamaño | máximo 5 MB |
| Pago | debe pertenecer al cliente |
| Estado pago | observado o rechazado |
| Pedido | no debe estar confirmado/facturado |

---

## 9. Interacción con tablas existentes y nuevas

| Tabla | Interacción |
|---|---|
| `pagos` | Estado vuelve a pendiente |
| `pagos_tienda` | Incrementa intentos y referencia actual |
| `comprobantes_pago_tienda` | Guarda historial |
| `pedidos_tienda` | Cambia a pendiente_validacion_pago |
| `users` | Cliente sube, admin revisa |
| `checkout_sesiones` | Mantiene flujo de pago registrado |

---

## 10. Criterios de aceptación

- Cliente puede resubir comprobante si pago fue observado.
- Cliente puede resubir comprobante si pago fue rechazado.
- Cliente no puede resubir si pago ya fue aceptado.
- Se conserva historial de comprobantes.
- El admin puede ver intentos anteriores.
- El nuevo comprobante queda pendiente de revisión.
