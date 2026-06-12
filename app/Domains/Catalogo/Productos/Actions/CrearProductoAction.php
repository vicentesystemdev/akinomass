<?php

namespace App\Domains\Catalogo\Productos\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CrearProductoAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(array $data): Producto
    {
        $variantes = $data['variantes'] ?? [];
        unset($data['variantes']);

        if (isset($data['imagen_pro']) && $data['imagen_pro'] instanceof UploadedFile) {
            $data['imagen_pro'] = $this->guardarImagen($data['imagen_pro']);
        }

        $producto = DB::transaction(function () use ($data, $variantes): Producto {
            $producto = Producto::create($data);

            Inventario::firstOrCreate(
                ['cod_producto' => $producto->cod_producto],
                [
                    'stock_actual_inv' => 0,
                    'stock_minimo_inv' => 0,
                    'ubicacion_inv' => 'Almacén 1',
                    'activo_inv' => true,
                ],
            );

            $producto->variantes()->createMany(array_map(
                fn (array $variante): array => [
                    'cod_talla_producto' => $variante['cod_talla_producto'],
                    'sku_variante_producto' => $variante['sku_variante_producto'] ?? null,
                    'precio_venta_variante' => $variante['precio_venta_variante'] ?? null,
                    'estado_variante_producto' => $variante['estado_variante_producto'] ?? 'activo',
                    'activo_variante_producto' => $variante['activo_variante_producto'] ?? true,
                ],
                $variantes,
            ));

            $this->auditar($producto);

            return $producto;
        });

        return $producto->load(['inventario', 'variantes.talla']);
    }

    private function guardarImagen(UploadedFile $archivo): string
    {
        $nombre = time().'_'.Str::random(10).'.'.$archivo->getClientOriginalExtension();

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
