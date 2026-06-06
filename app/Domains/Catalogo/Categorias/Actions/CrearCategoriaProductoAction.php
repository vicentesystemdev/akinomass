<?php

namespace App\Domains\Catalogo\Categorias\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\CategoriaProducto;

class CrearCategoriaProductoAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data): CategoriaProducto
    {
        $categoria = CategoriaProducto::create($data);

        $contexto = RegistrarAuditoriaData::fromRequest(request());
        $this->auditoriaService->registrarInsercion($contexto, 'Catálogo', 'categorias_producto', (string) $categoria->cod_categoria_producto);

        return $categoria;
    }
}
