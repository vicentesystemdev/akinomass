# Dominio Shared

Este dominio contiene elementos compartidos del negocio que pueden ser utilizados por varios dominios.

## Responsabilidades

- DTOs compartidos.
- Contracts compartidos.
- Events transversales.
- Listeners transversales.
- Enums generales del sistema.

## Diferencia con Support

Shared contiene elementos compartidos que sí conocen el negocio.

Support contiene utilidades técnicas genéricas que no conocen el negocio.

## Ejemplos correctos

- Contracts/Auditable.php
- Contracts/DashboardCacheable.php
- Events/EstadoCambiado.php
- Listeners/RegistrarActividadEnBitacora.php
- DTOs/RangoFechasData.php

## Reglas

- No colocar aquí lógica específica de Pedidos, Leads, Pagos o Inventario.
- Si algo pertenece claramente a un dominio, debe ir dentro de ese dominio.
- Shared debe usarse solo cuando varios dominios necesiten el mismo contrato, DTO, enum o evento transversal.
