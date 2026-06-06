<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Producto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CrearProductoAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data): Producto
    {
        if (isset($data['imagen_pro']) && $data['imagen_pro'] instanceof UploadedFile) {
            $data['imagen_pro'] = $this->guardarImagen($data['imagen_pro']);
        }

        $producto = Producto::create($data);

        $this->auditar($producto);

        return $producto;
    }

    private function guardarImagen(UploadedFile $archivo): string
    {
        $nombre = time() . '_' . Str::random(10) . '.' . $archivo->getClientOriginalExtension();

        return $archivo->storeAs('productos', $nombre, 'public');
    }

    private function auditar(Producto $producto): void
    {
        $contexto = RegistrarAuditoriaData::fromRequest(request());

        $this->auditoriaService->registrarInsercion(
            $contexto, 'Catálogo', 'productos', (string) $producto->cod_producto,
        );
    }
}
