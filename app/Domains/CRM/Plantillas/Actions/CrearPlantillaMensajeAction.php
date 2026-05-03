<?php

namespace App\Domains\CRM\Plantillas\Actions;

use App\Models\PlantillaMensaje;

class CrearPlantillaMensajeAction
{
    public function execute(array $data): PlantillaMensaje
    {
        $data['activo_pla'] = $data['activo_pla'] ?? true;

        return PlantillaMensaje::create($data);
    }
}
