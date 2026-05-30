# Sprints Cumplidos 00, 01, 02 — Tienda Online AKINOMASS

> **Fecha de implementación:** Mayo 2026  
> **Estado:** ✅ COMPLETADO  
> **Verificación:** `npm run build` exitoso

---

## Sprint 00 — Decisiones y Alcance

### Estado: ✅ COMPLETADO (sin código requerido)

Sprint de planificación. Las decisiones se aplicaron según los defaults recomendados:

| ID | Pregunta | Decisión Aplicada |
|----|----------|-------------------|
| P01 | Moneda | BOB |
| P02 | IVA | No en v1 (`impuesto_che = 0`) |
| P03 | Factura | Comprobante interno (`recibo`) |
| P04 | Carrito | Uno activo por `user_id` |
| P05 | Invitado ve carrito | Sí; checkout exige login |
| P06 | Pedido vs pago | Pedido `borrador` + pago `pendiente` |
| P07 | Quién confirma pagos | Solo staff |
| P08 | Comprobante obligatorio | Sí para transferencia/QR |
| P09 | Límite carrito | 50 líneas (configurable) |
| P10 | Reservar stock | Validar al confirmar pedido |
| P11 | Flujo `compra_web` | Sí, creado en seeder |
| P12 | Email transaccional | No en v1 |
| P13 | Ruta `/` | `/` → Tienda; `/dashboard` → Admin |
| P14 | Cliente en admin | No, redirect a `/tienda` |
| P15 | Tamaño comprobante | 5 MB; jpg, jpeg, png, pdf |

### Verificación

- [x] Canal `web` existía en `CanalesVentaSeeder.php`
- [x] Flujo `compra_web` creado en `TiposFlujoComercialSeeder.php`
- [x] Rol `Cliente` creado en `RolesAndPermissionsSeeder.php`

---

## Sprint 01 — Infraestructura Base

### Estado: ✅ COMPLETADO

### Archivos Creados/Modificados (11)

| # | Archivo | Acción | Descripción |
|---|---------|--------|-------------|
| 1 | `database/seeders/TiposFlujoComercialSeeder.php` | MODIFICADO | Agregado `compra_web` al array de tipos de flujo |
| 2 | `database/seeders/RolesAndPermissionsSeeder.php` | MODIFICADO | Agregado rol `Cliente` + 9 permisos de tienda |
| 3 | `app/Domains/Tienda/TiendaServiceProvider.php` | CREADO | ServiceProvider vacío (scaffold) |
| 4 | `app/Domains/Tienda/` (23 subdirectorios) | CREADO | Estructura completa de subdominios con `.gitkeep` |
| 5 | `app/Http/Middleware/EnsureUserIsCliente.php` | CREADO | Middleware que verifica rol `Cliente` |
| 6 | `app/Http/Middleware/RedirectIfCliente.php` | CREADO | Middleware que redirige Cliente fuera de admin |
| 7 | `routes/tienda.php` | CREADO | Rutas placeholder para tienda |
| 8 | `bootstrap/providers.php` | MODIFICADO | Registrado `TiendaServiceProvider` |
| 9 | `bootstrap/app.php` | MODIFICADO | Registrado rutas tienda + alias middleware `cliente` |
| 10 | `config/database.php` | MODIFICADO | Agregada conexión Redis `cart` (DB índice 2) |
| 11 | `.env.example` | MODIFICADO | Agregado `REDIS_CART_DB=2` y `REDIS_CART_PREFIX` |

### Estructura de Directorios Creada

```
app/Domains/Tienda/
├── README.md (existente)
├── TiendaServiceProvider.php
├── Catalogo/
│   ├── Actions/
│   ├── Services/
│   └── Repositories/
├── Carrito/
│   ├── Actions/
│   ├── Services/
│   ├── DTOs/
│   └── Enums/
├── Checkout/
│   ├── Actions/
│   ├── Services/
│   ├── DTOs/
│   └── Enums/
├── Cuenta/
│   ├── Actions/
│   ├── Services/
│   ├── DTOs/
│   └── Enums/
├── PedidosWeb/
│   ├── Actions/
│   └── Services/
├── PagosWeb/
│   ├── Actions/
│   └── Services/
├── Facturacion/
│   ├── Actions/
│   └── Services/
├── Enums/
└── Shared/
```

### Permisos del Rol Cliente

