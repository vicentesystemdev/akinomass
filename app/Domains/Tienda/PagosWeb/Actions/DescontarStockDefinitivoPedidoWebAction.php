<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Domains\Inventario\Enums\TipoMovimientoInventarioEnum;
use App\Domains\Inventario\Services\InventarioService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Models\Carrito;
use App\Models\Inventario;
use App\Models\Pago;
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
            if ($carrito->detalles->isEmpty()) {
                return;
            }

            foreach ($carrito->detalles as $detalle) {
                $inventario = Inventario::where('cod_producto', $detalle->cod_producto)
                    ->where('activo_inv', true)
                    ->lockForUpdate()
                    ->first();

                $stockFisico = $inventario ? (int) $inventario->stock_actual_inv : 0;

                if ($stockFisico < $detalle->cantidad_dca) {
                    throw ValidationException::withMessages([
                        'stock' => ['Stock físico insuficiente para: ' . ($detalle->nombre_producto_dca ?? 'Producto #' . $detalle->cod_producto) . '. Disponible: ' . $stockFisico],
                    ]);
                }

                $this->inventarioService->registrarMovimiento(
                    codProducto: $detalle->cod_producto,
                    tipo: TipoMovimientoInventarioEnum::SALIDA,
                    cantidad: $detalle->cantidad_dca,
                    motivo: 'Venta web - Pedido #' . $pedidoTienda->cod_pedido,
                    observacion: 'Descuento automático por pago aceptado',
                    codUsuario: auth()->id(),
                );
            }

            $this->reservaService->convertirReservasAPedido($carrito);
        });
    }
}
