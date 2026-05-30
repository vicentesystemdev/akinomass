<?php

namespace App\Domains\Tienda\Catalogo\Repositories;

use App\Models\CategoriaProducto;
use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CatalogoPublicoRepository
{
    public function listarPaginado(?int $codCategoria, ?string $busqueda, ?string $orden, bool $soloDisponibles, int $porPagina = 24): LengthAwarePaginator
    {
        $query = Producto::with(['categoria', 'inventario'])
            ->where('estado_pro', 'activo');

        if ($codCategoria) {
            $query->where('cod_categoria_producto', $codCategoria);
        }

        if ($busqueda) {
            $query->where(function ($q) use ($busqueda) {
                $q->where('nombre_pro', 'like', "%{$busqueda}%")
                  ->orWhere('sku_pro', 'like', "%{$busqueda}%");
            });
        }

        if ($soloDisponibles) {
            $query->whereHas('inventario', function ($q) {
                $q->where('stock_actual_inv', '>', 0)
                  ->where('activo_inv', true);
            });
        }

        $query = $this->aplicarOrden($query, $orden);

        return $query->paginate($porPagina)->withQueryString();
    }

    public function obtenerPorId(int $codProducto): ?Producto
    {
        return Producto::with(['categoria', 'inventario'])
            ->where('cod_producto', $codProducto)
            ->where('estado_pro', 'activo')
            ->first();
    }

    public function listarCategoriasConProductos(): Collection
    {
        return CategoriaProducto::where('activo_cat', true)
            ->whereHas('productos', function ($q) {
                $q->where('estado_pro', 'activo');
            })
            ->withCount(['productos' => function ($q) {
                $q->where('estado_pro', 'activo');
            }])
            ->orderBy('nombre_cat')
            ->get();
    }

    private function aplicarOrden($query, ?string $orden)
    {
        return match ($orden) {
            'precio_asc' => $query->orderBy('precio_venta_pro', 'asc'),
            'precio_desc' => $query->orderBy('precio_venta_pro', 'desc'),
            'nombre_asc' => $query->orderBy('nombre_pro', 'asc'),
            'recientes' => $query->orderBy('created_at', 'desc'),
            default => $query->orderBy('nombre_pro', 'asc'),
        };
    }
}
