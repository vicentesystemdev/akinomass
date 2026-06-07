<?php

namespace App\Domains\Tienda\PedidosWeb\Services;

use App\Models\CanalVenta;
use App\Models\CuentaCliente;
use App\Models\TipoFlujoComercial;
use Illuminate\Support\Facades\Cache;

class PedidoTiendaService
{
    public function resolverCanalWeb(): int
    {
        return Cache::rememberForever('lookup:canal_web', function () {
            $canal = CanalVenta::where('codigo_can', 'web')->first();
            if (! $canal) {
                throw new \RuntimeException('El canal de venta "web" no existe. Ejecuta: php artisan db:seed --class=CanalesVentaSeeder');
            }

            return $canal->cod_canal_venta;
        });
    }

    public function resolverFlujoCompraWeb(): int
    {
        return Cache::rememberForever('lookup:flujo_compra_web', function () {
            $flujo = TipoFlujoComercial::where('codigo_tip', 'compra_web')->first();
            if (! $flujo) {
                throw new \RuntimeException('El tipo de flujo comercial "compra_web" no existe. Ejecuta: php artisan db:seed --class=TiposFlujoComercialSeeder');
            }

            return $flujo->cod_tipo_flujo_comercial;
        });
    }

    public function resolverCodCliente(int $userId): int
    {
        $cuenta = CuentaCliente::where('user_id', $userId)->first();

        if (! $cuenta) {
            throw new \RuntimeException('El usuario no tiene una cuenta de cliente activa.');
        }

        return $cuenta->cod_cliente;
    }

    public function mapearDetallesCarritoParaPedido($detalles): array
    {
        return $detalles->map(function ($detalle) {
            return [
                'cod_producto' => $detalle->cod_producto,
                'cod_variante_producto' => $detalle->cod_variante_producto,
                'cantidad_det' => $detalle->cantidad_dca,
                'precio_unitario_det' => $detalle->precio_unitario_dca,
            ];
        })->toArray();
    }
}
