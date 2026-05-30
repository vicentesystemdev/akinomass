<?php

namespace App\Http\Controllers\Tienda;

use App\Domains\Tienda\Catalogo\Actions\ListarCategoriasPublicasAction;
use App\Domains\Tienda\Catalogo\Actions\ListarProductosPublicosAction;
use App\Domains\Tienda\Catalogo\Actions\ObtenerProductoPublicoAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tienda\ListarCatalogoRequest;
use App\Models\CategoriaProducto;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogoPublicoController extends Controller
{
    public function index(
        ListarCatalogoRequest $request,
        ListarProductosPublicosAction $listarAction,
        ListarCategoriasPublicasAction $categoriasAction,
    ): Response|JsonResponse {
        $filtros = $request->validated();
        $productos = $listarAction->execute($filtros);
        $categorias = $categoriasAction->execute();

        if ($request->expectsJson()) {
            return response()->json([
                'productos' => $productos,
                'categorias' => $categorias,
            ]);
        }

        $page = $request->routeIs('tienda.home') ? 'Tienda/Home' : 'Tienda/Catalogo';

        return Inertia::render($page, [
            'productos' => $productos,
            'categorias' => $categorias,
            'filtros' => $filtros,
        ]);
    }

    public function show(
        Producto $producto,
        ObtenerProductoPublicoAction $action,
        Request $request,
    ): Response|JsonResponse {
        $producto = $action->execute($producto->cod_producto);

        if (!$producto) {
            abort(404);
        }

        if ($request->expectsJson()) {
            return response()->json(['producto' => $producto]);
        }

        return Inertia::render('Tienda/ProductoShow', [
            'producto' => $producto,
        ]);
    }

    public function porCategoria(
        CategoriaProducto $categoria,
        ListarProductosPublicosAction $listarAction,
        ListarCategoriasPublicasAction $categoriasAction,
        Request $request,
    ): Response|JsonResponse {
        $filtros = $request->only(['q', 'orden', 'solo_disponibles', 'page']);
        $filtros['cod_categoria_producto'] = $categoria->cod_categoria_producto;

        $productos = $listarAction->execute($filtros);
        $categorias = $categoriasAction->execute();

        if ($request->expectsJson()) {
            return response()->json([
                'productos' => $productos,
                'categorias' => $categorias,
                'categoria_actual' => $categoria,
            ]);
        }

        return Inertia::render('Tienda/Catalogo', [
            'productos' => $productos,
            'categorias' => $categorias,
            'categoria_actual' => $categoria,
            'filtros' => $filtros,
        ]);
    }
}
