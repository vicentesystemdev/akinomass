<?php

namespace Database\Seeders;

use App\Domains\CRM\Plantillas\Enums\TipoPlantillaMensajeEnum;
use App\Models\PlantillaMensaje;
use Illuminate\Database\Seeder;

class PlantillasMensajeSeeder extends Seeder
{
    public function run(): void
    {
        $plantillas = [
            ['nombre_pla' => 'Primer contacto', 'tipo_pla' => TipoPlantillaMensajeEnum::PRIMER_CONTACTO->value, 'contenido_pla' => 'Hola, gracias por contactarte con AKINOMASS. ¿En qué producto te interesa recibir más información?'],
            ['nombre_pla' => 'Seguimiento', 'tipo_pla' => TipoPlantillaMensajeEnum::SEGUIMIENTO->value, 'contenido_pla' => 'Hola, te escribimos para hacer seguimiento a tu consulta. ¿Deseas que te enviemos opciones disponibles?'],
            ['nombre_pla' => 'Confirmación de interés', 'tipo_pla' => TipoPlantillaMensajeEnum::CONFIRMACION_INTERES->value, 'contenido_pla' => 'Perfecto, confirmamos tu interés. ¿Te gustaría que preparemos el pedido con los datos que nos compartiste?'],
            ['nombre_pla' => 'Confirmación de pedido', 'tipo_pla' => TipoPlantillaMensajeEnum::CONFIRMACION_PEDIDO->value, 'contenido_pla' => 'Tu pedido fue registrado correctamente. Te compartimos el detalle para validación final.'],
            ['nombre_pla' => 'Recordatorio de pago', 'tipo_pla' => TipoPlantillaMensajeEnum::RECORDATORIO_PAGO->value, 'contenido_pla' => 'Te recordamos que tu pago está pendiente. Si ya realizaste el pago, por favor comparte el comprobante.'],
            ['nombre_pla' => 'Agradecimiento', 'tipo_pla' => TipoPlantillaMensajeEnum::AGRADECIMIENTO->value, 'contenido_pla' => '¡Gracias por tu compra! Quedamos atentos a cualquier consulta adicional.'],
            ['nombre_pla' => 'Respuesta rápida live', 'tipo_pla' => TipoPlantillaMensajeEnum::RESPUESTA_RAPIDA_LIVE->value, 'contenido_pla' => '¡Gracias por tu interés en el LIVE! Escríbenos tu nombre y producto para ayudarte rápido.'],
        ];

        foreach ($plantillas as $plantilla) {
            PlantillaMensaje::updateOrCreate(
                ['nombre_pla' => $plantilla['nombre_pla'], 'tipo_pla' => $plantilla['tipo_pla']],
                ['contenido_pla' => $plantilla['contenido_pla'], 'activo_pla' => true]
            );
        }
    }
}
