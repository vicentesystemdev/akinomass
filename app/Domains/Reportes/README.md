# Dominio Reportes

Este dominio contiene la lógica relacionada con reportes comerciales y operativos.

## Responsabilidades

- Reportes de ventas.
- Reportes por canal.
- Reportes de productos más vendidos.
- Reportes de clientes y leads.
- Reportes de inventario.
- Exportaciones futuras.
- Consultas optimizadas para lectura.

## Reglas

- Reportes debe enfocarse en lectura y análisis operativo.
- No debe modificar pedidos, pagos, clientes ni inventario.
- Las consultas complejas deben ubicarse en Repositories.
- Los reportes pesados deben ejecutarse mediante Jobs.
- Redis puede utilizarse para cachear reportes frecuentes.
