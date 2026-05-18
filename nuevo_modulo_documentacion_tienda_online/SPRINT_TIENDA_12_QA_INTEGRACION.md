# Sprint 12 — QA, integración y cierre

| Campo | Valor |
|-------|-------|
| **ID** | TIENDA-12 |
| **Duración estimada** | 3–5 días |
| **Perfil** | QA + líder técnico + todos |
| **Rama** | `feature/tienda-12-qa-integracion` |
| **Depende de** | Sprints 01–11 |

---

## Objetivo

Validar flujo end-to-end, datos demo, documentación actualizada, merge a `develop` sin regresiones en back-office.

---

## Matriz de pruebas E2E

| ID | Caso | Pasos | Resultado esperado |
|----|------|-------|-------------------|
| E2E-01 | Compra invitado → registro → checkout | Agregar 2 productos → registro → checkout → pedido | Pedido borrador + pago pendiente |
| E2E-02 | Stock insuficiente | qty > stock en checkout | Error 422, sin pedido |
| E2E-03 | Confirmación staff | Admin confirma pago | Pedido confirmado, stock descontado |
| E2E-04 | Factura | Tras confirmar | `facturas.estado_fac = emitida` |
| E2E-05 | Aislamiento cliente | Cliente GET `/dashboard` | 403 o redirect |
| E2E-06 | Aislamiento pedidos | Cliente ve pedido ajeno | 403 |
| E2E-07 | Carrito merge | Guest + login | Cantidades fusionadas |
| E2E-08 | Checkout expirado | Esperar TTL | No generar pedido |
| E2E-09 | Admin operación | Vendedor crea pedido manual | Sin romper tienda |
| E2E-10 | Build | `npm run build` | Exit 0 |

---

## Pruebas automatizadas

| Suite | Ubicación sugerida |
|-------|-------------------|
| Feature Tienda Carrito | `tests/Feature/Tienda/CarritoTest.php` |
| Feature Checkout | `tests/Feature/Tienda/CheckoutTest.php` |
| Feature Cuenta | `tests/Feature/Tienda/CuentaClienteTest.php` |
| Feature Policies | `tests/Feature/Tienda/PoliciesTest.php` |

**Meta cobertura:** casos críticos 100% (carrito, checkout, pedido web, policies).

---

## Seeder demo tienda (opcional)

| Seeder | Contenido |
|--------|-----------|
| `DemoTiendaSeeder` | Usuario cliente demo + productos con stock |

Documentar credenciales en `database/seeders/Demo/README.md` (no contraseñas en producción).

---

## Checklist pre-merge `develop`

| # | Item |
|---|------|
| 1 | `php artisan migrate:status` — todas applied |
| 2 | `php artisan db:seed --class=TiendaRolesSeeder` |
| 3 | `php artisan config:clear` |
| 4 | `npm run build` |
| 5 | `php artisan test` |
| 6 | `php artisan route:list --path=tienda` |
| 7 | Revisión seguridad: archivos comprobante no públicos |
| 8 | README_TIENDA_ONLINE actualizado con estado DONE |
| 9 | Preguntas P01–P15 cerradas o defaults documentados |
| 10 | PR con descripción + capturas UI |

---

## Regresión back-office

| Módulo | Verificar |
|--------|-----------|
| Pedidos admin | CRUD + confirmar |
| Pagos admin | confirmar/rechazar |
| Inventario | movimientos tras pedido web confirmado |
| Roles staff | sin perder permisos |
| Dashboard | carga |

---

## Documentación a actualizar al cierre

| Documento | Acción |
|-----------|--------|
| `README_TIENDA_ONLINE.md` | Estado sprints |
| `README_ARQUITECTURA.md` | Mención dominio Tienda (opcional) |
| `database/seeders/Demo/README.md` | Usuario demo tienda |

---

## Criterios de aceptación programa completo

- [ ] Matriz E2E-01 a E2E-10 pasada.
- [ ] Sin migraciones ALTER en tablas legacy.
- [ ] Demo grabable en 5 min para stakeholders.
- [ ] Equipo tiene asignaciones cerradas en retro.

---

## Retro sugerida (template)

| ¿Qué funcionó? | ¿Qué mejorar? | Acción |
|----------------|---------------|--------|
| | | |
