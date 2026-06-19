# Dataset Demo de Defensa Académica para AKINOMASS

Este dataset ha sido estructurado específicamente para fines de defensa de tesis y demostraciones académicas del sistema **AKINOMASS**. Su propósito es evidenciar la transición de una gestión comercial empírica e informal en redes sociales a una gestión profesional guiada por datos.

## Objetivo del Dataset
El objetivo es proveer un conjunto de datos grande, limpio, determinista y consistente que alimente de forma óptima todos los módulos operativos (CRM, inventario, pedidos, pagos, tienda online, facturación) y que genere resultados claros y defendibles en las herramientas de analítica predictiva y segmentación (K-Means y Regresión Lineal).

## Comando de Ejecución
Para sembrar de forma limpia y controlada el dataset de defensa, ejecute el siguiente comando en su entorno local:

```bash
php artisan db:seed --class="Database\Seeders\Demo\DemoAkinomassDefensaSeeder"
```

> [!NOTE]
> Para evitar pérdidas accidentales de información, el seeder exige que la variable `AKINOMASS_DEMO_DEFENSA_TRUNCATE=true` esté configurada en su archivo `.env` y que el entorno de la aplicación sea estrictamente `local`.

## Cuentas Demo de Prueba
Todos los usuarios se crean con la contraseña local: `password`

| Nombre del Usuario | Rol en el Sistema | Correo Electrónico |
| :--- | :--- | :--- |
| Admin Akinomass | Administrador | `admin@akinomass.test` |
| Supervisor Comercial Demo | Supervisor Comercial | `supervisor@akinomass.test` |
| Vendedor Demo | Vendedor | `vendedor@akinomass.test` |
| Encargado de Inventario Demo | Encargado de Inventario | `inventario@akinomass.test` |
| Encargado de Pedidos Demo | Encargado de Pedidos | `pedidos@akinomass.test` |
| Analista Demo | Analista | `analista@akinomass.test` |
| Cliente Demo | Cliente (Tienda B2C) | `cliente.demo@akinomass.test` |

## Volumen de Datos Generado
- **Usuarios creados**: 7 cuentas estructuradas.
- **Clientes (CRM)**: 245 clientes activos con perfiles de compra diferenciados.
- **Leads/Prospectos**: 150 leads captados desde redes sociales (TikTok Live, WhatsApp, Instagram, etc.).
- **Categorías**: 10 categorías reales de moda.
- **Productos**: 50 prendas y accesorios con precios y costos realistas.
- **Variantes/Tallas**: 246 variantes de producto registradas (XS-XL, tallas de pantalón 28-38, talla UNICA).
- **Movimientos de Inventario**: Inicialización de stock lote de mercadería y salidas automáticas asociadas a ventas históricas. No existen existencias negativas.
- **Pedidos Históricos**: 1150 pedidos totales distribuidos entre el 1 de julio de 2025 y el 19 de junio de 2026.
- **Pagos**: 1150 registros de pagos con estados y métodos correspondientes (QR, transferencia, efectivo).
- **Interacciones de Live**: 100 transmisiones de TikTok Live cargadas y 1200 interacciones de comentarios asociadas a leads y conversiones.
- **Tienda Online**: 150 pedidos completados vía web con checkout sessions, comprobantes de pago QR cargados e historial de subidas.
- **Facturas Internas**: 150 recibos/facturas generadas con sus respectivos detalles fiscales para compras aprobadas.

## Innovación Científica y Casos de Uso para Defensa

### 1. Segmentación de Clientes (K-Means)
El algoritmo K-Means agrupa a los clientes en 3 clusters nítidos y defendibles en la ruta `http://akinomass.test/admin/inteligencia-ventas/segmentacion-clientes`:
- **Cluster 1: Clientes frecuentes de alto valor**: Compra recurrente, ticket promedio alto, recencia baja (compras en las últimas semanas).
- **Cluster 2: Clientes ocasionales**: Compras dispersas a lo largo del año con ticket promedio moderado.
- **Cluster 3: Clientes nuevos o de baja actividad / riesgo**: Clientes con solo 1 o 2 compras, o que no compran desde hace más de 120 días (clientes en riesgo).

### 2. Proyección de Ventas (Regresión Lineal)
En la sección `http://akinomass.test/admin/inteligencia-ventas/tendencias-regresion`, la regresión lineal simple sobre los meses de historial muestra patrones claros y reales:
- **Jeans cargo**: Tendencia lineal creciente y sostenida, recomendando aumentar la compra del stock.
- **Poleras oversize**: Crecimiento moderado estable.
- **Chamarras/abrigos**: Estacionalidad invernal extrema, mostrando picos en julio de 2025 y mayo-junio de 2026.
- **Prendas en liquidación**: Tendencia decreciente lineal a medida que se agotan los saldos de inventario.

### 3. Recomendaciones de Abastecimiento Inteligente
Alimentado por los stocks mínimos y la proyección de ventas, el sistema generará alertas automáticas de reposición crítica para productos con stock insuficiente ante la tendencia proyectada.

## Pantallas Sugeridas para el Recorrido de Defensa
1. **Dashboard de Ventas**: Visualización general de ingresos y volumen por canal (TikTok Live liderando).
2. **Historial de Live Sales**: Mostrar la sesión programada y las finalizadas, evidenciando cómo los comentarios se convierten en leads o pedidos.
3. **Control de Pagos**: Verificación de comprobantes de pago subidos por la tienda online (se asocian al archivo `/storage/demo/comprobantes/placeholder.png`).
4. **CRM & Clientes**: Visualización de perfiles con sus respectivos clusters calculados.
5. **Reporte de Machine Learning**: Proyecciones y recomendaciones sugeridas para compra de mercadería. En la sección Inteligencia de Ventas > Productos se recomienda ordenar por índice descendente y filtrar por demanda alta para mostrar productos prioritarios de abastecimiento.

## Imágenes Demo de Productos

Para lograr una presentación visual premium en la tienda online y el panel administrativo, el dataset incluye un generador local y determinista de imágenes.

- **Origen**: Las imágenes se generan programáticamente en el entorno de desarrollo usando la librería GD de PHP (o un fallback XML/SVG si GD no estuviera habilitado).
- **Ruta de Almacenamiento**: Se guardan en [productos](file:///c:/dev/apps/akinomass/storage/app/public/demo/productos) (`storage/app/public/demo/productos/`).
- **Vinculación**: Cada producto se asocia mediante la columna `imagen_pro` utilizando el formato `{cod_producto}-{slug-nombre}.png` (o `.svg`).
- **Enlace Simbólico**: Para visualizar las imágenes en el navegador, es indispensable contar con el enlace simbólico del almacenamiento. Asegúrese de ejecutar:
  ```bash
  php artisan storage:link
  ```

