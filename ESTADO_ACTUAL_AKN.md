# Resumen Total del Sistema AKINOMASS

## Identidad

**AKINOMASS** es una **plataforma comercial multicanal** para negocios en Bolivia (moneda: BOB). Combina un **panel administrativo/back-office** y una **tienda en línea (e-commerce B2C)** en un solo sistema monolítico modular.

**Stack:** Laravel 13 | PHP 8.3 | PostgreSQL | Redis | Inertia.js + React 18 | Tailwind CSS | Vite 8 | Spatie Permission | Laravel Sanctum

---

## Arquitectura

```
Monolito modular → 13 dominios funcionales
Flujo: Controller → FormRequest → Action → Service → Repository → Model
```

- **Backend:** `app/Domains/` con lógica de negocio por dominio
- **Frontend:** React via Inertia.js (SPA), ~173 archivos JSX
- **RBAC:** 7 roles, 55 permisos (Spatie Permission)
- **Colas:** Redis queues para jobs asíncronos
- **Auditoría:** Traza completa de acciones del sistema
- **Multi-canal:** Registro manual estructurado de canales de origen (TikTok, WhatsApp, Instagram, Facebook, Telegram, Marketplace, Web, Venta directa)

---

## Los 7 Roles del Sistema

| Rol | Permisos clave | Qué hace |
|-----|---------------|----------|
| **Administrador** | Todos (55) | Control total del sistema |
| **Supervisor Comercial** | Clientes, leads, pedidos, pagos, reportes, tienda admin | Supervisa operaciones comerciales |
| **Encargado de Pedidos** | Pedidos, pagos, inventario (ver), tienda admin | Gestiona pedidos y pagos |
| **Vendedor** | Clientes, leads, pedidos, pagos | Registra ventas y atiende clientes |
| **Encargado de Inventario** | Productos, inventario | Controla stock y movimientos |
| **Analista** | Solo lectura en todos los módulos | Consulta reportes y datos |
| **Cliente** | Tienda pública, carrito, checkout, cuenta | Compra en la tienda en línea |

---

## Flujo por Rol

### 1. Flujo del CLIENTE (Tienda en línea)

```
Home/Catálogo → Seleccionar producto → Agregar al carrito
  → Reserva de stock temporal (20 min configurable)
  → Checkout (4 pasos: carrito → datos envío → pago con comprobante → confirmación)
  → Se genera PedidoWeb + Factura
  → Admin revisa y acepta/rechaza pago
  → Stock descontado definitivamente
  → Puede ver: mis pedidos, mis direcciones, facturas, re-subir comprobantes
```

### 2. Flujo del VENDEDOR (Admin)

```
Registra Lead (origen: canal + flujo comercial)
  → Seguimiento del lead
  → Convierte Lead en Cliente
  → Crea Pedido manual (selecciona cliente, productos, variantes)
  → Registra Pago (efectivo, transferencia, QR, depósito)
  → Confirma Pedido → descuenta stock → genera Factura
```

### 3. Flujo de VENTAS POR REDES (WhatsApp, Instagram, etc.)

```
Registra venta de red social → Vincula a lead/cliente
  → Agrega productos (detalles con variantes/tallas)
  → Puede convertir a: Lead, Cliente, Checkout, o Pedido directo
  → Trazabilidad completa del origen y conversión
```

### 4. Flujo de LIVE SALES (TikTok LIVE, etc.)

```
Crea sesión live → Agrega productos a mostrar
  → Registra interacciones de espectadores (comentarios, intención de compra)
  → Convierte interacción en Lead o Pedido directamente
  → Estados: programada → en_vivo → finalizada/cancelada
```

### 5. Flujo del ENCARGADO DE INVENTARIO

```
Consulta dashboard de stock por categoría
  → Registra entradas (compras, devoluciones)
  → Registra salidas
  → Realiza ajustes (mermas, lotes, pacas)
  → Historial de movimientos con trazabilidad
  → Alertas de stock bajo y sin stock
```

### 6. Flujo del SUPERVISOR/ANALISTA

