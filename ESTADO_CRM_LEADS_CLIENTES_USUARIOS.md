# Estado del sistema: Leads, Clientes y Usuarios

Fecha: 2026-06-08

## 1. Panorama general

Este documento describe el estado actual del módulo CRM de la aplicación, con foco en:

- Leads
- Clientes
- Usuarios del sistema

La información se basa en el código actual de `app/Http/Controllers/CRM`, `app/Models`, `app/Domains/CRM`, y las rutas relevantes de `routes/web.php` y `routes/tienda.php`.

## 2. Leads

### Modelo

- Clase: `App\Models\Lead`
- Tabla: `leads`
- PK: `cod_lead`
- Campos principales:
    - `nombre_lea`, `alias_lea`, `telefono_lea`, `correo_lea`
    - `producto_interes_lea`, `observacion_lea`
    - `estado_lea`, `fecha_seguimiento_lea`
    - `cod_canal_venta`, `cod_tipo_flujo_comercial`
    - `cod_cliente` (opcional) y `cod_usuario_responsable`

### Relaciones

- `canalVenta()` → `CanalVenta`
- `tipoFlujoComercial()` → `TipoFlujoComercial`
- `cliente()` → `Cliente`
- `usuarioResponsable()` → `User`

### Estados válidos

Definidos en `App\Domains\CRM\Leads\Enums\EstadoLeadEnum`:

- `nuevo`
- `contactado`
- `interesado`
- `pendiente_pago`
- `convertido`
- `perdido`
- `descartado`

### Flujo funcional

- Controlador: `App\Http\Controllers\CRM\LeadController`
- Operaciones disponibles:
    - `index`: listado paginado de leads con relaciones cargadas
    - `create` / `store`: creación de leads
    - `edit` / `update`: edición de leads
    - `updateEstado`: cambio rápido de estado por PATCH a `/leads/{lead}/estado`
    - `convertir`: conversión de lead a cliente con POST a `/leads/{lead}/convertir`

### Notas de implementación

- El formulario y la vista usan Inertia React.
- El controller carga listas de `canales`, `tiposFlujo`, `usuarios` y `estados`.
- El lead puede estar vinculado a un cliente ya existente y a un usuario responsable.

## 3. Clientes

### Modelo

- Clase: `App\Models\Cliente`
- Tabla: `clientes`
- PK: `cod_cliente`
- Campos principales:
    - `nombre_cli`, `telefono_cli`, `correo_cli`, `direccion_cli`, `documento_cli`
    - `observacion_cli`, `estado_cli`
    - `cod_canal_venta`, `cod_tipo_flujo_comercial`

### Relaciones

- `canalVenta()` → `CanalVenta`
- `tipoFlujoComercial()` → `TipoFlujoComercial`
- `leads()` → colección de `Lead`

### Estados válidos

Definidos en `App\Domains\CRM\Clientes\Enums\EstadoClienteEnum`:

- `activo`
- `inactivo`
- `recurrente`
- `bloqueado`

### Flujo funcional

- Controlador: `App\Http\Controllers\CRM\ClienteController`
- Operaciones disponibles:
    - `index`: listado paginado de clientes
    - `create` / `store`: creación de clientes
    - `edit` / `update`: edición de clientes

### Notas de implementación

- El módulo muestra filtros de canal, tipo de flujo y estado.
- Los estados de cliente se usan para segmentar relaciones comerciales y reportes.

## 4. Usuarios

### Modelo y autenticación

- Clase: `App\Models\User`
- Extiende `Authenticatable`
- Usa el trait `Spatie\Permission\Traits\HasRoles`
- Atributos rellenables: `name`, `email`, `password`
- Casts: `email_verified_at` como `datetime`, `password` como `hashed`
- Relación clave: `cuentaCliente()` → `CuentaCliente`

### Estado de usuario en el sistema

- No existe un enum de estado de usuario en `User`.
- El estado operativo depende de:
    - `email_verified_at` (verificación de correo)
    - roles y permisos asignados por Spatie
    - middleware de rutas y guardas de acceso

### Roles y accesos relevantes

- El sistema utiliza `role:Cliente` para controlar acceso a la tienda online.
- En `routes/tienda.php`, el área del checkout y la cuenta del cliente requiere:
    - `auth`
    - `verified`
    - `role:Cliente`
- El panel administrativo usa middleware como `auth` y `redirect.cliente`.

### Notas de implementación

- `User` se usa tanto para usuarios internos como para clientes de tienda.
- La lógica de negocio de CRM no parece definir un estado de usuario propio más allá de roles y verificación.

## 5. Rutas principales

### CRM

- `routes/web.php`:
    - `Route::resource('clientes', ClienteController::class)->except(['show', 'destroy'])`
    - `Route::resource('leads', LeadController::class)->except(['show', 'destroy'])`
    - `Route::patch('/leads/{lead}/estado', [LeadController::class, 'updateEstado'])->name('leads.update-estado')`
    - `Route::post('/leads/{lead}/convertir', [LeadController::class, 'convertir'])->name('leads.convertir')`

### Tienda / cliente

- `routes/tienda.php`:
    - `/tienda/login`, `/tienda/registro`, `/tienda/logout`
    - `/tienda/carrito` y subrutas públicas/semipúblicas para carrito
    - `/tienda/checkout/*` y `/tienda/mi-cuenta` protegidas por `auth`, `verified`, `role:Cliente`

## 6. Estado actual

### Leads

- Módulo CRM de leads está presente y funcional.
- Soporta estados de avance comercial completos: nuevo → contactado → interesado → pendiente_pago → convertido / perdido / descartado.
- Incluye conversión explícita de lead a cliente.

### Clientes

- Módulo base de clientes está implementado.
- Soporta creación, edición y listado.
- Los clientes tienen estados comerciales también definidos y claros.

### Usuarios

- El sistema usa autenticación Laravel estándar con roles Spatie.
- Los clientes de tienda se validan con `role:Cliente`.
- No hay un enum de “estado de usuario” concreto, pero sí un estado funcional a través de roles y verificación de email.

## 7. Recomendaciones rápidas

- Si necesitas un estado de usuario más explícito, conviene agregar un enum o campo `estado_usuario` en `User`.
- Para la auditoría del CRM, confirma si la conversión `Lead → Cliente` también debe generar un registro de evento.
- Si quieres, puedo generar un diagrama de flujo más preciso de conversión de leads y acceso de usuarios.
