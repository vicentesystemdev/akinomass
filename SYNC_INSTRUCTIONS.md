# Comandos para sincronizar cambios críticos del compañero

## Resumen de cambios

Tu compañero agregó:

- **Nuevas tablas**: `tallas_producto`, `variantes_producto`
- **Cambios estructurales**: Se añadió columna `cod_variante_producto` a tabla `inventarios`
- **Nuevos modelos**: `TallaProducto`, `VarianteProducto`
- **Nuevos seeders**: `TallaProductoSeeder`, `DemoVariantesSeeder`
- **Datos de tallas**: 14 tallas predefinidas (XS, S, M, L, XL, XXL, 28-40 para pantalones, ÚNICA)
- **Datos de demo**: Producto "Jeans Earth Denim" con variantes para tallas 30, 32, 34

## Comandos a ejecutar (en orden)

### 1. Actualizar dependencias PHP (si es necesario)

```powershell
composer install
```

### 2. Ejecutar nuevas migraciones

```powershell
php artisan migrate
```

Este comando ejecutará:

- Creación de tabla `tallas_producto`
- Creación de tabla `variantes_producto`
- Agregación de columna `cod_variante_producto` a `inventarios`
- Protección de integridad referencial en variantes

### 3. Ejecutar seeders (carga de datos)

```powershell
php artisan db:seed
```

Este comando ejecutará en orden:

- `PlantillasMensajeSeeder`: Plantillas base
- `RolesAndPermissionsSeeder`: Roles y permisos
- `CanalesVentaSeeder`: Canales de venta
- `TiposFlujoComercialSeeder`: Tipos de flujo
- **`TallaProductoSeeder`** ✨ NUEVO: 14 tallas predefinidas
- `ConfiguracionTiendaSeeder`: Configuraciones de tienda

Si quieres también datos de demo:

```powershell
php artisan db:seed --class="Database\\Seeders\\Demo\\DemoAkinomassSeeder"
```

Este ejecutará adicionales seeders de demo incluyendo:

- **`DemoVariantesSeeder`** ✨ NUEVO: Producto Jeans con variantes

### 4. Limpiar caché (recomendado)

```powershell
php artisan optimize:clear
```

## Script completo para copiar y pegar (recomendado)

```powershell
# Ejecutar todo en una sola línea
composer install && php artisan migrate && php artisan db:seed && php artisan db:seed --class="Database\\Seeders\\Demo\\DemoAkinomassSeeder" && php artisan optimize:clear
```

O si prefieres paso a paso en una terminal:

```powershell
composer install
php artisan migrate
php artisan db:seed
php artisan db:seed --class="Database\\Seeders\\Demo\\DemoAkinomassSeeder"
php artisan optimize:clear
```

## Verificación

Para verificar que todo se ejecutó correctamente, puedes:

1. **Verificar tallas creadas**:

    ```powershell
    php artisan tinker
    >>> App\Models\TallaProducto::all()->count()
    # Debe devolver 14
    ```

2. **Verificar producto con variantes**:

    ```powershell
    php artisan tinker
    >>> App\Models\Producto::where('sku_pro', 'JEAN-EARTH-01')->with('variantes')->first()
    # Debe mostrar el producto Jeans con 3 variantes (tallas 30, 32, 34)
    ```

3. **Verificar inventarios por variante**:
    ```powershell
    php artisan tinker
    >>> App\Models\Inventario::where('cod_variante_producto', '!=', null)->count()
    # Debe mostrar al menos 3 registros (inventarios para las variantes)
    ```

## ⚠️ Notas importantes

- Los cambios a `inventarios` permite que el stock sea controlado por **variantes de producto** (opcional, puede ser NULL para productos sin variantes)
- El `TallaProductoSeeder` usa `updateOrCreate`, así que es **seguro ejecutarlo múltiples veces**
- El `DemoVariantesSeeder` crea un producto de ejemplo; **NO duplicará** si lo ejecutas varias veces
- Si tienes datos existentes en `inventarios`, los cambios de estructura son **retrocompatibles** (columna nullable)

## Si hay error en las migraciones

Si obtienes error por foreign keys, intenta rollback y re-migrar:

```powershell
php artisan migrate:rollback --step=5
php artisan migrate
php artisan db:seed
```

## Modelos y relaciones nuevas

Los modelos ya están creados y configurados:

- `App\Models\TallaProducto`: Almacena tallas disponibles (XS, S, M, L, etc.)
- `App\Models\VarianteProducto`: Une producto + talla + SKU + precio
- `App\Models\Inventario`: Ahora soporta relaciones opcionales a variantes

Relaciones:

- `Producto -> variantes()`: Devuelve todas las variantes del producto
- `VarianteProducto -> producto()`: Devuelve el producto base
- `VarianteProducto -> talla()`: Devuelve la talla asociada
- `Inventario -> variante()`: Devuelve la variante (si aplica)
