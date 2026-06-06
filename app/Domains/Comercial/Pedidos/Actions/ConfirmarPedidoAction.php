<?php
namespace App\Domains\Comercial\Pedidos\Actions;
use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pedidos\Services\PedidoService;
use App\Models\Pedido;
use Illuminate\Support\Str;

class ConfirmarPedidoAction { public function __construct(private readonly PedidoService $service, private RegistrarAuditoriaService $auditoriaService) {} public function execute(Pedido $pedido, ?int $codUsuario): Pedido { $pedido = $this->service->confirmar($pedido, $codUsuario); $contexto = RegistrarAuditoriaData::fromRequest(request()); $idEvento = (string) Str::uuid(); $this->auditoriaService->registrarAccion($contexto, 'Pedidos', 'pedidos', (string) $pedido->cod_pedido, 'cambio_estado', submodulo: 'Confirmación', idEvento: $idEvento, accionFuncional: 'Confirmación de pedido', descripcion: "El pedido {$pedido->numero_pedido_ped} fue confirmado.", campo: 'estado_ped', valorAnterior: 'borrador', valorNuevo: 'confirmado'); return $pedido; }}
