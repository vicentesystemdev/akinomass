<?php

namespace App\Domains\Tienda\Checkout\Services;

use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Models\Carrito;
use App\Models\CheckoutSesion;
use App\Models\CuentaCliente;

class CheckoutService
{
    public function resolverPorToken(string $token): ?CheckoutSesion
    {
        return CheckoutSesion::with(['cuentaCliente', 'carrito.detalles.variante.talla', 'direccionCliente', 'pedidoTienda.pedido'])
            ->where('token_che', $token)
            ->first();
    }

    public function verificarPertenencia(CheckoutSesion $checkoutSesion, int $userId): bool
    {
        $cuentaCliente = CuentaCliente::where('user_id', $userId)->first();

        if (! $cuentaCliente) {
            return false;
        }

        return $checkoutSesion->cod_cuenta_cliente === $cuentaCliente->cod_cuenta_cliente;
    }

    public function calcularTotales(Carrito $carrito): array
    {
        $carrito->load('detalles');

        $subtotal = $carrito->detalles->sum('subtotal_dca');

        return [
            'subtotal' => $subtotal,
            'descuento' => 0,
            'impuesto' => 0,
            'total' => $subtotal,
        ];
    }

    public function tieneCheckoutActivo(int $codCuentaCliente): bool
    {
        return CheckoutSesion::where('cod_cuenta_cliente', $codCuentaCliente)
            ->whereIn('estado_che', [
                EstadoCheckoutSesionEnum::INICIADO,
                EstadoCheckoutSesionEnum::DATOS_COMPLETADOS,
            ])
            ->exists();
    }
}