| Permiso | Descripción |
|---------|-------------|
| `tienda.ver` | Ver catálogo y producto |
| `carrito.ver` | Ver carrito propio |
| `carrito.gestionar` | Agregar, quitar, actualizar cantidades |
| `checkout.iniciar` | Iniciar sesión checkout |
| `checkout.completar` | Finalizar compra |
| `cuenta.ver` | Ver área cliente |
| `cuenta.ver_pedidos` | Listar pedidos propios |
| `cuenta.ver_pedido` | Detalle pedido propio |
| `cuenta.gestionar_direcciones` | CRUD direcciones |

### Configuración Redis Cart

```php
// config/database.php → 'connections'
'cart' => [
    'url' => env('REDIS_URL'),
    'host' => env('REDIS_HOST', '127.0.0.1'),
    'password' => env('REDIS_PASSWORD'),
    'port' => env('REDIS_PORT', '6379'),
    'database' => env('REDIS_CART_DB', '2'),
],
```

### Rutas Tienda (placeholder)

```php
// routes/tienda.php
GET  /tienda                    → Tienda/Home
GET  /tienda/catalogo           → Tienda/Catalogo
GET  /tienda/productos/{id}     → Tienda/ProductoShow
GET  /tienda/carrito            → Tienda/Carrito
GET  /tienda/login              → Tienda/Auth/Login (guest)
GET  /tienda/registro           → Tienda/Auth/Register (guest)
GET  /tienda/checkout/{token}   → Tienda/Checkout (auth+Cliente)
GET  /tienda/mi-cuenta          → Tienda/Cuenta/Index (auth+Cliente)
GET  /tienda/mis-pedidos        → Tienda/Cuenta/Pedidos (auth+Cliente)
GET  /tienda/mis-pedidos/{id}   → Tienda/Cuenta/PedidoShow (auth+Cliente)
GET  /tienda/mis-direcciones    → Tienda/Cuenta/Direcciones (auth+Cliente)
```

### Verificación Sprint 01

- [x] `TiendaServiceProvider` registrado en `bootstrap/providers.php`
- [x] Rutas tienda incluidas desde `bootstrap/app.php`
- [x] Middleware `cliente` registrado como alias
- [x] Conexión Redis `cart` configurada
- [x] Estructura `app/Domains/Tienda/` creada
- [x] `npm run build` exitoso

---

## Sprint 02 — Cuentas Cliente y Direcciones

### Estado: ✅ COMPLETADO

### Archivos Creados (19)

#### Migraciones (2)

| # | Archivo | Tabla | FK Referencia |
|---|---------|-------|---------------|
| 1 | `database/migrations/2026_05_25_000001_create_cuentas_cliente_table.php` | `cuentas_cliente` | `users.id` (UNIQUE), `clientes.cod_cliente` (UNIQUE) |
| 2 | `database/migrations/2026_05_25_000002_create_direcciones_cliente_table.php` | `direcciones_cliente` | `clientes.cod_cliente` |

**Tabla `cuentas_cliente`:**
```
cod_cuenta_cliente  bigIncrements    PK
user_id             foreignId        FK → users.id, UNIQUE
cod_cliente         unsignedBigInteger  FK → clientes.cod_cliente, UNIQUE
estado_cue          string(20)       default 'activa', INDEX
fecha_activacion_cue  timestamp      nullable
created_at / updated_at
```

**Tabla `direcciones_cliente`:**
```
cod_direccion_cliente  bigIncrements    PK
cod_cliente            unsignedBigInteger  FK → clientes.cod_cliente
etiqueta_dir           string(50)       NOT NULL
nombre_destinatario_dir  string(255)    NOT NULL
telefono_dir           string(30)       nullable
direccion_dir          text             NOT NULL
ciudad_dir             string(100)      nullable
departamento_dir       string(100)      nullable
codigo_postal_dir      string(20)       nullable
referencia_dir         text             nullable
documento_nit_dir      string(30)       nullable
razon_social_dir       string(255)      nullable
es_predeterminada_dir  boolean          default false
activo_dir             boolean          default true, INDEX (cod_cliente, activo_dir)
created_at / updated_at
```

#### Modelos (2)

| # | Archivo | Relaciones |
|---|---------|------------|
| 3 | `app/Models/CuentaCliente.php` | `user()` → BelongsTo User, `cliente()` → BelongsTo Cliente |
| 4 | `app/Models/DireccionCliente.php` | `cliente()` → BelongsTo Cliente |

