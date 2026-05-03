<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaProducto extends Model
{
    use HasFactory;

    protected $table = 'categorias_producto';

    protected $primaryKey = 'cod_categoria_producto';

    protected $fillable = [
        'nombre_cat',
        'descripcion_cat',
        'activo_cat',
    ];

    protected $casts = [
        'activo_cat' => 'boolean',
    ];

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'cod_categoria_producto', 'cod_categoria_producto');
    }
}
