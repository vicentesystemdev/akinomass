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
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(): Response
    {
        $this->authorize('productos.ver');

        return Inertia::render('Productos/Index', [
            'productos' => Producto::with('categoria')->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('productos.crear');

        return Inertia::render('Productos/Create', [
            'categorias' => CategoriaProducto::where('activo_cat', true)->get(),
            'estados' => array_column(EstadoProductoEnum::cases(), 'value'),
        ]);
    }

    public function store(StoreProductoRequest $request, CrearProductoAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('productos.index');
    }

    public function edit(Producto $producto): Response
    {
        $this->authorize('productos.editar');

        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'categorias' => CategoriaProducto::where('activo_cat', true)->orWhere('cod_categoria_producto', $producto->cod_categoria_producto)->get(),
            'estados' => array_column(EstadoProductoEnum::cases(), 'value'),
        ]);
    }

    public function update(UpdateProductoRequest $request, Producto $producto, ActualizarProductoAction $action)
    {
        $action->execute($producto, $request->validated());

        return redirect()->route('productos.index');
    }
}
