<?php

namespace App\Domains\CRM\Leads\Actions;

use App\Domains\CRM\Clientes\Actions\CrearClienteAction;
use App\Domains\CRM\Clientes\Enums\EstadoClienteEnum;
use App\Domains\CRM\Leads\Enums\EstadoLeadEnum;
use App\Models\Cliente;
use App\Models\Lead;
use Illuminate\Support\Facades\DB;

class ConvertirLeadEnClienteAction
{
    public function __construct(private readonly CrearClienteAction $crearClienteAction) {}

    public function execute(Lead $lead): Cliente
    {
        return DB::transaction(function () use ($lead) {
            $cliente = $this->crearClienteAction->execute([
                'nombre_cli' => $lead->nombre_lea,
                'telefono_cli' => $lead->telefono_lea,
                'correo_cli' => $lead->correo_lea,
                'direccion_cli' => null,
                'documento_cli' => null,
                'observacion_cli' => $lead->observacion_lea,
                'estado_cli' => EstadoClienteEnum::ACTIVO->value,
                'cod_canal_venta' => $lead->cod_canal_venta,
                'cod_tipo_flujo_comercial' => $lead->cod_tipo_flujo_comercial,
            ]);

            $lead->update([
                'cod_cliente' => $cliente->cod_cliente,
                'estado_lea' => EstadoLeadEnum::CONVERTIDO->value,
            ]);

            return $cliente;
        });
    }
}
