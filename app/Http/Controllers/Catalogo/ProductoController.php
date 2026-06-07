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
            ->where('sku_pro', 'not like', 'GEN-CAT-%');

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

        $productos = $query->latest('cod_producto')->paginate(16)->withQueryString();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => CategoriaProducto::where('activo_cat', true)->get(),
            'filters' => $request->only(['q', 'cod_categoria_producto', 'estado_pro']),
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
