# PROMPT PARA AGENTE — MÓDULO DE BACKUPS INCREMENTALES EN DASHBOARD ADMIN AKINOMASS

Actúa como un **ingeniero de sistemas, arquitecto de software y desarrollador Laravel senior con más de 20 años de experiencia**, especializado en seguridad, respaldo de datos, PostgreSQL, Laravel, Inertia.js, React, Tailwind CSS, Spatie Permission y arquitectura modular por dominios.

Necesito implementar un nuevo módulo administrativo llamado:

```txt
Backups de Base de Datos
```

Este módulo debe aparecer como **un módulo más en el sidebar del ADMIN**, y debe permitir que el administrador genere y descargue backups incrementales del sistema de forma simple.

---

## 1. Contexto del sistema

El sistema AKINOMASS es un e-commerce / social commerce desarrollado con:

| Área | Tecnología |
|---|---|
| Backend | Laravel |
| Base de datos | PostgreSQL |
| Frontend | Inertia.js + React |
| Estilos | Tailwind CSS |
| Roles y permisos | Spatie Permission |
| Arquitectura | Monolito modular por dominios |
| Flujo backend | Controller → FormRequest → DTO → Action → Service → Repository → Model |

El sistema cuenta con usuarios internos y clientes externos.

Este módulo será únicamente para el **ADMIN**.

---

## 2. Objetivo del módulo

Implementar un módulo simple de backups donde:

| Función | Descripción |
|---|---|
| Ver historial de backups | El Admin verá una tabla con los backups generados |
| Generar backup | Un botón generará un backup lógico incremental |
| Descargar backup | El Admin podrá descargar cualquier backup exitoso |
| Registrar historial | Se guardará archivo, fecha, tipo y estado |
| Restringir acceso | Solo el ADMIN puede acceder |
| Registrar auditoría | Cada generación y descarga debe registrarse en logs si existe el módulo de auditoría |

---

## 3. Decisión técnica principal

No usar WAL, pgBackRest, Barman ni configuración avanzada de PostgreSQL.

Implementar un enfoque simple:

```txt
Backup incremental lógico desde Laravel
```

La lógica será:

```txt
Primer backup exitoso:
    Se genera un backup base con todos los registros de las tablas configuradas.

Siguientes backups:
    Se generan backups incrementales con los registros creados o modificados desde el último backup exitoso.
```

No se debe implementar restauración desde el dashboard en esta versión.

---

## 4. Regla importante

No guardar el archivo completo del backup dentro de PostgreSQL.

La tabla de base de datos solo debe guardar:

```txt
Historial + ruta del archivo + fecha + estado + tipo
```

El archivo real debe guardarse en storage, por ejemplo:

```txt
storage/app/backups_bd/
```

O preferentemente:

```txt
storage/app/private/backups_bd/
```

El archivo no debe quedar público directamente en `/public`.

La descarga debe hacerse mediante un controlador protegido por permisos.

---

## 5. Migración requerida

Crear una nueva migración para la tabla:

```txt
backups_bd
```

No modificar migraciones antiguas.

No usar `migrate:fresh` en entornos compartidos.

---

### 5.1. Tabla: `backups_bd`

| Campo | Tipo | Null | Descripción |
|---|---|:---:|---|
| `bck_id` | BIGSERIAL | NO | Identificador principal |
| `usu_id` | BIGINT | SÍ | Usuario ADMIN que generó el backup manual |
| `bck_tipo` | VARCHAR(30) | NO | `base` o `incremental` |
| `bck_archivo` | VARCHAR(255) | NO | Nombre del archivo generado |
| `bck_ruta` | VARCHAR(500) | NO | Ruta interna del archivo en storage |
| `bck_fecha` | TIMESTAMP | NO | Fecha de generación |
| `bck_estado` | VARCHAR(20) | NO | `en_proceso`, `exitoso`, `fallido` |
| `bck_desde` | TIMESTAMP | SÍ | Fecha desde la que se toman cambios |
| `bck_hasta` | TIMESTAMP | SÍ | Fecha hasta donde cubre el backup |
| `bck_error` | TEXT | SÍ | Mensaje de error si falla |
| `created_at` | TIMESTAMP | SÍ | Timestamps Laravel |
| `updated_at` | TIMESTAMP | SÍ | Timestamps Laravel |

---

### 5.2. Migración Laravel esperada

