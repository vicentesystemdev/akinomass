# Estado del sistema

## 1. Resumen general

- **Proyecto**: Laravel 13 + Inertia React + Vite.
- **Backend**: PHP 8.3, Laravel 13, PostgreSQL, Redis.
- **Frontend**: React 18 con Inertia, Vite como bundler, Tailwind CSS.
- **Arquitectura**: mezcla de MVC tradicional con elementos de DDD y lógica de dominio (Actions, Services, Repositories, Enums, DTOs) organizados bajo `app/Domains`.

## 2. Estructura principal

- `app/Http/Controllers/`: Controladores HTTP que reciben peticiones y retornan páginas de Inertia o redirecciones.
- `app/Http/Requests/`: Validaciones fuertemente tipadas de entrada usando FormRequests.
- `app/Domains/`: Lógica de dominio organizada por áreas (Comercial, Inventario, CRM, Tienda, InteligenciaVentas, VentasRedes, Auditoria, Reportes).
    - Cada dominio utiliza subcarpetas de `Actions`, `Services`, `Repositories`, `Enums` y `DTOs` para mantener la separación de responsabilidades.
- `app/Models/`: Modelos Eloquent principales que representan las entidades del negocio.
- `resources/js/Pages/`: Componentes y vistas de React renderizados por Inertia.
- `resources/views/app.blade.php`: Plantilla Blade principal que carga el bundle de React + Vite (`@viteReactRefresh`, `@vite`, `@inertia`).
- `database/seeders/`: Seeders de la base de datos divididos en seeders base del sistema y un subdirectorio `Demo` para datos de demostración y pruebas rápidas.

## 3. Flujos de negocio actuales

### Flujo de Tienda Online (Storefront)
- El cliente navega por el catálogo público y añade productos (y sus variantes/tallas) al carrito.
- Al añadir ítems, se genera una reserva temporal de stock (`ReservaStockCarrito`) que previene que otros usuarios agoten el producto.
- En el frontend, se muestra un temporizador de cuenta regresiva (`CountdownTimer`). Si la reserva expira sin concretar la compra, el stock vuelve a estar disponible.
- Al proceder al checkout, el cliente ingresa datos de envío y pago, se confirma la transacción a través de `PagoWebController` y se genera el pedido final (`PedidoWebController`).

### Flujo de Ventas por Redes Sociales
- Un vendedor registra prospectos provenientes de redes sociales (mensajes privados, comentarios, WhatsApp, marketplace) a través del panel de administración (`VentaRedController`).
- Se crea una venta en estado borrador vinculada a un lead o cliente.
- El vendedor añade detalles de la venta (productos y sus variantes específicas).
- El sistema permite realizar la conversión directa del flujo:
    - Convertir el lead de la red social en cliente formal de la plataforma.
    - Convertir la venta en una sesión de checkout online para que el cliente la complete.
    - Convertir la venta directamente en un pedido confirmado de administración.

### Flujo de Inteligencia de Ventas (Predicciones)
- El administrador accede al dashboard de Inteligencia de Ventas (`InteligenciaVentasController`).
- Al ejecutar el proceso de análisis, el sistema procesa las ventas históricas de un periodo determinado (por ejemplo, últimos 30, 60 o 90 días).
- Se calculan métricas de demanda relativa por producto y categoría comparándolas con promedios del sistema.
- Utilizando una matriz de transición de demanda de Markov, se predice el comportamiento de la demanda para el próximo ciclo.
- A partir de estas predicciones, el sistema genera recomendaciones inteligentes de abastecimiento, niveles de riesgo de rotura de stock, y justificaciones detalladas en lenguaje natural.

## 4. Patrones de diseño observados

- **Service / Action / Repository Pattern**: Las `Actions` orquestan los casos de uso específicos y autocontenidos, los `Services` encapsulan las reglas y cálculos complejos de negocio, y los `Repositories` aíslan las consultas Eloquent de la lógica de dominio.
- **DTOs (Data Transfer Objects)**: Implementados extensivamente en los nuevos dominios (`InteligenciaVentas` y `VentasRedes`) para estructurar de manera limpia y tipada las entradas y salidas de datos, mitigando el uso de arrays asociativos genéricos.
- **Enums respaldados (Backed Enums)**: Uso intensivo de Enums PHP para modelar estados (estados de venta, tipos de interacciones de redes, estados de demanda, prioridades de abastecimiento y niveles de riesgo de stock).

