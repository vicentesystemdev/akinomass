<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Models\Producto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ActualizarProductoAction
{
    public function execute(Producto $producto, array $data): Producto
    {
        if (isset($data['imagen_pro']) && $data['imagen_pro'] instanceof UploadedFile) {
            $this->eliminarImagenAnterior($producto);
            $data['imagen_pro'] = $this->guardarImagen($data['imagen_pro']);
        }

        $producto->update($data);

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
}
