# Integración futura con FastAPI

AKINOMASS está preparado para integrar FastAPI como servicio analítico paralelo en el futuro.

## Enfoque

Laravel será el núcleo transaccional del sistema.

FastAPI será un servicio especializado para analítica comercial.

## Laravel se encarga de

- Usuarios.
- Roles.
- Permisos.
- Clientes.
- Leads.
- Productos.
- Inventario.
- Pedidos.
- Pagos.
- Reportes operativos.
- Dashboards.
- Base de datos principal.

## FastAPI se encargará de

- Predicción de demanda.
- Segmentación de clientes.
- Clasificación de leads.
- Análisis de ventas.
- Modelos con Python.
- Procesamiento con Pandas y Scikit-learn.

## Regla

FastAPI no debe reemplazar la lógica principal de Laravel.

En la primera versión, FastAPI no debe tocar directamente la base de datos principal.

## Flujo futuro

Laravel
→ Job Redis
→ Analytics Client
→ FastAPI
→ Resultado
→ Laravel
→ PostgreSQL

## Ubicación preparada en Laravel

app/Domains/Analytics/
├── Clients/
├── Services/
├── DTOs/
├── Jobs/
└── Contracts/