Crear una migración nueva similar a esta estructura:

```php
Schema::create('backups_bd', function (Blueprint $table) {
    $table->bigIncrements('bck_id');

    $table->foreignId('usu_id')
        ->nullable()
        ->constrained('users')
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->string('bck_tipo', 30);
    $table->string('bck_archivo', 255);
    $table->string('bck_ruta', 500);
    $table->timestamp('bck_fecha')->useCurrent();

    $table->string('bck_estado', 20)->default('en_proceso');

    $table->timestamp('bck_desde')->nullable();
    $table->timestamp('bck_hasta')->nullable();

    $table->text('bck_error')->nullable();

    $table->timestamps();

    $table->index('usu_id');
    $table->index('bck_tipo');
    $table->index('bck_estado');
    $table->index('bck_fecha');
    $table->index(['bck_tipo', 'bck_estado']);
    $table->index(['bck_desde', 'bck_hasta']);
});
```

---

## 6. Enums recomendados

Crear enums PHP para evitar strings mágicos.

### 6.1. `TipoBackupEnum`

```txt
base
incremental
```

| Valor | Uso |
|---|---|
| `base` | Primer backup completo lógico |
| `incremental` | Backups posteriores con registros creados/modificados |

---

### 6.2. `EstadoBackupEnum`

```txt
en_proceso
exitoso
fallido
```

| Valor | Uso |
|---|---|
| `en_proceso` | Backup iniciado |
| `exitoso` | Backup generado correctamente |
| `fallido` | Backup falló |

---

## 7. Lógica funcional del botón “Generar backup”

En el módulo debe existir un botón:

```txt
Generar backup
```

Cuando el Admin presione este botón, el sistema debe ejecutar esta lógica:

```txt
1. Validar que el usuario autenticado sea ADMIN.
2. Crear un registro en backups_bd con estado en_proceso.
3. Buscar el último backup exitoso ordenado por bck_hasta DESC.
4. Si no existe ningún backup exitoso:
      generar backup tipo base.
5. Si existe un backup exitoso:
      generar backup tipo incremental.
6. Definir el rango:
      bck_desde = último bck_hasta del último backup exitoso.
      bck_hasta = fecha/hora actual al iniciar el proceso.
7. Exportar los registros correspondientes.
8. Crear archivos JSON por tabla.
9. Crear un manifest.json.
10. Comprimir todo en ZIP.
11. Guardar el ZIP en storage/app/private/backups_bd.
12. Actualizar backups_bd:
      estado = exitoso,
      archivo = nombre del zip,
      ruta = ruta interna,
      fecha = fecha actual,
      desde = bck_desde,
      hasta = bck_hasta.
13. Si ocurre error:
      actualizar backups_bd como fallido,
      guardar bck_error.
14. Registrar auditoría si existe el módulo auditoria_sis.
15. Retornar al dashboard con mensaje de éxito o error.
```

---

## 8. Lógica del primer backup

Si no existe ningún backup exitoso, el sistema debe generar un backup base.

El backup base debe incluir todos los registros de las tablas configuradas.

Ejemplo:

```txt
backup_base_akinomass_2026_06_06_103000.zip
```

Debe tener:

```txt
manifest.json
users.json
clientes.json
productos.json
inventarios.json
pedidos.json
detalles_pedido.json
pagos.json
...
```

---

## 9. Lógica de backups incrementales

Si ya existe un backup exitoso, el nuevo backup debe ser incremental.

El sistema debe tomar como referencia:

```txt
ultimo_backup_exitoso.bck_hasta
```

Y exportar registros que cumplan:

```txt
created_at > ultimo_backup_exitoso.bck_hasta
OR
updated_at > ultimo_backup_exitoso.bck_hasta
```

Siempre hasta:

```txt
fecha_actual_del_backup
```

Ejemplo:

```txt
backup_incremental_akinomass_2026_06_07_103000.zip
```

---

## 10. Regla sobre IDs

No implementar el incremental por ID.

No hacer:

```txt
id > ultimo_id_respaldado
```

Porque eso no captura actualizaciones, anulaciones, cambios de estado ni modificaciones de registros antiguos.

Implementar por fechas:

```txt
created_at / updated_at
```

---

## 11. Tablas que deben respaldarse

Crear una configuración interna para definir las tablas respaldables.

Puede ser en:

```txt
config/backups.php
```

La configuración debe tener una lista blanca de tablas.

No recorrer automáticamente todas las tablas sin control.

---

### 11.1. Tablas sugeridas para respaldo

Ajustar la lista según existan realmente en el proyecto.

| Módulo | Tablas sugeridas |
|---|---|
| Seguridad | `users`, tablas Spatie si corresponde |
| CRM | `clientes`, `leads`, `cuentas_cliente`, `direcciones_cliente` |
| Catálogo | `productos`, `categorias_producto` |
| Inventario | `inventarios`, `movimientos_inventario` |
| Pedidos | `pedidos`, `detalles_pedido`, `pedidos_tienda` |
| Pagos | `pagos`, `pagos_tienda` |
| Tienda | `carritos`, `detalles_carrito`, `checkout_sesiones` |
| Facturación | `facturas`, `detalles_factura` |
| Auditoría | `auditoria_sis` |
| Configuración | catálogos internos del negocio |

---

### 11.2. Ejemplo conceptual de configuración

No es obligatorio usar exactamente esta estructura, pero se recomienda algo similar:

```php
return [
    'disk' => 'local',

    'path' => 'private/backups_bd',

    'tables' => [
        'users' => [
            'primary_key' => 'id',
            'timestamps' => true,
        ],
        'clientes' => [
            'primary_key' => 'cod_cliente',
            'timestamps' => true,
        ],
        'productos' => [
            'primary_key' => 'cod_producto',
            'timestamps' => true,
        ],
        'pedidos' => [
            'primary_key' => 'cod_pedido',
            'timestamps' => true,
        ],
        'pagos' => [
            'primary_key' => 'cod_pago',
            'timestamps' => true,
        ],
    ],
];
```

---

## 12. Tablas sin timestamps

Si alguna tabla crítica no tiene `created_at` o `updated_at`, aplicar una de estas reglas:

| Caso | Recomendación |
|---|---|
| Tabla sin timestamps pero poco variable | Incluir completa en cada backup incremental |
| Tabla sin timestamps y crítica | Documentar como riesgo |
| Tabla no crítica | Excluir temporalmente |
| Tabla de catálogo pequeña | Exportar completa siempre |

No romper el proceso si una tabla no tiene timestamps. El sistema debe manejarlo de forma controlada.

---

## 13. Formato del archivo backup

Cada backup debe ser un archivo ZIP.

Dentro del ZIP debe existir:

```txt
manifest.json
tabla_1.json
tabla_2.json
tabla_3.json
...
```

---

### 13.1. `manifest.json`

El archivo `manifest.json` debe incluir como mínimo:

| Campo | Descripción |
|---|---|
| `sistema` | AKINOMASS |
| `tipo_backup` | base / incremental |
| `generado_en` | Fecha de generación |
| `desde` | Fecha desde |
| `hasta` | Fecha hasta |
| `tablas` | Lista de tablas incluidas |
| `version` | Versión del formato |
| `generado_por` | ID o email del Admin |
| `observacion` | Texto opcional |

---

### 13.2. Archivos por tabla

Cada tabla debe exportarse a JSON.

Ejemplo:

```txt
clientes.json
productos.json
pedidos.json
pagos.json
```

Cada archivo debe contener un arreglo de registros.

---

## 14. Lógica de descarga

En la tabla visual del Admin debe existir un botón:

```txt
Descargar
```

Cuando el Admin presione descargar:

```txt
1. Validar que el usuario sea ADMIN.
2. Buscar el backup por bck_id.
3. Validar que bck_estado sea exitoso.
4. Validar que el archivo exista en storage.
5. Retornar descarga segura desde controlador.
6. Registrar auditoría de descarga si existe auditoria_sis.
```

No exponer directamente la ruta real del archivo.

No guardar los backups en `/public`.

---

## 15. Módulo en sidebar ADMIN

Agregar un nuevo módulo en el sidebar del ADMIN.

Nombre visible:

```txt
Backups BD
```

Icono sugerido:

```txt
Database
Archive
Download
Shield
```

Ruta sugerida:

```txt
/admin/backups-bd
```

El módulo solo debe mostrarse para usuarios con permiso correspondiente.

---

## 16. Permisos Spatie recomendados

Crear permisos:

| Permiso | Descripción |
|---|---|
| `backups.ver` | Ver módulo de backups |
| `backups.generar` | Generar backup |
| `backups.descargar` | Descargar backup |

