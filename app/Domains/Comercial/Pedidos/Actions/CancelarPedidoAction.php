<?php
namespace App\Domains\Comercial\Pedidos\Actions;
use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pedidos\Services\PedidoService;
use App\Models\Pedido;

class CancelarPedidoAction { public function __construct(private readonly PedidoService $service, private RegistrarAuditoriaService $auditoriaService) {} public function execute(Pedido $pedido, ?int $codUsuario): Pedido { $pedido = $this->service->cancelar($pedido, $codUsuario); $contexto = RegistrarAuditoriaData::fromRequest(request()); $this->auditoriaService->registrarAccion($contexto, 'Pedidos', 'pedidos', (string) $pedido->cod_pedido, 'cancelacion', submodulo: 'Cancelación', accionFuncional: 'Cancelación de pedido', descripcion: "El pedido {$pedido->numero_pedido_ped} fue cancelado."); return $pedido; }}
