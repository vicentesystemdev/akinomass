# Sprints Cumplidos 09, 10, 11 — Tienda Online AKINOMASS

> **Fecha de implementación:** Mayo 2026  
> **Estado:** ✅ COMPLETADO  
> **Verificación:** `npm run build` exitoso

---

## Sprint 09 — Autenticación y Rol Cliente

### Estado: ✅ COMPLETADO

### Archivos Creados/Modificados (6)

| # | Archivo | Acción | Descripción |
|---|---------|--------|-------------|
| 1 | `app/Http/Controllers/Tienda/Auth/RegisteredClienteController.php` | CREADO | Registro tienda (User + Cliente + CuentaCliente + rol) |
| 2 | `app/Http/Controllers/Tienda/Auth/AuthenticatedClienteController.php` | CREADO | Login tienda (solo rol Cliente) + Logout |
| 3 | `resources/js/Pages/Tienda/Auth/Login.jsx` | CREADO | UI login con paleta del sistema |
| 4 | `resources/js/Pages/Tienda/Auth/Register.jsx` | CREADO | UI registro con paleta del sistema |
| 5 | `app/Http/Middleware/HandleInertiaRequests.php` | MODIFICADO | Compartir `auth.user.roles` a Inertia |
| 6 | `routes/tienda.php` | MODIFICADO | Rutas auth con controllers |

### Controller: `RegisteredClienteController::store`

| Paso | Acción |
|------|--------|
| 1 | Validar request (name, email, password, telefono_cli) |
| 2 | `User::create()` |
| 3 | `CrearCuentaClienteAction` (Cliente + CuentaCliente) |
| 4 | `$user->assignRole('Cliente')` |
| 5 | `event(Registered)` |
| 6 | `Auth::login()` |
| 7 | `MergeCarritoInvitadoAction` |
| 8 | `redirect()->intended('/tienda')` |

### Controller: `AuthenticatedClienteController::store`

| Paso | Acción |
|------|--------|
| 1 | Validar request (email, password) |
| 2 | `Auth::attempt()` |
| 3 | Verificar rol `Cliente` (si no, logout y redirect /login) |
| 4 | `session()->regenerate()` |
| 5 | `MergeCarritoInvitadoAction` |
| 6 | `redirect()->intended('/tienda')` |

### Rutas Auth

```php
GET  /tienda/login     → AuthenticatedClienteController@create (guest)
POST /tienda/login     → AuthenticatedClienteController@store (guest)
GET  /tienda/registro  → RegisteredClienteController@create (guest)
POST /tienda/registro  → RegisteredClienteController@store (guest)
POST /tienda/logout    → AuthenticatedClienteController@destroy (auth)
```

### Redirect Logic

| Usuario | Login desde | Redirect |
|---------|-------------|----------|
| Cliente | `/tienda/login` | `/tienda` (o `intended`) |
| Staff | `/login` | `/dashboard` |
| Cliente intenta `/dashboard` | — | Middleware `RedirectIfCliente` |

### UI Auth (paleta del sistema)

| Elemento | Color |
|----------|-------|
| Panel izquierdo hero | Gradiente `#1a1f19 → #3C473A → #D77A61` |
| Fondo formulario | `#FDF6F0` (crema) |
| Botón principal | `#D77A61` (terracota) |
| Texto | `#2B221E` (cafe) |
| Logo | `#3C473A` (oliva) |

### Verificación Sprint 09

- [x] Controllers creados con lógica completa
- [x] Páginas Auth con paleta del sistema
- [x] Rutas auth configuradas
- [x] HandleInertiaRequests comparte roles
- [x] `npm run build` exitoso

---

## Sprint 10 — Frontend Storefront

### Estado: ✅ COMPLETADO

### Archivos Creados (10)

| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | `resources/js/Layouts/StorefrontLayout.jsx` | Layout tienda (Header + Main + Footer) |
| 2 | `resources/js/Components/Tienda/StorefrontHeader.jsx` | Header con nav, carrito, user menu |
| 3 | `resources/js/Components/Tienda/StorefrontFooter.jsx` | Footer con links y contacto |
| 4 | `resources/js/Components/Tienda/ProductCard.jsx` | Card producto (imagen, precio, agregar) |
| 5 | `resources/js/Components/Tienda/ProductGrid.jsx` | Grid responsive 2-4 cols |
| 6 | `resources/js/Components/Tienda/CatalogFilters.jsx` | Filtros categoría + orden |
| 7 | `resources/js/Components/Tienda/CartDrawer.jsx` | Drawer lateral carrito |
| 8 | `resources/js/Pages/Tienda/Home.jsx` | Página principal (Hero + Productos) |
| 9 | `resources/js/Pages/Tienda/Catalogo.jsx` | Catálogo con filtros |
| 10 | `resources/js/Pages/Tienda/ProductoShow.jsx` | Detalle producto |

