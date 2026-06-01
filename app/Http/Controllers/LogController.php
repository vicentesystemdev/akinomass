<?php

namespace App\Http\Controllers;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class LogController extends Controller
{
    private const MAX_LINES = 250;
    private const MAX_EVENTS = 80;

    public function index(): Response
    {
        $logs = $this->readLatestLogs();

        return Inertia::render('Logs/Index', [
            'logs' => $logs,
            'summary' => [
                'total' => $logs->count(),
                'errors' => $logs->whereIn('level', ['error', 'critical'])->count(),
                'warnings' => $logs->where('level', 'warning')->count(),
                'info' => $logs->where('level', 'info')->count(),
            ],
            'filters' => [
                'levels' => ['Todos', 'Info', 'Warning', 'Error', 'Critical', 'Debug'],
                'modules' => ['Sistema', 'Autenticacion', 'Dashboard', 'Productos', 'Inventario', 'Pedidos', 'Pagos', 'LiveSales', 'Reportes'],
            ],
        ]);
    }

    private function readLatestLogs(): Collection
    {
        try {
            $logFile = $this->latestLogFile();

            if ($logFile === null) {
                return $this->fallbackLogs();
            }

            $lines = $this->tailFile($logFile, self::MAX_LINES);
            $events = $this->parseLogLines($lines);

            return $events->isNotEmpty() ? $events : $this->fallbackLogs();
        } catch (Throwable) {
            return $this->fallbackLogs();
        }
    }

    private function latestLogFile(): ?string
    {
        $files = collect(File::glob(storage_path('logs/laravel*.log')) ?: [])
            ->filter(fn (string $path): bool => File::isFile($path))
            ->sortByDesc(fn (string $path): int => File::lastModified($path))
            ->values();

        return $files->first();
    }

    /**
     * Lee solo el tramo final del archivo para evitar cargar logs grandes en memoria.
     */
    private function tailFile(string $path, int $maxLines): array
    {
        $file = new \SplFileObject($path, 'r');
        $file->seek(PHP_INT_MAX);

        $lastLine = $file->key();
        $startLine = max(0, $lastLine - $maxLines);
        $lines = [];

        for ($line = $startLine; $line <= $lastLine; $line++) {
            $file->seek($line);
            $content = trim((string) $file->current());

            if ($content !== '') {
                $lines[] = $content;
            }
        }

        return $lines;
    }

    private function parseLogLines(array $lines): Collection
    {
        $events = collect();
        $current = null;

        foreach ($lines as $line) {
            if (preg_match('/^\[(?<date>[^\]]+)\]\s+(?<env>[^.]+)\.(?<level>[A-Z]+):\s+(?<message>.*)$/', $line, $matches)) {
                if ($current !== null) {
                    $events->push($this->normalizeEvent($current, $events->count()));
                }

                $current = [
                    'date' => $matches['date'],
                    'level' => strtolower($matches['level']),
                    'message' => $this->sanitizeText($matches['message']),
                    'context' => '',
                ];

                continue;
            }

            if ($current !== null && ! str_starts_with($line, '#')) {
                $current['context'] .= ' ' . $this->sanitizeText($line);
            }
        }

        if ($current !== null) {
            $events->push($this->normalizeEvent($current, $events->count()));
        }

        return $events
            ->reverse()
            ->take(self::MAX_EVENTS)
            ->values();
    }

    private function normalizeEvent(array $event, int $index): array
    {
        $message = mb_strimwidth($event['message'] ?: 'Evento registrado por Laravel', 0, 260, '...');
        $context = mb_strimwidth(trim($event['context']), 0, 700, '...');

        return [
            'id' => 'log-' . md5($event['date'] . $message . $index),
            'datetime' => $event['date'],
            'level' => $this->normalizeLevel($event['level']),
            'module' => $this->guessModule($message . ' ' . $context),
            'event' => $message,
            'user' => 'Sistema',
            'ip' => '-',
            'action' => 'Revisar',
            'message' => $message,
            'context' => $context ?: 'Sin contexto adicional visible.',
            'source' => 'storage/logs',
        ];
    }

    private function normalizeLevel(string $level): string
    {
        return match (strtolower($level)) {
            'emergency', 'alert', 'critical' => 'critical',
            'error' => 'error',
            'warning' => 'warning',
            'debug' => 'debug',
            default => 'info',
        };
    }

    private function guessModule(string $text): string
    {
        $normalized = strtolower($text);

        return match (true) {
            str_contains($normalized, 'auth'), str_contains($normalized, 'login'), str_contains($normalized, 'password') => 'Autenticacion',
            str_contains($normalized, 'dashboard') => 'Dashboard',
            str_contains($normalized, 'producto'), str_contains($normalized, 'categoria') => 'Productos',
            str_contains($normalized, 'inventario'), str_contains($normalized, 'stock') => 'Inventario',
            str_contains($normalized, 'pedido') => 'Pedidos',
            str_contains($normalized, 'pago'), str_contains($normalized, 'comprobante') => 'Pagos',
            str_contains($normalized, 'live') => 'LiveSales',
            str_contains($normalized, 'reporte') => 'Reportes',
            default => 'Sistema',
        };
    }

    private function sanitizeText(string $text): string
    {
        $patterns = [
            "/(password|passwd|pwd|token|secret|api[_-]?key|authorization|bearer)\s*[:=]\s*[\"']?[^\"',\]\s}]+/i",
            '/(DB_PASSWORD|APP_KEY|AWS_SECRET_ACCESS_KEY|MAIL_PASSWORD)=\S+/i',
            '/Bearer\s+[A-Za-z0-9\-_\.]+/i',
        ];

        return preg_replace($patterns, '$1=[oculto]', $text) ?? $text;
    }

    private function fallbackLogs(): Collection
    {
        // Datos simulados temporalmente hasta conectar una fuente real de logs disponible.
        return collect([
            [
                'id' => 'sample-info',
                'datetime' => now()->subMinutes(8)->format('Y-m-d H:i:s'),
                'level' => 'info',
                'module' => 'Sistema',
                'event' => 'Monitor de logs listo para visualizar eventos recientes.',
                'user' => 'Sistema',
                'ip' => '-',
                'action' => 'Revisar',
                'message' => 'La pantalla de logs esta operativa con datos seguros de presentacion.',
                'context' => 'Sin archivo de log reciente disponible o sin eventos parseables.',
                'source' => 'simulado',
            ],
            [
                'id' => 'sample-warning',
                'datetime' => now()->subMinutes(21)->format('Y-m-d H:i:s'),
                'level' => 'warning',
                'module' => 'Reportes',
                'event' => 'Ejemplo de advertencia tecnica sin datos sensibles.',
                'user' => 'Sistema',
                'ip' => '-',
                'action' => 'Revisar',
                'message' => 'Evento simulado para validar filtros y badges.',
                'context' => 'Este registro se reemplaza automaticamente cuando hay logs reales legibles.',
                'source' => 'simulado',
            ],
        ]);
    }
}
