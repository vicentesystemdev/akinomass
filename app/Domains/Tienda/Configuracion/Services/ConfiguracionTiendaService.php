<?php

namespace App\Domains\Tienda\Configuracion\Services;

use App\Models\ConfiguracionTienda;
use Illuminate\Support\Facades\Cache;

class ConfiguracionTiendaService
{
    private const CACHE_KEY_PREFIX = 'config_tienda:';
    private const CACHE_TTL = 3600;

    public function obtenerEntero(string $clave, int $default = 0): int
    {
        return (int) $this->obtenerValor($clave, (string) $default);
    }

    public function obtenerBooleano(string $clave, bool $default = true): bool
    {
        return filter_var($this->obtenerValor($clave, $default ? 'true' : 'false'), FILTER_VALIDATE_BOOLEAN);
    }

    public function obtenerString(string $clave, string $default = ''): string
    {
        return $this->obtenerValor($clave, $default);
    }

    public function obtenerValor(string $clave, string $default = ''): string
    {
        $cacheKey = self::CACHE_KEY_PREFIX . $clave;

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($clave, $default) {
            $config = ConfiguracionTienda::where('clave_cti', $clave)
                ->where('activo_cti', true)
                ->first();

            return $config ? $config->valor_cti : $default;
        });
    }

    public function actualizarValor(string $clave, string $valor, int $userId): void
    {
        ConfiguracionTienda::updateOrCreate(
            ['clave_cti' => $clave],
            [
                'valor_cti' => $valor,
                'actualizado_por_user_id' => $userId,
            ]
        );

        Cache::forget(self::CACHE_KEY_PREFIX . $clave);
    }

    public function obtenerTodas(): array
    {
        $configs = ConfiguracionTienda::where('activo_cti', true)->get();
        $result = [];

        foreach ($configs as $config) {
            $result[$config->clave_cti] = [
                'valor' => $config->valor_cti,
                'tipo' => $config->tipo_cti,
                'descripcion' => $config->descripcion_cti,
            ];
        }

        return $result;
    }

    public function limpiarCache(): void
    {
        $claves = ConfiguracionTienda::where('activo_cti', true)->pluck('clave_cti');

        foreach ($claves as $clave) {
            Cache::forget(self::CACHE_KEY_PREFIX . $clave);
        }
    }

    public function obtenerTiempoReservaCarritoMinutos(): int
    {
        return $this->obtenerEntero('carrito_reserva_minutos', 20);
    }

    public function obtenerTiempoCheckoutMinutos(): int
    {
        return $this->obtenerEntero('checkout_ttl_minutos', 30);
    }

    public function obtenerTiempoPagoPendienteMinutos(): int
    {
        return $this->obtenerEntero('checkout_pago_pendiente_minutos', 60);
    }

    public function obtenerTiempoCorreccionPagoMinutos(): int
    {
        return $this->obtenerEntero('pago_observado_correccion_minutos', 1440);
    }

    public function obtenerTiempoResubidaPagoRechazadoMinutos(): int
    {
        return $this->obtenerEntero('pago_rechazado_resubida_minutos', 1440);
    }

    public function obtenerPermitirExtensionReserva(): bool
    {
        return $this->obtenerBooleano('carrito_permitir_extension', true);
    }

    public function obtenerMaxExtensionesReserva(): int
    {
        return $this->obtenerEntero('carrito_max_extensiones', 1);
    }

    public function obtenerMediosPago(): array
    {
        return [
            'qr' => [
                'imagen' => $this->obtenerString('pago_qr_imagen'),
                'titulo' => $this->obtenerString('pago_qr_titulo', 'Escanea el código QR'),
                'instrucciones' => $this->obtenerString('pago_qr_instrucciones', 'Realiza el pago escaneando el código QR y adjunta tu comprobante de transferencia.'),
            ],
            'transferencia' => [
                'banco' => $this->obtenerString('pago_transferencia_banco', 'Banco de Crédito BCP'),
                'cuenta' => $this->obtenerString('pago_transferencia_cuenta'),
                'titular' => $this->obtenerString('pago_transferencia_titular'),
                'cci' => $this->obtenerString('pago_transferencia_cci'),
                'imagen' => $this->obtenerString('pago_transferencia_imagen'),
                'instrucciones' => $this->obtenerString('pago_transferencia_instrucciones', 'Realiza la transferencia al número de cuenta indicado y adjunta tu comprobante.'),
            ],
            'deposito' => [
                'banco' => $this->obtenerString('pago_deposito_banco', 'Banco de Crédito BCP'),
                'cuenta' => $this->obtenerString('pago_deposito_cuenta'),
                'titular' => $this->obtenerString('pago_deposito_titular'),
                'imagen' => $this->obtenerString('pago_deposito_imagen'),
                'instrucciones' => $this->obtenerString('pago_deposito_instrucciones', 'Realiza el depósito en ventanilla al número de cuenta indicado y adjunta tu comprobante.'),
            ],
        ];
    }
}
