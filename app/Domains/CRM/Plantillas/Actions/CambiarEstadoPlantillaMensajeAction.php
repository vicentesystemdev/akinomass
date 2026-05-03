<?php

namespace App\Domains\CRM\Plantillas\Actions;

use App\Models\PlantillaMensaje;

class CambiarEstadoPlantillaMensajeAction
{
    public function execute(PlantillaMensaje $plantillaMensaje): PlantillaMensaje
    {
        $plantillaMensaje->update([
            'activo_pla' => ! $plantillaMensaje->activo_pla,
        ]);

        return $plantillaMensaje->refresh();
    }
}
