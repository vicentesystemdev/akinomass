<?php
namespace App\Domains\Comercial\Pedidos\Actions;
use App\Domains\Comercial\Pedidos\Services\PedidoService;
use App\Models\Pedido;
class ActualizarPedidoAction { public function __construct(private readonly PedidoService $service) {} public function execute(Pedido $pedido, array $data): Pedido { $pedido->update(['cod_cliente' => $data['cod_cliente'],'cod_canal_venta' => $data['cod_canal_venta'],'cod_tipo_flujo_comercial' => $data['cod_tipo_flujo_comercial'],'observacion_ped' => $data['observacion_ped'] ?? null]); return $this->service->actualizarDetallesYTotales($pedido, $data['detalles'], (float) ($data['descuento_ped'] ?? 0)); }}
