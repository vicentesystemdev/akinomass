<?php

namespace Database\Seeders;

use App\Domains\Comercial\Pedidos\Enums\EstadoPedidoEnum;
use App\Models\CanalVenta;
use App\Models\CategoriaProducto;
use App\Models\Cliente;
use App\Models\ConfiguracionInteligenciaVentas;
use App\Models\DetallePedido;
use App\Models\Inventario;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\TipoFlujoComercial;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class InteligenciaVentasDemoSeeder extends Seeder
{
    public function run(): void
    {
        ConfiguracionInteligenciaVentas::firstOrCreate(['activo' => true]);

        $whatsapp = CanalVenta::firstOrCreate(
            ['codigo_can' => 'iv_demo_whatsapp'],
            ['nombre_can' => 'WhatsApp Demo IV', 'descripcion_can' => 'Canal demo para inteligencia de ventas', 'activo_can' => true],
        );
        $instagram = CanalVenta::firstOrCreate(
            ['codigo_can' => 'iv_demo_instagram'],
            ['nombre_can' => 'Instagram Demo IV', 'descripcion_can' => 'Canal demo para inteligencia de ventas', 'activo_can' => true],
        );

        $flujo = TipoFlujoComercial::firstOrCreate(
            ['codigo_tip' => 'iv_demo_redes'],
            ['nombre_tip' => 'Redes Sociales Demo IV', 'activo_tip' => true],
        );

        $cliente = Cliente::firstOrCreate(
            ['correo_cli' => 'cliente.iv.demo@akinomass.test'],
            [
                'nombre_cli' => 'Cliente Demo Inteligencia Ventas',
                'telefono_cli' => '70000001',
                'estado_cli' => 'activo',
                'cod_canal_venta' => $whatsapp->cod_canal_venta,
                'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
            ],
        );

        $usuario = User::first();
        $categorias = [
            'abrigos' => CategoriaProducto::firstOrCreate(['nombre_cat' => 'IV Demo Abrigos'], ['activo_cat' => true]),
            'poleras' => CategoriaProducto::firstOrCreate(['nombre_cat' => 'IV Demo Poleras'], ['activo_cat' => true]),
            'vestidos' => CategoriaProducto::firstOrCreate(['nombre_cat' => 'IV Demo Vestidos'], ['activo_cat' => true]),
            'accesorios' => CategoriaProducto::firstOrCreate(['nombre_cat' => 'IV Demo Accesorios'], ['activo_cat' => true]),
        ];

        $productos = [
            ['sku' => 'IV-DEMO-ABRIGO-ALTA', 'nombre' => 'IV Demo Abrigo Lana Alta Rotacion', 'categoria' => 'abrigos', 'precio' => 260, 'stock' => 2, 'ventas' => [4, 7, 11, 17], 'canal' => $whatsapp],
            ['sku' => 'IV-DEMO-POLERA-MEDIA', 'nombre' => 'IV Demo Polera Basica Media', 'categoria' => 'poleras', 'precio' => 80, 'stock' => 14, 'ventas' => [8, 9, 8, 9], 'canal' => $instagram],
            ['sku' => 'IV-DEMO-VESTIDO-BAJA', 'nombre' => 'IV Demo Vestido Verano Baja', 'categoria' => 'vestidos', 'precio' => 180, 'stock' => 18, 'ventas' => [6, 4, 2, 1], 'canal' => $instagram],
            ['sku' => 'IV-DEMO-ACCESORIO-REL', 'nombre' => 'IV Demo Bufanda Relativa Fuerte', 'categoria' => 'accesorios', 'precio' => 55, 'stock' => 1, 'ventas' => [1, 2, 3, 5], 'canal' => $whatsapp],
        ];

        $secuenciaPedido = 1;

        foreach ($productos as $config) {
            $producto = Producto::firstOrCreate(
                ['sku_pro' => $config['sku']],
                [
                    'cod_categoria_producto' => $categorias[$config['categoria']]->cod_categoria_producto,
                    'nombre_pro' => $config['nombre'],
                    'descripcion_pro' => 'Producto demo no destructivo para Inteligencia de Ventas.',
                    'precio_venta_pro' => $config['precio'],
                    'precio_costo_pro' => $config['precio'] * 0.55,
                    'estado_pro' => 'activo',
                ],
            );

            Inventario::updateOrCreate(
                ['cod_producto' => $producto->cod_producto, 'cod_variante_producto' => null],
                ['stock_actual_inv' => $config['stock'], 'stock_minimo_inv' => 1, 'ubicacion_inv' => 'IV-DEMO', 'activo_inv' => true],
            );

            foreach ($config['ventas'] as $indice => $cantidad) {
                $fecha = Carbon::now()->subMonths(3 - $indice)->day(10)->toDateString();
                $numero = sprintf('IVD-%s-%03d', Carbon::parse($fecha)->format('ymd'), $secuenciaPedido++);

                $pedido = Pedido::firstOrCreate(
                    ['numero_pedido_ped' => $numero],
                    [
                        'cod_cliente' => $cliente->cod_cliente,
                        'cod_canal_venta' => $config['canal']->cod_canal_venta,
                        'cod_tipo_flujo_comercial' => $flujo->cod_tipo_flujo_comercial,
                        'cod_usuario_responsable' => $usuario?->id,
                        'fecha_pedido_ped' => $fecha,
                        'estado_ped' => EstadoPedidoEnum::CONFIRMADO->value,
                        'subtotal_ped' => $cantidad * $config['precio'],
                        'descuento_ped' => 0,
                        'total_ped' => $cantidad * $config['precio'],
                        'observacion_ped' => 'Pedido historico demo para Inteligencia de Ventas.',
                    ],
                );

                DetallePedido::firstOrCreate(
                    ['cod_pedido' => $pedido->cod_pedido, 'cod_producto' => $producto->cod_producto],
                    ['cantidad_det' => $cantidad, 'precio_unitario_det' => $config['precio'], 'subtotal_det' => $cantidad * $config['precio']],
                );
            }
        }
    }
}
