# Estado del sistema

## 1. Resumen general

- Proyecto: Laravel 13 + Inertia React + Vite.
- Backend: PHP 8.3, Laravel 13, PostgreSQL, Redis.
- Frontend: React 18 con Inertia, Vite como bundler, Tailwind CSS.
- Arquitectura: mezcla de MVC tradicional con elementos de dominio (Actions, Services, Repositories, Enums) en `app/Domains`.

## 2. Estructura principal

- `app/Http/Controllers/`: controladores HTTP que reciben formularios y retornan páginas Inertia.
- `app/Http/Requests/`: validación de peticiones con FormRequest.
- `app/Domains/`: lógica de dominio organizada por áreas (Comercial, Inventario, CRM, etc.).
    - Cada dominio usa subcarpetas de `Actions`, `Services`, `Repositories`, `Enums`, `DTOs`.
- `app/Models/`: modelos Eloquent que representan entidades principales.
- `resources/js/Pages/`: páginas React usadas por Inertia.
- `resources/views/app.blade.php`: plantilla Blade principal con `@viteReactRefresh`, `@vite` y `@inertia`.
- `database/seeders/`: seeders de datos, incluyendo un subdirectorio `Demo` para datos de demo.

## 3. Flujo de pedido actual (ejemplo representativo)

- `PedidoController` recibe la petición y valida con `StorePedidoRequest`.
- Se delega a una Action: `CrearPedidoAction`.
- La Action orquesta la creación y usa `PedidoService` para calcular totales y persistir detalles.
- `PedidoService` también contiene lógica de confirmación y cancelación de pedidos, verificando stock y registrando movimientos de inventario.
- El modelo `Pedido` y la relación `detalles()` persisten datos con Eloquent.

## 4. Patrón de diseño observados

- Se usa un patrón de separación controller/action/service.
- `Actions` son orquestadores de casos de uso.
- `Services` son responsables de reglas de negocio y validaciones de estado.
- `Repositories` existen como directorio, pero en gran parte no están llenos o no son usados extensivamente en el código inspeccionado.
- `DTOs` existe como carpeta, pero no hay implementaciones visibles; los datos limpios viajan en arrays validados.

## 5. Componentes clave de dominio

- `app/Domains/Comercial/Pedidos/`: gestión de pedidos, con acciones y servicios.
- `app/Domains/Inventario/`: manejo de inventario y movimientos.
- `app/Domains/Reportes/`: repositorios y servicios para reportes.
- `app/Domains/CRM/`, `Catalogo/`, `Dashboard/`: ramas de dominio con funcionalidades específicas.

## 6. Estado actual de la lógica

### Fortalezas

- Separación clara de responsabilidades en varias capas.
- Uso de validaciones FormRequest para peticiones de entrada.
- Acceso a datos a través de Eloquent con relaciones explícitas.
- Inercia React implementado con páginas React y una plantilla Blade moderna.
- Seeders demo organizados y ejecutables a través de `DatabaseSeeder`.

### Debilidades / áreas de mejora

- `DTOs` y `Repositories` no están plenamente materializados: hay carpetas vacías o poco usadas.
- Algunas decisiones de persistencia todavía mezclan lógica de dominio con Eloquent directo (por ejemplo, `PedidoService` actualiza, crea y borra detalles directamente).
- El flujo de validación/transformación no usa objetos de transferencia fuertemente tipados; se usan arrays validados.
- El directorio de dominio no está completamente consistente: hay servicios que mezclan lógica de estado y persistencia.
- La integración Vite/React puede ser frágil si la configuración de plugins no es correcta (orden de plugins en `vite.config.js`).

## 7. Configuración técnica relevante

- `vite.config.js` usa `@vitejs/plugin-react` y `laravel-vite-plugin`.
- `package.json` contiene:
    - `vite` ^8.0.0
    - `@vitejs/plugin-react` ^6.0.2
    - `laravel-vite-plugin` ^3.0.0
    - `react` ^18.2.0
    - `react-dom` ^18.2.0
- `resources/views/app.blade.php` carga `resources/js/app.jsx` y las páginas Inertia dinámicas.

## 8. Observaciones sobre consistencia del sistema

- Buen avance hacia un diseño modular de dominio, pero no es un DDD puro porque la persistencia y la orquestación aún están dispersas.
- El sistema combina una estructura moderna (`app/Domains`) con convenciones Laravel tradicionales (`app/Http/`, `app/Models/`).
- La capa de datos está basada en Eloquent; no hay un adaptador de persistencia claramente aislado.
- Las semillas de datos demo están presentes y el seeder principal puede invocarlas.

## 9. Recomendaciones objetivas

1. Formalizar los DTOs si se quiere mejorar la calidad de los datos entre Request/Action/Service.
2. Usar repositorios reales para encapsular consultas Eloquent y mantener `Services` libres de detalles de persistencia.
3. Revisar la configuración de Vite y el orden de plugins para asegurar compilación React correcta.
4. Mantener las validaciones `FormRequest` y centralizar los casos de uso en `Actions`.
5. Fortalecer la coherencia de `app/Domains` usando nombres y responsabilidades consistentes.

## 10. Conclusión

Este sistema tiene una base sólida: Laravel moderno, Inertia React y una separación de dominios clara. La lógica de pedidos y la estructura condicional ya están encaminadas, pero todavía hay espacio para mejorar la consistencia en la capa de dominio y para reforzar la separación entre reglas de negocio, persistencia y transferencia de datos.
