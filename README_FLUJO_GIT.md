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
- El entorno local oficial usa Laragon con `http://akinomass.test`; no requiere
  `php artisan serve`.
- `composer dev` inicia cola, logs y Vite. `composer dev:serve` queda disponible
  solo como alternativa explícita.
- Antes de hacer PR ejecutar:

```bash
composer dump-autoload
php artisan config:clear
php artisan migrate:fresh --seed
php artisan test
npm run build
php artisan route:list --path=tienda
php artisan route:list --path=admin/tienda
php artisan route:list --path=admin/inteligencia-ventas
```

## Recursos de referencia fuera del runtime

- `.agents/skills/`: material de apoyo para asistentes de desarrollo.
- `E-commerce_frontend_design_modules/`: prototipo de diseño exportado desde Figma.

Estos directorios no forman parte del runtime Laravel/Inertia. Conviene excluirlos
del PR funcional hacia `develop` o moverlos a `docs/referencias/` mediante un PR
documental separado, después de acordarlo con el equipo.

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
