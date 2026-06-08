<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Domains\Comercial\Pagos\Enums\EstadoPagoEnum;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Domains\Tienda\PagosWeb\Services\PagoTiendaService;
use App\Models\ComprobantePagoTienda;
use App\Models\PagoTienda;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ResubirComprobantePagoTiendaAction
{
    public function __construct(
        private PagoTiendaService $pagoTiendaService,
    ) {}

    public function execute(int $userId, PagoTienda $pagoTienda, UploadedFile $comprobante): ComprobantePagoTienda
    {
        return DB::transaction(function () use ($userId, $pagoTienda, $comprobante) {
            $pago = $pagoTienda->pago;

            if (!$pago) {
                throw ValidationException::withMessages([
                    'pago' => ['No se encontró el pago asociado.'],
                ]);
            }

            $estadosPermitidos = [EstadoPagoEnum::OBSERVADO, EstadoPagoEnum::RECHAZADO];
            if (!in_array($pago->estado_pago_pag, $estadosPermitidos)) {
                throw ValidationException::withMessages([
                    'pago' => ['Solo se puede resubir comprobante si el pago fue observado o rechazado.'],
                ]);
            }

            $pedidoTienda = $pagoTienda->checkoutSesion->pedidoTienda ?? null;
            if ($pedidoTienda) {
                $estadosNoPermitidos = [
                    EstadoPedidoTiendaEnum::CONFIRMADO,
                    EstadoPedidoTiendaEnum::FACTURADO,
                    EstadoPedidoTiendaEnum::CANCELADO,
                    EstadoPedidoTiendaEnum::EXPIRADO,
                    EstadoPedidoTiendaEnum::RECHAZADO,
                ];

                foreach ($estadosNoPermitidos as $estado) {
                    if ($pedidoTienda->estado_pte === $estado) {
                        throw ValidationException::withMessages([
                            'pedido' => ['El pedido no admite resubida de comprobante en su estado actual.'],
                        ]);
                    }
                }
            }

            ComprobantePagoTienda::where('cod_pago_tienda', $pagoTienda->cod_pago_tienda)
                ->where('estado_cpt', 'pendiente')
                ->update(['estado_cpt' => 'reemplazado']);

            $ruta = $this->pagoTiendaService->guardarComprobante($pago->cod_pago, $comprobante);
            $hash = hash_file('sha256', $comprobante->getRealPath());

            $comprobanteRecord = ComprobantePagoTienda::create([
                'cod_pago_tienda' => $pagoTienda->cod_pago_tienda,
                'ruta_comprobante_cpt' => $ruta,
                'hash_comprobante_cpt' => $hash,
                'mime_cpt' => $comprobante->getClientMimeType(),
                'tamano_bytes_cpt' => $comprobante->getSize(),
                'estado_cpt' => 'pendiente',
                'subido_por_user_id' => $userId,
                'subido_en_cpt' => now(),
            ]);

            $pagoTienda->update([
                'comprobante_ruta_pwe' => $ruta,
                'comprobante_hash_pwe' => $hash,
                'fecha_subida_comprobante_pwe' => now(),
            ]);

            $pagoTienda->increment('intentos_pago_pwe');

            $pago->update([
                'estado_pago_pag' => EstadoPagoEnum::PENDIENTE,
                'observacion_pag' => null,
            ]);

            if ($pedidoTienda) {
                $pedidoTienda->update([
                    'estado_pte' => EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO,
                ]);
            }

            return $comprobanteRecord;
        });
    }
}
