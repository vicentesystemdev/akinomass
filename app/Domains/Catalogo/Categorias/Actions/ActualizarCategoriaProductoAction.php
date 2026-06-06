<?php

namespace App\Domains\Catalogo\Categorias\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\CategoriaProducto;

class ActualizarCategoriaProductoAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(CategoriaProducto $categoriaProducto, array $data): CategoriaProducto
    {
        $original = $categoriaProducto->getOriginal();
        $categoriaProducto->update($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $changed = array_intersect_key($data, $original);
        $changed = array_filter($changed, fn($v, $k) => ($original[$k] ?? null) != $v, ARRAY_FILTER_USE_BOTH);

        if (!empty($changed)) {
            $this->auditoriaService->registrarCambios(
                $contexto, 'Catálogo', 'categorias_producto', (string) $categoriaProducto->cod_categoria_producto,
                $original, $changed,
            );
        }

        return $categoriaProducto;
    }
}