### StorefrontLayout

```
┌─────────────────────────────────────────┐
│ StorefrontHeader                        │
│ - Logo AKINOMASS (oliva)                │
│ - Nav: Catálogo                         │
│ - Carrito (badge terracota)             │
│ - Login / Mi Cuenta dropdown            │
├─────────────────────────────────────────┤
│ {children}                              │
├─────────────────────────────────────────┤
│ StorefrontFooter                        │
│ - Brand, Links, Contacto                │
│ - Redes sociales                        │
└─────────────────────────────────────────┘
```

### StorefrontHeader — Funcionalidades

| Feature | Descripción |
|---------|-------------|
| Logo | Link a `/tienda`, icono oliva |
| Nav | Catálogo link |
| Carrito | Badge con count, link a `/tienda/carrito` |
| User menu | Dropdown con Mi Cuenta, Pedidos, Direcciones, Logout |
| Mobile | Menú hamburguesa responsive |

### ProductCard — Funcionalidades

| Feature | Descripción |
|---------|-------------|
| Imagen | Link a detalle, hover zoom |
| Categoría | Badge terracota |
| Nombre | Link a detalle |
| Precio | Formato `Bs. XX.XX` |
| Stock | Badge "Agotado" si no disponible |
| Agregar | Botón terracota, loading state, feedback "Añadido" |

### CartDrawer — Funcionalidades

| Feature | Descripción |
|---------|-------------|
| Overlay | Fondo oscuro al abrir |
| Header | Icono + count de productos |
| Items | Nombre, SKU, cantidad, subtotal, eliminar |
| Footer | Subtotal, total, botón checkout |
| Checkout | Si auth → POST checkout, si no → /tienda/login |

### Home.jsx — Secciones

| Sección | Contenido |
|---------|-----------|
| Hero | Gradiente oliva/terracota, título, estadísticas |
| Benefits | Envío, pago seguro, devoluciones, calidad |
| Catálogo | Filtros + ProductGrid |

### Ruta Principal

```php
// routes/web.php
Route::get('/', function () {
    return redirect('/tienda');
});
```

### Verificación Sprint 10

- [x] StorefrontLayout con Header/Footer
- [x] ProductCard con agregar al carrito funcional
- [x] CartDrawer lateral con resumen
- [x] CatalogFilters con categorías y orden
- [x] Home con Hero y productos
- [x] Catalogo con filtros
- [x] ProductoShow con detalle y agregar
- [x] Ruta `/` redirige a `/tienda`
- [x] `npm run build` exitoso

---

## Sprint 11 — Frontend Checkout y Área Cliente

### Estado: ✅ COMPLETADO

### Archivos Creados (10)

| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | `resources/js/Layouts/CustomerLayout.jsx` | Layout cuenta cliente (sidebar + content) |
| 2 | `resources/js/Components/Tienda/Checkout/ProgressStepper.jsx` | Stepper 4 pasos |
| 3 | `resources/js/Components/Tienda/Checkout/CartStep.jsx` | Paso 1: Revisión carrito |
| 4 | `resources/js/Components/Tienda/Checkout/ShippingStep.jsx` | Paso 2: Datos envío/facturación |
| 5 | `resources/js/Components/Tienda/Checkout/PaymentStep.jsx` | Paso 3: Método de pago |
| 6 | `resources/js/Components/Tienda/Checkout/ConfirmationStep.jsx` | Paso 4: Confirmación |
| 7 | `resources/js/Pages/Tienda/Checkout/Index.jsx` | Checkout wizard (4 pasos) |
| 8 | `resources/js/Pages/Tienda/Cuenta/Index.jsx` | Mi cuenta (resumen) |
| 9 | `resources/js/Pages/Tienda/Cuenta/Pedidos.jsx` | Mis pedidos (lista) |
| 10 | `resources/js/Pages/Tienda/Cuenta/PedidoShow.jsx` | Detalle pedido |
| 11 | `resources/js/Pages/Tienda/Cuenta/Direcciones.jsx` | CRUD direcciones |

### CustomerLayout

