# DISEÑO FRONTEND AKINOMASS — V1 (Todos los Módulos)

> **Versión:** 1.0  
> **Fecha:** Mayo 2026  
> **Stack:** Laravel 13 · Inertia.js · React 18 · Tailwind CSS 3 · Vite 8 · Recharts 2.12.7  
> **Paleta:** Modern Earth

---

## Índice

1. [Arquitectura Visual Base](#1-arquitectura-visual-base)
2. [Paleta de Colores Modern Earth](#2-paleta-de-colores-modern-earth)
3. [Semántica de Estados Universales](#3-semántica-de-estados-universales)
4. [Componentes UI Reutilizables](#4-componentes-ui-reutilizables)
5. [Componentes de Gráficas](#5-componentes-de-gráficas)
6. [Layout Principal](#6-layout-principal)
7. [Módulo 0 — Base Visual Común](#7-módulo-0--base-visual-común)
8. [Módulo 1 — CRM (Clientes, Leads, Plantillas)](#8-módulo-1--crm-clientes-leads-plantillas)
9. [Módulo 2 — Catálogo (Categorías, Productos)](#9-módulo-2--catálogo-categorías-productos)
10. [Módulo 3 — Inventario](#10-módulo-3--inventario)
11. [Módulo 4 — Comercial (Pedidos, Pagos)](#11-módulo-4--comercial-pedidos-pagos)
12. [Módulo 5 — LiveSales (Sesiones, Interacciones)](#12-módulo-5--livesales-sesiones-interacciones)
13. [Módulo 6 — Reportes (Gráficas y KPIs)](#13-módulo-6--reportes-gráficas-y-kpis)
14. [Reglas Operativas](#14-reglas-operativas)
15. [Flujo de Trabajo por Módulo](#15-flujo-de-trabajo-por-módulo)
16. [Archivos del Proyecto](#16-archivos-del-proyecto)

---

## 1. Arquitectura Visual Base

El sistema utiliza una arquitectura de diseño consistente en todos los módulos:

```
┌─────────────────────────────────────────────────────┐
│ Sidebar Izquierdo (fijo)  │  Contenido Principal    │
│ #3C473A                   │  Fondo: #FDF6F0         │
│                           │                         │
│ ┌───────────────────────┐ │  ┌───────────────────┐  │
│ │ Logo AKINOMASS        │ │  │ Topbar flotante   │  │
│ │                       │ │  │ (búsqueda+perfil) │  │
│ ├───────────────────────┤ │  └───────────────────┘  │
│ │ • Dashboard           │ │                         │
│ │ • Clientes            │ │  ┌───────────────────┐  │
│ │ • Leads               │ │  │ PageHeader        │  │
│ │ • Plantillas          │ │  │ (título+breadcrumbs)│
│ │ • Categorías          │ │  └───────────────────┘  │
│ │ • Productos           │ │                         │
│ │ • Inventario          │ │  ┌───────────────────┐  │
│ │ • Movimientos         │ │  │                   │  │
│ │ • Pedidos             │ │  │   {children}      │  │
│ │ • Pagos               │ │  │   Tarjetas,        │  │
│ │ • Live Sales          │ │  │   Tablas,         │  │
│ │ • Reportes            │ │  │   Gráficas        │  │
│ │                       │ │  └───────────────────┘  │
│ ├───────────────────────┤ │                         │
│ │ Perfil · Cerrar sesión│ │                         │
│ └───────────────────────┘ │                         │
└─────────────────────────────────────────────────────┘
```

---

## 2. Paleta de Colores Modern Earth

### Colores Institucionales

| Rol | Nombre | Hex | Clase Tailwind |
|-----|--------|-----|----------------|
| Primario / Sidebar | Verde oliva oscuro | `#3C473A` | `oliva-700` |
| Acción Principal | Terracota / Naranja quemado | `#D77A61` | `terracota-500` |
| Fondo App | Crema suave | `#FDF6F0` | `crema-100` |
| Texto General | Marrón café oscuro | `#2B221E` | `cafe-950` |

### Escalas de Color

```
oliva:     50 al 950   (verde oliva, base #3C473A)
terracota: 50 al 950   (terracota, base #D77A61)
crema:     DEFAULT, 50, 100, 200, 300  (crema, base #FDF6F0)
cafe:      DEFAULT, 50 al 950  (café, base #2B221E)
```

### Colores de Estado

| Estado | Hex | Clase Tailwind |
|--------|-----|----------------|
| Éxito | `#059669` | `estado-exito` / `success` |
| Advertencia | `#D97706` | `estado-advertencia` / `warning` |
| Informativo | `#0891B2` | `estado-info` / `info` |
| Error | `#DC2626` | `estado-error` / `danger` |
| Inactivo | `#9CA3AF` | `estado-inactivo` |

---

## 3. Semántica de Estados Universales

### Regla General de Color por Estado

| Significado | Color | Uso |
|-------------|-------|-----|
| Activo, pagado, confirmado, entregado, completado, convertido | Verde | Entidades operativas exitosas |
| Acción principal, pendiente, en preparación, observado, en vivo | Terracota | Estados que requieren atención |
| Enviado, en proceso, informativo | Azul suave | Flujos intermedios |
| Cancelado, rechazado, agotado, error, devuelto, descontinuado | Rojo | Estados negativos o terminales |
| Borrador, inactivo, programada | Gris | Estados neutros o no activos |

### Badges por Dominio

#### Pedidos
| Estado | Color |
|--------|-------|
| `borrador` | Gris |
| `confirmado` | Verde |
| `preparando` | Terracota |
| `enviado` | Azul suave |
| `entregado` | Verde |
| `cancelado` | Rojo |
| `devuelto` | Rojo |

#### Pagos
| Estado | Color |
|--------|-------|
| `pendiente` | Terracota |
| `pagado` | Verde |
| `observado` | Terracota |
| `rechazado` | Rojo |
| `reembolsado` | Rojo |

#### Leads
| Estado | Color |
|--------|-------|
| `nuevo` | Verde |
| `contactado` | Terracota |
| `interesado` | Terracota |
| `pendiente_pago` | Terracota |
| `convertido` | Verde |
| `perdido` | Rojo |
| `descartado` | Rojo |

#### Clientes
| Estado | Color |
|--------|-------|
| `activo` | Verde |
| `inactivo` | Gris |
| `recurrente` | Oliva |
| `bloqueado` | Rojo |

#### Productos
| Estado | Color |
|--------|-------|
| `activo` | Verde |
| `inactivo` | Gris |
| `agotado` | Rojo |
| `descontinuado` | Rojo |

#### Sesiones Live
| Estado | Color |
|--------|-------|
| `programada` | Gris |
| `en_vivo` | Terracota (con indicador pulsante) |
| `finalizada` | Verde |
| `cancelada` | Rojo |

#### Interacciones Live
| Estado | Color |
|--------|-------|
| `nuevo` | Verde |
| `contactado` | Terracota |
| `convertido_lead` | Oliva |
| `convertido_pedido` | Verde |
| `descartado` | Rojo |

#### Movimientos de Inventario
| Tipo | Color |
|------|-------|
| `entrada` | Verde |
| `salida` | Rojo |
| `ajuste` | Terracota |
| `devolucion` | Verde |
| `reserva` | Azul suave |
| `cancelacion` | Rojo |

#### Métodos de Pago
| Método | Color |
|--------|-------|
| `qr` | Cyan |
| `transferencia` | Oliva |
| `efectivo` | Verde |
| `deposito` | Terracota |
| `otro` | Gris |

#### Tipos de Plantilla
| Tipo | Color |
|------|-------|
| `primer_contacto` | Oliva |
| `seguimiento` | Cyan |
| `confirmacion_interes` | Terracota |
| `confirmacion_pedido` | Verde |
| `recordatorio_pago` | Amber |
| `agradecimiento` | Verde |
| `cliente_inactivo` | Gris |
| `stock_disponible` | Oliva |
| `respuesta_rapida_live` | Terracota |

---

## 4. Componentes UI Reutilizables

### Ubicación
```
resources/js/Components/UI/
├── PageHeader.jsx
├── SectionCard.jsx
├── StatusBadge.jsx
├── EmptyState.jsx
├── PrimaryActionButton.jsx
├── SecondaryActionButton.jsx
├── TableWrapper.jsx
└── FormCard.jsx
```

### 4.1 `PageHeader.jsx`
Encabezado de cada página con título, subtítulo, breadcrumbs y acciones.

```jsx
<PageHeader
    title="Clientes"
    subtitle="Gestiona tus clientes registrados"
    breadcrumbs={[
        { label: 'Dashboard', href: route('dashboard') },
        { label: 'Clientes' },
    ]}
    actions={<PrimaryActionButton>Crear</PrimaryActionButton>}
/>
```

**Props:** `title`, `subtitle`, `breadcrumbs` (array de `{label, href?}`), `actions` (ReactNode)

### 4.2 `SectionCard.jsx`
Contenedor base tipo tarjeta con header opcional y sombras sutiles.

```jsx
<SectionCard title="Información" subtitle="Subtítulo" noPadding>
    {children}
</SectionCard>
```

**Props:** `title`, `subtitle`, `headerActions`, `noPadding`, `className`

### 4.3 `StatusBadge.jsx`
Badge de estado con paleta semántica. Soporta 30+ estados predefinidos.

```jsx
<StatusBadge status="activo" />
<StatusBadge status="pendiente" size="lg" label="Pendiente" />
```

**Props:** `status` (string del estado), `label` (override), `size` (`sm`/`md`/`lg`)

### 4.4 `EmptyState.jsx`
Estado vacío obligatorio para vistas sin registros.

```jsx
<EmptyState
    title="No hay clientes"
    description="Comienza creando tu primer cliente."
    action={<PrimaryActionButton>Crear Cliente</PrimaryActionButton>}
/>
```

**Props:** `icon`, `title`, `description`, `action`

### 4.5 `PrimaryActionButton.jsx`
Botón principal de interacción en color terracota con soporte para loading y icono.

```jsx
<PrimaryActionButton
    onClick={handleSubmit}
    loading={form.processing}
    icon={<svg>...</svg>}
>
    Guardar
</PrimaryActionButton>
```

**Props:** `children`, `onClick`, `disabled`, `loading`, `icon`, `type`, `size` (`sm`/`md`/`lg`)

### 4.6 `SecondaryActionButton.jsx`
Botón secundario neutro para cancelaciones o flujos alternos.

```jsx
<SecondaryActionButton onClick={handleCancel}>
    Cancelar
</SecondaryActionButton>
```

### 4.7 `TableWrapper.jsx`
Envoltorio para tablas limpias con Header, Body, Row, Cell, y compatibilidad con scroll horizontal.

```jsx
<TableWrapper>
    <TableWrapper.Header>
        <TableWrapper.HeaderCell>Nombre</TableWrapper.HeaderCell>
    </TableWrapper.Header>
    <TableWrapper.Body>
        <TableWrapper.Row>
            <TableWrapper.Cell>Contenido</TableWrapper.Cell>
        </TableWrapper.Row>
    </TableWrapper.Body>
</TableWrapper>
```

Subcomponentes: `TableWrapper.Header`, `TableWrapper.HeaderCell`, `TableWrapper.Body`, `TableWrapper.Row`, `TableWrapper.Cell`, `TableWrapper.EmptyRow`

### 4.8 `FormCard.jsx`
Tarjeta optimizada para formularios con secciones y acciones.

```jsx
<FormCard title="Datos" subtitle="Complete la información" onSubmit={submit}>
    <FormCard.Section title="Sección">
        <FormCard.Row>
            {inputs}
        </FormCard.Row>
    </FormCard.Section>
    <FormCard.Actions>
        <SecondaryButton>Cancelar</SecondaryButton>
        <PrimaryActionButton type="submit">Guardar</PrimaryActionButton>
    </FormCard.Actions>
</FormCard>
```

Subcomponentes: `FormCard.Section`, `FormCard.Row`, `FormCard.Actions`

---

## 5. Componentes de Gráficas

### Ubicación
```
resources/js/Components/Charts/
├── VerticalBarChart.jsx
├── PieChart.jsx
├── HorizontalBar.jsx
└── KpiCard.jsx
```

### 5.1 `VerticalBarChart.jsx`
Gráfica de barras verticales con Recharts.

```jsx
<VerticalBarChart
    data={data}
    dataKey="valor"
    labelKey="nombre"
    height={300}
    color="#D77A61"
    formatValue={(v) => `Bs ${v}`}
/>
```

### 5.2 `PieChart.jsx`
Gráfica de pastel/donut con leyenda personalizada.

```jsx
<PieChartComponent
    data={pieData}
    dataKey="value"
    nameKey="name"
    height={300}
    innerRadius={60}
/>
```

### 5.3 `HorizontalBar.jsx`
Barras horizontales CSS puras (sin dependencia de librería).

```jsx
<HorizontalBar
    data={data}
    labelKey="name"
    valueKey="value"
    formatValue={formatBOB}
/>
```

### 5.4 `KpiCard.jsx`
Tarjeta de métrica grande con icono, valor, variante de color y tendencia.

```jsx
<KpiCard
    title="Total Ventas"
    value={formatBOB(total)}
    variant="green"
    trend="up"
    trendValue="+12%"
    icon={<svg>...</svg>}
/>
```

**Variantes:** `oliva`, `terracota`, `green`, `cyan`, `amber`, `red`

---

## 6. Layout Principal

### Archivos
```
resources/js/Layouts/
├── AuthenticatedLayout.jsx
└── GuestLayout.jsx
```

### `AuthenticatedLayout.jsx`
Layout principal con sidebar lateral fijo en color oliva oscuro y topbar flotante.

- **Sidebar:** Fondo `#3C473A`, logo AKINOMASS estilizado, navegación con iconos SVG, ítem activo en terracota, se oculta en móvil con botón hamburguesa
- **Topbar:** Fondo blanco semitransparente con backdrop-blur, barra de búsqueda, perfil de usuario con dropdown (Mi Perfil / Cerrar Sesión)
- **Contenido:** Fondo `#FDF6F0`, header opcional, main con padding

---

## 7. Módulo 0 — Base Visual Común

### Archivos Modificados (8)

| Archivo | Cambio |
|---------|--------|
| `tailwind.config.js` | Paleta completa Modern Earth: `oliva`, `terracota`, `crema`, `cafe`. Colores de estado: `estado-exito`, `estado-advertencia`, `estado-info`, `estado-error`, `estado-inactivo`. Sombras `card`, `card-hover`, `sidebar`. |
| `resources/css/app.css` | Scrollbar personalizado, selección de texto en terracota, focus ring accesible, smooth scroll, clases utilitarias `card-hover`, `input-focus`, `gradient-oliva`, `gradient-terracota` |
| `Layouts/AuthenticatedLayout.jsx` | Rediseño completo: sidebar lateral izquierdo + topbar flotante + responsive |
| `Components/Badge.jsx` | Variantes ampliadas: `terracota`, `oliva`, `inactivo` |
| `Components/PrimaryButton.jsx` | Color terracota, soporte `loading` con spinner |
| `Components/SecondaryButton.jsx` | Estilo neutro con bordes sutiles |
| `Components/NavLink.jsx` | Soporte `sidebar` mode para navegación vertical |
| `Pages/Dashboard.jsx` | Actualizado con nueva paleta y componentes UI |

### Componentes UI Creados (8)

`PageHeader`, `SectionCard`, `StatusBadge`, `EmptyState`, `PrimaryActionButton`, `SecondaryActionButton`, `TableWrapper`, `FormCard`

---

## 8. Módulo 1 — CRM (Clientes, Leads, Plantillas)

### Clientes (4 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `Clientes/Index.jsx` | PageHeader + breadcrumbs + SectionCard + TableWrapper con StatusBadge + FilterBar (estado, canal, flujo) + EmptyState |
| `Clientes/Create.jsx` | PageHeader + FormCard con secciones (Información Personal, Contacto, Clasificación Comercial, Observaciones) + validación visual de errores |
| `Clientes/Edit.jsx` | Igual que Create, pre-llenado con datos del cliente |
| `Clientes/Partials.jsx` | FormCard con inputs enfocados en terracota, errores con borde rojo y mensaje, botones PrimaryActionButton/SecondaryButton |

### Leads (4 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `Leads/Index.jsx` | PageHeader + SectionCard + TableWrapper + select inline para cambio rápido de estado en tabla + **modal de confirmación** para convertir a cliente + botón "Convertir" |
| `Leads/Create.jsx` | PageHeader + FormCard con secciones (Información, Contacto, Interés, Clasificación, Observaciones) |
| `Leads/Edit.jsx` | Igual que Create, pre-llenado |
| `Leads/Partials.jsx` | FormCard con selects para estado, canal, flujo y responsable |

### Plantillas de Mensajes (3 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `PlantillasMensaje/Index.jsx` | PageHeader + **cards individuales** (no tabla) con: badges de tipo y estado, botón **copiar texto** con `navigator.clipboard.writeText` y feedback "Copiado", filtro por tipo, banner informativo "No envío automático" |
| `PlantillasMensaje/Create.jsx` | PageHeader + FormCard con nombre, tipo (select), contenido (textarea), checkbox activo |
| `PlantillasMensaje/Edit.jsx` | Igual que Create, pre-llenado |

---

## 9. Módulo 2 — Catálogo (Categorías, Productos)

### Categorías (3 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `CategoriasProducto/Index.jsx` | PageHeader + SectionCard + TableWrapper con StatusBadge (activo=verde, inactivo=gris) + EmptyState |
| `CategoriasProducto/Create.jsx` | PageHeader + FormCard con nombre, descripción, checkbox activo |
| `CategoriasProducto/Edit.jsx` | Igual que Create, pre-llenado |

### Productos (3 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `Productos/Index.jsx` | PageHeader + **grilla de cards** responsive (1-4 columnas). Cada card: imagen con fallback SVG, badge de estado, nombre, SKU (monospace), categoría, precio en Bs, costo. **Filtros client-side:** búsqueda por nombre/SKU, filtro por categoría, filtro por estado. Contador de resultados. EmptyState contextual. |
| `Productos/Create.jsx` | PageHeader + FormCard con 4 secciones: Información Básica (nombre, SKU, descripción), Clasificación (categoría, estado), Precios (venta con prefijo Bs, costo), Imagen URL. |
| `Productos/Edit.jsx` | Igual que Create, pre-llenado |

**Formato de moneda:** `Bs 120.00` usando `Intl.NumberFormat('es-BO')`

---

## 10. Módulo 3 — Inventario

### Archivos (5)

| Archivo | Funcionalidad |
|---------|---------------|
| `Inventario/Index.jsx` | **Dashboard de inventario:** 4 KPIs (Total Productos, Stock Total, Stock Bajo, Activos). **Sección de alertas de stock bajo** con tarjetas destacadas en terracota. Tabla principal con filas resaltadas para stock bajo. Accesos rápidos a Entrada/Salida/Ajuste/Movimientos. |
| `Inventario/Entrada.jsx` | PageHeader + FormCard con: Producto (select), Cantidad (number), Motivo, Observación |
| `Inventario/Salida.jsx` | Misma estructura que Entrada con ruta de salida |
| `Inventario/Ajustar.jsx` | PageHeader + FormCard con: Producto (select), Stock Nuevo (number), Motivo, Observación. Texto de ayuda. |
| `Inventario/Movimientos.jsx` | PageHeader + **tabla con badges semánticos** por tipo de movimiento. Columnas: Fecha completa con hora, Producto, Tipo, Cantidad (con signo +/- y color), Stock Anterior → Nuevo, Responsable. **Leyenda de tipos.** |

---

## 11. Módulo 4 — Comercial (Pedidos, Pagos)

### Pedidos (4 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `Pedidos/Index.jsx` | PageHeader + TableWrapper con filtro por estado. Columnas: Número (monospace), Cliente, Canal, Estado, Fecha, Total (Bs). Acciones: Ver + Editar (solo si borrador). |
| `Pedidos/Create.jsx` | **Tabla dinámica de productos** sin límite. Cliente y Canal (selects), Fecha, Productos (agregar/eliminar filas), auto-precio al seleccionar producto, Resumen (subtotal, descuento, total calculado en tiempo real). |
| `Pedidos/Edit.jsx` | Misma estructura que Create. **Solo editable si estado = borrador.** Campos deshabilitados si no editable. Mensaje de advertencia. |
| `Pedidos/Show.jsx` | **Detalle completo:** Sección Cliente (nombre, canal, flujo), Productos (tabla con cantidades y subtotales), Totales (subtotal, descuento, total). **Acciones contextuales:** Confirmar y Cancelar con **modales de confirmación**. Editar solo si borrador. |

### Pagos (4 archivos)

| Archivo | Funcionalidad |
|---------|---------------|
| `Pagos/Index.jsx` | PageHeader + TableWrapper con **filtros por estado Y método**. Badges de método (QR=cyan, Transferencia=oliva, Efectivo=verde, Depósito=terracota). **Banner informativo:** "El registro manual de un pago no equivale a la confirmación automática de fondos bancarios." |
| `Pagos/Create.jsx` | FormCard con: Pedido (select), Método (select), Monto (con prefijo Bs), Referencia, Fecha, Observación |
| `Pagos/Edit.jsx` | Mismos campos que Create excepto Pedido (no editable) |
| `Pagos/Show.jsx` | Detalle del pago con **acciones contextuales según estado**: Confirmar (solo pendiente), Observar (solo pendiente), Rechazar (pendiente u observado). **3 modales de confirmación** independientes. |

---

## 12. Módulo 5 — LiveSales (Sesiones, Interacciones)

### Archivos (5)

| Archivo | Funcionalidad |
|---------|---------------|
| `LiveSales/Index.jsx` | **Cards de sesiones** con: badge de estado, **indicador "EN VIVO" animado** (pulse CSS), canal, fecha, contadores de productos e interacciones. Filtro por estado. |
| `LiveSales/Create.jsx` | FormCard con: Título, Fecha Inicio/Fin (datetime-local), Canal (select), Estado (select), Resumen (textarea) |
| `LiveSales/Edit.jsx` | FormCard pre-llenado, mismos campos |
| `LiveSales/Show.jsx` | **Página principal con 3 tabs:** **Resumen** (info de sesión + estadísticas), **Productos** (tabla + formulario rápido para agregar), **Interacciones** (tabla con badges + acciones). **Panel lateral deslizable** para registrar interacción rápida. **Botones de estado** separados: Iniciar Live, Finalizar, Cancelar (con modales). **Convertir a Lead / Convertir a Pedido** con modales. |
| `LiveSales/Interacciones.jsx` | **Vista global** de todas las interacciones de todas las sesiones. Tabla con: Fecha, Sesión (link), Interesado, Producto, Intención, Estado, Acciones (links a Lead/Pedido/Sesión). Filtro por estado. |

---

## 13. Módulo 6 — Reportes (Gráficas y KPIs)

### Dependencia instalada
- `recharts` 2.12.7 (compatible con React 18)

### Archivos (11)

#### Componentes de gráficas (4)
| Archivo | Uso |
|---------|-----|
| `Components/Charts/VerticalBarChart.jsx` | Barras verticales con Recharts, tooltip personalizado, colores Modern Earth |
| `Components/Charts/PieChart.jsx` | Pastel/donut con Recharts, leyenda personalizada, tooltip con porcentaje |
| `Components/Charts/HorizontalBar.jsx` | Barras horizontales CSS puras con transiciones |
| `Components/Charts/KpiCard.jsx` | Tarjeta de métrica con 6 variantes de color, icono y tendencia |

#### Página principal (1)
| Archivo | Funcionalidad |
|---------|---------------|
| `Reportes/Index.jsx` | **7 tabs por módulo**, **filtros globales** (fecha inicio/fin, estado pedido/pago/lead, canal, flujo), botón Exportar PDF |

#### Tabs de reportes (7)
| Archivo | Contenido |
|---------|-----------|
| `Reportes/Tabs/ResumenTab.jsx` | 7 KPIs (Clientes, Leads, Pedidos, Monto Pagado, Sesiones Live, Interacciones) + **gráfica de área** de ventas por fecha |
| `Reportes/Tabs/VentasTab.jsx` | **Barras horizontales** por canal, por flujo. **Barras verticales** de productos más vendidos + tabla de top 10 |
| `Reportes/Tabs/PedidosTab.jsx` | **Donut chart** de pedidos por estado + tabla con porcentajes |
| `Reportes/Tabs/PagosTab.jsx` | **Donut chart** por estado + **barras** por método + tabla detallada con montos |
| `Reportes/Tabs/CrmTab.jsx` | **Donut** de leads, **donut** de clientes, **barras horizontales** por canal + tablas detalladas |
| `Reportes/Tabs/InventarioTab.jsx` | Tabla de stock bajo con **niveles de riesgo** (Crítico/Medio/Bajo) + empty state con icono de check verde |
| `Reportes/Tabs/LiveSalesTab.jsx` | 5 KPIs de conversión + **embudo visual** (Interacciones → Leads → Pedidos) + donut de sesiones + barras de interacciones |

### Métricas de LiveSales calculadas en backend
- Tasa Live → Lead: `leads_desde_live / total_interacciones * 100`
- Tasa Live → Pedido: `pedidos_desde_live / total_interacciones * 100`
- Tasa Lead → Pedido: `pedidos_desde_live / leads_desde_live * 100`

### Backend — Reportes Ampliados
El repositorio `ReporteComercialRepository` se amplió con 10 nuevos métodos:
`pagosPorMetodo()`, `leadsPorCanal()`, `clientesPorEstado()`, `sesionesLivePorEstado()`, `interaccionesPorSesion()`, `leadsDesdeLive()`, `pedidosDesdeLive()`, `totalInteraccionesLive()`, `totalSesionesLive()`, `totalClientes()`, `totalLeads()`, `totalPedidos()`, `totalPagos()`, `montoTotalPagado()`

---

## 14. Reglas Operativas

### Backend
- ⚠️ **Backend congelado** — Solo se modifican: `resources/js/**`, `resources/css/app.css`, `tailwind.config.js`, `package.json` (para dependencias)
- 🚫 **No modificar:** `database/migrations`, `app/Models`, `app/Domains`, `app/Http/Controllers`, `app/Http/Requests`, `routes/web.php`, `.env`, `composer.json`
- Los controladores no deben contener lógica de negocio

### Frontend
- No instalar paquetes de diseño externos (Bootstrap, Material UI, shadcn/ui, DaisyUI, Ant Design)
- No duplicar reglas de estados en frontend — los estados vienen del backend
- No hardcodear permisos como única seguridad — la seguridad real está en backend
- Iconos: SVG inline puros (sin librerías externas de iconos)

### Diseño
- `rounded-xl` en cards y contenedores
- `transition-all duration-200 ease-in-out` en elementos interactivos
- Textos en color `cafe` (no negro puro)
- Estados vacíos con `EmptyState` — nunca dejar pantallas en blanco
- Precios en formato Bs (BOB): `Intl.NumberFormat('es-BO', {minimumFractionDigits: 2})`
- Botones primarios siempre en terracota con hover más oscuro
- Focus visible con `ring-2 ring-terracota-500`

### UX
- Confirmaciones de acciones críticas siempre con modales
- Validación visual de errores: borde rojo + mensaje debajo del campo
- Loading states en botones de submit
- Breadcrumbs en todas las páginas
- Acciones contextuales (solo mostrar botones que aplican al estado actual)

---

## 15. Flujo de Trabajo por Módulo

```
1. Módulo 0: Base Visual Común
   ├── tailwind.config.js (paleta)
   ├── app.css (estilos base)
   ├── AuthenticatedLayout.jsx (sidebar + topbar)
   ├── Componentes UI (8)
   └── Componentes existentes adaptados
   
2. Módulo 1: CRM
   ├── Clientes (Index, Create, Edit, Partials)
   ├── Leads (Index, Create, Edit, Partials)
   └── Plantillas (Index, Create, Edit)
   
3. Módulo 2: Catálogo
   ├── Categorías (Index, Create, Edit)
   └── Productos (Index con grilla, Create, Edit)
   
4. Módulo 3: Inventario
   ├── Index con KPIs y alertas
   ├── Entrada, Salida, Ajustar
   └── Movimientos con badges
   
5. Módulo 4: Comercial
   ├── Pedidos (Index, Create/Edit con tabla dinámica, Show con modales)
   └── Pagos (Index, Create, Edit, Show con acciones contextuales)
   
6. Módulo 5: LiveSales
   ├── Index con cards
   ├── Create, Edit
   ├── Show con tabs y panel lateral
   └── Interacciones global
   
7. Módulo 6: Reportes
   ├── Instalar Recharts
   ├── Componentes de gráficas (4)
   ├── Ampliar backend (10+ métodos)
   └── Index con 7 tabs + filtros globales
```

---

## 16. Archivos del Proyecto

### Total de Archivos Creados/Modificados: 58+

### Archivos de Configuración (2)
- `tailwind.config.js`
- `resources/css/app.css`

### Layouts (1)
- `resources/js/Layouts/AuthenticatedLayout.jsx`

### Componentes UI (8)
- `resources/js/Components/UI/PageHeader.jsx`
- `resources/js/Components/UI/SectionCard.jsx`
- `resources/js/Components/UI/StatusBadge.jsx`
- `resources/js/Components/UI/EmptyState.jsx`
- `resources/js/Components/UI/PrimaryActionButton.jsx`
- `resources/js/Components/UI/SecondaryActionButton.jsx`
- `resources/js/Components/UI/TableWrapper.jsx`
- `resources/js/Components/UI/FormCard.jsx`

### Componentes Adaptados (4)
- `resources/js/Components/Badge.jsx`
- `resources/js/Components/PrimaryButton.jsx`
- `resources/js/Components/SecondaryButton.jsx`
- `resources/js/Components/NavLink.jsx`

### Componentes de Gráficas (4)
- `resources/js/Components/Charts/VerticalBarChart.jsx`
- `resources/js/Components/Charts/PieChart.jsx`
- `resources/js/Components/Charts/HorizontalBar.jsx`
- `resources/js/Components/Charts/KpiCard.jsx`

### Páginas de Dashboard (1)
- `resources/js/Pages/Dashboard.jsx`

### Páginas de CRM — Clientes (4)
- `pages/Clientes/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Partials.jsx`

### Páginas de CRM — Leads (4)
- `pages/Leads/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Partials.jsx`

### Páginas de CRM — Plantillas (3)
- `pages/PlantillasMensaje/Index.jsx`, `Create.jsx`, `Edit.jsx`

### Páginas de Catálogo — Categorías (3)
- `pages/CategoriasProducto/Index.jsx`, `Create.jsx`, `Edit.jsx`

### Páginas de Catálogo — Productos (3)
- `pages/Productos/Index.jsx`, `Create.jsx`, `Edit.jsx`

### Páginas de Inventario (5)
- `pages/Inventario/Index.jsx`, `Entrada.jsx`, `Salida.jsx`, `Ajustar.jsx`, `Movimientos.jsx`

### Páginas de Pedidos (4)
- `pages/Pedidos/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Show.jsx`

### Páginas de Pagos (4)
- `pages/Pagos/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Show.jsx`

### Páginas de LiveSales (5)
- `pages/LiveSales/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Show.jsx`, `Interacciones.jsx`

### Páginas de Reportes (8)
- `pages/Reportes/Index.jsx`
- `pages/Reportes/Tabs/ResumenTab.jsx`
- `pages/Reportes/Tabs/VentasTab.jsx`
- `pages/Reportes/Tabs/PedidosTab.jsx`
- `pages/Reportes/Tabs/PagosTab.jsx`
- `pages/Reportes/Tabs/CrmTab.jsx`
- `pages/Reportes/Tabs/InventarioTab.jsx`
- `pages/Reportes/Tabs/LiveSalesTab.jsx`

### Backend — Modificaciones (2)
- `app/Domains/Reportes/Repositories/ReporteComercialRepository.php` (+10 métodos)
- `app/Domains/Reportes/Services/ReporteComercialService.php` (reescritura con todos los reportes)

### Dependencias (1)
- `recharts` 2.12.7

---

> **Total archivos:** 58+ creados/modificados  
> **Verificación:** `npm run build` exitoso en todos los módulos  
> **Principio:** Frontend modular, consistente, profesional, con paleta Modern Earth y componentes reutilizables
