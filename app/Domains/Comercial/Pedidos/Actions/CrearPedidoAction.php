<?php

namespace App\Domains\Comercial\Pedidos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Domains\Comercial\Pedidos\Services\PedidoService;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CrearPedidoAction
{
    public function __construct(
        private readonly PedidoService $service,
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data, ?int $codUsuario): Pedido
    {
        $this->validarProductosYStock($data['detalles']);

        $totales = $this->service->calcularTotales($data['detalles'], (float) ($data['descuento_ped'] ?? 0));

        return DB::transaction(function () use ($data, $codUsuario, $totales) {
            $pedido = Pedido::create([
                'cod_cliente' => $data['cod_cliente'],
                'cod_canal_venta' => $data['cod_canal_venta'],
                'cod_tipo_flujo_comercial' => $data['cod_tipo_flujo_comercial'],
                'cod_usuario_responsable' => $codUsuario,
                'numero_pedido_ped' => $this->service->generarNumeroPedido(),
                'fecha_pedido_ped' => $data['fecha_pedido_ped'] ?? now()->toDateString(),
                'estado_ped' => EstadoPedidoEnum::BORRADOR,
                'subtotal_ped' => $totales['subtotal'],
                'descuento_ped' => $totales['descuento'],
                'total_ped' => $totales['total'],
                'observacion_ped' => $data['observacion_ped'] ?? null,
            ]);

            $pedido->detalles()->createMany($totales['detalles']);

            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $this->auditoriaService->registrarInsercion(
                $contexto, 'Pedidos', 'pedidos', (string) $pedido->cod_pedido, submodulo: 'Creación'
            );

            return $pedido->refresh();
        });
    }

    private function validarProductosYStock(array $detalles): void
    {
        $productosIds = array_unique(array_column($detalles, 'cod_producto'));

        $productos = Producto::whereIn('cod_producto', $productosIds)->get()->keyBy('cod_producto');
        $inventarios = Inventario::whereIn('cod_producto', $productosIds)
            ->where('activo_inv', true)
            ->get()
            ->keyBy('cod_producto');

        foreach ($detalles as $detalle) {
            $codProducto = $detalle['cod_producto'];
            $cantidad = (int) $detalle['cantidad_det'];

            $producto = $productos[$codProducto] ?? null;
            if (!$producto) {
                throw ValidationException::withMessages([
                    'detalles' => ["El producto {$codProducto} no existe."],
                ]);
            }

            if ($producto->estado_pro !== 'activo' && $producto->estado_pro?->value !== 'activo') {
                throw ValidationException::withMessages([
                    'detalles' => ["El producto \"{$producto->nombre_pro}\" no está activo."],
                ]);
            }

            $stock = $inventarios[$codProducto]->stock_actual_inv ?? 0;
            if ($cantidad > $stock) {
                throw ValidationException::withMessages([
                    'detalles' => ["Stock insuficiente para \"{$producto->nombre_pro}\". Disponible: {$stock}, solicitado: {$cantidad}."],
                ]);
            }
        }
    }
}