## 5. Componentes clave de dominio

- `app/Domains/Tienda/`: Manejo del carrito de compras, checkout, registro de pagos y pedidos del storefront público.
- `app/Domains/VentasRedes/`: Gestión completa del proceso comercial iniciado en canales sociales y su respectiva conversión a pedidos o clientes.
- `app/Domains/InteligenciaVentas/`: Motor analítico de proyecciones de demanda, análisis de canales dominantes, matrices de transición e indicaciones de reabastecimiento.
- `app/Domains/Inventario/`: Lógica de movimientos, ajustes y stock disponible físico y reservado, ahora adaptado al soporte de variantes de productos.
- `app/Domains/Comercial/Pedidos/`: Gestión tradicional de pedidos administrativos de la empresa.
- `app/Domains/Auditoria/`: Registro detallado de acciones administrativas y de sistema, con soporte de visualización de diferencias (`diffs`) en la UI.

## 6. Estado actual de la lógica

### Fortalezas
- **Madurez de arquitectura modular**: Los módulos de `InteligenciaVentas` y `VentasRedes` sirven como referencia de DDD limpio (uso riguroso de Actions, DTOs y Repositories).
- **Soporte de Variantes y Tallas**: El sistema soporta productos complejos con variaciones en tallas, vinculadas a registros específicos de inventario y movimientos.
- **Reservas Temporales y Robustas**: Control dinámico de inventario intermedio que protege el stock durante el flujo de checkout, evitando sobreventas.
- **Dashboard de Monitoreo de Logs**: Consola visual para administradores que carga y filtra en tiempo real los registros de Laravel, aplicando máscaras automáticas para proteger contraseñas y datos sensibles.
- **Suite de Pruebas Automatizadas**: Amplia cobertura de tests de integración para asegurar que las reglas críticas de descuento de stock, carrito y transiciones de estados funcionen correctamente.

### Debilidades / áreas de mejora
- **Heterogeneidad en Dominios Antiguos**: Los dominios iniciales (como pedidos generales y CRM) aún usan arrays validados en lugar de DTOs y realizan consultas Eloquent directas dentro de los controladores o servicios.
- **Persistencia dispersa**: Todavía existen servicios que mezclan lógica de orquestación con llamadas directas de escritura Eloquent en lugar de centralizarlas en sus respectivos Repositories.

## 7. Configuración técnica relevante

- **Vite & React**: `vite.config.js` ahora usa `loadEnv` para leer `APP_URL` del `.env` dinámicamente y configurar el `origin` y `hmr.host` en función del dominio activo. Puerto fijo: `5173`.
- **Entorno local de desarrollo**:
    - Servidor: **Laragon** (nginx, puerto 80). Dominio local: `http://akinomass.test`.
    - `APP_URL=http://akinomass.test` en `.env`.
    - `127.0.0.1 akinomass.net` agregado al `hosts` de Windows (dominio alternativo preservado).
    - No se usa `php artisan serve`; Laragon gestiona el servidor PHP.
    - `composer dev` y `composer dev:laragon` ejecutan cola, Pail y Vite sin levantar un servidor PHP.
    - `composer dev:serve` conserva `php artisan serve` únicamente como alternativa explícita.
- **Dependencias principales** (`package.json`):
    - `vite` ^8.0.0
    - `@vitejs/plugin-react` ^6.0.2
    - `laravel-vite-plugin` ^3.0.0
    - `react` y `react-dom` ^18.2.0

## 8. Observaciones sobre consistencia del sistema

- El proyecto ha avanzado exitosamente hacia un desarrollo guiado por el dominio. Los nuevos componentes son modulares, fáciles de testear y se aíslan correctamente de la capa HTTP.
- El soporte para variantes de productos agrega una complejidad que está bien manejada a través del campo `cod_variante_producto` en la tabla de inventarios, sin romper la compatibilidad con productos simples.

## 9. Recomendaciones objetivas

