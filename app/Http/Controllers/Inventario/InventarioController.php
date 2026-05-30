<?php

namespace App\Http\Controllers\Inventario;

use App\Domains\Inventario\Actions\CrearOActualizarInventarioAction;
use App\Domains\Inventario\Actions\RegistrarAjusteInventarioAction;
use App\Domains\Inventario\Actions\RegistrarEntradaInventarioAction;
use App\Domains\Inventario\Actions\RegistrarSalidaInventarioAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Inventario\AjustarInventarioRequest;
use App\Http\Requests\Inventario\RegistrarMovimientoInventarioRequest;
use App\Http\Requests\Inventario\StoreInventarioRequest;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(): Response
    {
        $this->authorize('inventario.ver');
        $stockBajo = Inventario::with('producto')->whereColumn('stock_actual_inv', '<=', 'stock_minimo_inv')->get();
        $allInventarios = Inventario::all(['stock_actual_inv', 'activo_inv']);
        $kpis = [
            'total_productos' => $allInventarios->count(),
            'stock_total' => $allInventarios->sum('stock_actual_inv'),
            'inventarios_activos' => $allInventarios->filter(fn($i) => $i->activo_inv !== false)->count(),
        ];
        return Inertia::render('Inventario/Index', [
            'inventarios' => Inventario::with('producto')->paginate(15)->withQueryString(),
            'stockBajo' => $stockBajo,
            'kpis' => $kpis,
        ]);
    }

    public function movimientos(): Response
    {
        $this->authorize('inventario.movimientos');
        return Inertia::render('Inventario/Movimientos', ['movimientos' => MovimientoInventario::with(['producto', 'usuarioResponsable'])->latest()->paginate(15)->withQueryString()]);
    }

    public function entradaForm(): Response { $this->authorize('inventario.ajustar'); return Inertia::render('Inventario/Entrada', ['productos' => Producto::all()]); }
    public function salidaForm(): Response { $this->authorize('inventario.ajustar'); return Inertia::render('Inventario/Salida', ['productos' => Producto::all()]); }
    public function ajusteForm(): Response { $this->authorize('inventario.ajustar'); return Inertia::render('Inventario/Ajustar', ['productos' => Producto::all()]); }

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
