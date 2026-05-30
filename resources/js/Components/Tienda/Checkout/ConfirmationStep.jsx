import { Link } from '@inertiajs/react';
import { CheckCircle, Package, Home, FileText, Star } from 'lucide-react';

export default function ConfirmationStep({ checkout, pedido }) {
    const total = checkout ? Number(checkout.total_che) : 0;
    const pedidoData = pedido?.pedido || pedido;
    const numeroPedido = pedidoData?.numero_pedido_ped || `#${pedidoData?.cod_pedido || '---'}`;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div
                className="flex flex-col items-center text-center p-8 rounded-3xl"
                style={{ background: 'linear-gradient(135deg, #f4f5f4, #FDF6F0)', border: '2px solid #D77A61' }}
            >
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)', boxShadow: '0 0 0 8px rgba(60,71,58,0.12)' }}
                >
                    <CheckCircle size={36} color="white" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#2B221E', marginBottom: 8 }}>¡Pedido Confirmado!</h2>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, maxWidth: 380 }}>
                    Tu pedido ha sido recibido correctamente. Te notificaremos cuando validemos tu pago.
                </p>
                {pedido && (
                    <div
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl mt-4"
                        style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}
                    >
                        <Package size={14} color="white" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
                            Pedido {numeroPedido}
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
                <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #3C473A, #4e5849)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>AKINOMASS</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Comprobante de compra</p>
                        </div>
                        <div className="text-right">
                            <p style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>
                                {numeroPedido}
                            </p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>
                                {new Date().toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#2B221E' }}>Total</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#D77A61' }}>Bs. {total.toFixed(2)}</span>
                    </div>

                    <div className="p-4 rounded-2xl" style={{ background: '#FDF6F0', border: '1px solid #D77A61' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#544a45', marginBottom: 12 }}>Estado de tu pedido</p>
                        <div className="flex items-center gap-0">
                            {[
                                { label: 'Recibido', done: true },
                                { label: 'Validando pago', done: false },
                                { label: 'Confirmado', done: false },
                                { label: 'Entregado', done: false },
                            ].map((st, i) => (
                                <div key={st.label} className="flex items-center flex-1 min-w-0">
                                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ background: st.done ? 'linear-gradient(135deg, #059669, #10B981)' : '#E5E7EB' }}
                                        >
                                            {st.done ? (
                                                <CheckCircle size={13} color="white" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                            )}
                                        </div>
                                        <p style={{ fontSize: 10.5, fontWeight: st.done ? 700 : 400, color: st.done ? '#059669' : '#9CA3AF', whiteSpace: 'nowrap' }}>
                                            {st.label}
                                        </p>
                                    </div>
                                    {i < 3 && <div className="flex-1 h-0.5 mx-1 mb-7" style={{ background: '#E5E7EB', minWidth: 12 }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href="/tienda"
                    className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 14, fontWeight: 700, border: 'none', textDecoration: 'none' }}
                >
                    <Home size={15} />
                    Seguir comprando
                </Link>
                <Link
                    href="/tienda/mis-pedidos"
                    className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{ fontSize: 14, fontWeight: 600, color: '#544a45', border: '1.5px solid #E5E7EB', background: 'white', textDecoration: 'none' }}
                >
                    <FileText size={15} />
                    Ver mis pedidos
                </Link>
            </div>
        </div>
    );
}
