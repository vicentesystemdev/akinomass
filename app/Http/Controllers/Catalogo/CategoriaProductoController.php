<?php

namespace App\Http\Controllers\Catalogo;

use App\Domains\Catalogo\Categorias\Actions\ActualizarCategoriaProductoAction;
use App\Domains\Catalogo\Categorias\Actions\CrearCategoriaProductoAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoriasProducto\StoreCategoriaProductoRequest;
use App\Http\Requests\CategoriasProducto\UpdateCategoriaProductoRequest;
use App\Models\CategoriaProducto;
use App\Models\Producto;
use App\Models\TallaProducto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoriaProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('productos.ver');

        $query = CategoriaProducto::query();

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where('nombre_cat', 'like', "%{$q}%");
        }

        if ($request->filled('activo_cat')) {
            $query->where('activo_cat', $request->boolean('activo_cat'));
        }

        if ($request->filled('cod_talla_producto')) {
            $codTalla = $request->input('cod_talla_producto');
            $query->whereHas('productos.variantes', function ($q) use ($codTalla) {
                $q->where('cod_talla_producto', $codTalla);
            });
        }

        $categorias = $query->latest('cod_categoria_producto')
            ->paginate(15)
            ->withQueryString();

        $tieneDuplicados = CategoriaProducto::select('nombre_cat')
            ->groupBy('nombre_cat')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        $tallas = TallaProducto::where('activo_talla_producto', true)
            ->orderBy('orden_talla_producto')
            ->get();

        return Inertia::render('CategoriasProducto/Index', [
            'categorias' => $categorias,
            'filters' => $request->only(['q', 'activo_cat', 'cod_talla_producto']),
            'tieneDuplicados' => $tieneDuplicados,
            'tallas' => $tallas,
        ]);
    }

    public function show(int $id): Response
    {
        $this->authorize('productos.ver');

        $categoria = CategoriaProducto::findOrFail($id);

        $productos = Producto::where('cod_categoria_producto', $id)
            ->with(['variantes.talla', 'inventarios'])
            ->get();

        $stockPorTalla = [];
        $tallasDisponibles = [];
        $totalStock = 0;

        foreach ($productos as $producto) {
            if ($producto->variantes->isNotEmpty()) {
                foreach ($producto->variantes as $variante) {
                    $tallaCod = $variante->cod_talla_producto;
                    $tallaNom = $variante->talla?->nom_talla_producto ?? 'Desconocida';
                    $tallaCodStr = (string)$tallaCod;

                    if (!isset($tallasDisponibles[$tallaCod])) {
                        $tallasDisponibles[$tallaCod] = [
                            'cod_talla_producto' => $tallaCod,
                            'nom_talla_producto' => $tallaNom,
                            'codigo_talla_producto' => $variante->talla?->codigo_talla_producto,
                        ];
                    }

                    $stockVar = $variante->inventarios->sum('stock_actual_inv');
                    $stockPorTalla[$tallaCodStr] = ($stockPorTalla[$tallaCodStr] ?? 0) + $stockVar;
                    $totalStock += $stockVar;
                }
            } else {
                $stockBase = $producto->inventarios->whereNull('cod_variante_producto')->sum('stock_actual_inv');
                $totalStock += $stockBase;
            }
        }

        $tallasDisponibles = array_values($tallasDisponibles);

        return Inertia::render('CategoriasProducto/Show', [
            'categoria' => $categoria,
            'productos' => $productos,
            'tallasDisponibles' => $tallasDisponibles,
            'stockPorTalla' => $stockPorTalla,
            'totalStock' => $totalStock,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('productos.crear');

        return Inertia::render('CategoriasProducto/Create');
    }

    public function store(StoreCategoriaProductoRequest $request, CrearCategoriaProductoAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('categorias-producto.index');
    }

    public function edit(int $categoriaProducto): Response
    {
        $this->authorize('productos.editar');

        $categoria = CategoriaProducto::findOrFail($categoriaProducto);

        return Inertia::render('CategoriasProducto/Edit', [
            'categoria' => $categoria,
        ]);
    }

    public function update(UpdateCategoriaProductoRequest $request, int $categoriaProducto, ActualizarCategoriaProductoAction $action)
    {
        $categoria = CategoriaProducto::findOrFail($categoriaProducto);

        $action->execute($categoria, $request->validated());

        return redirect()->route('categorias-producto.index');
    }
}
