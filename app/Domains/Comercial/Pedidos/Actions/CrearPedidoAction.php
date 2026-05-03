<?php
namespace App\Domains\Comercial\Pedidos\Actions;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\Comercial\Pedidos\Services\PedidoService;
use App\Models\Pedido;
use Illuminate\Support\Facades\DB;

class CrearPedidoAction {
    public function __construct(private readonly PedidoService $service) {}
    public function execute(array $data, ?int $codUsuario): Pedido {
        $totales = $this->service->calcularTotales($data['detalles'], (float) ($data['descuento_ped'] ?? 0));
        return DB::transaction(function () use ($data, $codUsuario, $totales) {
            $pedido = Pedido::create([
                'cod_cliente' => $data['cod_cliente'], 'cod_canal_venta' => $data['cod_canal_venta'], 'cod_tipo_flujo_comercial' => $data['cod_tipo_flujo_comercial'], 'cod_usuario_responsable' => $codUsuario, 'numero_pedido_ped' => $this->service->generarNumeroPedido(), 'fecha_pedido_ped' => $data['fecha_pedido_ped'] ?? now()->toDateString(), 'estado_ped' => EstadoPedidoEnum::BORRADOR, 'subtotal_ped' => $totales['subtotal'], 'descuento_ped' => $totales['descuento'], 'total_ped' => $totales['total'], 'observacion_ped' => $data['observacion_ped'] ?? null,
            ]);
            $pedido->detalles()->createMany($totales['detalles']);
            return $pedido->refresh();
        });
    }}
