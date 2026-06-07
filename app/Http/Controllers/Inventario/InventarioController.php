<?php

namespace App\Http\Controllers\Inventario;

use App\Domains\Inventario\Actions\CrearOActualizarInventarioAction;
use App\Domains\Inventario\Actions\RegistrarAjusteInventarioAction;
use App\Domains\Inventario\Actions\RegistrarEntradaInventarioAction;
use App\Domains\Inventario\Actions\RegistrarSalidaInventarioAction;
use App\Domains\Inventario\Services\ConsultaInventarioCategoriaService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\AjustarInventarioRequest;
use App\Http\Requests\Inventario\RegistrarMovimientoInventarioRequest;
use App\Http\Requests\Inventario\StoreInventarioRequest;
use App\Models\CategoriaProducto;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(Request $request, ConsultaInventarioCategoriaService $consulta): Response
    {
        $this->authorize('inventario.ver');

        $categorias = $consulta->categorias();
        $codCategoria = $request->integer('cod_categoria_producto') ?: null;

        return Inertia::render('Inventario/Index', [
            'categorias' => $categorias,
            'detalleCategoria' => $codCategoria ? $consulta->detalle($codCategoria) : null,
            'kpis' => $consulta->kpis(),
        ]);
    }

    public function movimientos(Request $request): Response
    {
        $this->authorize('inventario.movimientos');

        $codCategoria = $request->integer('cod_categoria_producto') ?: null;
        $movimientos = MovimientoInventario::query()
            ->with(['producto.categoria', 'inventario.variante.talla', 'usuarioResponsable'])
            ->when($codCategoria, fn ($query) => $query->whereHas(
                'producto',
                fn ($producto) => $producto->where('cod_categoria_producto', $codCategoria),
            ))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Inventario/Movimientos', [
            'movimientos' => $movimientos,
            'categorias' => CategoriaProducto::query()
                ->orderBy('nombre_cat')
                ->get(['cod_categoria_producto', 'nombre_cat']),
            'filtros' => ['cod_categoria_producto' => $codCategoria],
        ]);
    }

    public function entradaForm(): Response
    {
        $this->authorize('inventario.ajustar');

        return Inertia::render('Inventario/Entrada', ['productos' => Producto::all()]);
    }

    public function salidaForm(): Response
    {
        $this->authorize('inventario.ajustar');

        return Inertia::render('Inventario/Salida', ['productos' => Producto::all()]);
    }

    public function ajusteForm(Request $request): Response
    {
        $this->authorize('inventario.ajustar');

        return Inertia::render('Inventario/Ajustar', [
            'productos' => Producto::query()
                ->with([
                    'inventario',
                    'variantes' => fn ($query) => $query
                        ->where('activo_variante_producto', true)
                        ->with(['talla', 'inventario']),
                ])
                ->orderBy('nombre_pro')
                ->get(),
            'codProductoSeleccionado' => $request->integer('cod_producto') ?: null,
            'codVarianteSeleccionada' => $request->integer('cod_variante_producto') ?: null,
        ]);
    }

    public function store(StoreInventarioRequest $request, CrearOActualizarInventarioAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('inventario.index');
    }

    public function registrarEntrada(RegistrarMovimientoInventarioRequest $request, RegistrarEntradaInventarioAction $action)
    {
        $action->execute($request->validated(), $request->user()?->id);

        return redirect()->route('inventario.index');
    }

    public function registrarSalida(RegistrarMovimientoInventarioRequest $request, RegistrarSalidaInventarioAction $action)
    {
        $action->execute($request->validated(), $request->user()?->id);

        return redirect()->route('inventario.index');
    }

    public function registrarAjuste(AjustarInventarioRequest $request, RegistrarAjusteInventarioAction $action)
    {
        $action->execute($request->validated(), $request->user()?->id);

        return redirect()->route('inventario.index');
    }
}
