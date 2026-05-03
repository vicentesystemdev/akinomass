# Seeders Demo de AKINOMASS

Estos seeders crean datos de demostración controlados y coherentes para presentar AKINOMASS en entorno local/demo.

Incluye:

- Usuarios demo con roles (Spatie Permission).
- Clientes y leads de ejemplo.
- Categorías, productos e inventario demo.
- Pedidos y pagos en distintos estados.
- Sesiones LiveSales, productos live e interacciones (incluyendo una conversión a lead).

## Cómo ejecutarlo

```bash
php artisan db:seed --class=Database\\Seeders\\Demo\\DemoAkinomassSeeder
```

## Advertencia

**Solo para entorno local/demo.**
No usar estos datos como información real de producción.