1. **Refactorizar módulos tradicionales**: Migrar el flujo de pedidos antiguos de administración y el módulo CRM a la arquitectura de DTOs y Repositorios ya probada en `VentasRedes`.
2. **Consolidar el Servicio de Stock**: Garantizar que cualquier decremento o incremento del inventario se centralice en `InventarioService` para prevenir inconsistencias al mezclar flujos de tienda web con ventas manuales de administración.
3. **Optimización y caché en predicciones**: El cálculo de la matriz de transición y tendencias puede ser intensivo en base de datos. Se sugiere cachear temporalmente los resultados por periodo o delegar la tarea a colas de trabajo si la escala de datos aumenta.

## 10. Conclusión

Este sistema posee un backend moderno y estructurado que combina la agilidad de Laravel con la robustez de patrones de DDD. La introducción de la Inteligencia de Ventas y el flujo de ventas por Redes Sociales consolidan la plataforma como una herramienta administrativa y comercial potente.

---

## 11. Cambios recientes (resumen estructural)

### Periodo: commits del 2026-06-08 al 2026-06-12 (Fase Inteligencia de Ventas, Ventas por Redes y Consola de Logs)

- **Módulo de Inteligencia de Ventas (Predicciones)**:
    - Creación del dominio `app/Domains/InteligenciaVentas/` con todas sus capas (Actions de generación/limpieza, DTOs de resultados y abastecimiento, Enums de demanda y riesgo, y Repositories dedicados).
    - Creación de las vistas React y pestañas de navegación para: Categorías, Productos (con filtros avanzados, búsqueda y ordenamiento interactivo), Canales de venta, Recomendaciones de Abastecimiento y Conclusiones automáticas.
    - La pantalla de productos de InteligenciaVentas incorpora búsqueda, filtros por categoría/estado/tendencia y ordenamiento ascendente-descendente para facilitar el análisis comercial durante la defensa.
    - Modelos `PrediccionVenta` y `ConfiguracionInteligenciaVentas` con sus respectivas migraciones de tablas de base de datos.
- **Módulo de Ventas por Redes Sociales**:
    - Creación del dominio `app/Domains/VentasRedes/` (Actions para CRUD de la venta y sus detalles, DTOs estructurados y Repositories de integración).
    - Acciones clave de conversión: convertir lead a cliente formal en CRM, generar URL de checkout e iniciar pedidos directos.
    - Páginas React para administración: listado con filtros, formulario de creación y edición, y vista detallada del flujo comercial (`Show`).
- **Soporte de Variantes y Tallas**:
    - Nuevos modelos `VarianteProducto` y `TallaProducto`.
    - Modificación de la tabla `inventarios` para incluir el campo `cod_variante_producto`.
    - Adaptación del storefront (detalle de producto, drawer de carrito y flujo de checkout) para manejar combinaciones de variantes de manera segura.
- **Temporizador de Stock en Checkout**:
    - Componente React `CountdownTimer` en el storefront para avisar sobre el tiempo restante de las reservas de stock en carrito.
- **Consola de Visualización de Logs**:
    - Dashboard interactivo `Logs/Index` que consulta de manera eficiente (`tail`) los logs generados en `storage/logs/` y enmascara datos sensibles de configuración.
- **Testing y QA**:
    - Incorporación de tests feature robustos bajo `tests/Feature/Admin/` (`InteligenciaVentasTest`, `VentasRedesTest`, `InventarioTest`, etc.) y optimización de tests de storefront.

---

## 12. Cambios recientes (resumen estructural)

### Periodo: commits del 2026-06-12 al 2026-06-19 (Fase Tienda Online — Arreglos, Configuración Admin y Entorno)

