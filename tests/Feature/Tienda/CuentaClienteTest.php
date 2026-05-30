<?php

namespace Tests\Feature\Tienda;

use App\Domains\Tienda\Cuenta\Actions\CrearCuentaClienteAction;
use App\Domains\Tienda\Cuenta\Actions\CrearDireccionClienteAction;
use App\Domains\Tienda\Cuenta\DTOs\CrearCuentaClienteData;
use App\Domains\Tienda\Cuenta\DTOs\DireccionClienteData;
use App\Domains\Tienda\Cuenta\Enums\EstadoCuentaClienteEnum;
use App\Models\CanalVenta;
use App\Models\Cliente;
use App\Models\CuentaCliente;
use App\Models\DireccionCliente;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use RuntimeException;

class CuentaClienteTest extends TiendaTestCase
{
    private User $user;

    private CanalVenta $canal;

    private TipoFlujoComercial $flujo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->canal = CanalVenta::first();
        $this->flujo = TipoFlujoComercial::first();

        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
    }

    public function test_crear_cuenta_cliente_crea_cliente_y_cuenta(): void
    {
        $action = new CrearCuentaClienteAction();

        $data = CrearCuentaClienteData::fromArray([
            'user_id' => $this->user->id,
            'nombre_cli' => 'Test User',
            'telefono_cli' => '70000000',
            'correo_cli' => 'test@example.com',
            'cod_canal_venta' => $this->canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->flujo->cod_tipo_flujo_comercial,
        ]);

        $cuenta = $action->execute($data);

        $this->assertInstanceOf(CuentaCliente::class, $cuenta);
        $this->assertEquals($this->user->id, $cuenta->user_id);
        $this->assertEquals(EstadoCuentaClienteEnum::ACTIVA->value, $cuenta->estado_cue);
        $this->assertNotNull($cuenta->fecha_activacion_cue);

        $this->assertDatabaseHas('clientes', [
            'correo_cli' => 'test@example.com',
            'nombre_cli' => 'Test User',
        ]);

        $this->assertDatabaseHas('cuentas_cliente', [
            'user_id' => $this->user->id,
            'cod_cliente' => $cuenta->cod_cliente,
        ]);
    }

    public function test_crear_cuenta_duplicada_user_id_falla(): void
    {
        $action = new CrearCuentaClienteAction();

        $data = CrearCuentaClienteData::fromArray([
            'user_id' => $this->user->id,
            'nombre_cli' => 'Test User',
            'telefono_cli' => null,
            'correo_cli' => 'test@example.com',
            'cod_canal_venta' => $this->canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->flujo->cod_tipo_flujo_comercial,
        ]);

        $action->execute($data);

        $this->expectException(RuntimeException::class);

        $action->execute($data);
    }

    public function test_crear_direccion_cliente(): void
    {
        $cliente = Cliente::create([
            'nombre_cli' => 'Test',
            'correo_cli' => 'test@test.com',
            'estado_cli' => 'activo',
            'cod_canal_venta' => $this->canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->flujo->cod_tipo_flujo_comercial,
        ]);

        $action = new CrearDireccionClienteAction();

        $data = DireccionClienteData::fromArray([
            'etiqueta_dir' => 'Casa',
            'nombre_destinatario_dir' => 'Juan Pérez',
            'telefono_dir' => '70000000',
            'direccion_dir' => 'Av. Principal 123',
            'ciudad_dir' => 'La Paz',
            'departamento_dir' => 'La Paz',
            'codigo_postal_dir' => null,
            'referencia_dir' => 'Frente al parque',
            'documento_nit_dir' => '1234567',
            'razon_social_dir' => null,
            'es_predeterminada_dir' => true,
        ]);

        $direccion = $action->execute($cliente->cod_cliente, $data);

        $this->assertInstanceOf(DireccionCliente::class, $direccion);
        $this->assertEquals($cliente->cod_cliente, $direccion->cod_cliente);
        $this->assertTrue($direccion->es_predeterminada_dir);
        $this->assertTrue($direccion->activo_dir);

        $this->assertDatabaseHas('direcciones_cliente', [
            'cod_cliente' => $cliente->cod_cliente,
            'etiqueta_dir' => 'Casa',
            'direccion_dir' => 'Av. Principal 123',
        ]);
    }

    public function test_solo_una_direccion_predeterminada_por_cliente(): void
    {
        $cliente = Cliente::create([
            'nombre_cli' => 'Test',
            'correo_cli' => 'test@test.com',
            'estado_cli' => 'activo',
            'cod_canal_venta' => $this->canal->cod_canal_venta,
            'cod_tipo_flujo_comercial' => $this->flujo->cod_tipo_flujo_comercial,
        ]);

        $action = new CrearDireccionClienteAction();

        $data1 = DireccionClienteData::fromArray([
            'etiqueta_dir' => 'Casa',
            'nombre_destinatario_dir' => 'Juan',
            'direccion_dir' => 'Dir 1',
            'es_predeterminada_dir' => true,
        ]);

        $dir1 = $action->execute($cliente->cod_cliente, $data1);
        $this->assertTrue($dir1->es_predeterminada_dir);

        $data2 = DireccionClienteData::fromArray([
            'etiqueta_dir' => 'Oficina',
            'nombre_destinatario_dir' => 'Juan',
            'direccion_dir' => 'Dir 2',
            'es_predeterminada_dir' => true,
        ]);

        $dir2 = $action->execute($cliente->cod_cliente, $data2);

        $dir1->refresh();
        $this->assertFalse($dir1->es_predeterminada_dir);
        $this->assertTrue($dir2->es_predeterminada_dir);
    }
}