Asignar estos permisos únicamente al rol ADMIN.

No asignar a cliente, vendedor, inventario ni otros roles.

---

## 17. Rutas recomendadas

Todas las rutas deben estar protegidas por autenticación y permisos.

| Método | Ruta | Acción |
|---|---|---|
| GET | `/admin/backups-bd` | Ver historial |
| POST | `/admin/backups-bd/generar` | Generar backup |
| GET | `/admin/backups-bd/{backup}/descargar` | Descargar backup |

No crear rutas públicas.

No permitir update ni delete desde UI.

---

## 18. Backend recomendado

Crear un dominio nuevo:

```txt
app/Domains/Backups/
```

Estructura sugerida:

```txt
app/Domains/Backups/
├── README.md
├── Actions/
│   ├── GenerarBackupBdAction.php
│   └── DescargarBackupBdAction.php
├── DTOs/
│   └── ResultadoBackupDTO.php
├── Enums/
│   ├── TipoBackupEnum.php
│   └── EstadoBackupEnum.php
├── Services/
│   ├── BackupBdService.php
│   └── ExportadorBackupJsonService.php
├── Repositories/
│   └── BackupBdRepository.php
└── Shared/
```

Modelo:

```txt
app/Models/BackupBd.php
```

Controlador:

```txt
app/Http/Controllers/Admin/BackupBdController.php
```

---

## 19. Regla para controladores

El controlador debe ser delgado.

Debe limitarse a:

```txt
1. Validar permisos.
2. Llamar una Action.
3. Retornar Inertia o descarga.
```

No poner lógica de exportación en el controlador.

La lógica debe estar en Actions y Services.

---

## 20. Frontend recomendado

Crear página:

```txt
resources/js/Pages/Admin/BackupsBd/Index.jsx
```

O según la estructura actual del proyecto:

```txt
resources/js/Pages/Backups/Index.jsx
```

Debe respetar el diseño actual del dashboard.

---

### 20.1. Vista del módulo

La vista debe tener:

| Elemento | Descripción |
|---|---|
| Título | Backups de Base de Datos |
| Descripción | Módulo para generar y descargar respaldos incrementales |
| Botón principal | Generar backup |
| Tabla historial | Lista de backups |
| Estado visual | Badge exitoso/fallido/en proceso |
| Acción descargar | Solo si estado exitoso |
| Empty state | Si no hay backups |
| Loading state | Mientras genera |
| Mensajes | Éxito o error |

---

### 20.2. Tabla visual

Columnas mínimas:

| Columna | Campo |
|---|---|
| Archivo | `bck_archivo` |
| Tipo | `bck_tipo` |
| Fecha | `bck_fecha` |
| Estado | `bck_estado` |
| Acción | Descargar |

Aunque la BD tenga más campos, en pantalla basta con mostrar lo esencial.

---

## 21. Comportamiento esperado de la tabla

Ejemplo:

| Archivo | Tipo | Fecha | Estado | Acción |
|---|---|---|---|---|
| `backup_base_akinomass_2026_06_06_103000.zip` | Base | 06/06/2026 10:30 | Exitoso | Descargar |
| `backup_incremental_akinomass_2026_06_07_103000.zip` | Incremental | 07/06/2026 10:30 | Exitoso | Descargar |
| `backup_incremental_akinomass_2026_06_08_103000.zip` | Incremental | 08/06/2026 10:30 | Fallido | No disponible |

---

## 22. Estados visuales

| Estado | Visual sugerido |
|---|---|
| `en_proceso` | Badge azul o naranja |
| `exitoso` | Badge verde |
| `fallido` | Badge rojo |

---

## 23. Validaciones del botón generar

Antes de generar:

| Validación | Resultado |
|---|---|
| Usuario no es Admin | 403 |
| No tiene permiso `backups.generar` | 403 |
| Ya hay backup en proceso | No iniciar otro |
| Storage no escribible | Registrar fallido |
| No hay tablas configuradas | Registrar fallido |
| Error durante exportación | Registrar fallido |

Evitar que se generen dos backups al mismo tiempo.

---

## 24. Concurrencia

No permitir múltiples backups simultáneos.

Antes de iniciar un nuevo backup, verificar si existe:

```txt
bck_estado = en_proceso
```