#### Storefront — Mejoras en flujo de compra (`59f7832`, `3a39aaf`)
- **Carrito (`CarritoController` + `CartDrawer.jsx`)**: Refactorización del controlador de carrito; el `CartDrawer` ahora muestra variantes y tallas correctamente, con manejo de stock reservado visible en tiempo real.
- **Checkout (`CheckoutController` + `Checkout/Index.jsx`)**: Mejoras en el flujo de pasos del checkout — validación de datos de envío robustecida (`IniciarCheckoutAction`) y manejo de expiración de reservas.
- **Pago web (`PagoWebController`)**: Ajustes en el registro y resubida de comprobantes de pago desde la cuenta del cliente.
- **Pedidos del cliente (`PedidoWebController` + `Cuenta/PedidoShow.jsx` + `Cuenta/Pedidos.jsx`)**: Vista detallada del pedido completamente rediseñada; listado de pedidos con estados y acciones visibles. Actions `ListarPedidosClienteAction` y `ObtenerPedidoClienteAction` refactorizadas.
- **`CountdownTimer.jsx`**: Componente de cuenta regresiva integrado en el checkout y carrito, consumiendo `carrito_reservas` del middleware `HandleInertiaRequests`.
- **Migración**: `add_estado_pte_length_on_pedidos_tienda_table` — campo `estado_pte` ampliado en la tabla de pedidos de tienda.

#### Admin Tienda — Nueva página de configuración (`59f7832`)
- **`Tienda/Admin/Configuracion.jsx`**: Página de administración de configuración de tienda con controles para tiempo de reserva de carrito, métodos de pago, datos de envío, etc.
- **`ConfiguracionTiendaController`** y **`ConfiguracionTiendaService`** actualizados para persistir todas las opciones de configuración correctamente.
- Rutas de configuración protegidas con permisos Spatie: `configuracion_tienda.ver` y `configuracion_tienda.editar`.

#### Seeders — Datos de demostración mejorados (`b3ac6f0`)
- **`DemoClientesLeadsSeeder`**: Ampliado con más clientes y leads con datos bolivianos realistas.
- **`DemoPedidosPagosSeeder`**: Mayor volumen de pedidos y pagos en distintos estados para pruebas más completas.
- **`DemoProductosInventarioSeeder`** y **`DemoVariantesSeeder`**: Más productos con variantes y stock inicial variado.
- **`InteligenciaVentasDemoSeeder`**: Reducido y simplificado para mayor velocidad de seed.
- **`DemoUsuariosSeeder`**: Ajustes menores en datos de usuarios de demostración.

#### Entorno de desarrollo — Configuración de dominio local (`2026-06-19`)
- **`vite.config.js`**: Migrado a función con `loadEnv` para leer `APP_URL` dinámicamente. `origin` y `hmr.host` se derivan automáticamente del hostname en `APP_URL`.
- **`APP_URL`**: Establecido en `http://akinomass.test` — dominio gestionado por Laragon (nginx, puerto 80).
- **`hosts` de Windows**: Entrada `127.0.0.1 akinomass.net` agregada como dominio alternativo.
- **`php artisan serve` eliminado** del flujo de desarrollo: Laragon reemplaza al servidor integrado de PHP.
- **Puerto Vite**: `5173` (exclusivo de este proyecto cuando corre en solitario).

## 13. Integridad del flujo de confirmación de pagos

- Los pagos administrativos publican `PagoConfirmadoEvent` y son atendidos por
  `ConfirmarPedidoTrasPagoAdminListener`.
- El listener administrativo aplica una guard clause sobre `PagoTienda`; por tanto,
  no confirma ni descuenta inventario perteneciente al storefront.
- La aceptación de un pago de tienda descuenta el stock una sola vez dentro de
  `AceptarPagoPedidoTiendaAction` mediante `DescontarStockDefinitivoPedidoWebAction`.
- Antes de publicar `PagoConfirmadoEvent`, el pedido administrativo queda en estado
  `confirmado`. El listener web evita volver a ejecutar la confirmación cuando detecta
  ese estado.
- La segunda aceptación del mismo pago se rechaza y la prueba automatizada verifica
  que el inventario permanezca con un único descuento.

## 14. Recursos externos y alcance del runtime

- `.agents/skills/` contiene instrucciones y referencias para asistentes de desarrollo.
  No es cargado por Laravel, Inertia, Vite ni por los procesos de producción.
- `E-commerce_frontend_design_modules/` es un prototipo exportado desde Figma con
  componentes de referencia. No forma parte del árbol ejecutado desde `resources/js/`
  ni del build principal de AKINOMASS.
