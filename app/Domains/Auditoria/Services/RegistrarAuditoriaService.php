<?php

namespace App\Domains\Auditoria\Services;

use App\Domains\Auditoria\DTOs\RegistrarAuditoriaData;
use App\Models\AuditoriaSis;
use Illuminate\Support\Str;

class RegistrarAuditoriaService
{
    public function registrar(RegistrarAuditoriaData $data): void
    {
        AuditoriaSis::create($data->toArray());
    }

    public function registrarCambios(
        RegistrarAuditoriaData $contexto,
        string $modulo,
        string $tabla,
        string $idRegistro,
        array $original,
        array $changed,
        ?string $submodulo = null,
        ?string $idEvento = null,
    ): void {
        foreach ($changed as $campo => $nuevoValor) {
            $valorAnterior = $original[$campo] ?? null;

            if ($valorAnterior == $nuevoValor) {
                continue;
            }

            $data = $contexto->withAuditData(
                modulo: $modulo,
                submodulo: $submodulo,
                tabla: $tabla,
                idRegistro: $idRegistro,
                accion: 'update',
                accionFuncional: 'Actualización',
                descripcion: $this->generarDescripcionCambio($tabla, $idRegistro, $campo, $valorAnterior, $nuevoValor),
                campo: $campo,
                valorAnterior: is_scalar($valorAnterior) ? (string) $valorAnterior : json_encode($valorAnterior),
                valorNuevo: is_scalar($nuevoValor) ? (string) $nuevoValor : json_encode($nuevoValor),
                idEvento: $idEvento,
            );

            AuditoriaSis::create($data->toArray());
        }
    }

    public function registrarInsercion(
        RegistrarAuditoriaData $contexto,
        string $modulo,
        string $tabla,
        string $idRegistro,
        ?string $submodulo = null,
        ?string $idEvento = null,
        ?string $descripcion = null,
    ): void {
        $data = $contexto->withAuditData(
            modulo: $modulo,
            submodulo: $submodulo,
            tabla: $tabla,
            idRegistro: $idRegistro,
            accion: 'insert',
            accionFuncional: 'Creación',
            descripcion: $descripcion ?? "Se creó un registro en {$tabla} con ID {$idRegistro}.",
            idEvento: $idEvento,
        );

        AuditoriaSis::create($data->toArray());
    }

    public function registrarAccion(
        RegistrarAuditoriaData $contexto,
        string $modulo,
        string $tabla,
        string $idRegistro,
        string $accion,
        ?string $submodulo = null,
        ?string $idEvento = null,
        ?string $accionFuncional = null,
        ?string $descripcion = null,
        ?string $campo = null,
        ?string $valorAnterior = null,
        ?string $valorNuevo = null,
    ): void {
        $data = $contexto->withAuditData(
            modulo: $modulo,
            submodulo: $submodulo,
            tabla: $tabla,
            idRegistro: $idRegistro,
            accion: $accion,
            accionFuncional: $accionFuncional,
            descripcion: $descripcion,
            campo: $campo,
            valorAnterior: $valorAnterior,
            valorNuevo: $valorNuevo,
            idEvento: $idEvento,
        );

        AuditoriaSis::create($data->toArray());
    }

    private function generarDescripcionCambio(string $tabla, string $idRegistro, string $campo, $anterior, $nuevo): string
    {
        $nombreTabla = $this->nombreLegibleTabla($tabla);

        return sprintf(
            'Se modificó el campo "%s" en %s #%s: de "%s" a "%s".',
            $campo,
            $nombreTabla,
            $idRegistro,
            is_scalar($anterior) ? (string) $anterior : '[...]',
            is_scalar($nuevo) ? (string) $nuevo : '[...]',
        );
    }

    private function nombreLegibleTabla(string $tabla): string
    {
        return match ($tabla) {
            'productos' => 'Producto',
            'clientes' => 'Cliente',
            'pedidos' => 'Pedido',
            'pagos' => 'Pago',
            'inventarios' => 'Inventario',
            'movimientos_inventario' => 'Movimiento de inventario',
            'leads' => 'Lead',
            'categorias_producto' => 'Categoría',
            'plantillas_mensaje' => 'Plantilla',
            'sesiones_live' => 'Sesión Live',
            'productos_live' => 'Producto Live',
            'interacciones_live' => 'Interacción Live',
            'checkout_sesiones' => 'Checkout',
            'pedidos_tienda' => 'Pedido Tienda',
            'pagos_tienda' => 'Pago Tienda',
            'facturas' => 'Factura',
            'detalles_factura' => 'Detalle Factura',
            'users' => 'Usuario',
            'cuentas_cliente' => 'Cuenta Cliente',
            'direcciones_cliente' => 'Dirección',
            'carritos' => 'Carrito',
            'detalles_carrito' => 'Detalle Carrito',
            default => Str::title(str_replace('_', ' ', $tabla)),
        };
    }
}
