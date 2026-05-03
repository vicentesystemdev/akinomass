# Dominio Dashboard

Este dominio contiene la lógica relacionada con métricas rápidas, indicadores visuales y datos resumidos para paneles del sistema.

## Responsabilidades

- Métricas comerciales principales.
- Indicadores de ventas del día y del mes.
- Cantidad de pedidos pendientes.
- Leads nuevos o en seguimiento.
- Productos con bajo stock.
- Pagos pendientes.
- Datos resumidos para vistas de administración.

## Reglas

- Dashboard debe leer información de otros dominios, pero no modificarla.
- Los cálculos frecuentes deben cachearse con Redis.
- Los datos pesados deben actualizarse mediante Jobs.
- Dashboard no debe contener lógica principal de pedidos, pagos, inventario o CRM.