- Ambos directorios se mantienen temporalmente por trazabilidad académica y de diseño.
  Para el PR hacia `develop`, se recomienda excluirlos del alcance o trasladarlos en
  un cambio separado a `docs/referencias/`, previa validación del equipo.

## 15. Validación pre-PR del 19 de junio de 2026

- Migración y seed completos sobre PostgreSQL: correctos.
- Suite automatizada: 212 pruebas y 614 aserciones, sin fallos.
- Build de producción con Vite 8: correcto.
- Autoload optimizado de Composer: correcto y sin clases omitidas por PSR-4.
- Rutas de tienda, administración de tienda e inteligencia de ventas: verificadas.

## 16. Machine Learning implementado

### Segmentación de clientes mediante K-Means

El módulo `InteligenciaVentas` incorpora segmentación no supervisada con un
algoritmo K-Means implementado en PHP, sin librerías externas de aprendizaje
automático. El número predeterminado de grupos es `k = 3` y puede configurarse
entre 2 y 6 desde la interfaz.

Las variables utilizadas son:

- cantidad de pedidos confirmados;
- monto total comprado;
- ticket promedio;
- días desde la última compra;
- frecuencia de compra;
- cantidad de productos distintos;
- porcentaje de pedidos pagados.

Antes del agrupamiento se aplica normalización Min-Max. La inicialización de
centroides es determinista para que el mismo conjunto histórico produzca una
salida reproducible durante pruebas y defensa académica. Los clusters se
interpretan con etiquetas comerciales como cliente frecuente de alto valor,
cliente ocasional, cliente nuevo o de baja actividad y cliente en riesgo.

### Predicción de tendencias mediante regresión lineal

La pantalla de tendencias calcula una regresión lineal simple sobre series
semanales o mensuales:

```text
y = a + bx
```

Donde `x` es el índice temporal, `y` representa unidades o monto vendido, `b`
es la pendiente y `a` el intercepto. El resultado incluye proyección del
siguiente periodo, dirección de tendencia, porcentaje estimado de crecimiento,
coeficiente `R²`, nivel de confianza y recomendación de abastecimiento.

Ambos análisis consideran pedidos confirmados y pagos aceptados. Se excluyen
pedidos cancelados y pagos rechazados. Sus resultados son estimaciones para
apoyo a decisiones comerciales y no predicciones absolutas.

## 17. Dataset demo de defensa académica

Para la demostración práctica del sistema y de la innovación científica ante el tribunal de defensa, el sistema cuenta con un dataset demo estructurado e independiente, sembrado a través de [DemoAkinomassDefensaSeeder.php](file:///c:/dev/apps/akinomass/database/seeders/Demo/DemoAkinomassDefensaSeeder.php).

- **Tamaño de la base**: 7 usuarios demo, 245 clientes, 150 leads, 50 productos, 246 variantes, 1150 pedidos, 1150 pagos, 100 sesiones de live, 1200 interacciones, 150 pedidos de tienda y 150 facturas.
- **Módulos alimentados**: CRM (leads/clientes), Inventario (stock físico/salidas/movimientos), Comercial (pedidos/pagos), Tienda Online (checkouts/pedidos tienda/pagos tienda/comprobantes) e Inteligencia de Ventas (ML).
- **Imágenes demo locales**: El catálogo de defensa incluye imágenes locales generadas para productos, compatibles con la tienda online y el panel administrativo.
- **Periodo histórico**: Del 1 de julio de 2025 al 19 de junio de 2026 (sin fechas futuras, evitando recencia negativa).
- **Patrones comerciales y estacionalidad**:
  - *Jeans cargo*: Tendencia lineal de ventas creciente.
  - *Poleras oversize*: Crecimiento moderado estable.
  - *Chamarras*: Picos de venta estacionales de invierno (mayo/junio 2026 y julio 2025).
  - *Liquidación*: Tendencia lineal decreciente.
- **Utilidad académica**:
  - *Clustering (K-Means)*: Agrupa deterministamente a los clientes en tres clusters nítidos y analizables (Alto valor, Ocasionales, En riesgo/Baja actividad).
  - *Regresión lineal*: Demuestra proyecciones crecientes, estables y decrecientes realistas, alimentando alertas críticas y sugerencias de compra para mercadería.

