# Preguntas abiertas — Tienda Online AKINOMASS

**Responsable de cierre:** Líder técnico / product owner.  
**Bloqueante:** Sprint 00 debe dejar respuestas antes de Sprint 05 (checkout).

Marcar decisión con fecha y nombre:

| ID | Pregunta | Opciones | Decisión | Fecha | Responsable |
|----|----------|----------|----------|-------|-------------|
| P01 | ¿Moneda única? | BOB / USD / multi | _Pendiente_ | | |
| P02 | ¿Impuesto (IVA) en checkout? | Sí % fijo / No en v1 | _Pendiente_ | | |
| P03 | ¿Factura fiscal legal (SIN) o comprobante interno? | Solo recibo interno / Integración fiscal futura | _Pendiente_ | | |
| P04 | ¿Un carrito activo por usuario o varios? | Uno (recomendado) / Varios | _Pendiente_ | | |
| P05 | ¿Invitado puede ver carrito sin login? | Sí / Solo con login | _Pendiente_ | | |
| P06 | ¿Crear pedido antes o después de confirmar pago? | Pedido borrador + pago pendiente (recomendado) / Pedido solo si pago confirmado | _Pendiente_ | | |
| P07 | ¿Quién confirma pagos web? | Solo staff / Staff + auto si referencia válida | _Pendiente_ | | |
| P08 | ¿Subida de comprobante obligatoria? | Sí para transferencia/QR / Opcional | _Pendiente_ | | |
| P09 | ¿Límite de ítems en carrito? | Número máximo / Sin límite | _Pendiente_ | | |
| P10 | ¿Reservar stock al iniciar checkout? | Sí (reserva temporal) / Solo al confirmar pedido | _Pendiente_ | | |
| P11 | ¿Nuevo tipo flujo `compra_web` en seeder? | Sí / Usar `venta_directa` existente | _Pendiente_ | | |
| P12 | ¿Email transaccional (pedido confirmado)? | Sí / No en v1 | _Pendiente_ | | |
| P13 | ¿Ruta raíz `/` es tienda o Welcome Laravel? | Tienda / Landing + link tienda | _Pendiente_ | | |
| P14 | ¿Clientes registrados ven panel admin? | No (redirect tienda) / Sí lectura limitada | _Pendiente_ | | |
| P15 | ¿Máximo tamaño comprobante pago? | MB / formatos jpg,png,pdf | _Pendiente_ | | |

---

## Recomendaciones por defecto (si no hay respuesta en 48h)

| ID | Recomendación |
|----|----------------|
| P01 | BOB |
| P02 | No IVA en v1 (`impuesto_che = 0`) |
| P03 | Comprobante interno (`tipo_comprobante_fac = recibo`) |
| P04 | Un carrito `activo` por `user_id` |
| P05 | Sí ver carrito; checkout exige login |
| P06 | Pedido `borrador` + pago `pendiente` al checkout |
| P07 | Solo staff (roles Encargado Pedidos / Supervisor) |
| P08 | Obligatorio para `transferencia` y `qr` |
| P09 | Máximo 50 líneas o 99 unidades por producto (configurable) |
| P10 | Validar stock al confirmar pedido; reserva opcional fase 2 |
| P11 | Agregar `compra_web` en `TiposFlujoComercialSeeder` |
| P12 | No en v1 |
| P13 | `/` → Home tienda; `/admin` o `/dashboard` → back-office |
| P14 | Rol Cliente **no** accede a rutas `dashboard`, `pedidos` admin, etc. |
| P15 | 5 MB; `jpg`, `jpeg`, `png`, `pdf` |