```
┌─────────────────────────────────────────┐
│ StorefrontHeader (reutilizar)           │
├──────────┬──────────────────────────────┤
│ Sidebar  │ {children}                   │
│ - Cuenta │                              │
│ - Pedidos│                              │
│ - Direcc.│                              │
│ - Salir  │                              │
├──────────┴──────────────────────────────┤
│ StorefrontFooter (reutilizar)           │
└─────────────────────────────────────────┘
```

### Checkout — Flujo UI (4 pasos)

```
Paso 1: Resumen carrito
  - Líneas de productos (readonly)
  - Subtotal, total
  - Botón "Continuar"

Paso 2: Datos envío/facturación
  - Email, teléfono
  - Dirección completa, ciudad, departamento
  - Documento, razón social
  - Validación client-side

Paso 3: Método de pago
  - QR, Transferencia, Depósito
  - Referencia de pago
  - Comprobante (file upload)
  - Banner: "No confirma acreditación bancaria"

Paso 4: Confirmación
  - Mensaje éxito
  - Número de pedido
  - Timeline de estados
  - Botones: Seguir comprando, Ver pedidos
```

### ProgressStepper

| Paso | Label | Sublabel | Icono |
|------|-------|----------|-------|
| 1 | Carrito | Revisión | ShoppingCart |
| 2 | Datos | Facturación | FileText |
| 3 | Pago | Método | CreditCard |
| 4 | Confirmado | ¡Listo! | CheckCircle |

### ShippingStep — Campos

| Campo | Request key | Requerido |
|-------|-------------|-----------|
| Email | `email_contacto` | Sí |
| Teléfono | `telefono_contacto` | Sí |
| Departamento | `departamento_entrega` | No |
| Ciudad | `ciudad_entrega` | No |
| Dirección | `direccion_entrega` | Sí |
| Referencia | `referencia_entrega` | No |
| Documento | `documento_facturacion` | No |
| Razón social | `razon_social` | No |

### PaymentStep — Métodos

| Método | Icono | Color |
|--------|-------|-------|
| QR | QrCode | oliva |
| Transferencia | Building2 | terracota |
| Depósito | CreditCard | verde |

### Cuenta Pages

| Página | Ruta | Contenido |
|--------|------|-----------|
| `Cuenta/Index.jsx` | `/tienda/mi-cuenta` | Resumen cuenta, stats, datos |
| `Cuenta/Pedidos.jsx` | `/tienda/mis-pedidos` | Lista pedidos con badges estado |
| `Cuenta/PedidoShow.jsx` | `/tienda/mis-pedidos/{id}` | Detalle pedido + pago + factura |
| `Cuenta/Direcciones.jsx` | `/tienda/mis-direcciones` | CRUD direcciones |

### Badges de Estado

| Estado | Color | Label |
|--------|-------|-------|
| `pendiente_pago` | ámbar | Pendiente de pago |
| `pagado` | verde | Pagado |
| `facturado` | azul | Facturado |
| `cancelado` | rojo | Cancelado |

### Direcciones CRUD

| Acción | Implementación |
|--------|----------------|
| Listar | GET props desde backend |
| Crear | `router.post('/tienda/mis-direcciones')` |
| Editar | `router.patch('/tienda/mis-direcciones/{id}')` |
| Predeterminada | `router.patch('/tienda/mis-direcciones/{id}/predeterminada')` |
| Eliminar | `router.delete('/tienda/mis-direcciones/{id}')` |

### Verificación Sprint 11

- [x] CustomerLayout con sidebar
- [x] ProgressStepper animado
- [x] CartStep con resumen
- [x] ShippingStep con validación
- [x] PaymentStep con 3 métodos
- [x] ConfirmationStep con timeline
- [x] Checkout/Index.jsx wizard funcional
- [x] Cuenta/Index.jsx con stats
- [x] Cuenta/Pedidos.jsx con lista
- [x] Cuenta/PedidoShow.jsx con detalle
- [x] Cuenta/Direcciones.jsx con CRUD
- [x] `npm run build` exitoso

---

## Resumen de Archivos Totales (27)

### Sprint 09 — Autenticación (6 archivos)

| # | Archivo |
|---|---------|
| 1 | `app/Http/Controllers/Tienda/Auth/RegisteredClienteController.php` |
| 2 | `app/Http/Controllers/Tienda/Auth/AuthenticatedClienteController.php` |
| 3 | `resources/js/Pages/Tienda/Auth/Login.jsx` |
| 4 | `resources/js/Pages/Tienda/Auth/Register.jsx` |
| 5 | `app/Http/Middleware/HandleInertiaRequests.php` (modificado) |
| 6 | `routes/tienda.php` (modificado) |

