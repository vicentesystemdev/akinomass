# Flujo Git AKINOMASS

## Ramas principales

- main: versión estable.
- develop: rama de integración.
- dev/vicente: trabajo individual de Vicente.
- dev/carla: trabajo individual de Carla.
- dev/victor: trabajo individual de Victor.
- dev/marcelo: trabajo individual de Marcelo.
- feature/\*: ramas de funcionalidades puntuales.

## Reglas

- No trabajar directamente en main.
- No trabajar directamente en develop salvo integración.
- Cada módulo debe desarrollarse en una rama feature.
- Todo cambio importante debe pasar por Pull Request.
- Antes de hacer PR ejecutar:

php artisan migrate:status
npm run build
php artisan config:clear

## Convención de ramas

feature/seguridad-seeders
feature/clientes-crud
feature/leads-crm
feature/productos-catalogo
feature/inventario-base
feature/pedidos-base
feature/pagos-base
feature/dashboard-comercial

## Convención de commits

Usar mensajes claros:

- Crea seeder de roles y permisos
- Implementa módulo base de clientes
- Agrega migraciones de productos e inventario
- Implementa creación de pedidos
