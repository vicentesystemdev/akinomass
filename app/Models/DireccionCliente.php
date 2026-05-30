<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DireccionCliente extends Model
{
    use HasFactory;

    protected $table = 'direcciones_cliente';
    protected $primaryKey = 'cod_direccion_cliente';

    protected $fillable = [
        'cod_cliente',
        'etiqueta_dir',
        'nombre_destinatario_dir',
        'telefono_dir',
        'direccion_dir',
        'ciudad_dir',
        'departamento_dir',
        'codigo_postal_dir',
        'referencia_dir',
        'documento_nit_dir',
        'razon_social_dir',
        'es_predeterminada_dir',
        'activo_dir',
    ];

    protected $casts = [
        'es_predeterminada_dir' => 'boolean',
        'activo_dir' => 'boolean',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cod_cliente', 'cod_cliente');
    }
}
