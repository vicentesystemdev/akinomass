# Dominio Catálogo

Este dominio contiene la lógica relacionada con productos y categorías.

Su objetivo es mantener una base organizada de productos que luego pueda ser utilizada por pedidos, inventario, reportes y dashboards.

## Responsabilidades

- Registro de productos.
- Edición de productos.
- Gestión de categorías.
- Estados de productos.
- Información comercial básica del producto.
- Relación con inventario y pedidos.

## Submódulos

- Productos
- Categorias

## Reglas

- El catálogo define qué productos existen.
- El inventario define cuántas unidades disponibles existen.
- No mezclar lógica de stock dentro del catálogo.
- Los productos pueden ser consultados por otros dominios, pero la modificación de información del producto debe permanecer en este dominio.