Si existe uno en proceso, mostrar mensaje:

```txt
Ya existe un backup en proceso. Espere a que finalice antes de generar otro.
```

---

## 25. Auditoría

Si existe el módulo `auditoria_sis`, registrar:

| Acción | Descripción |
|---|---|
| Generación iniciada | Admin inició generación de backup |
| Generación exitosa | Backup generado correctamente |
| Generación fallida | Backup falló |
| Descarga | Admin descargó backup |

Ejemplo de descripción:

```txt
El administrador generó el backup incremental backup_incremental_akinomass_2026_06_07_103000.zip.
```

---

## 26. Seguridad

Reglas obligatorias:

| Regla | Descripción |
|---|---|
| Solo Admin | El módulo solo es accesible por ADMIN |
| No acceso clientes | Los clientes no pueden ver ni descargar backups |
| No acceso vendedores | Los vendedores no pueden ver ni descargar backups |
| No ruta pública | No exponer archivos directamente |
| No guardar en public | Guardar en storage privado |
| Descargar por controlador | Validar permiso antes de descargar |
| No editar historial | El Admin no debe editar registros |
| No eliminar historial | No implementar eliminar en esta versión |

---

## 27. Limitaciones aceptadas

Este módulo implementa backups incrementales lógicos, no backups físicos de PostgreSQL.

No cubre perfectamente:

| Caso | Observación |
|---|---|
| Deletes físicos | Solo se detectan si existe auditoría o eliminación lógica |
| Tablas sin timestamps | Deben tratarse como caso especial |
| Restauración automática | No incluida |
| WAL / PITR | No incluido |
| Backup binario PostgreSQL | No incluido |

Regla recomendada para el sistema:

```txt
No eliminar físicamente registros críticos. Usar estados como anulado, cancelado, inactivo o eliminado.
```

---

## 28. Criterios de aceptación

El módulo se considera terminado cuando:

| Criterio | Estado esperado |
|---|---|
| Existe tabla `backups_bd` | Sí |
| Existe módulo en sidebar Admin | Sí |
| Solo Admin puede acceder | Sí |
| Admin ve historial | Sí |
| Admin puede generar backup | Sí |
| Primer backup es tipo base | Sí |
| Siguientes backups son incrementales | Sí |
| Backup se guarda en ZIP | Sí |
| ZIP contiene `manifest.json` | Sí |
| ZIP contiene JSON por tabla | Sí |
| Historial muestra archivo, tipo, fecha y estado | Sí |
| Admin puede descargar backup exitoso | Sí |
| Backup fallido queda registrado | Sí |
| No se guarda ZIP en BD | Sí |
| No se expone storage público | Sí |
| No se permite editar/eliminar backups | Sí |
| Se audita generación y descarga | Sí, si auditoría existe |

---

## 29. Pruebas recomendadas

| Prueba | Resultado esperado |
|---|---|
| Admin entra al módulo | Accede correctamente |
| Vendedor entra al módulo | 403 |
| Cliente entra al módulo | 403 |
| Admin genera primer backup | Se crea backup tipo base |
| Admin genera segundo backup | Se crea backup incremental |
| Backup exitoso aparece en tabla | Sí |
| Backup fallido aparece como fallido | Sí |
| Botón descargar aparece solo en exitosos | Sí |
| Archivo descargado es ZIP | Sí |
| ZIP contiene manifest | Sí |
| ZIP contiene JSON de tablas | Sí |
| Dos clicks rápidos en generar | No genera backups duplicados |
| Archivo inexistente | Muestra error controlado |
| Acción se registra en auditoría | Sí, si aplica |

---

## 30. Resultado esperado final

El resultado debe ser un módulo simple, seguro y funcional:

```txt
Admin Dashboard
    → Backups BD
        → Tabla de backups generados
        → Botón Generar backup
        → Botón Descargar en cada backup exitoso
```

La lógica debe ser:

```txt
Primer backup = base completa lógica
Siguientes backups = incrementales por created_at / updated_at
Archivos = ZIP privado en storage
Historial = tabla backups_bd
Acceso = solo ADMIN
```

No implementar restauración.

No implementar WAL.

No implementar pgBackRest.

No implementar configuración automática por intervalos en esta versión.

Priorizar simplicidad, seguridad, trazabilidad y coherencia con la arquitectura actual de AKINOMASS.
