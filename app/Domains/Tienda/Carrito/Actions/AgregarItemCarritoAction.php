<?php

namespace App\Domains\Tienda\Carrito\Actions;

use App\Domains\Tienda\Carrito\DTOs\AgregarItemCarritoData;
use App\Domains\Tienda\Carrito\Services\CarritoCalculoService;
use App\Domains\Tienda\Carrito\Services\CarritoPersistenciaService;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Carrito\Services\StockDisponibleTiendaService;
use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AgregarItemCarritoAction
{
    public function __construct(
        private CarritoPersistenciaService $persistenciaService,
        private CarritoCalculoService $calculoService,
        private StockDisponibleTiendaService $stockDisponibleService,
        private ReservaStockCarritoService $reservaService,
        private ConfiguracionTiendaService $configService,
    ) {}

    public function execute(Carrito $carrito, AgregarItemCarritoData $data): DetalleCarrito
    {
        return DB::transaction(function () use ($carrito, $data) {
            $producto = Producto::where('cod_producto', $data->codProducto)
                ->where('estado_pro', 'activo')
                ->lockForUpdate()
                ->first();

            if (!$producto) {
                throw ValidationException::withMessages([
                    'cod_producto' => ['El producto no está disponible.'],
                ]);
            }

            $stockDisponible = $this->stockDisponibleService->obtenerStockDisponible($data->codProducto);

            if ($stockDisponible < $data->cantidad) {
                throw ValidationException::withMessages([
                    'cantidad' => ['Stock insuficiente. Disponible: ' . $stockDisponible],
                ]);
            }

            $itemsActuales = $this->persistenciaService->contarItems($carrito);
            if ($itemsActuales >= 50) {
                throw ValidationException::withMessages([
                    'carrito' => ['El carrito ha alcanzado el límite máximo de 50 líneas.'],
                ]);
            }

            $detalle = $this->persistenciaService->agregarDetalle($carrito, [
                'cod_producto' => $data->codProducto,
                'cantidad' => $data->cantidad,
                'precio_unitario' => (float) $producto->precio_venta_pro,
                'nombre_snapshot' => $producto->nombre_pro,
                'sku_snapshot' => $producto->sku_pro,
            ]);

            $cantidadTotal = $detalle->cantidad_dca;

            $reservaExistente = $this->reservaService->obtenerReservaPorDetalle($detalle->cod_detalle_carrito);

            if ($reservaExistente) {
                $this->reservaService->actualizarCantidadReserva($reservaExistente, $cantidadTotal);
            } else {
                $this->reservaService->crearReserva(
                    carrito: $carrito,
                    codDetalleCarrito: $detalle->cod_detalle_carrito,
                    codProducto: $data->codProducto,
                    cantidad: $cantidadTotal,
                    userId: $carrito->user_id,
                    sessionId: $carrito->session_id_car,
                    ttlMinutos: $this->configService->obtenerTiempoReservaCarritoMinutos(),
                );
            }

            $this->calculoService->recalcularSubtotales($carrito);

            return $detalle;
        });
    }
}
