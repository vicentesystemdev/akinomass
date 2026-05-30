import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { ArrowLeft, Package, CreditCard, FileText } from 'lucide-react';

const ESTADO_PEDIDO = {
    pendiente_pago: { bg: '#FFFBEB', color: '#D97706', label: 'Pendiente de pago' },
    pagado: { bg: '#ECFDF5', color: '#059669', label: 'Pagado' },
    facturado: { bg: '#EFF6FF', color: '#2563EB', label: 'Facturado' },
    cancelado: { bg: '#FEF2F2', color: '#DC2626', label: 'Cancelado' },
};

export default function PedidoShow({ auth, pedidoTienda, pedido, pago, factura }) {
    const estado = ESTADO_PEDIDO[pedidoTienda?.estado_pte] || ESTADO_PEDIDO.pendiente_pago;

    return (
        <CustomerLayout auth={auth}>
            <Head title={`Pedido ${pedido?.numero_pedido_ped || ''} - AKINOMASS`} />

            <Link
                href="/tienda/mis-pedidos"
                className="inline-flex items-center gap-1.5 mb-6 hover:underline"
                style={{ fontSize: 13, color: '#D77A61', fontWeight: 500, textDecoration: 'none' }}
            >
                <ArrowLeft size={14} />
                Volver a mis pedidos
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2B221E' }}>
                        {pedido?.numero_pedido_ped || `Pedido #${pedido?.cod_pedido}`}
                    </h1>
                    <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                        {new Date(pedidoTienda?.created_at).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <span
                    className="px-3 py-1 rounded-lg"
                    style={{ fontSize: 13, fontWeight: 600, background: estado.bg, color: estado.color }}
                >
                    {estado.label}
                </span>
            </div>

            {/* Detalles */}
            <div className="p-5 rounded-2xl bg-white mb-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 12 }}>Productos</h2>
                <div className="space-y-3">
                    {pedido?.detalles?.map((detalle) => (
                        <div key={detalle.cod_detalle_pedido} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{detalle.producto?.nombre_pro || `Producto #${detalle.cod_producto}`}</p>
                                <p style={{ fontSize: 12, color: '#9CA3AF' }}>×{detalle.cantidad_det} · Bs. {Number(detalle.precio_unitario_det).toFixed(2)} c/u</p>
                            </div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>Bs. {Number(detalle.subtotal_det).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: '2px solid #F3F4F6' }}>
                    <div className="flex justify-between">
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#2B221E' }}>Total</span>
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#D77A61' }}>Bs. {pedido ? Number(pedido.total_ped).toFixed(2) : '---'}</span>
                    </div>
                </div>
            </div>

            {/* Pago */}
            {pago && (
                <div className="p-5 rounded-2xl bg-white mb-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={16} style={{ color: '#D77A61' }} />
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E' }}>Pago</h2>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between py-1">
                            <span style={{ fontSize: 13, color: '#6B7280' }}>Método</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{pago.metodo_pago_pag}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span style={{ fontSize: 13, color: '#6B7280' }}>Estado</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{pago.estado_pago_pag}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span style={{ fontSize: 13, color: '#6B7280' }}>Monto</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#D77A61' }}>Bs. {Number(pago.monto_pag).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Factura */}
            {factura && (
                <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText size={16} style={{ color: '#3C473A' }} />
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E' }}>Factura</h2>
                        </div>
                        <Link
                            href={`/tienda/mis-pedidos/${pedido.cod_pedido}/factura`}
                            className="px-4 py-2 rounded-xl"
                            style={{ fontSize: 13, fontWeight: 600, color: '#D77A61', border: '1px solid #D77A61', textDecoration: 'none' }}
                        >
                            Ver factura
                        </Link>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
