<?php
namespace App\Domains\Comercial\Pedidos\Actions;
use App\Domains\Comercial\Pedidos\Services\PedidoService;
use App\Models\Pedido;
class CancelarPedidoAction { public function __construct(private readonly PedidoService $service) {} public function execute(Pedido $pedido, ?int $codUsuario): Pedido { return $this->service->cancelar($pedido, $codUsuario); }}