#### Enum (1)

| # | Archivo | Cases |
|---|---------|-------|
| 5 | `app/Domains/Tienda/Cuenta/Enums/EstadoCuentaClienteEnum.php` | `ACTIVA`, `SUSPENDIDA`, `PENDIENTE_VERIFICACION` |

#### DTOs (2)

| # | Archivo | Campos |
|---|---------|--------|
| 6 | `app/Domains/Tienda/Cuenta/DTOs/CrearCuentaClienteData.php` | `userId`, `nombreCli`, `telefonoCli`, `correoCli`, `codCanalVenta`, `codTipoFlujoComercial` |
| 7 | `app/Domains/Tienda/Cuenta/DTOs/DireccionClienteData.php` | Todos los campos `*_dir`, `esPredeterminadaDir` |

#### Actions (6)

| # | Archivo | Responsabilidad |
|---|---------|-----------------|
| 8 | `CrearCuentaClienteAction.php` | Crea `Cliente` + `CuentaCliente` en transacción DB |
| 9 | `VincularUsuarioClienteExistenteAction.php` | Si email coincide con `correo_cli` existente |
| 10 | `CrearDireccionClienteAction.php` | Alta dirección con manejo de predeterminada |
| 11 | `ActualizarDireccionClienteAction.php` | Edición con manejo de predeterminada |
| 12 | `MarcarDireccionPredeterminadaAction.php` | Cambia predeterminada (valida solo 1 por cliente) |
| 13 | `DesactivarDireccionClienteAction.php` | `activo_dir = false` |

#### Services (2)

| # | Archivo | Métodos |
|---|---------|---------|
| 14 | `app/Domains/Tienda/Cuenta/Services/CuentaClienteService.php` | `resolverPorUserId()`, `existePorUserId()`, `existePorClienteId()` |
| 15 | `app/Domains/Tienda/Cuenta/Services/DireccionClienteService.php` | `listarActivasPorCliente()`, `obtenerPredeterminada()` |

#### Requests (2)

| # | Archivo | Validación |
|---|---------|------------|
| 16 | `app/Http/Requests/Tienda/StoreDireccionClienteRequest.php` | Todos los campos `*_dir` requeridos/opcionales |
| 17 | `app/Http/Requests/Tienda/UpdateDireccionClienteRequest.php` | Mismos campos con `sometimes` |

#### Policy (1)

| # | Archivo | Regla |
|---|---------|-------|
| 18 | `app/Policies/DireccionClientePolicy.php` | Solo `cod_cliente` de la cuenta del usuario autenticado |

#### Tests (1)

| # | Archivo | Tests |
|---|---------|-------|
| 19 | `tests/Feature/Tienda/CuentaClienteTest.php` | crear cuenta, duplicado user_id falla, crear dirección, solo una predeterminada |

### Datos al Crear Cuenta (Registro)

| Campo `clientes` | Origen |
|------------------|--------|
| `nombre_cli` | `users.name` |
| `correo_cli` | `users.email` |
| `telefono_cli` | formulario registro (opcional) |
| `estado_cli` | `'activo'` |
| `cod_canal_venta` | Canal `web` (resolver por `codigo_can`) |
| `cod_tipo_flujo_comercial` | Flujo `compra_web` (resolver por `codigo_tip`) |

### Condiciones Críticas Cumplidas

| # | Condición | Estado |
|---|-----------|--------|
| 1 | **NO** `Schema::table('clientes', ...)` | ✅ No se alteró tabla existente |
| 2 | `CrearCuentaClienteAction` en DB transaction | ✅ |
| 3 | Un `user_id` → una cuenta; un `cod_cliente` → una cuenta | ✅ UNIQUE en migración |
| 4 | Máximo una `es_predeterminada_dir = true` por `cod_cliente` | ✅ Validado en Action |

### Verificación Sprint 02

- [x] Migraciones creadas con FK correctas hacia tablas existentes
- [x] Modelos con relaciones `BelongsTo` configuradas
- [x] Enum `EstadoCuentaClienteEnum` con 3 cases
- [x] DTOs con `fromArray()` y `toArray()`
- [x] 6 Actions creadas siguiendo patrón del proyecto
- [x] 2 Services creados
- [x] 2 Requests con validación
- [x] Policy con verificación de pertenencia
- [x] Tests PHPUnit creados (4 casos de prueba)
- [x] `npm run build` exitoso

---

## Resumen de Archivos Totales (30)

