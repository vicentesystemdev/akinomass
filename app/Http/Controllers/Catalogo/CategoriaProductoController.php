<?php

namespace App\Http\Controllers\Catalogo;

use App\Domains\Catalogo\Categorias\Actions\ActualizarCategoriaProductoAction;
use App\Domains\Catalogo\Categorias\Actions\CrearCategoriaProductoAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\CategoriasProducto\StoreCategoriaProductoRequest;
use App\Http\Requests\CategoriasProducto\UpdateCategoriaProductoRequest;
use App\Models\CategoriaProducto;
use Inertia\Inertia;
use Inertia\Response;

class CategoriaProductoController extends Controller
{
    public function index(): Response
    {
        $this->authorize('productos.ver');

        return Inertia::render('CategoriasProducto/Index', [
            'categorias' => CategoriaProducto::latest()->get(),
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

    public function edit(CategoriaProducto $categoria): Response
    {
        $this->authorize('productos.editar');

        return Inertia::render('CategoriasProducto/Edit', [
            'categoria' => $categoria,
        ]);
    }

    public function update(UpdateCategoriaProductoRequest $request, CategoriaProducto $categoria, ActualizarCategoriaProductoAction $action)
    {
        $action->execute($categoria, $request->validated());

        return redirect()->route('categorias-producto.index');
    }
}