```
Dashboard ejecutivo (KPIs auto-polling cada 25s)
  → Reportes multi-tab: Resumen, Ventas, Pedidos, Pagos, CRM, Inventario, Live Sales
  → Inteligencia de Ventas:
      - Predicción de demanda (matrices de transición Markov)
      - Análisis por canal, categoría, producto
      - Recomendaciones de abastecimiento
      - Conclusiones estratégicas (escenarios optimista/realista/pesimista)
  → Auditoría del sistema (quién hizo qué, cuándo, con diff)
```

### 7. Flujo del ADMIN (Configuración)

```
Gestiona catálogo: Categorías → Productos → Variantes/Tallas
  → Gestiona configuración de tienda (TTL reservas, checkout, pagos)
  → Revisa y acepta/rechaza pagos de tienda web
  → Acepta/rechaza pedidos de tienda
  → Administra roles y usuarios
```

---

## Módulos Funcionales

| Módulo | Funcionalidad principal |
|--------|------------------------|
| **CRM** | Clientes, Leads, Plantillas de mensaje, conversión lead→cliente |
| **Catálogo** | Productos, Categorías, Variantes, Tallas, imágenes |
| **Inventario** | Stock por variante, entradas/salidas/ajustes, movimientos |
| **Comercial** | Pedidos, Pagos (admin), Canales de venta |
| **Ventas Redes** | Registro estructurado de ventas por redes sociales |
| **Live Sales** | Sesiones de venta en vivo, interacciones, conversión |
| **Tienda** | Catálogo público, Carrito, Checkout, Pedidos web, Pagos web, Facturación, Cuenta cliente, Direcciones |
| **Reportes** | 7 módulos de reportes con filtros por fecha/canal/flujo |
| **Inteligencia de Ventas** | Predicción de demanda, abastecimiento, análisis por canal/producto |
| **Dashboard** | KPIs ejecutivos, gráficos, alertas |
| **Auditoría** | Trazabilidad completa de acciones del sistema |
| **Seguridad** | Auth, Roles, Permisos (Spatie), Sanctum tokens |

---

## Base de Datos (36+ modelos)

**Entidades centrales:**
- `Pedido` → el corazón del sistema, conecta CRM, inventario, pagos y facturación
- `Producto` + `VarianteProducto` + `TallaProducto` → catálogo con soporte de variantes
- `Inventario` + `MovimientoInventario` → control de stock
- `Cliente` ↔ `CuentaCliente` ↔ `User` → puente entre negocio y autenticación
- `CheckoutSesion` → flujo de checkout online con máquina de estados
- `PrediccionVenta` → 40+ columnas de análisis predictivo

**Reserva de stock:** `ReservaStockCarrito` bloquea inventario temporalmente durante carrito/checkout con TTL configurable. Jobs programados expiran reservas cada 5 minutos.

**Facturación:** Emisión automática tras confirmación de pedido, con numeración secuencial, código de control y soporte de comprobantes de pago.

---

## Tareas Programadas

| Job | Frecuencia |
|-----|-----------|
| `ExpirarReservasCarritoJob` | Cada 5 minutos |
| `ExpirarCheckoutSesionesJob` | Cada 15 minutos |

---

## Estado de Madurez

| Dominio | Estado |
|---------|--------|
| **Tienda** | Completo (11 sub-módulos, 50+ archivos) |
| **InteligenciaVentas** | Completo (9 Actions, 11 Services, 7 DTOs, 5 Repos) |
| **VentasRedes** | Completo (11 Actions, 5 Services, 4 Repos) |
| **Auditoría** | Parcial (funcional) |
| **Comercial** | Parcial (Pagos y Pedidos funcionales) |
| **CRM** | Parcial (Actions definidos, Services vacíos) |
| **Inventario** | Parcial (funcional) |
| **Catálogo** | Parcial (Actions definidos) |
| **Dashboard/Reportes** | Parcial (funcional) |
| **Analytics/Seguridad/Shared** | Solo scaffolding |
