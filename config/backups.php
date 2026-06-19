<?php

return [

    'disk' => env('BACKUP_DISK', 'local'),

    'path' => 'backups_bd',

    'tables' => [

        'users' => [
            'primary_key' => 'id',
            'timestamps' => false,
        ],

        'clientes' => [
            'primary_key' => 'cod_cliente',
            'timestamps' => true,
        ],

        'leads' => [
            'primary_key' => 'cod_lead',
            'timestamps' => true,
        ],

        'cuentas_cliente' => [
            'primary_key' => 'cod_cuenta_cliente',
            'timestamps' => true,
        ],

        'direcciones_cliente' => [
            'primary_key' => 'cod_direccion_cliente',
            'timestamps' => true,
        ],

        'productos' => [
            'primary_key' => 'cod_producto',
            'timestamps' => true,
        ],

        'categorias_producto' => [
            'primary_key' => 'cod_categoria_producto',
            'timestamps' => true,
        ],

        'variantes_producto' => [
            'primary_key' => 'cod_variante_producto',
            'timestamps' => true,
        ],

        'tallas_producto' => [
            'primary_key' => 'cod_talla_producto',
            'timestamps' => true,
        ],

        'inventarios' => [
            'primary_key' => 'cod_inventario',
            'timestamps' => true,
        ],

        'movimientos_inventario' => [
            'primary_key' => 'cod_movimiento_inventario',
            'timestamps' => true,
        ],

        'pedidos' => [
            'primary_key' => 'cod_pedido',
            'timestamps' => true,
        ],

        'detalles_pedido' => [
            'primary_key' => 'cod_detalle_pedido',
            'timestamps' => true,
        ],

        'pagos' => [
            'primary_key' => 'cod_pago',
            'timestamps' => true,
        ],

        'canales_venta' => [
            'primary_key' => 'cod_canal_venta',
            'timestamps' => false,
        ],

        'tipos_flujo_comercial' => [
            'primary_key' => 'cod_tipo_flujo_comercial',
            'timestamps' => false,
        ],

        'pedidos_tienda' => [
            'primary_key' => 'cod_pedido_tienda',
            'timestamps' => true,
        ],

        'pagos_tienda' => [
            'primary_key' => 'cod_pago_tienda',
            'timestamps' => true,
        ],

        'facturas' => [
            'primary_key' => 'cod_factura',
            'timestamps' => true,
        ],

        'detalles_factura' => [
            'primary_key' => 'cod_detalle_factura',
            'timestamps' => true,
        ],

        'checkout_sesiones' => [
            'primary_key' => 'cod_checkout_sesion',
            'timestamps' => true,
        ],

        'ventas_redes' => [
            'primary_key' => 'cod_venta_red',
            'timestamps' => true,
        ],

        'venta_red_detalles' => [
            'primary_key' => 'cod_venta_red_detalle',
            'timestamps' => true,
        ],

        'sesiones_live' => [
            'primary_key' => 'cod_sesion_live',
            'timestamps' => true,
        ],

        'productos_live' => [
            'primary_key' => 'cod_producto_live',
            'timestamps' => true,
        ],

        'interacciones_live' => [
            'primary_key' => 'cod_interaccion_live',
            'timestamps' => true,
        ],

        'auditoria_sis' => [
            'primary_key' => 'cod_auditoria_sis',
            'timestamps' => false,
        ],

    ],

];
