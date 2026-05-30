<?php

namespace App\Domains\Tienda\Carrito\Services;

use Illuminate\Support\Facades\Redis;

class CarritoRedisService
{
    private const TTL = 172800; // 48 horas
    private const PREFIX = 'carrito:';

    public function obtener(string $sessionId): ?array
    {
        $data = Redis::connection('cart')->get(self::PREFIX . $sessionId);

        return $data ? json_decode($data, true) : null;
    }

    public function guardar(string $sessionId, array $data): void
    {
        $data['actualizado_en'] = now()->toISOString();

        Redis::connection('cart')->setex(
            self::PREFIX . $sessionId,
            self::TTL,
            json_encode($data)
        );
    }

    public function eliminar(string $sessionId): void
    {
        Redis::connection('cart')->del(self::PREFIX . $sessionId);
    }

    public function merge(string $guestSessionId, int $userId): ?array
    {
        $guestData = $this->obtener($guestSessionId);

        if (!$guestData || empty($guestData['items'])) {
            return null;
        }

        $this->eliminar($guestSessionId);

        return $guestData;
    }

    public function existe(string $sessionId): bool
    {
        return Redis::connection('cart')->exists(self::PREFIX . $sessionId);
    }
}
