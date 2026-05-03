# Support

Este directorio contiene utilidades técnicas genéricas del sistema.

A diferencia de `app/Domains/Shared`, este directorio no debe contener lógica de negocio.

## Responsabilidades

- Utilidades de cache.
- Utilidades de fechas.
- Utilidades de formato monetario.
- Helpers HTTP genéricos.
- Utilidades de strings.
- Clases técnicas reutilizables.

## Reglas

- Support no debe saber qué es un pedido, un lead, un pago o un producto.
- No colocar lógica comercial aquí.
- Si una clase depende de conceptos del negocio, debe ir en `app/Domains`.
- Si una clase es técnica y genérica, puede ir en `app/Support`.

## Ejemplos correctos

- Cache/CacheService.php
- Dates/DateRange.php
- Money/MoneyFormatter.php
- Http/HttpClientFactory.php
- Strings/SlugGenerator.php