### Sprint 10 — Storefront (10 archivos)

| # | Archivo |
|---|---------|
| 1 | `resources/js/Layouts/StorefrontLayout.jsx` |
| 2 | `resources/js/Components/Tienda/StorefrontHeader.jsx` |
| 3 | `resources/js/Components/Tienda/StorefrontFooter.jsx` |
| 4 | `resources/js/Components/Tienda/ProductCard.jsx` |
| 5 | `resources/js/Components/Tienda/ProductGrid.jsx` |
| 6 | `resources/js/Components/Tienda/CatalogFilters.jsx` |
| 7 | `resources/js/Components/Tienda/CartDrawer.jsx` |
| 8 | `resources/js/Pages/Tienda/Home.jsx` |
| 9 | `resources/js/Pages/Tienda/Catalogo.jsx` |
| 10 | `resources/js/Pages/Tienda/ProductoShow.jsx` |

### Sprint 11 — Checkout y Cuenta (11 archivos)

| # | Archivo |
|---|---------|
| 1 | `resources/js/Layouts/CustomerLayout.jsx` |
| 2 | `resources/js/Components/Tienda/Checkout/ProgressStepper.jsx` |
| 3 | `resources/js/Components/Tienda/Checkout/CartStep.jsx` |
| 4 | `resources/js/Components/Tienda/Checkout/ShippingStep.jsx` |
| 5 | `resources/js/Components/Tienda/Checkout/PaymentStep.jsx` |
| 6 | `resources/js/Components/Tienda/Checkout/ConfirmationStep.jsx` |
| 7 | `resources/js/Pages/Tienda/Checkout/Index.jsx` |
| 8 | `resources/js/Pages/Tienda/Cuenta/Index.jsx` |
| 9 | `resources/js/Pages/Tienda/Cuenta/Pedidos.jsx` |
| 10 | `resources/js/Pages/Tienda/Cuenta/PedidoShow.jsx` |
| 11 | `resources/js/Pages/Tienda/Cuenta/Direcciones.jsx` |

---

## Dependencia Adicional

| Paquete | Versión | Uso |
|---------|---------|-----|
| `lucide-react` | latest | Iconos SVG (ShoppingCart, User, Mail, etc.) |

---

## Flujo Completo del Usuario

```
1. Visitante → / → redirect /tienda
2. Explora catálogo → /tienda/catalogo
3. Ve producto → /tienda/productos/{id}
4. Añade al carrito → Drawer lateral se abre
5. Procede al pago → Si no logueado → /tienda/login
6. Se registra → User + Cliente + CuentaCliente + rol Cliente
7. Login → redirect /tienda
8. Checkout → 4 pasos (Carrito → Datos → Pago → Confirmación)
9. Mi cuenta → /tienda/mi-cuenta
10. Mis pedidos → /tienda/mis-pedidos
11. Mis direcciones → /tienda/mis-direcciones
```

---

## Paleta de Colores Aplicada

| Elemento | Tailwind | Hex |
|----------|----------|-----|
| Header/Footer | `oliva-700` | `#3C473A` |
| CTA/Botones | `terracota-500` | `#D77A61` |
| Fondo | `crema-100` | `#FDF6F0` |
| Texto | `cafe-950` | `#2B221E` |
| Éxito | `estado-exito` | `#059669` |
| Error | `estado-error` | `#DC2626` |

---

## Comandos de Verificación

```bash
# Verificar build frontend
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
php artisan test --filter=AuthCliente
```

---

## Notas Importantes

1. **`lucide-react` instalado:** Dependencia nueva para iconos SVG en frontend.

2. **Ruta principal:** `/` redirige a `/tienda` (reemplaza Welcome.jsx de Laravel).

3. **Roles compartidos:** `HandleInertiaRequests` comparte `auth.user.roles` para que el frontend pueda mostrar/ocultar elementos según el rol.

4. **Merge carrito:** Tanto registro como login ejecutan `MergeCarritoInvitadoAction` para transferir items del carrito guest al carrito del usuario.

5. **Checkout requiere auth:** Las rutas de checkout usan middleware `role:Cliente`, por lo que el usuario debe estar autenticado con rol Cliente.

6. **Direcciones CRUD:** Implementado con `router.post/patch/delete` de Inertia, sin API separada.

7. **Paleta consistente:** Todos los componentes frontend usan los colores del sistema (oliva, terracota, crema, cafe) definidos en `tailwind.config.js`.
