import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import CountdownTimer from '@/Components/Tienda/CountdownTimer';
import { useInertiaPoll } from '@/hooks/useInertiaPoll';
import { Clock, CreditCard, Package, RefreshCw, ChevronRight } from 'lucide-react';

const ESTADO_COLORS = {
    pendiente_revision: { bg: '#FFFBEB', color: '#D97706', label: 'Pendiente de revisión' },
    aceptado: { bg: '#EFF6FF', color: '#2563EB', label: 'Aceptado' },
    rechazado: { bg: '#FEF2F2', color: '#DC2626', label: 'Rechazado' },
    pendiente_pago: { bg: '#FFFBEB', color: '#D97706', label: 'Pendiente de pago' },
    pendiente_validacion_pago: { bg: '#FDF6F0', color: '#D77A61', label: 'Pago en validación' },
    pago_observado: { bg: '#FFFBEB', color: '#B45309', label: 'Pago observado' },
    pago_rechazado: { bg: '#FEF2F2', color: '#DC2626', label: 'Pago rechazado' },
    pagado: { bg: '#ECFDF5', color: '#059669', label: 'Pagado' },
    confirmado: { bg: '#ECFDF5', color: '#047857', label: 'Confirmado' },
    facturado: { bg: '#EFF6FF', color: '#2563EB', label: 'Facturado' },
    cancelado: { bg: '#FEF2F2', color: '#DC2626', label: 'Cancelado' },
    expirado: { bg: '#F3F4F6', color: '#6B7280', label: 'Expirado' },
};

export default function CuentaPedidos({ auth, pedidos }) {
    const { isRefreshing } = useInertiaPoll(['pedidos'], 15000, true);

    return (
        <CustomerLayout auth={auth}>
            <Head title="Mis Pedidos - AKINOMASS" />

            <div className="flex items-center justify-between mb-6">
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2B221E' }}>Mis Pedidos</h1>
                <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: '#9CA3AF' }}>
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                    Estados actualizados
                </div>
            </div>

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
                        const acciones = pedidoTienda.acciones || {};
                        const tiempo = pedidoTienda.tiempo_pago;

                        return (
                            <div
                                key={pedidoTienda.cod_pedido_tienda}
                                className="p-5 rounded-2xl bg-white transition-all"
                                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <Link
                                        href={`/tienda/mis-pedidos/${pedidoTienda.cod_pedido}`}
                                        className="min-w-0 flex-1"
                                        style={{ textDecoration: 'none' }}
                                    >
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
                                        {pedidoTienda.mensaje_estado && (
                                            <p style={{ fontSize: 12.5, color: '#6B7280', marginBottom: 6 }}>
                                                {pedidoTienda.mensaje_estado}
                                            </p>
                                        )}
                                        <p style={{ fontSize: 13, color: '#9CA3AF' }}>
                                            {new Date(pedidoTienda.created_at).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </Link>

                                    <div className="flex flex-col items-start gap-2 md:items-end">
                                        <div className="flex items-center gap-4">
                                            <p style={{ fontSize: 18, fontWeight: 800, color: '#D77A61' }}>
                                                Bs. {pedido ? Number(pedido.total_ped).toFixed(2) : '---'}
                                            </p>
                                            <Link href={`/tienda/mis-pedidos/${pedidoTienda.cod_pedido}`} aria-label="Ver pedido">
                                                <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
                                            </Link>
                                        </div>

                                        {tiempo && (
                                            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: '#FDF6F0', color: '#8A4B3A', fontSize: 12, fontWeight: 700 }}>
                                                <Clock size={13} />
                                                <CountdownTimer seconds={tiempo.tiempo_restante_segundos} expiredLabel="Tiempo expirado" />
                                            </div>
                                        )}

                                        {acciones.puede_continuar_pago && acciones.url_checkout && (
                                            <Link
                                                href={acciones.url_checkout}
                                                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2"
                                                style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                                            >
                                                <CreditCard size={14} />
                                                Completar pago
                                            </Link>
                                        )}
                                        {acciones.puede_resubir_comprobante && (
                                            <Link
                                                href={`/tienda/mis-pedidos/${pedidoTienda.cod_pedido}`}
                                                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2"
                                                style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FCD34D', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                                            >
                                                <CreditCard size={14} />
                                                Corregir comprobante
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </CustomerLayout>
    );
}
