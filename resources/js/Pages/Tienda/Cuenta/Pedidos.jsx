import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Package, ChevronRight } from 'lucide-react';

const ESTADO_COLORS = {
    pendiente_pago: { bg: '#FFFBEB', color: '#D97706', label: 'Pendiente de pago' },
    pagado: { bg: '#ECFDF5', color: '#059669', label: 'Pagado' },
    facturado: { bg: '#EFF6FF', color: '#2563EB', label: 'Facturado' },
    cancelado: { bg: '#FEF2F2', color: '#DC2626', label: 'Cancelado' },
};

export default function CuentaPedidos({ auth, pedidos }) {
    return (
        <CustomerLayout auth={auth}>
            <Head title="Mis Pedidos - AKINOMASS" />

            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2B221E', marginBottom: 24 }}>Mis Pedidos</h1>

            {!pedidos || pedidos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#FDF6F0' }}>
                        <Package size={32} style={{ color: '#D77A61' }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#544a45' }}>No tienes pedidos aún</p>
                    <Link
                        href="/tienda/catalogo"
                        className="px-6 py-3 rounded-xl"
                        style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                        Explorar catálogo
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {pedidos.map((pedidoTienda) => {
                        const pedido = pedidoTienda.pedido;
                        const estado = ESTADO_COLORS[pedidoTienda.estado_pte] || ESTADO_COLORS.pendiente_pago;

                        return (
                            <Link
                                key={pedidoTienda.cod_pedido_tienda}
                                href={`/tienda/mis-pedidos/${pedidoTienda.cod_pedido}`}
                                className="block p-5 rounded-2xl bg-white hover:shadow-md transition-all"
                                style={{ border: '1px solid rgba(0,0,0,0.07)', textDecoration: 'none' }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <p style={{ fontSize: 15, fontWeight: 700, color: '#2B221E' }}>
                                                {pedido?.numero_pedido_ped || `Pedido #${pedidoTienda.cod_pedido}`}
                                            </p>
                                            <span
                                                className="px-2.5 py-0.5 rounded-lg"
                                                style={{ fontSize: 11, fontWeight: 600, background: estado.bg, color: estado.color }}
                                            >
                                                {estado.label}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#9CA3AF' }}>
                                            {new Date(pedidoTienda.created_at).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p style={{ fontSize: 18, fontWeight: 800, color: '#D77A61' }}>
                                            Bs. {pedido ? Number(pedido.total_ped).toFixed(2) : '---'}
                                        </p>
                                        <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </CustomerLayout>
    );
}
