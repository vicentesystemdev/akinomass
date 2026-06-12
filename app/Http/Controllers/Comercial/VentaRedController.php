<?php

namespace App\Http\Controllers\Comercial;

use App\Domains\VentasRedes\Actions\ActualizarDetalleVentaRedAction;
use App\Domains\VentasRedes\Actions\ActualizarVentaRedAction;
use App\Domains\VentasRedes\Actions\AgregarDetalleVentaRedAction;
use App\Domains\VentasRedes\Actions\CambiarEstadoVentaRedAction;
use App\Domains\VentasRedes\Actions\CancelarVentaRedAction;
use App\Domains\VentasRedes\Actions\ConfirmarVentaRedAction;
use App\Domains\VentasRedes\Actions\ConvertirLeadVentaRedAClienteAction;
use App\Domains\VentasRedes\Actions\ConvertirVentaRedACheckoutAction;
use App\Domains\VentasRedes\Actions\ConvertirVentaRedAPedidoAction;
use App\Domains\VentasRedes\Actions\CrearVentaRedAction;
use App\Domains\VentasRedes\Actions\EliminarDetalleVentaRedAction;
use App\Domains\VentasRedes\DTOs\FiltroVentaRedData;
use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Domains\VentasRedes\Enums\TipoInteraccionVentaRedEnum;
use App\Domains\VentasRedes\Repositories\CatalogoVentaRedRepository;
use App\Domains\VentasRedes\Repositories\CrmVentaRedRepository;
use App\Domains\VentasRedes\Repositories\VentaRedRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\VentasRedes\CambiarEstadoVentaRedRequest;
use App\Http\Requests\VentasRedes\ConfirmarVentaRedRequest;
use App\Http\Requests\VentasRedes\ConvertirVentaRedRequest;
use App\Http\Requests\VentasRedes\StoreDetalleVentaRedRequest;
use App\Http\Requests\VentasRedes\StoreVentaRedRequest;
use App\Http\Requests\VentasRedes\UpdateDetalleVentaRedRequest;
use App\Http\Requests\VentasRedes\UpdateVentaRedRequest;
use App\Models\CanalVenta;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use App\Models\VentaRed;
use App\Models\VentaRedDetalle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class VentaRedController extends Controller
{
    public function index(Request $request, VentaRedRepository $repository): Response
    {
        $this->authorize('pedidos.ver');

        return Inertia::render('VentasRedes/Index', [
            'ventas' => $repository->paginar(FiltroVentaRedData::fromArray($request->all())),
            'filtros' => $request->only(['estado', 'cod_canal_venta', 'tipo_interaccion', 'cod_usuario_responsable', 'desde', 'hasta', 'busqueda']),
            'estados' => array_column(EstadoVentaRedEnum::cases(), 'value'),
            'tiposInteraccion' => array_column(TipoInteraccionVentaRedEnum::cases(), 'value'),
            'canales' => $this->canales(),
            'usuarios' => $this->usuarios(),
        ]);
    }

    public function create(CrmVentaRedRepository $crm, CatalogoVentaRedRepository $catalogo): Response
    {
        $this->authorize('pedidos.crear');

        return Inertia::render('VentasRedes/Create', $this->formProps($crm, $catalogo));
    }

    public function store(StoreVentaRedRequest $request, CrearVentaRedAction $action): RedirectResponse
    {
        $ventaRed = $action->execute($request->validated());

        return redirect()->route('ventas-redes.show', $ventaRed);
    }

    public function show(VentaRed $ventaRed, CatalogoVentaRedRepository $catalogo): Response
    {
        $this->authorize('pedidos.ver');

        return Inertia::render('VentasRedes/Show', [
            'venta' => $ventaRed->load(['lead', 'cliente', 'canalVenta', 'tipoFlujoComercial', 'usuarioResponsable', 'detalles.producto', 'detalles.variante.talla', 'pedido']),
            'productos' => $catalogo->productosActivos(),
            'estados' => array_column(EstadoVentaRedEnum::cases(), 'value'),
        ]);
    }

    public function edit(VentaRed $ventaRed, CrmVentaRedRepository $crm, CatalogoVentaRedRepository $catalogo): Response
    {
        $this->authorize('pedidos.editar');

        return Inertia::render('VentasRedes/Edit', [
            ...$this->formProps($crm, $catalogo),
            'venta' => $ventaRed->load(['detalles.producto', 'detalles.variante.talla']),
        ]);
    }

    public function update(UpdateVentaRedRequest $request, VentaRed $ventaRed, ActualizarVentaRedAction $action): RedirectResponse
    {
        $action->execute($ventaRed, $request->validated());

        return redirect()->route('ventas-redes.show', $ventaRed);
    }

    public function destroy(VentaRed $ventaRed, CancelarVentaRedAction $action): RedirectResponse
    {
        $this->authorize('pedidos.editar');
        $action->execute($ventaRed);

        return redirect()->route('ventas-redes.index');
    }

    public function agregarDetalle(StoreDetalleVentaRedRequest $request, VentaRed $ventaRed, AgregarDetalleVentaRedAction $action): RedirectResponse
    {
        $action->execute($ventaRed, $request->validated());

        return back();
    }

    public function actualizarDetalle(UpdateDetalleVentaRedRequest $request, VentaRed $ventaRed, VentaRedDetalle $detalle, ActualizarDetalleVentaRedAction $action): RedirectResponse
    {
        abort_unless($detalle->cod_venta_red === $ventaRed->cod_venta_red, 404);
        $action->execute($ventaRed, $detalle, $request->validated());

        return back();
    }

    public function eliminarDetalle(VentaRed $ventaRed, VentaRedDetalle $detalle, EliminarDetalleVentaRedAction $action): RedirectResponse
    {
        $this->authorize('pedidos.editar');
        abort_unless($detalle->cod_venta_red === $ventaRed->cod_venta_red, 404);
        $action->execute($ventaRed, $detalle);

        return back();
    }

    public function cambiarEstado(CambiarEstadoVentaRedRequest $request, VentaRed $ventaRed, CambiarEstadoVentaRedAction $action): RedirectResponse
    {
        $action->execute($ventaRed, $request->validated()['estado_venta_red']);

        return back();
    }

    public function confirmar(ConfirmarVentaRedRequest $request, VentaRed $ventaRed, ConfirmarVentaRedAction $action): RedirectResponse
    {
        $action->execute($ventaRed);

        return back();
    }

    public function convertirLeadCliente(ConvertirVentaRedRequest $request, VentaRed $ventaRed, ConvertirLeadVentaRedAClienteAction $action): RedirectResponse
    {
        $action->execute($ventaRed);

        return back();
    }

    public function convertirCheckout(ConvertirVentaRedRequest $request, VentaRed $ventaRed, ConvertirVentaRedACheckoutAction $action): RedirectResponse
    {
        $action->execute($ventaRed);

        return back();
    }

    public function convertirPedido(ConvertirVentaRedRequest $request, VentaRed $ventaRed, ConvertirVentaRedAPedidoAction $action): RedirectResponse
    {
        $pedido = $action->execute($ventaRed, auth()->id());

        return redirect()->route('pedidos.show', $pedido);
    }

    private function formProps(CrmVentaRedRepository $crm, CatalogoVentaRedRepository $catalogo): array
    {
        return [
            'leads' => $crm->leads(),
            'clientes' => $crm->clientes(),
            'canales' => $this->canales(),
            'tiposFlujo' => $this->tiposFlujo(),
            'usuarios' => $this->usuarios(),
            'productos' => $catalogo->productosActivos(),
            'estados' => array_column(EstadoVentaRedEnum::cases(), 'value'),
            'tiposInteraccion' => array_column(TipoInteraccionVentaRedEnum::cases(), 'value'),
        ];
    }

    private function canales()
    {
        return Cache::rememberForever('lookup:canales_venta', fn() => CanalVenta::where('activo_can', true)->get()->toArray());
    }

    private function tiposFlujo()
    {
        return Cache::rememberForever('lookup:tipos_flujo', fn() => TipoFlujoComercial::where('activo_tip', true)->get()->toArray());
    }

    private function usuarios()
    {
        return User::select('id', 'name')->orderBy('name')->get()->toArray();
    }
}
