<?php

namespace App\Support\Cache;

use Illuminate\Support\Facades\Cache;

class CacheService
{
  /**
   * Obtiene un valor desde cache.
   * Si no existe, ejecuta el callback, guarda el resultado y lo retorna.
   */
  public function remember(string $key, callable $callback, int $ttl = 300): mixed
  {
    return Cache::remember($key, $ttl, $callback);
  }

  /**
   * Guarda un valor en cache por un tiempo determinado.
   */
  public function put(string $key, mixed $value, int $ttl = 300): bool
  {
    return Cache::put($key, $value, $ttl);
  }

  /**
   * Obtiene un valor directamente desde cache.
   */
  public function get(string $key, mixed $default = null): mixed
  {
    return Cache::get($key, $default);
  }

  /**
   * Elimina una clave específica de cache.
   */
  public function forget(string $key): bool
  {
    return Cache::forget($key);
  }

  /**
   * Limpia toda la cache configurada.
   * Usar con cuidado.
   */
  public function clear(): bool
  {
    return Cache::flush();
  }

  /**
   * Verifica si una clave existe en cache.
   */
  public function has(string $key): bool
  {
    return Cache::has($key);
  }
}
