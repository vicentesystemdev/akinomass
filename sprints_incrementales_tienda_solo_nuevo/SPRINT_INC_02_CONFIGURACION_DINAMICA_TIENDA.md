# Sprint INC-02 — Configuración dinámica de tiempos desde dashboard

| Campo | Valor |
|---|---|
| ID | TIENDA-INC-02 |
| Tipo | Backend + Dashboard Admin |
| Depende de | Reservas temporales de stock |
| Objetivo | Permitir que el admin configure tiempos del carrito, checkout y corrección de pago desde dashboard |

---

## 1. Qué se añade

Se añade un módulo nuevo en el dashboard:

```txt
Dashboard → Configuraciones → Tienda Online
```

Desde este módulo el administrador podrá configurar tiempos operativos sin editar `.env`.

---

## 2. Lo que NO se rehace

No se rehace:

- Dashboard base.
- Sistema de roles base.
- Módulo de tienda base.
- Módulo de pagos base.
- Módulo de pedidos base.

---

## 3. Tabla nueva

### `configuraciones_tienda`

| Columna | Tipo | Null | Descripción |
|---|---:|:---:|---|
| `cod_configuracion_tienda` | bigIncrements | NO | PK |
| `clave_cti` | string(100) | NO | Clave única de configuración |
| `valor_cti` | text | NO | Valor almacenado |
| `tipo_cti` | string(30) | NO | integer, boolean, string |
| `descripcion_cti` | text | SÍ | Descripción visible o técnica |
| `activo_cti` | boolean | NO | Si la configuración está activa |
| `actualizado_por_user_id` | foreignId | SÍ | Admin que actualizó |
| `created_at` | timestamp | SÍ | Laravel |
| `updated_at` | timestamp | SÍ | Laravel |

---

## 4. Migración sugerida

```php
Schema::create('configuraciones_tienda', function (Blueprint $table) {
    $table->bigIncrements('cod_configuracion_tienda');

    $table->string('clave_cti', 100)->unique();
    $table->text('valor_cti');
    $table->string('tipo_cti', 30)->default('string');
    $table->text('descripcion_cti')->nullable();
    $table->boolean('activo_cti')->default(true);

    $table->foreignId('actualizado_por_user_id')
        ->nullable()
        ->constrained('users')
        ->nullOnDelete();

    $table->timestamps();
});
```

---

## 5. Configuraciones iniciales

Seeder recomendado:

| Clave | Valor default | Tipo | Descripción |
|---|---:|---|---|
| `carrito_reserva_minutos` | 20 | integer | Tiempo de reserva en carrito |
| `checkout_ttl_minutos` | 30 | integer | Tiempo máximo para completar checkout |
| `checkout_pago_pendiente_minutos` | 60 | integer | Tiempo para subir comprobante |
| `pago_observado_correccion_minutos` | 1440 | integer | Tiempo para corregir pago observado |
| `pago_rechazado_resubida_minutos` | 1440 | integer | Tiempo para resubir pago rechazado |
| `carrito_permitir_extension` | true | boolean | Permite extender reserva |
| `carrito_max_extensiones` | 1 | integer | Máximo de extensiones |

---

## 6. Service nuevo

```txt
ConfiguracionTiendaService
```

Responsabilidades:

- Obtener valores enteros.
- Obtener valores booleanos.
- Aplicar fallback desde `config/tienda.php`.
- Cachear configuración.
- Limpiar cache al actualizar.

---

## 7. Actions nuevas

```txt
ActualizarConfiguracionTiendaAction
ObtenerConfiguracionTiendaAction
LimpiarCacheConfiguracionTiendaAction
```

---

## 8. Validaciones del admin

| Campo | Validación |
|---|---|
| `carrito_reserva_minutos` | required, integer, min:5, max:120 |
| `checkout_ttl_minutos` | required, integer, min:10, max:180 |
| `checkout_pago_pendiente_minutos` | required, integer, min:10, max:1440 |
| `pago_observado_correccion_minutos` | required, integer, min:30, max:4320 |
| `pago_rechazado_resubida_minutos` | required, integer, min:30, max:4320 |
| `carrito_permitir_extension` | required, boolean |
| `carrito_max_extensiones` | required, integer, min:0, max:5 |

---

## 9. Regla sobre reservas ya existentes

Cuando el admin cambia un tiempo:

```txt
El nuevo valor solo aplica a nuevas reservas, nuevos checkouts y nuevos plazos.
Las reservas/checkouts ya creados mantienen su fecha de expiración original.
```

---

## 10. Permisos nuevos

```txt
configuracion_tienda.ver
configuracion_tienda.editar
```

Asignar a:

```txt
Administrador
```

Opcional:

```txt
Supervisor Comercial
```

No asignar a Cliente.

---

## 11. Interacción con tablas existentes

| Tabla existente | Interacción |
|---|---|
| `users` | Registra admin que actualiza configuración |
| `roles/permissions` | Controla acceso al módulo |
| `auditoria_sistema` si existe | Registra cambio de valores |

---

## 12. Criterios de aceptación

- Admin ve la configuración actual.
- Admin modifica tiempos desde dashboard.
- El sistema valida mínimos y máximos.
- Nuevas reservas usan el nuevo tiempo.
- Reservas anteriores no se alteran.
- El cambio queda auditado.
