# Sprint 02 — Cuentas cliente y direcciones

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-02 |
| **Duración estimada** | 3–4 días |
| **Perfil** | Backend (Carla / CRM) |
| **Rama** | `feature/tienda-02-cuentas-direcciones` |
| **Depende de** | Sprint 01 |
| **Habilita** | Sprint 05, 09 |

---

## Objetivo

Vincular `users` con `clientes` sin alterar tabla `clientes`, y permitir direcciones de envío/facturación.

---

## Migración 1: `cuentas_cliente`

### Tabla: `cuentas_cliente`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_cuenta_cliente` | `bigIncrements` | NO | — | PK |
| `user_id` | `foreignId` | NO | — | FK → `users.id`, **UNIQUE** |
| `cod_cliente` | `unsignedBigInteger` | NO | — | FK → `clientes.cod_cliente`, **UNIQUE** |
| `estado_cue` | `string(20)` | NO | `activa` | INDEX |
| `fecha_activacion_cue` | `timestamp` | SÍ | `null` | — |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

### Enum: `EstadoCuentaClienteEnum`

| Case | Valor |
|------|-------|
| `ACTIVA` | `activa` |
| `SUSPENDIDA` | `suspendida` |
| `PENDIENTE_VERIFICACION` | `pendiente_verificacion` |

### Modelo: `app/Models/CuentaCliente.php`

| Relación | Tipo | FK |
|----------|------|-----|
| `user()` | BelongsTo | `user_id` |
| `cliente()` | BelongsTo | `cod_cliente` |

---

## Migración 2: `direcciones_cliente`

### Tabla: `direcciones_cliente`

| Columna | Tipo | Null | Default | Índice / FK |
|---------|------|:----:|---------|-------------|
| `cod_direccion_cliente` | `bigIncrements` | NO | — | PK |
| `cod_cliente` | `unsignedBigInteger` | NO | — | FK → `clientes.cod_cliente` |
| `etiqueta_dir` | `string(50)` | NO | — | — |
| `nombre_destinatario_dir` | `string(255)` | NO | — | — |
| `telefono_dir` | `string(30)` | SÍ | `null` | — |
| `direccion_dir` | `text` | NO | — | — |
| `ciudad_dir` | `string(100)` | SÍ | `null` | — |
| `departamento_dir` | `string(100)` | SÍ | `null` | — |
| `codigo_postal_dir` | `string(20)` | SÍ | `null` | — |
| `referencia_dir` | `text` | SÍ | `null` | — |
| `documento_nit_dir` | `string(30)` | SÍ | `null` | — |
| `razon_social_dir` | `string(255)` | SÍ | `null` | — |
| `es_predeterminada_dir` | `boolean` | NO | `false` | — |
| `activo_dir` | `boolean` | NO | `true` | INDEX con `cod_cliente` |
| `created_at` | `timestamp` | SÍ | | |
| `updated_at` | `timestamp` | SÍ | | |

**Regla negocio:** máximo una `es_predeterminada_dir = true` por `cod_cliente` (validar en Action).

---

## Dominio `app/Domains/Tienda/Cuenta/`

### Actions

| Clase | Responsabilidad |
|-------|-----------------|
| `CrearCuentaClienteAction` | Crea `Cliente` + `CuentaCliente` en transacción |
| `VincularUsuarioClienteExistenteAction` | Si email coincide con `correo_cli` |
| `CrearDireccionClienteAction` | Alta dirección |
| `ActualizarDireccionClienteAction` | Edición |
| `MarcarDireccionPredeterminadaAction` | Cambia predeterminada |
| `DesactivarDireccionClienteAction` | `activo_dir = false` |

### DTOs

| DTO | Campos principales |
|-----|-------------------|
| `CrearCuentaClienteData` | `user_id`, `nombre_cli`, `telefono_cli`, `correo_cli`, `cod_canal_venta`, `cod_tipo_flujo_comercial` |
| `DireccionClienteData` | todos los campos `*_dir` |

### Service

| Clase | Método ejemplo |
|-------|----------------|
| `CuentaClienteService` | `resolverPorUserId(int $userId): CuentaCliente` |
| `DireccionClienteService` | `listarActivasPorCliente(int $codCliente)` |

---

## Datos al crear cuenta (registro)

| Campo `clientes` | Origen |
|------------------|--------|
| `nombre_cli` | `users.name` |
| `correo_cli` | `users.email` |
| `telefono_cli` | formulario registro (opcional) |
| `estado_cli` | `activo` |
| `cod_canal_venta` | Canal `web` (resolver por `codigo_can`) |
| `cod_tipo_flujo_comercial` | `compra_web` o `venta_directa` |

---

## Requests / Policies

| Request | Uso |
|---------|-----|
| `StoreDireccionClienteRequest` | Validación dirección |
| `UpdateDireccionClienteRequest` | Validación edición |

| Policy | Regla |
|--------|-------|
| `DireccionClientePolicy` | Solo `cod_cliente` de la cuenta del usuario autenticado |

---

## Condiciones

| # | Condición |
|---|-----------|
| 1 | **NO** `Schema::table('clientes', ...)` |
| 2 | `CrearCuentaClienteAction` en DB transaction |
| 3 | Un `user_id` → una cuenta; un `cod_cliente` → una cuenta |
| 4 | Tests: crear cuenta, duplicado user_id falla |

---

## Criterios de aceptación

- [ ] Migraciones ejecutan en PostgreSQL sin error.
- [ ] Modelos con relaciones cargables.
- [ ] `CrearCuentaClienteAction` crea filas en `clientes` + `cuentas_cliente`.
- [ ] CRUD direcciones vía Actions (tests o tinker).
- [ ] Índices y FKs según tablas arriba.

---

## Archivos a crear (checklist)

- [ ] `database/migrations/xxxx_create_cuentas_cliente_table.php`
- [ ] `database/migrations/xxxx_create_direcciones_cliente_table.php`
- [ ] `app/Models/CuentaCliente.php`
- [ ] `app/Models/DireccionCliente.php`
- [ ] `app/Domains/Tienda/Cuenta/Actions/*`
- [ ] `app/Domains/Tienda/Cuenta/Enums/EstadoCuentaClienteEnum.php`
- [ ] `tests/Feature/Tienda/CuentaClienteTest.php` (recomendado)
