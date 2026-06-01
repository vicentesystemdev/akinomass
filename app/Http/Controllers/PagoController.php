<?php

namespace App\Http\Controllers;

use App\Domains\Comercial\Pagos\Actions\ActualizarPagoAction;
use App\Domains\Comercial\Pagos\Actions\ConfirmarPagoAction;
use App\Domains\Comercial\Pagos\Actions\ObservarPagoAction;
use App\Domains\Comercial\Pagos\Actions\RechazarPagoAction;
use App\Domains\Comercial\Pagos\Actions\RegistrarPagoAction;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Comercial\Pagos\Enums\MetodoPagoEnum;
use App\Http\Requests\Pagos\CambiarEstadoPagoRequest;
use App\Http\Requests\Pagos\StorePagoRequest;
use App\Http\Requests\Pagos\UpdatePagoRequest;
use App\Http\Support\PagoComprobantePresenter;
use App\Models\Pago;
use App\Models\Pedido;
use Inertia\Inertia;
use Inertia\Response;

class PagoController extends Controller
{
    public function index(): Response
    {
        $this->authorize('pagos.ver');

        $pagos = Pago::with(['pedido', 'pagoTienda'])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function (Pago $pago) {
                $data = $pago->toArray();
                $data['comprobante_web'] = PagoComprobantePresenter::for($pago);

                return $data;
            });

        return Inertia::render('Pagos/Index', ['pagos' => $pagos]);
    }
    public function create(): Response { $this->authorize('pagos.registrar'); return Inertia::render('Pagos/Create', ['pedidos' => Pedido::select('cod_pedido', 'numero_pedido_ped')->get(), 'metodosPago' => array_map(fn($m) => $m->value, MetodoPagoEnum::cases())]); }
    public function store(StorePagoRequest $request, RegistrarPagoAction $action) { $action->execute($request->validated(), auth()->id()); return redirect()->route('pagos.index'); }
    public function show(Pago $pago): Response
    {
        $this->authorize('pagos.ver');

        $pago->load(['pedido', 'pagoTienda']);

        return Inertia::render('Pagos/Show', [
            'pago' => array_merge($pago->toArray(), [
                'comprobante_web' => PagoComprobantePresenter::for($pago),
            ]),
        ]);
    }
    public function edit(Pago $pago): Response { $this->authorize('pagos.registrar'); return Inertia::render('Pagos/Edit', ['pago' => $pago, 'metodosPago' => array_map(fn($m) => $m->value, MetodoPagoEnum::cases()), 'estadoPagado' => EstadoPagoEnum::PAGADO->value]); }
    public function update(UpdatePagoRequest $request, Pago $pago, ActualizarPagoAction $action) { $action->execute($pago, $request->validated()); return redirect()->route('pagos.show', $pago); }
    public function confirmar(CambiarEstadoPagoRequest $request, Pago $pago, ConfirmarPagoAction $action) { $this->authorize('pagos.confirmar'); $action->execute($pago); return redirect()->route('pagos.show', $pago); }
    public function observar(CambiarEstadoPagoRequest $request, Pago $pago, ObservarPagoAction $action) { $this->authorize('pagos.confirmar'); $action->execute($pago); return redirect()->route('pagos.show', $pago); }
    public function rechazar(CambiarEstadoPagoRequest $request, Pago $pago, RechazarPagoAction $action) { $this->authorize('pagos.rechazar'); $action->execute($pago); return redirect()->route('pagos.show', $pago); }
}
