<?php

namespace App\Domains\CRM\Plantillas\Actions;

use App\Models\PlantillaMensaje;

class ActualizarPlantillaMensajeAction
{
    public function execute(PlantillaMensaje $plantillaMensaje, array $data): PlantillaMensaje
    {
        $plantillaMensaje->update($data);

        return $plantillaMensaje->refresh();
    }
}