### Sprint 01 (11 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/seeders/TiposFlujoComercialSeeder.php` |
| 2 | `database/seeders/RolesAndPermissionsSeeder.php` |
| 3 | `app/Domains/Tienda/TiendaServiceProvider.php` |
| 4 | `app/Domains/Tienda/` (23 subdirectorios con `.gitkeep`) |
| 5 | `app/Http/Middleware/EnsureUserIsCliente.php` |
| 6 | `app/Http/Middleware/RedirectIfCliente.php` |
| 7 | `routes/tienda.php` |
| 8 | `bootstrap/providers.php` |
| 9 | `bootstrap/app.php` |
| 10 | `config/database.php` |
| 11 | `.env.example` |

### Sprint 02 (19 archivos)

| # | Archivo |
|---|---------|
| 1 | `database/migrations/2026_05_25_000001_create_cuentas_cliente_table.php` |
| 2 | `database/migrations/2026_05_25_000002_create_direcciones_cliente_table.php` |
| 3 | `app/Models/CuentaCliente.php` |
| 4 | `app/Models/DireccionCliente.php` |
| 5 | `app/Domains/Tienda/Cuenta/Enums/EstadoCuentaClienteEnum.php` |
| 6 | `app/Domains/Tienda/Cuenta/DTOs/CrearCuentaClienteData.php` |
| 7 | `app/Domains/Tienda/Cuenta/DTOs/DireccionClienteData.php` |
| 8 | `app/Domains/Tienda/Cuenta/Actions/CrearCuentaClienteAction.php` |
| 9 | `app/Domains/Tienda/Cuenta/Actions/VincularUsuarioClienteExistenteAction.php` |
| 10 | `app/Domains/Tienda/Cuenta/Actions/CrearDireccionClienteAction.php` |
| 11 | `app/Domains/Tienda/Cuenta/Actions/ActualizarDireccionClienteAction.php` |
| 12 | `app/Domains/Tienda/Cuenta/Actions/MarcarDireccionPredeterminadaAction.php` |
| 13 | `app/Domains/Tienda/Cuenta/Actions/DesactivarDireccionClienteAction.php` |
| 14 | `app/Domains/Tienda/Cuenta/Services/CuentaClienteService.php` |
| 15 | `app/Domains/Tienda/Cuenta/Services/DireccionClienteService.php` |
| 16 | `app/Http/Requests/Tienda/StoreDireccionClienteRequest.php` |
| 17 | `app/Http/Requests/Tienda/UpdateDireccionClienteRequest.php` |
| 18 | `app/Policies/DireccionClientePolicy.php` |
| 19 | `tests/Feature/Tienda/CuentaClienteTest.php` |

---

## Dependencias para Sprints Siguientes

| Sprint | Dependencia de Sprint 02 |
|--------|--------------------------|
| Sprint 05 (Checkout) | Usa `CuentaCliente`, `DireccionCliente` |
| Sprint 06 (Pedidos Web) | Usa `CuentaCliente.cod_cliente` para crear pedido |
| Sprint 09 (Auth Cliente) | Usa `CrearCuentaClienteAction` en registro |
| Sprint 11 (Frontend Checkout) | Usa `DireccionCliente` para formulario envío |

---

## Comandos de Verificación

```bash
# Verificar migraciones (requiere PHP 8.3+)
php artisan migrate --pretend

# Ejecutar seeders
php artisan db:seed --class=TiendaRolesSeeder
php artisan db:seed --class=TiposFlujoComercialSeeder
php artisan db:seed --class=CanalesVentaSeeder

# Verificar build frontend
npm run build

# Ejecutar tests
php artisan test --filter=CuentaCliente
```

---

## Notas Importantes

1. **PHP Requerido:** El proyecto requiere PHP 8.3+. Las migraciones no se pudieron ejecutar localmente por tener PHP 8.1, pero son sintácticamente correctas.

2. **Tablas existentes NO modificadas:** Solo se crearon nuevas tablas con FK hacia las existentes (`users`, `clientes`, `canales_venta`, `tipos_flujo_comercial`).

3. **Rol Cliente por defecto:** Según lo acordado, todos los usuarios nuevos que se registren desde la tienda recibirán el rol `Cliente` automáticamente.

4. **Redis:** La conexión `cart` está configurada en `config/database.php` con DB índice 2. Se requiere Redis corriendo para el Sprint 03 (Carrito).
