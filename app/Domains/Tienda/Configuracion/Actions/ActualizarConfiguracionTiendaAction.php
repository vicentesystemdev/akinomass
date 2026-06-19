<?php

namespace App\Domains\Tienda\Configuracion\Actions;

use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ActualizarConfiguracionTiendaAction
{
    private const IMAGE_KEYS = [
        'pago_qr_imagen',
        'pago_transferencia_imagen',
        'pago_deposito_imagen',
    ];

    public function __construct(
        private ConfiguracionTiendaService $configService,
    ) {}

    public function execute(int $userId, array $valores): void
    {
        DB::transaction(function () use ($userId, $valores) {
            foreach ($valores as $clave => $valor) {
                if (!in_array($clave, self::IMAGE_KEYS)) {
                    if (!is_null($valor)) {
                        $this->configService->actualizarValor(
                            clave: $clave,
                            valor: is_bool($valor) ? ($valor ? 'true' : 'false') : (string) $valor,
                            userId: $userId,
                        );
                    }
                    continue;
                }

                if ($valor instanceof UploadedFile) {
                    $this->eliminarImagenAnterior($clave);
                    $this->asegurarDirectorio();
                    $ruta = $this->guardarImagen($clave, $valor);
                    $this->configService->actualizarValor(
                        clave: $clave,
                        valor: $ruta,
                        userId: $userId,
                    );
                } elseif (is_null($valor) && array_key_exists($clave, $valores)) {
                    $this->eliminarImagenAnterior($clave);
                    $this->configService->actualizarValor(
                        clave: $clave,
                        valor: '',
                        userId: $userId,
                    );
                }
            }
        });
    }

    private function eliminarImagenAnterior(string $clave): void
    {
        $rutaActual = $this->configService->obtenerString($clave);

        if ($rutaActual !== '' && Storage::disk('public')->exists($rutaActual)) {
            Storage::disk('public')->delete($rutaActual);
        }
    }

    private function asegurarDirectorio(): void
    {
        if (!Storage::disk('public')->exists('medios_pago')) {
            Storage::disk('public')->makeDirectory('medios_pago');
        }
    }

    private function guardarImagen(string $clave, UploadedFile $archivo): string
    {
        $nombre = $clave . '_' . time() . '_' . Str::random(8) . '.' . $archivo->getClientOriginalExtension();

        return $archivo->storeAs('medios_pago', $nombre, 'public');
    }
}
