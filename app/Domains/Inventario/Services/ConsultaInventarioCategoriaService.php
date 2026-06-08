<?php

namespace App\Domains\Inventario\Services;

use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Models\CategoriaProducto;
use App\Models\Producto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ConsultaInventarioCategoriaService
{
    public function categorias(int $porPagina = 15): LengthAwarePaginator
    {
        $categorias = CategoriaProducto::query()
            ->orderBy('nombre_cat')
            ->paginate($porPagina)
            ->withQueryString();

        $resumenes = $this->resumenesPorCategoria(
            $categorias->getCollection()->pluck('cod_categoria_producto'),
        );

        $categorias->setCollection(
            $categorias->getCollection()->map(
                fn (CategoriaProducto $categoria): array => array_merge(
                    $categoria->only(['cod_categoria_producto', 'nombre_cat', 'activo_cat']),
                    $resumenes->get($categoria->cod_categoria_producto, $this->resumenVacio()),
                ),
            ),
        );

        return $categorias;
    }

    public function detalle(int $codCategoriaProducto): array
    {
        $categoria = CategoriaProducto::query()->findOrFail($codCategoriaProducto);

        $productos = Producto::query()
            ->where('cod_categoria_producto', $codCategoriaProducto)
            ->where('sku_pro', 'not like', 'GEN-CAT-%')
            ->with([
                'inventario',
                'inventarios',
                'variantes' => fn ($query) => $query
                    ->where('activo_variante_producto', true)
                    ->with(['talla', 'inventario'])
                    ->orderBy('cod_talla_producto'),
            ])
            ->orderBy('nombre_pro')
            ->get();

        $reservas = $this->reservasActivasPorProducto($productos->pluck('cod_producto'));

        $skuVirtual = 'GEN-CAT-' . $codCategoriaProducto;
        $virtualProduct = Producto::where('sku_pro', $skuVirtual)->first();
        $inventarioVirtual = $virtualProduct ? \App\Models\Inventario::where('cod_producto', $virtualProduct->cod_producto)->whereNull('cod_variante_producto')->first() : null;
        $stockVirtual = $inventarioVirtual ? (int) $inventarioVirtual->stock_actual_inv : 0;

        return [
            'categoria' => $categoria->only(['cod_categoria_producto', 'nombre_cat', 'descripcion_cat', 'activo_cat']),
            'stock_virtual' => $stockVirtual,
            'productos' => $productos->map(function (Producto $producto) use ($reservas): array {
                $inventarioBase = $producto->inventario;
                $stockFisico = (int) $producto->inventarios->sum('stock_actual_inv');
                $stockReservado = (int) $reservas->get($producto->cod_producto, 0);
                $stockDisponible = max(0, $stockFisico - $stockReservado);
                $stockMinimo = (int) $producto->inventarios->sum('stock_minimo_inv');

                return [
                    'cod_producto' => $producto->cod_producto,
                    'nombre_pro' => $producto->nombre_pro,
                    'sku_pro' => $producto->sku_pro,
                    'estado_pro' => $producto->estado_pro?->value ?? $producto->estado_pro,
                    'cod_inventario' => $inventarioBase?->cod_inventario,
                    'stock_actual' => $stockFisico,
                    'stock_reservado' => $stockReservado,
                    'stock_disponible' => $stockDisponible,
                    'stock_minimo' => $stockMinimo,
                    'estado_stock' => $this->estadoStock($producto->inventarios->isNotEmpty(), $stockDisponible, $stockMinimo),
                    'inventario_base' => $this->presentarInventario($inventarioBase),
                    'variantes' => $producto->variantes->map(fn ($variante): array => [
                        'cod_variante_producto' => $variante->cod_variante_producto,
                        'sku_variante_producto' => $variante->sku_variante_producto,
                        'talla' => $variante->talla?->codigo_talla_producto,
                        'inventario' => $this->presentarInventario($variante->inventario),
                    ])->values(),
                ];
            })->values(),
        ];
    }

    public function kpis(): array
    {
        $codigos = CategoriaProducto::query()->pluck('cod_categoria_producto');
        $items = $this->resumenesPorCategoria($codigos);

        return [
            'categorias' => $codigos->count(),
            'productos_activos' => $items->sum('total_productos_registrados'),
            'stock_total' => $items->sum('stock_total'),
            'stock_reservado' => $items->sum('stock_reservado'),
            'stock_disponible' => $items->sum('stock_disponible'),
        ];
    }

    public function resumenesPorCategoria(Collection $codigosCategoria): Collection
    {
        if ($codigosCategoria->isEmpty()) {
            return collect();
        }

        // 1. Obtener todos los productos reales
        $productos = Producto::query()
            ->whereIn('cod_categoria_producto', $codigosCategoria)
            ->where('sku_pro', 'not like', 'GEN-CAT-%')
            ->with(['inventarios'])
            ->get()
            ->groupBy('cod_categoria_producto');

        // 2. Obtener reservas activas por producto
        $reservas = DB::table('reservas_stock_carrito')
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA->value)
            ->where('expira_en_res', '>', now())
            ->selectRaw('cod_producto, COALESCE(SUM(cantidad_res), 0) as total')
            ->groupBy('cod_producto')
            ->pluck('total', 'cod_producto');

        // 3. Obtener stock total, mínimo e inventario agrupado (incluye el producto virtual)
        $inventariosAgrupados = DB::table('inventarios as i')
            ->join('productos as p', 'p.cod_producto', '=', 'i.cod_producto')
            ->whereIn('p.cod_categoria_producto', $codigosCategoria)
            ->selectRaw('p.cod_categoria_producto, COALESCE(SUM(i.stock_actual_inv), 0) as stock_total, COALESCE(SUM(i.stock_minimo_inv), 0) as stock_minimo')
            ->groupBy('p.cod_categoria_producto')
            ->get()
            ->keyBy('cod_categoria_producto');

        $reservasAgrupadas = DB::table('reservas_stock_carrito as r')
            ->join('productos as p', 'p.cod_producto', '=', 'r.cod_producto')
            ->whereIn('p.cod_categoria_producto', $codigosCategoria)
            ->where('r.estado_res', EstadoReservaStockEnum::ACTIVA->value)
            ->where('r.expira_en_res', '>', now())
            ->selectRaw('p.cod_categoria_producto, COALESCE(SUM(r.cantidad_res), 0) as total')
            ->groupBy('p.cod_categoria_producto')
            ->pluck('total', 'p.cod_categoria_producto');

        return $codigosCategoria->mapWithKeys(function (int $codigo) use ($productos, $reservas, $inventariosAgrupados, $reservasAgrupadas): array {
            $prodsDeCat = $productos->get($codigo, collect());
            
            $totalRegistrados = $prodsDeCat->count();
            $cantidadDisponible = 0;
            $cantidadReservada = 0;
            $cantidadVendida = 0;

            foreach ($prodsDeCat as $p) {
                $stockFisico = (int) $p->inventarios->sum('stock_actual_inv');
                $stockReservado = (int) $reservas->get($p->cod_producto, 0);
                $stockDisponible = max(0, $stockFisico - $stockReservado);

                $esAgotado = $p->estado_pro === EstadoProductoEnum::AGOTADO || $p->estado_pro === EstadoProductoEnum::INACTIVO || $stockFisico <= 0;

                if ($stockReservado > 0) {
                    $cantidadReservada++;
                }

                if ($esAgotado) {
                    $cantidadVendida++;
                } elseif ($stockDisponible > 0 && $p->estado_pro === EstadoProductoEnum::ACTIVO) {
                    $cantidadDisponible++;
                } else {
                    $cantidadVendida++;
                }
            }

            $invAgrupado = $inventariosAgrupados->get($codigo);
            $stockTotal = (int) ($invAgrupado?->stock_total ?? 0);
            $stockReservadoTotal = (int) $reservasAgrupadas->get($codigo, 0);
            $stockDisponibleTotal = max(0, $stockTotal - $stockReservadoTotal);
            $stockMinimo = (int) ($invAgrupado?->stock_minimo ?? 0);

            return [$codigo => [
                'total_productos_registrados' => $totalRegistrados,
                'productos_disponibles' => $cantidadDisponible,
                'productos_reservados' => $cantidadReservada,
                'productos_vendidos' => $cantidadVendida,
                'stock_total' => $stockTotal,
                'stock_reservado' => $stockReservadoTotal,
                'stock_disponible' => $stockDisponibleTotal,
                'stock_minimo' => $stockMinimo,
                'estado_stock' => $this->estadoStock($invAgrupado !== null, $stockDisponibleTotal, $stockMinimo),
            ]];
        });
    }

    private function reservasActivasPorProducto(Collection $codigosProducto): Collection
    {
        if ($codigosProducto->isEmpty()) {
            return collect();
        }

        return DB::table('reservas_stock_carrito')
            ->whereIn('cod_producto', $codigosProducto)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA->value)
            ->where('expira_en_res', '>', now())
            ->selectRaw('cod_producto, COALESCE(SUM(cantidad_res), 0) as total')
            ->groupBy('cod_producto')
            ->pluck('total', 'cod_producto');
    }

    private function estadoStock(bool $tieneInventario, int $stockDisponible, int $stockMinimo): string
    {
        if (! $tieneInventario) {
            return 'sin_inventario';
        }

        if ($stockDisponible <= 0) {
            return 'sin_stock';
        }

        if ($stockDisponible <= $stockMinimo) {
            return 'stock_bajo';
        }

        return 'correcto';
    }

    private function presentarInventario($inventario): ?array
    {
        if (! $inventario) {
            return null;
        }

        return [
            'cod_inventario' => $inventario->cod_inventario,
            'stock_actual' => (int) $inventario->stock_actual_inv,
            'stock_minimo' => (int) $inventario->stock_minimo_inv,
            'ubicacion' => $inventario->ubicacion_inv,
            'estado_stock' => $this->estadoStock(true, (int) $inventario->stock_actual_inv, (int) $inventario->stock_minimo_inv),
        ];
    }

    private function resumenVacio(): array
    {
        return [
            'total_productos_registrados' => 0,
            'productos_disponibles' => 0,
            'productos_reservados' => 0,
            'productos_vendidos' => 0,
            'stock_total' => 0,
            'stock_reservado' => 0,
            'stock_disponible' => 0,
            'stock_minimo' => 0,
            'estado_stock' => 'sin_inventario',
        ];
    }
}
