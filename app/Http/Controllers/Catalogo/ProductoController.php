<?php

namespace App\Http\Controllers\Catalogo;

use App\Domains\Catalogo\Productos\Actions\ActualizarProductoAction;
use App\Domains\Catalogo\Productos\Actions\CrearProductoAction;
use App\Domains\Catalogo\Productos\Enums\EstadoProductoEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Productos\StoreProductoRequest;
use App\Http\Requests\Productos\UpdateProductoRequest;
use App\Models\CategoriaProducto;
use App\Models\Producto;
use App\Models\TallaProducto;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('productos.ver');

        $query = Producto::with(['categoria', 'inventarios', 'variantes.talla', 'variantes.inventarios'])
            ->where(function ($q) {
                $q->where('sku_pro', 'not like', 'GEN-CAT-%')
                  ->orWhereNull('sku_pro');
            });

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where(function ($sub) use ($q) {
                $sub->where('nombre_pro', 'like', "%{$q}%")
                    ->orWhere('sku_pro', 'like', "%{$q}%");
            });
        }

        if ($request->filled('cod_categoria_producto')) {
            $query->where('cod_categoria_producto', $request->input('cod_categoria_producto'));
        }

        if ($request->filled('estado_pro')) {
            $query->where('estado_pro', $request->input('estado_pro'));
        }

        if ($request->filled('stock')) {
            $stockFilter = $request->input('stock');
            if ($stockFilter === 'con_stock') {
                $query->whereHas('inventarios', function ($q) {
                    $q->where('stock_actual_inv', '>', 0);
                });
            } elseif ($stockFilter === 'sin_stock') {
                $query->whereDoesntHave('inventarios', function ($q) {
                    $q->where('stock_actual_inv', '>', 0);
                });
            } elseif ($stockFilter === 'bajo_stock') {
                $query->whereHas('inventarios', function ($q) {
                    $q->whereColumn('stock_actual_inv', '<', 'stock_minimo_inv');
                });
            }
        }

        $perPage = $request->input('per_page', 16);
        if ($perPage === 'all') {
            $perPage = 1000;
        } else {
            $perPage = is_numeric($perPage) ? (int)$perPage : 16;
        }

        $productos = $query->latest('cod_producto')->paginate($perPage)->withQueryString();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => CategoriaProducto::where('activo_cat', true)->get(),
            'filters' => $request->only(['q', 'cod_categoria_producto', 'estado_pro', 'stock', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('productos.crear');

        return Inertia::render('Productos/Create', [
            'categorias' => CategoriaProducto::where('activo_cat', true)->get(),
            'estados' => array_column(EstadoProductoEnum::cases(), 'value'),
            'tallas' => TallaProducto::where('activo_talla_producto', true)
                ->orderBy('orden_talla_producto')
                ->get(),
        ]);
    }

    public function store(StoreProductoRequest $request, CrearProductoAction $action)
    {
        $data = $request->validated();

        if ($request->hasFile('imagen_pro')) {
            $data['imagen_pro'] = $request->file('imagen_pro');
        } else {
            unset($data['imagen_pro']);
        }

        $action->execute($data);

        return redirect()->route('productos.index');
    }

    public function update(UpdateProductoRequest $request, Producto $producto, ActualizarProductoAction $action)
    {
        $data = $request->validated();

        if ($request->hasFile('imagen_pro')) {
            $data['imagen_pro'] = $request->file('imagen_pro');
        } elseif ($request->boolean('eliminar_imagen')) {
            $data['imagen_pro'] = null;
        } else {
            unset($data['imagen_pro']);
        }

        unset($data['eliminar_imagen']);

        $action->execute($producto, $data);

        return redirect()->route('productos.index');
    }

    public function edit(Producto $producto): Response
    {
        $this->authorize('productos.editar');

        return Inertia::render('Productos/Edit', [
            'producto' => $producto->load('variantes.talla'),
            'categorias' => CategoriaProducto::where('activo_cat', true)->orWhere('cod_categoria_producto', $producto->cod_categoria_producto)->get(),
            'estados' => array_column(EstadoProductoEnum::cases(), 'value'),
            'tallas' => TallaProducto::where('activo_talla_producto', true)
                ->orderBy('orden_talla_producto')
                ->get(),
        ]);
    }
}
