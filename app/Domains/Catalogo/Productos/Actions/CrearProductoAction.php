<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Models\Producto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CrearProductoAction
{
    public function execute(array $data): Producto
    {
        if (isset($data['imagen_pro']) && $data['imagen_pro'] instanceof UploadedFile) {
            $data['imagen_pro'] = $this->guardarImagen($data['imagen_pro']);
        }

        return Producto::create($data);
    }

    private function guardarImagen(UploadedFile $archivo): string
    {
        $nombre = time() . '_' . Str::random(10) . '.' . $archivo->getClientOriginalExtension();

        return $archivo->storeAs('productos', $nombre, 'public');
    }
}
