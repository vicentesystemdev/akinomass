<?php

namespace App\Domains\Tienda\PagosWeb\Actions;

use App\Domains\Comercial\Pagos\Actions\RegistrarPagoAction;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\PagosWeb\DTOs\RegistrarPagoDesdeCheckoutData;
use App\Domains\Tienda\PagosWeb\Events\PagoWebRegistradoEvent;
use App\Domains\Tienda\PagosWeb\Services\PagoTiendaService;
use App\Domains\Tienda\PedidosWeb\Enums\EstadoPedidoTiendaEnum;
use App\Models\CheckoutSesion;
use App\Models\ComprobantePagoTienda;
use App\Models\PagoTienda;
use App\Models\PedidoTienda;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RegistrarPagoDesdeCheckoutAction
{
    public function __construct(
        private PagoTiendaService $service,
        private RegistrarPagoAction $registrarPagoAction,
    ) {}

    public function execute(int $userId, RegistrarPagoDesdeCheckoutData $data, ?UploadedFile $comprobante = null): PagoTienda
    {
        $checkoutSesion = CheckoutSesion::with(['carrito'])
            ->where('cod_checkout_sesion', $data->codCheckoutSesion)
            ->first();

        if (!$checkoutSesion) {
            throw ValidationException::withMessages([
                'checkout' => ['La sesión de checkout no existe.'],
            ]);
        }

        $pedidoTienda = $this->service->resolverPedidoTienda($data->codCheckoutSesion);

        if (!$pedidoTienda) {
            throw ValidationException::withMessages([
                'pedido' => ['No se ha generado un pedido para esta sesión de checkout.'],
            ]);
        }

        $estadosPermitidosPago = [
            EstadoPedidoTiendaEnum::PENDIENTE_VALIDACION_PAGO,
            EstadoPedidoTiendaEnum::ACEPTADO,
            EstadoPedidoTiendaEnum::PENDIENTE_PAGO,
        ];

        $estadoPermitido = false;
        foreach ($estadosPermitidosPago as $estado) {
            if ($pedidoTienda->estado_pte === $estado) {
                $estadoPermitido = true;
                break;
            }
        }

        if (!$estadoPermitido) {
            throw ValidationException::withMessages([
                'pedido' => ['El pedido no está en un estado que permita registrar pago.'],
            ]);
        }

        return DB::transaction(function () use ($data, $userId, $checkoutSesion, $pedidoTienda, $comprobante) {
            $pago = $this->registrarPagoAction->execute([
                'cod_pedido' => $pedidoTienda->cod_pedido,
                'metodo_pago_pag' => $data->metodoPagoPag,
                'estado_pago_pag' => 'pendiente',
                'monto_pag' => $checkoutSesion->total_che,
                'referencia_pag' => $data->referenciaPag,
                'fecha_pago_pag' => now()->toDateString(),
            ], $userId);

            $comprobanteRuta = null;
            $comprobanteHash = null;
            $fechaSubida = null;

            if ($comprobante) {
                $comprobanteRuta = $this->service->guardarComprobante($pago->cod_pago, $comprobante);
                $comprobanteHash = hash_file('sha256', $comprobante->getRealPath());
                $fechaSubida = now();
            }

            $pagoTienda = PagoTienda::create([
                'cod_pago' => $pago->cod_pago,
                'cod_checkout_sesion' => $data->codCheckoutSesion,
                'user_id' => $userId,
                'comprobante_ruta_pwe' => $comprobanteRuta,
                'comprobante_hash_pwe' => $comprobanteHash,
                'banco_origen_pwe' => $data->bancoOrigen,
                'fecha_subida_comprobante_pwe' => $fechaSubida,
                'intentos_pago_pwe' => 1,
            ]);

            if ($comprobante) {
                ComprobantePagoTienda::create([
                    'cod_pago_tienda' => $pagoTienda->cod_pago_tienda,
                    'ruta_comprobante_cpt' => $comprobanteRuta,
                    'hash_comprobante_cpt' => $comprobanteHash,
                    'mime_cpt' => $comprobante->getClientMimeType(),
                    'tamano_bytes_cpt' => $comprobante->getSize(),
                    'estado_cpt' => 'pendiente',
                    'subido_por_user_id' => $userId,
                    'subido_en_cpt' => $fechaSubida ?? now(),
                ]);
            }

            $checkoutSesion->update([
                'estado_che' => EstadoCheckoutSesionEnum::PAGO_REGISTRADO,
            ]);

            PagoWebRegistradoEvent::dispatch($pagoTienda);

            return $pagoTienda->load('pago');
        });
    }
}
