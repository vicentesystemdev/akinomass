<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\ComprobantePagoTienda;
use App\Models\Pago;
use App\Models\PagoTienda;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RechazarPagoPedidoTiendaAction
{
    public function __construct(
        private RegistrarAuditoriaService $auditoriaService,
    ) {}

    public function execute(Pago $pago, string $motivo): Pago
    {
        return DB::transaction(function () use ($pago, $motivo) {
            $pagoTienda = PagoTienda::where('cod_pago', $pago->cod_pago)->first();

            if (!$pagoTienda) {
                throw ValidationException::withMessages([
                    'pago' => ['El pago no pertenece al flujo de tienda.'],
                ]);
            }

            if ($pago->estado_pago_pag === EstadoPagoEnum::PAGADO) {
                throw ValidationException::withMessages([
                    'pago' => ['No se puede rechazar un pago ya aceptado.'],
                ]);
            }

            if (empty(trim($motivo))) {
                throw ValidationException::withMessages([
                    'motivo' => ['El motivo de rechazo es obligatorio.'],
                ]);
            }

            $pago->update([
                'estado_pago_pag' => EstadoPagoEnum::RECHAZADO,
                'observacion_pag' => $motivo,
            ]);

            $pedidoTienda = $pagoTienda->checkoutSesion->pedidoTienda ?? null;
            if ($pedidoTienda) {
                $pedidoTienda->update([
                    'estado_pte' => EstadoPedidoTiendaEnum::PAGO_RECHAZADO,
                ]);
            }

            ComprobantePagoTienda::where('cod_pago_tienda', $pagoTienda->cod_pago_tienda)
                ->where('estado_cpt', 'pendiente')
                ->update([
                    'estado_cpt' => 'rechazado',
                    'observacion_admin_cpt' => $motivo,
                    'revisado_por_user_id' => auth()->id(),
                    'revisado_en_cpt' => now(),
                ]);

            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $this->auditoriaService->registrarAccion(
                $contexto, 'Pagos Web', 'pagos',
                (string) $pago->cod_pago, 'rechazar_pago',
                submodulo: 'Validación admin',
                accionFuncional: 'Rechazo de pago tienda',
                descripcion: "Pago #{$pago->cod_pago} rechazado. Motivo: {$motivo}",
                campo: 'estado_pago_pag',
                valorAnterior: $pago->getOriginal('estado_pago_pag')?->value,
                valorNuevo: EstadoPagoEnum::RECHAZADO->value,
            );

            return $pago->fresh();
        });
    }
}
