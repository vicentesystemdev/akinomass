<?php

namespace Database\Seeders;

use App\Models\TallaProducto;
use Illuminate\Database\Seeder;

class TallaProductoSeeder extends Seeder
{
    public function run(): void
    {
        $tallas = [
            ['codigo' => 'XS', 'nombre' => 'Extra pequeña', 'tipo' => 'ropa', 'orden' => 10],
            ['codigo' => 'S', 'nombre' => 'Pequeña', 'tipo' => 'ropa', 'orden' => 20],
            ['codigo' => 'M', 'nombre' => 'Mediana', 'tipo' => 'ropa', 'orden' => 30],
            ['codigo' => 'L', 'nombre' => 'Grande', 'tipo' => 'ropa', 'orden' => 40],
            ['codigo' => 'XL', 'nombre' => 'Extra grande', 'tipo' => 'ropa', 'orden' => 50],
            ['codigo' => 'XXL', 'nombre' => 'Doble extra grande', 'tipo' => 'ropa', 'orden' => 60],
            ['codigo' => '28', 'nombre' => 'Talla 28', 'tipo' => 'pantalon', 'orden' => 110],
            ['codigo' => '30', 'nombre' => 'Talla 30', 'tipo' => 'pantalon', 'orden' => 120],
            ['codigo' => '32', 'nombre' => 'Talla 32', 'tipo' => 'pantalon', 'orden' => 130],
            ['codigo' => '34', 'nombre' => 'Talla 34', 'tipo' => 'pantalon', 'orden' => 140],
            ['codigo' => '36', 'nombre' => 'Talla 36', 'tipo' => 'pantalon', 'orden' => 150],
            ['codigo' => '38', 'nombre' => 'Talla 38', 'tipo' => 'pantalon', 'orden' => 160],
            ['codigo' => '40', 'nombre' => 'Talla 40', 'tipo' => 'pantalon', 'orden' => 170],
            ['codigo' => 'UNICA', 'nombre' => 'Única', 'tipo' => 'general', 'orden' => 1000],
        ];

        foreach ($tallas as $talla) {
            TallaProducto::updateOrCreate(
                ['codigo_talla_producto' => $talla['codigo']],
                [
                    'nom_talla_producto' => $talla['nombre'],
                    'tipo_talla_producto' => $talla['tipo'],
                    'orden_talla_producto' => $talla['orden'],
                    'activo_talla_producto' => true,
                ],
            );
        }
    }
}
