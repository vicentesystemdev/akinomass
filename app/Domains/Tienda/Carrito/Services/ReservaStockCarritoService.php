<?php

namespace App\Domains\Tienda\Carrito\Services;

use App\Domains\Tienda\Carrito\Enums\EstadoReservaStockEnum;
use App\Models\Carrito;
use App\Models\ReservaStockCarrito;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReservaStockCarritoService
{
    public function crearReserva(
        Carrito $carrito,
        int $codDetalleCarrito,
        int $codProducto,
        int $cantidad,
        ?int $codVarianteProducto,
        ?int $userId,
        ?string $sessionId,
        int $ttlMinutos = 20,
    ): ReservaStockCarrito {
        return ReservaStockCarrito::create([
            'cod_carrito' => $carrito->cod_carrito,
            'cod_detalle_carrito' => $codDetalleCarrito,
            'cod_producto' => $codProducto,
            'cod_variante_producto' => $codVarianteProducto,
            'user_id' => $userId,
            'session_id_res' => $sessionId,
            'cantidad_res' => $cantidad,
            'estado_res' => EstadoReservaStockEnum::ACTIVA,
            'expira_en_res' => Carbon::now()->addMinutes($ttlMinutos),
        ]);
    }

    public function actualizarCantidadReserva(
        ReservaStockCarrito $reserva,
        int $nuevaCantidad,
        int $ttlMinutos = 20,
    ): void {
        if ($nuevaCantidad <= 0) {
            $this->liberarReserva($reserva);

            return;
        }

        $reserva->update([
            'cantidad_res' => $nuevaCantidad,
            'expira_en_res' => Carbon::now()->addMinutes($ttlMinutos),
        ]);
    }

    public function liberarReserva(ReservaStockCarrito $reserva): void
    {
        if ($reserva->estado_res === EstadoReservaStockEnum::ACTIVA) {
            $reserva->update([
                'estado_res' => EstadoReservaStockEnum::LIBERADA,
                'liberada_en_res' => Carbon::now(),
            ]);
        }
    }

    public function liberarReservasPorCarrito(Carrito $carrito): void
    {
        ReservaStockCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->update([
                'estado_res' => EstadoReservaStockEnum::LIBERADA,
                'liberada_en_res' => Carbon::now(),
            ]);
    }

    public function cancelarReservasPorCarrito(Carrito $carrito): void
    {
        ReservaStockCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->whereIn('estado_res', [
                EstadoReservaStockEnum::ACTIVA,
            ])
            ->update([
                'estado_res' => EstadoReservaStockEnum::CANCELADA,
                'liberada_en_res' => Carbon::now(),
            ]);
    }

    public function extenderReservasPorCarrito(Carrito $carrito, int $ttlMinutos): void
    {
        ReservaStockCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->update([
                'expira_en_res' => Carbon::now()->addMinutes($ttlMinutos),
            ]);
    }

    public function obtenerReservaPorDetalle(int $codDetalleCarrito): ?ReservaStockCarrito
    {
        return ReservaStockCarrito::where('cod_detalle_carrito', $codDetalleCarrito)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();
    }

    public function obtenerReservaPorCarritoYProducto(int $codCarrito, int $codProducto, ?int $codVarianteProducto = null): ?ReservaStockCarrito
    {
        return ReservaStockCarrito::where('cod_carrito', $codCarrito)
            ->where('cod_producto', $codProducto)
            ->when($codVarianteProducto, fn ($query) => $query->where('cod_variante_producto', $codVarianteProducto), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->first();
    }

    public function sumarReservasActivasPorProducto(int $codProducto, ?int $codVarianteProducto = null): int
    {
        return (int) ReservaStockCarrito::where('cod_producto', $codProducto)
            ->when($codVarianteProducto, fn ($query) => $query->where('cod_variante_producto', $codVarianteProducto), fn ($query) => $query->whereNull('cod_variante_producto'))
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->where('expira_en_res', '>', Carbon::now())
            ->sum('cantidad_res');
    }

    public function expirarReservasVencidas(): int
    {
        return DB::transaction(function () {
            $reservasVencidas = ReservaStockCarrito::where('estado_res', EstadoReservaStockEnum::ACTIVA)
                ->where('expira_en_res', '<=', Carbon::now())
                ->lockForUpdate()
                ->get();

            $contador = 0;

            foreach ($reservasVencidas as $reserva) {
                $reserva->update([
                    'estado_res' => EstadoReservaStockEnum::EXPIRADA,
                    'liberada_en_res' => Carbon::now(),
                ]);
                $contador++;
            }

            return $contador;
        });
    }

    public function convertirReservasAPedido(Carrito $carrito): void
    {
        ReservaStockCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->update([
                'estado_res' => EstadoReservaStockEnum::CONVERTIDA_PEDIDO,
                'confirmada_en_res' => Carbon::now(),
            ]);
    }

    public function reservasActivasPorCarrito(Carrito $carrito): int
    {
        return ReservaStockCarrito::where('cod_carrito', $carrito->cod_carrito)
            ->where('estado_res', EstadoReservaStockEnum::ACTIVA)
            ->where('expira_en_res', '>', Carbon::now())
            ->count();
    }
}
