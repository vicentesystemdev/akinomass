# Dominio Analytics

Este dominio prepara la futura integración de AKINOMASS con un servicio analítico externo desarrollado en FastAPI.

En la primera versión no se implementa la lógica predictiva completa, pero se deja preparada la estructura para evitar rehacer la arquitectura en el futuro.

## Responsabilidades futuras

- Comunicación con FastAPI.
- Preparación de datos históricos de ventas.
- Predicción de demanda.
- Segmentación de clientes.
- Clasificación de leads.
- Análisis comercial con modelos de machine learning.
- Almacenamiento de resultados analíticos devueltos por FastAPI.

## Reglas

- Laravel sigue siendo el núcleo transaccional del sistema.
- FastAPI será un servicio analítico paralelo.
- FastAPI no debe reemplazar la lógica principal de Laravel.
- En la primera versión, FastAPI no debe tocar directamente la base principal.
- Laravel preparará datos, llamará a FastAPI y guardará resultados.

## Flujo futuro

Laravel → Job → Analytics Client → FastAPI → Resultado → Laravel → PostgreSQL
