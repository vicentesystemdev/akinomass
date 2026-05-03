# Dominios de AKINOMASS

Este directorio contiene la lógica de negocio del sistema AKINOMASS organizada por dominios funcionales.

AKINOMASS utiliza una arquitectura monolítica modular basada en MVC de Laravel, complementada con capas internas y organización por dominios.

## Dominios principales

- Seguridad: usuarios, roles, permisos y control de acceso.
- CRM: clientes, leads y seguimiento comercial.
- Comercial: canales de venta, pedidos y pagos.
- Catalogo: productos y categorías.
- Inventario: stock, movimientos, ajustes y disponibilidad.
- Reportes: reportes comerciales y operativos.
- Dashboard: métricas rápidas y visualización ejecutiva.
- Analytics: preparación para analítica comercial y futura integración con FastAPI.
- Shared: contratos, DTOs, eventos y elementos compartidos del negocio.

## Regla general

La lógica de negocio no debe colocarse en controladores.

Flujo recomendado:

Controller → Request → DTO → Action → Service → Repository → Model

Los controladores solo deben recibir la petición, validar permisos, llamar una Action y retornar una respuesta.
