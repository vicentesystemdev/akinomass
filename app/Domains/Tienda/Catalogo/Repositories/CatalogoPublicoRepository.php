<?php

namespace App\Domains\Tienda\Catalogo\Repositories;

use App\Models\CategoriaProducto;
use App\Models\Producto;
use App\Models\TallaProducto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CatalogoPublicoRepository
{
    public function listarPaginado(?int $codCategoria, ?int $codTalla, ?string $busqueda, ?string $orden, bool $soloDisponibles, int $porPagina = 24): LengthAwarePaginator
    {
        $query = Producto::with([
            'categoria',
            'inventario',
            'variantes' => fn ($query) => $query
                ->where('activo_variante_producto', true)
                ->where('estado_variante_producto', 'activo')
                ->whereHas('talla', fn ($tallaQuery) => $tallaQuery->where('activo_talla_producto', true))
                ->with(['talla' => fn ($tallaQuery) => $tallaQuery->where('activo_talla_producto', true), 'inventario']),
        ])
            ->where('estado_pro', 'activo')
            ->whereHas('categoria', fn ($q) => $q->where('activo_cat', true));

        if ($codCategoria) {
            $query->where('cod_categoria_producto', $codCategoria);
        }

        if ($codTalla) {
            $query->whereHas('variantes', fn ($q) => $q
                ->where('cod_talla_producto', $codTalla)
                ->where('activo_variante_producto', true)
                ->where('estado_variante_producto', 'activo')
            );
        }

        if ($busqueda) {
            $query->where(function ($q) use ($busqueda) {
                $q->where('nombre_pro', 'like', "%{$busqueda}%")
                    ->orWhere('sku_pro', 'like', "%{$busqueda}%");
            });
        }

        if ($soloDisponibles) {
            $query->where(function ($disponibleQuery) {
                $disponibleQuery->where(function ($baseQuery) {
                    $baseQuery->whereDoesntHave('variantes', fn ($varianteQuery) => $varianteQuery
                        ->where('activo_variante_producto', true)
                        ->where('estado_variante_producto', 'activo'))
                        ->whereHas('inventario', function ($q) {
                            $q->where('activo_inv', true)
                                ->whereRaw(
                                    'stock_actual_inv > (
                                        SELECT COALESCE(SUM(reservas_stock_carrito.cantidad_res), 0)
                                        FROM reservas_stock_carrito
                                        WHERE reservas_stock_carrito.cod_producto = inventarios.cod_producto
                                          AND reservas_stock_carrito.cod_variante_producto IS NULL
                                          AND reservas_stock_carrito.estado_res = ?
                                          AND reservas_stock_carrito.expira_en_res > CURRENT_TIMESTAMP
                                    )',
                                    ['activa'],
                                );
                        });
                })->orWhereHas('variantes.inventario', function ($q) {
                    $q->where('activo_inv', true)
                        ->whereRaw(
                            'stock_actual_inv > (
                                SELECT COALESCE(SUM(reservas_stock_carrito.cantidad_res), 0)
                                FROM reservas_stock_carrito
                                WHERE reservas_stock_carrito.cod_variante_producto = inventarios.cod_variante_producto
                                  AND reservas_stock_carrito.estado_res = ?
                                  AND reservas_stock_carrito.expira_en_res > CURRENT_TIMESTAMP
                            )',
                            ['activa'],
                        );
                });
            });
        }

        $query = $this->aplicarOrden($query, $orden);

        return $query->paginate($porPagina)->withQueryString();
    }

    public function obtenerPorId(int $codProducto): ?Producto
    {
        return Producto::with([
            'categoria',
            'inventario',
            'variantes' => fn ($query) => $query
                ->where('activo_variante_producto', true)
                ->where('estado_variante_producto', 'activo')
                ->whereHas('talla', fn ($tallaQuery) => $tallaQuery->where('activo_talla_producto', true))
                ->with(['talla' => fn ($tallaQuery) => $tallaQuery->where('activo_talla_producto', true), 'inventario']),
        ])
            ->where('cod_producto', $codProducto)
            ->where('estado_pro', 'activo')
            ->whereHas('categoria', fn ($q) => $q->where('activo_cat', true))
            ->first();
    }

    public function listarTallasPublicas(): Collection
    {
        return TallaProducto::where('activo_talla_producto', true)
            ->whereHas('variantes', fn ($q) => $q
                ->where('activo_variante_producto', true)
                ->where('estado_variante_producto', 'activo')
                ->whereHas('producto', fn ($pq) => $pq
                    ->where('estado_pro', 'activo')
                    ->whereHas('categoria', fn ($cq) => $cq->where('activo_cat', true))
                )
            )
            ->orderBy('orden_talla_producto')
            ->orderBy('codigo_talla_producto')
            ->get();
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
