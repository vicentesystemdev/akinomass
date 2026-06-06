<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Producto;
use Illuminate\Http\UploadedFile;
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

        if (isset($data['imagen_pro']) && $data['imagen_pro'] instanceof UploadedFile) {
            $this->eliminarImagenAnterior($producto);
            $data['imagen_pro'] = $this->guardarImagen($data['imagen_pro']);
        }

        $producto->update($data);

        $this->auditar($producto, $original, $data);

        return $producto;
    }

    private function guardarImagen(UploadedFile $archivo): string
    {
        $nombre = time() . '_' . Str::random(10) . '.' . $archivo->getClientOriginalExtension();

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
        $changed = array_filter($changed, fn($v, $k) => ($original[$k] ?? null) != $v, ARRAY_FILTER_USE_BOTH);

        if (empty($changed)) {
            return;
        }

        $this->auditoriaService->registrarCambios(
            $contexto, 'Catálogo', 'productos', (string) $producto->cod_producto,
            $original, $changed,
        );
    }
}
