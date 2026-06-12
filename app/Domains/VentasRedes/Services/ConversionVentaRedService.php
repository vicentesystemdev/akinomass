<?php

namespace App\Domains\VentasRedes\Services;

use App\Domains\Comercial\Pedidos\Actions\CrearPedidoAction;
use App\Domains\CRM\Leads\Actions\ConvertirLeadEnClienteAction;
use App\Domains\VentasRedes\Enums\EstadoVentaRedEnum;
use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\VentaRed;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class ConversionVentaRedService
{
    public function __construct(
        private readonly CrearPedidoAction $crearPedidoAction,
        private readonly ConvertirLeadEnClienteAction $convertirLeadAction,
    ) {}

    public function convertirLeadACliente(VentaRed $ventaRed): Cliente
    {
        $ventaRed->loadMissing('lead');

        if ($ventaRed->cod_cliente) {
            return $ventaRed->cliente()->firstOrFail();
        }

        if (! $ventaRed->lead) {
            throw ValidationException::withMessages([
                'cod_lead' => ['La venta no tiene un lead asociado.'],
            ]);
        }

        return DB::transaction(function () use ($ventaRed): Cliente {
            $cliente = $ventaRed->lead->cod_cliente
                ? $ventaRed->lead->cliente
                : $this->convertirLeadAction->execute($ventaRed->lead);

            $ventaRed->update(['cod_cliente' => $cliente->cod_cliente]);

            return $cliente;
        });
    }

    public function convertirAPedido(VentaRed $ventaRed, ?int $codUsuario): Pedido
    {
        $ventaRed->loadMissing(['detalles', 'lead', 'cliente']);

        if ($ventaRed->estado_venta_red === EstadoVentaRedEnum::CANCELADA) {
            throw ValidationException::withMessages([
                'estado_venta_red' => ['No se puede convertir una venta cancelada.'],
            ]);
        }

        if ($ventaRed->cod_pedido) {
            throw new RuntimeException('La venta por redes ya fue convertida a pedido.');
        }

        if ($ventaRed->detalles->isEmpty()) {
            throw ValidationException::withMessages([
                'detalles' => ['No se puede convertir una venta sin productos.'],
            ]);
        }

        if (! $ventaRed->cod_cliente && $ventaRed->cod_lead) {
            $this->convertirLeadACliente($ventaRed);
            $ventaRed->refresh()->load('detalles');
        }

        if (! $ventaRed->cod_cliente) {
            throw ValidationException::withMessages([
                'cod_cliente' => ['Selecciona o convierte un cliente antes de generar el pedido.'],
            ]);
        }

        return DB::transaction(function () use ($ventaRed, $codUsuario): Pedido {
            $pedido = $this->crearPedidoAction->execute([
                'cod_cliente' => $ventaRed->cod_cliente,
                'cod_canal_venta' => $ventaRed->cod_canal_venta,
                'cod_tipo_flujo_comercial' => $ventaRed->cod_tipo_flujo_comercial,
                'descuento_ped' => $ventaRed->descuento,
                'observacion_ped' => trim(($ventaRed->observacion ?? '')."\nOrigen: Ventas por Redes {$ventaRed->codigo_venta_red}"),
                'detalles' => $ventaRed->detalles->map(fn ($detalle): array => [
                    'cod_producto' => $detalle->cod_producto,
                    'cod_variante_producto' => $detalle->cod_variante_producto,
                    'cantidad_det' => $detalle->cantidad,
                    'precio_unitario_det' => $detalle->precio_unitario,
                ])->all(),
            ], $codUsuario);

            $ventaRed->update([
                'cod_pedido' => $pedido->cod_pedido,
                'estado_venta_red' => EstadoVentaRedEnum::CONVERTIDA_PEDIDO,
                'fecha_confirmacion' => $ventaRed->fecha_confirmacion ?? now(),
            ]);

            return $pedido->refresh();
        });
    }
}
