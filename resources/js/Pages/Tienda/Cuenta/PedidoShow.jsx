import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import CountdownTimer from '@/Components/Tienda/CountdownTimer';
import ComprobanteUpload from '@/Components/Tienda/Checkout/ComprobanteUpload';
import { useInertiaPoll } from '@/hooks/useInertiaPoll';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, CreditCard, FileText, Package, RefreshCw, Upload } from 'lucide-react';

const ESTADO_PEDIDO = {
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

function firstError(errors) {
    const value = Object.values(errors || {})[0];
    return Array.isArray(value) ? value[0] : value;
}

function PaymentActionPanel({ pedidoTienda, pagoTienda, pago, comprobantes }) {
    const acciones = pedidoTienda?.acciones || {};
    const tiempo = pedidoTienda?.tiempo_pago;
    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [processError, setProcessError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const submitResubida = (event) => {
        event.preventDefault();
        setProcessError(null);
        setSuccessMessage(null);

        if (!file) {
            setFileError('Debe adjuntar el nuevo comprobante de pago.');
            return;
        }

        if (!acciones.url_resubir) {
            setProcessError('No hay una ruta disponible para enviar el comprobante.');
            return;
        }

        setProcessing(true);
        router.post(acciones.url_resubir, { comprobante: file }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setFile(null);
                setFileError(null);
                setSuccessMessage('Comprobante enviado. Tu pago vuelve a revisión.');
                router.reload({
                    only: ['pedidoTienda', 'pago', 'pagoTienda', 'comprobantes', 'mensaje_estado', 'puede_resubir_comprobante'],
                    preserveScroll: true,
                    preserveState: true,
                });
            },
            onError: (errors) => {
                if (errors.comprobante) {
                    setFileError(Array.isArray(errors.comprobante) ? errors.comprobante[0] : errors.comprobante);
                }
                setProcessError(firstError(errors) || 'No fue posible subir el comprobante. Intenta nuevamente.');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="p-5 rounded-2xl bg-white mb-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} style={{ color: '#D77A61' }} />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E' }}>Pago</h2>
            </div>

            {tiempo && (
                <div className="flex items-start gap-3 rounded-xl p-3 mb-4" style={{ background: '#FDF6F0', border: '1px solid rgba(215,122,97,0.22)' }}>
                    <Clock size={16} style={{ color: '#D77A61', marginTop: 1, flexShrink: 0 }} />
                    <div>
                        <p style={{ fontSize: 12.5, fontWeight: 800, color: '#2B221E' }}>
                            {tiempo.mensaje}
                        </p>
                        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                            Tiempo configurado: {tiempo.ttl_minutos} min · queda{' '}
                            <CountdownTimer seconds={tiempo.tiempo_restante_segundos} expiredLabel="tiempo expirado" />
                        </p>
                    </div>
                </div>
            )}

            {acciones.puede_continuar_pago && acciones.url_checkout && (
                <div className="rounded-xl p-4" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                    <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5, marginBottom: 12 }}>
                        Este pedido todavía no tiene comprobante registrado. Puedes volver al paso de pago para cargarlo.
                    </p>
                    <Link
                        href={acciones.url_checkout}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5"
                        style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                    >
                        <Upload size={15} />
                        Subir comprobante
                    </Link>
                </div>
            )}

            {acciones.puede_resubir_comprobante && acciones.url_resubir && (
                <form onSubmit={submitResubida} className="space-y-4">
                    <div className="rounded-xl p-3" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
                        <p style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.5 }}>
                            El comprobante necesita corrección. Sube una nueva imagen o PDF para que el equipo lo revise nuevamente.
                        </p>
                    </div>

                    {processError && (
                        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                            <AlertCircle size={15} style={{ color: '#DC2626', marginTop: 1, flexShrink: 0 }} />
                            <p style={{ fontSize: 12.5, color: '#991B1B', fontWeight: 600, lineHeight: 1.45 }}>{processError}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                            <CheckCircle size={15} style={{ color: '#047857', marginTop: 1, flexShrink: 0 }} />
                            <p style={{ fontSize: 12.5, color: '#047857', fontWeight: 600, lineHeight: 1.45 }}>{successMessage}</p>
                        </div>
                    )}

                    <ComprobanteUpload
                        file={file}
                        error={fileError}
                        onChange={(selected, uploadError = null) => {
                            setFile(selected);
                            setFileError(uploadError);
                            setProcessError(null);
                            setSuccessMessage(null);
                        }}
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3"
                        style={{
                            background: processing ? '#9CA3AF' : 'linear-gradient(135deg, #D77A61, #c56950)',
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 800,
                            border: 'none',
                            cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <Upload size={15} />
                        {processing ? 'Enviando...' : 'Enviar comprobante corregido'}
                    </button>
                </form>
            )}

            {!acciones.puede_continuar_pago && !acciones.puede_resubir_comprobante && (
                <div className="space-y-2">
                    {pago ? (
                        <>
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
                        </>
                    ) : (
                        <p style={{ fontSize: 13, color: '#6B7280' }}>No hay acciones de pago disponibles para este pedido.</p>
                    )}
                </div>
            )}

            {pagoTienda && comprobantes?.length > 0 && (
                <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#2B221E', marginBottom: 10 }}>Historial de comprobantes</p>
                    <div className="space-y-2">
                        {comprobantes.map((comprobante) => (
                            <div key={comprobante.cod_comprobante_pago_tienda} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: '#FAFAFA' }}>
                                <span style={{ fontSize: 12, color: '#6B7280' }}>
                                    {new Date(comprobante.subido_en_cpt || comprobante.created_at).toLocaleString('es-BO')}
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#544a45' }}>
                                    {comprobante.estado_cpt}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PedidoShow({
    auth,
    pedidoTienda,
    pedido,
    pago,
    pagoTienda,
    factura,
    mensaje_estado,
    comprobantes = [],
}) {
    const { isRefreshing } = useInertiaPoll(
        ['pedidoTienda', 'pedido', 'pago', 'pagoTienda', 'factura', 'mensaje_estado', 'puede_resubir_comprobante', 'comprobantes'],
        15000,
        true,
    );
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

            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2B221E' }}>
                        {pedido?.numero_pedido_ped || `Pedido #${pedido?.cod_pedido}`}
                    </h1>
                    <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                        {new Date(pedidoTienda?.created_at).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className="px-3 py-1 rounded-lg"
                        style={{ fontSize: 13, fontWeight: 600, background: estado.bg, color: estado.color }}
                    >
                        {estado.label}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ fontSize: 12, color: '#6B7280', background: '#F9FAFB' }}>
                        <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                        Actualizado
                    </span>
                </div>
            </div>

            {mensaje_estado && (
                <div className="flex items-start gap-2 p-4 rounded-2xl mb-4" style={{ background: estado.bg, border: `1px solid ${estado.color}22` }}>
                    <AlertCircle size={16} style={{ color: estado.color, marginTop: 1, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: '#2B221E', fontWeight: 600, lineHeight: 1.5 }}>{mensaje_estado}</p>
                </div>
            )}

            <div className="p-5 rounded-2xl bg-white mb-4" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                    <Package size={16} style={{ color: '#D77A61' }} />
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E' }}>Productos</h2>
                </div>
                <div className="space-y-3">
                    {pedido?.detalles?.map((detalle) => (
                        <div key={detalle.cod_detalle_pedido} className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#2B221E' }}>{detalle.producto?.nombre_pro || `Producto #${detalle.cod_producto}`}</p>
                                {detalle.variante?.talla && <p style={{ fontSize: 12, color: '#D77A61' }}>Talla: {detalle.variante.talla.codigo_talla_producto}</p>}
                                <p style={{ fontSize: 12, color: '#9CA3AF' }}>x{detalle.cantidad_det} · Bs. {Number(detalle.precio_unitario_det).toFixed(2)} c/u</p>
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

            <PaymentActionPanel
                pedidoTienda={pedidoTienda}
                pagoTienda={pagoTienda}
                pago={pago}
                comprobantes={comprobantes}
            />

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
