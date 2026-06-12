<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Producto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ActualizarProductoAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(Producto $producto, array $data): Producto
    {
        $original = $producto->getOriginal();
        $actualizarVariantes = array_key_exists('variantes', $data);
        $variantes = $data['variantes'] ?? [];
        unset($data['variantes']);

        if (isset($data['imagen_pro']) && $data['imagen_pro'] instanceof UploadedFile) {
            $this->eliminarImagenAnterior($producto);
            $data['imagen_pro'] = $this->guardarImagen($data['imagen_pro']);
        }

        return DB::transaction(function () use ($producto, $data, $variantes, $original, $actualizarVariantes): Producto {
            $producto->update($data);

            if ($actualizarVariantes) {
                $variantesConservadas = [];

                foreach ($variantes as $varianteData) {
                    $codVariante = $varianteData['cod_variante_producto'] ?? null;
                    unset($varianteData['cod_variante_producto']);

                    $varianteData['estado_variante_producto'] ??= 'activo';
                    $varianteData['activo_variante_producto'] ??= true;

                    $variante = $codVariante
                        ? $producto->variantes()->where('cod_variante_producto', $codVariante)->firstOrFail()
                        : $producto->variantes()->make();

                    $variante->fill($varianteData);
                    $variante->save();
                    $variantesConservadas[] = $variante->cod_variante_producto;
                }

                $producto->variantes()
                    ->when($variantesConservadas !== [], fn ($query) => $query->whereNotIn('cod_variante_producto', $variantesConservadas))
                    ->delete();
            }

            $this->auditar($producto, $original, $data);

            return $producto->refresh()->load(['inventario', 'variantes.talla']);
        });
    }

    private function guardarImagen(UploadedFile $archivo): string
    {
        $nombre = time().'_'.Str::random(10).'.'.$archivo->getClientOriginalExtension();

        return $archivo->storeAs('productos', $nombre, 'public');
    }

    private function eliminarImagenAnterior(Producto $producto): void
    {
        if ($producto->imagen_pro && Storage::disk('public')->exists($producto->imagen_pro)) {
            Storage::disk('public')->delete($producto->imagen_pro);
        }
    }

    private function auditar(Producto $producto, array $original, array $data): void
    {
        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $changed = array_intersect_key($data, $original);
        $changed = array_filter($changed, fn ($v, $k) => ($original[$k] ?? null) != $v, ARRAY_FILTER_USE_BOTH);

        if (empty($changed)) {
            return;
        }

        $this->auditoriaService->registrarCambios(
            $contexto, 'Catálogo', 'productos', (string) $producto->cod_producto,
            $original, $changed,
        );
    }
}
