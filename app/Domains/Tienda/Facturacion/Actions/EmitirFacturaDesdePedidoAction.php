<?php

namespace App\Domains\Tienda\Facturacion\Actions;

use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\Facturacion\Enums\EstadoFacturaEnum;
use App\Domains\Tienda\Facturacion\Enums\TipoComprobanteEnum;
use App\Domains\Tienda\Facturacion\Events\FacturaEmitidaEvent;
use App\Domains\Tienda\Facturacion\Services\GenerarNumeroFacturaService;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\CheckoutSesion;
use App\Models\Factura;
use App\Models\Pedido;
use App\Models\PedidoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EmitirFacturaDesdePedidoAction
{
    public function __construct(
        private GenerarNumeroFacturaService $numeroFacturaService,
    ) {}

    public function execute(Pedido $pedido, ?int $emitidaPorUserId = null): Factura
    {
        $pedidoTienda = PedidoTienda::where('cod_pedido', $pedido->cod_pedido)->first();

        if (!$pedidoTienda) {
            throw ValidationException::withMessages([
                'pedido' => ['El pedido no tiene una tienda asociada.'],
            ]);
        }

        $checkoutSesion = CheckoutSesion::find($pedidoTienda->cod_checkout_sesion);

        $pedido->load('detalles.producto');

        return DB::transaction(function () use ($pedido, $pedidoTienda, $checkoutSesion, $emitidaPorUserId) {
            $numeroFactura = $this->numeroFacturaService->generar();

            $documentoCliente = $checkoutSesion?->documento_facturacion_che ?? 'S/N';
            $razonSocial = $checkoutSesion?->razon_social_che ?? $pedido->cliente->nombre_cli ?? 'Cliente';
            $direccionFiscal = $checkoutSesion?->direccion_entrega_che;

            $factura = Factura::create([
                'cod_pedido' => $pedido->cod_pedido,
                'cod_pago' => $pedidoTienda->pago?->cod_pago,
                'cod_checkout_sesion' => $pedidoTienda->cod_checkout_sesion,
                'numero_factura_fac' => $numeroFactura,
                'tipo_comprobante_fac' => TipoComprobanteEnum::RECIBO,
                'estado_fac' => EstadoFacturaEnum::EMITIDA,
                'fecha_emision_fac' => now()->toDateString(),
                'documento_cliente_fac' => $documentoCliente,
                'razon_social_cliente_fac' => $razonSocial,
                'direccion_fiscal_fac' => $direccionFiscal,
                'subtotal_fac' => $pedido->subtotal_ped ?? 0,
                'descuento_fac' => $pedido->descuento_ped ?? 0,
                'impuesto_fac' => 0,
                'total_fac' => $pedido->total_ped,
                'moneda_fac' => 'BOB',
                'emitida_por_user_id' => $emitidaPorUserId,
            ]);

            foreach ($pedido->detalles as $detalle) {
                $factura->detalles()->create([
                    'cod_producto' => $detalle->cod_producto,
                    'cod_detalle_pedido' => $detalle->cod_detalle_pedido,
                    'descripcion_dfa' => $detalle->producto->nombre_pro ?? 'Producto',
                    'cantidad_dfa' => $detalle->cantidad_det,
                    'precio_unitario_dfa' => $detalle->precio_unitario_det,
                    'subtotal_dfa' => $detalle->subtotal_det,
                ]);
            }

            $pedidoTienda->update([
                'estado_pte' => EstadoPedidoTiendaEnum::FACTURADO,
            ]);

            if ($checkoutSesion && $checkoutSesion->estado_che !== EstadoCheckoutSesionEnum::COMPLETADO) {
                $checkoutSesion->update([
                    'estado_che' => EstadoCheckoutSesionEnum::COMPLETADO,
                ]);
            }

            FacturaEmitidaEvent::dispatch($factura);

            return $factura->load('detalles');
        });
    }
}
