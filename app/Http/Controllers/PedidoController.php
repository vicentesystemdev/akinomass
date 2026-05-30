<?php
namespace App\Http\Controllers;

use App\Domains\Comercial\Pedidos\Actions\ActualizarPedidoAction;
use App\Domains\Comercial\Pedidos\Actions\CancelarPedidoAction;
use App\Domains\Comercial\Pedidos\Actions\ConfirmarPedidoAction;
use App\Domains\Comercial\Pedidos\Actions\CrearPedidoAction;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Http\Requests\Pedidos\CancelarPedidoRequest;
use App\Http\Requests\Pedidos\ConfirmarPedidoRequest;
use App\Http\Requests\Pedidos\StorePedidoRequest;
use App\Http\Requests\Pedidos\UpdatePedidoRequest;
use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use Inertia\Inertia;
use Inertia\Response;

class PedidoController extends Controller
{
    public function index(): Response { $this->authorize('pedidos.ver'); return Inertia::render('Pedidos/Index', ['pedidos' => Pedido::with(['cliente','canalVenta','tipoFlujoComercial'])->latest()->paginate(15)->withQueryString()]); }
    public function create(): Response { $this->authorize('pedidos.crear'); return Inertia::render('Pedidos/Create', ['clientes'=>Cliente::all(),'canales'=>CanalVenta::all(),'tiposFlujo'=>TipoFlujoComercial::all(),'productos'=>Producto::all()]); }
    public function store(StorePedidoRequest $request, CrearPedidoAction $action) { $action->execute($request->validated(), auth()->id()); return redirect()->route('pedidos.index'); }
    public function show(Pedido $pedido): Response { $this->authorize('pedidos.ver'); return Inertia::render('Pedidos/Show', ['pedido'=>$pedido->load(['cliente','canalVenta','tipoFlujoComercial','detalles.producto'])]); }
    public function edit(Pedido $pedido): Response { $this->authorize('pedidos.editar'); return Inertia::render('Pedidos/Edit', ['pedido'=>$pedido->load('detalles'),'clientes'=>Cliente::all(),'canales'=>CanalVenta::all(),'tiposFlujo'=>TipoFlujoComercial::all(),'productos'=>Producto::all(),'estadoBorrador'=>EstadoPedidoEnum::BORRADOR->value]); }
    public function update(UpdatePedidoRequest $request, Pedido $pedido, ActualizarPedidoAction $action) { $action->execute($pedido, $request->validated()); return redirect()->route('pedidos.show', $pedido); }
    public function confirmar(ConfirmarPedidoRequest $request, Pedido $pedido, ConfirmarPedidoAction $action) { $action->execute($pedido, auth()->id()); return redirect()->route('pedidos.show', $pedido); }
    public function cancelar(CancelarPedidoRequest $request, Pedido $pedido, CancelarPedidoAction $action) { $action->execute($pedido, auth()->id()); return redirect()->route('pedidos.show', $pedido); }
}
