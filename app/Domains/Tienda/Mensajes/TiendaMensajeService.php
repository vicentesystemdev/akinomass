<?php

namespace App\Domains\Tienda\Mensajes;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use Illuminate\Support\Carbon;

class TiendaMensajeService
{
    private static array $mensajesPedido = [];

    private static function mensajes(): array
    {
        if (empty(self::$mensajesPedido)) {
            self::$mensajesPedido = [
                EstadoPedidoTiendaEnum::PENDIENTE_REVISION->value => 'Tu pedido está pendiente de revisión.',
                EstadoPedidoTiendaEnum::ACEPTADO->value => 'Tu pedido fue aceptado. Estamos revisando tu pago.',
                EstadoPedidoTiendaEnum::RECHAZADO->value => 'Tu pedido fue rechazado.',
                EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO->value => 'Tu pago está pendiente de validación.',
                EstadoPedidoTiendaEnum::PAGO_OBSERVADO->value => 'Tu comprobante fue observado. Por favor revisa los comentarios.',
                EstadoPedidoTiendaEnum::PAGO_RECHAZADO->value => 'Tu pago fue rechazado. Puedes subir un nuevo comprobante.',
                EstadoPedidoTiendaEnum::CONFIRMADO->value => 'Tu pago fue aceptado y tu pedido confirmado.',
                EstadoPedidoTiendaEnum::FACTURADO->value => 'Tu comprobante interno está disponible.',
                EstadoPedidoTiendaEnum::PENDIENTE_PAGO->value => 'Tu pedido está pendiente de pago.',
                EstadoPedidoTiendaEnum::EXPIRADO->value => 'Tu pedido expiró. Por favor crea uno nuevo.',
                EstadoPedidoTiendaEnum::CANCELADO->value => 'Tu pedido fue cancelado.',
            ];
        }

        return self::$mensajesPedido;
    }

    public function obtenerMensajePedido(EstadoPedidoTiendaEnum $estado): string
    {
        return self::mensajes()[$estado->value] ?? 'Estado desconocido.';
    }

    public function puedeResubirComprobante(EstadoPedidoTiendaEnum $estadoPedido, EstadoPagoEnum|string|null $estadoPago): bool
    {
        if (in_array($estadoPedido, [
            EstadoPedidoTiendaEnum::CONFIRMADO,
            EstadoPedidoTiendaEnum::FACTURADO,
            EstadoPedidoTiendaEnum::CANCELADO,
            EstadoPedidoTiendaEnum::EXPIRADO,
        ])) {
            return false;
        }

        $valorPago = $estadoPago instanceof EstadoPagoEnum ? $estadoPago->value : $estadoPago;

        if (in_array($valorPago, ['pagado'])) {
            return false;
        }

        return in_array($valorPago, ['observado', 'rechazado', 'pendiente']);
    }

    public function obtenerTiempoRestanteMinutos(Carbon $expiraEn): int
    {
        $ahora = now();
        if ($expiraEn->lte($ahora)) {
            return 0;
        }

        return (int) $ahora->diffInMinutes($expiraEn, false);
    }

    public function obtenerTiempoRestanteSegundos(Carbon $expiraEn): int
    {
        $ahora = now();
        if ($expiraEn->lte($ahora)) {
            return 0;
        }

        return (int) $ahora->diffInSeconds($expiraEn, false);
    }

    public function formatearTiempoRestante(int $segundos): string
    {
        if ($segundos <= 0) {
            return 'Expirado';
        }

        $minutos = (int) ($segundos / 60);
        $segundosRestantes = $segundos % 60;

        if ($minutos > 0) {
            return "{$minutos}m {$segundosRestantes}s";
        }

        return "{$segundosRestantes}s";
    }
}
