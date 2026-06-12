<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Models\Carrito;
use App\Models\Inventario;
use App\Models\PedidoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DescontarStockDefinitivoPedidoWebAction
{
    public function __construct(
        private InventarioService $inventarioService,
        private ReservaStockCarritoService $reservaService,
    ) {}

    public function execute(PedidoTienda $pedidoTienda, Carrito $carrito): void
    {
        DB::transaction(function () use ($pedidoTienda, $carrito) {
            $pedidoTienda->loadMissing('pedido.detalles.producto');
            $detallesPedido = $pedidoTienda->pedido?->detalles;

            if (! $detallesPedido || $detallesPedido->isEmpty()) {
                return;
            }

            foreach ($detallesPedido as $detalle) {
                $inventario = Inventario::where('cod_producto', $detalle->cod_producto)
                    ->when($detalle->cod_variante_producto, fn ($query, $codVariante) => $query->where('cod_variante_producto', $codVariante), fn ($query) => $query->whereNull('cod_variante_producto'))
                    ->where('activo_inv', true)
                    ->lockForUpdate()
                    ->first();

                $stockFisico = $inventario ? (int) $inventario->stock_actual_inv : 0;

                if ($stockFisico < $detalle->cantidad_det) {
                    throw ValidationException::withMessages([
                        'stock' => ['Stock físico insuficiente para: '.($detalle->producto?->nombre_pro ?? 'Producto #'.$detalle->cod_producto).'. Disponible: '.$stockFisico],
                    ]);
                }

                $this->inventarioService->registrarMovimiento(
                    codProducto: $detalle->cod_producto,
                    tipo: TipoMovimientoInventarioEnum::SALIDA,
                    cantidad: $detalle->cantidad_det,
                    motivo: 'Venta web - Pedido #'.$pedidoTienda->cod_pedido,
                    observacion: 'Descuento automático por pago aceptado',
                    codUsuario: auth()->id(),
                    codVarianteProducto: $detalle->cod_variante_producto,
                );
            }

            $this->reservaService->convertirReservasAPedido($carrito);
        });
    }
}
