<?php

namespace App\Domains\Tienda\Checkout\Actions;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Domains\Auditoria\Services\RegistrarAuditoriaService;
use App\Domains\Tienda\Carrito\Enums\EstadoCarritoEnum;
use App\Domains\Tienda\Carrito\Services\ReservaStockCarritoService;
use App\Domains\Tienda\Checkout\DTOs\IniciarCheckoutData;
use App\Domains\Tienda\Checkout\Enums\EstadoCheckoutSesionEnum;
use App\Domains\Tienda\Checkout\Services\CheckoutService;
use App\Domains\Tienda\Configuracion\Services\ConfiguracionTiendaService;
use App\Models\Carrito;
use App\Models\CheckoutSesion;
use App\Models\CuentaCliente;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class IniciarCheckoutAction
{
    public function __construct(
        private CheckoutService $checkoutService,
        private RegistrarAuditoriaService $auditoriaService,
        private ReservaStockCarritoService $reservaService,
        private ConfiguracionTiendaService $configService,
    ) {}

    public function execute(int $userId, IniciarCheckoutData $data): CheckoutSesion
    {
        return DB::transaction(function () use ($userId, $data) {
            $cuentaCliente = CuentaCliente::where('user_id', $userId)->first();

            if (!$cuentaCliente) {
                throw ValidationException::withMessages([
                    'usuario' => ['No tiene una cuenta de cliente activa.'],
                ]);
            }

            $carrito = Carrito::with('detalles')
                ->where('cod_carrito', $data->codCarrito)
                ->where('estado_car', EstadoCarritoEnum::ACTIVO)
                ->lockForUpdate()
                ->first();

            if (!$carrito) {
                throw ValidationException::withMessages([
                    'carrito' => ['El carrito no está disponible.'],
                ]);
            }

            if ($carrito->detalles()->count() === 0) {
                throw ValidationException::withMessages([
                    'carrito' => ['El carrito está vacío.'],
                ]);
            }

            $reservasActivas = $this->reservaService->reservasActivasPorCarrito($carrito);
            if ($reservasActivas === 0) {
                throw ValidationException::withMessages([
                    'carrito' => ['Las reservas de productos han vencido. Revisa tu carrito.'],
                ]);
            }

            $carrito->update(['estado_car' => EstadoCarritoEnum::EN_CHECKOUT]);

            $this->reservaService->extenderReservasPorCarrito($carrito, $this->configService->obtenerTiempoCheckoutMinutos() + 20);

            $totales = $this->checkoutService->calcularTotales($carrito);

            $checkoutSesion = CheckoutSesion::create([
                'cod_cuenta_cliente' => $cuentaCliente->cod_cuenta_cliente,
                'cod_carrito' => $carrito->cod_carrito,
                'estado_che' => EstadoCheckoutSesionEnum::INICIADO,
                'email_contacto_che' => $cuentaCliente->cliente->correo_cli ?? '',
                'subtotal_che' => $totales['subtotal'],
                'descuento_che' => $totales['descuento'],
                'impuesto_che' => $totales['impuesto'],
                'total_che' => $totales['total'],
                'expira_en_che' => now()->addMinutes($this->configService->obtenerTiempoCheckoutMinutos()),
            ]);

            $contexto = RegistrarAuditoriaData::fromRequest(request());
            $this->auditoriaService->registrarInsercion($contexto, 'Checkout', 'checkout_sesiones', (string) $checkoutSesion->cod_checkout_sesion, submodulo: 'Inicio');

            return $checkoutSesion;
        });
    }
}
