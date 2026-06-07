import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { AlertCircle, ArrowLeft, Clock, Shield, ShoppingCart, X } from 'lucide-react';

function extractFirstError(errors) {
    const first = Object.values(errors || {})[0];
    return Array.isArray(first) ? first[0] : first;
}

export default function Carrito({ carrito, reservas, auth }) {
    const [checkoutError, setCheckoutError] = useState(null);
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const items = carrito?.detalles || [];
    const subtotal = carrito ? Number(carrito.subtotal_car) : 0;
    const total = carrito ? Number(carrito.total_car) : 0;
    const cartCount = items.reduce((sum, d) => sum + d.cantidad_dca, 0);
    const reservaActiva = (reservas?.cantidad_reservas_activas ?? 0) > 0;
    const tiempoReserva = reservaActiva
        ? reservas?.tiempo_restante_formateado
        : `${reservas?.ttl_minutos ?? 20} min`;

    const handleCheckout = () => {
        setCheckoutError(null);
        if (auth?.user) {
            setProcessingCheckout(true);
            router.post('/tienda/checkout', { cod_carrito: carrito.cod_carrito }, {
                preserveScroll: true,
                onError: (errors) => {
                    setCheckoutError(extractFirstError(errors) || 'No se pudo iniciar el checkout. Revisa tu carrito.');
                },
                onFinish: () => setProcessingCheckout(false),
            });
        } else {
            router.visit('/tienda/login');
        }
    };

    const handleUpdateQuantity = (producto, cantidad, codVarianteProducto = null) => {
        if (cantidad <= 0) {
            router.delete(`/tienda/carrito/items/${producto}`, { data: { cod_variante_producto: codVarianteProducto }, preserveScroll: true });
        } else {
            router.patch(`/tienda/carrito/items/${producto}`, { cantidad, cod_variante_producto: codVarianteProducto }, { preserveScroll: true });
        }
    };

    const handleRemove = (producto, codVarianteProducto = null) => {
        router.delete(`/tienda/carrito/items/${producto}`, { data: { cod_variante_producto: codVarianteProducto }, preserveScroll: true });
    };

    return (
        <StorefrontLayout auth={auth}>
            <Head title="Mi Carrito - AKINOMASS" />

            <section className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                <Link
                    href="/tienda/catalogo"
                    className="inline-flex items-center gap-1.5 mb-6 hover:underline"
                    style={{ fontSize: 13, color: '#D77A61', fontWeight: 500, textDecoration: 'none' }}
                >
                    <ArrowLeft size={14} />
                    Seguir comprando
                </Link>

                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#2B221E', marginBottom: 24 }}>
                    Mi Carrito ({cartCount} {cartCount === 1 ? 'producto' : 'productos'})
                </h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: '#FDF6F0' }}>
                            <ShoppingCart size={40} style={{ color: '#D77A61' }} />
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 600, color: '#544a45' }}>Tu carrito está vacío</p>
                        <Link
                            href="/tienda/catalogo"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #D77A61, #c56950)', color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                        >
                            Explorar catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.cod_detalle_carrito}
                                    className="flex gap-4 p-4 rounded-2xl bg-white"
                                    style={{ border: '1px solid rgba(0,0,0,0.07)' }}
                                >
                                    <div className="w-20 h-24 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#F3F4F6' }}>
                                        <ShoppingCart size={24} style={{ color: '#D1D5DB' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: '#2B221E' }}>{item.nombre_producto_dca}</p>
                                                {item.sku_producto_dca && (
                                                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>SKU: {item.sku_producto_dca}</p>
                                                )}
                                                {item.variante?.talla ? (
                                                    <p style={{ fontSize: 12, color: '#D77A61', fontWeight: 600, marginTop: 2 }}>
                                                        Talla: {item.variante.talla.codigo_talla_producto}
                                                    </p>
                                                ) : null}
                                                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>
                                                    Bs. {Number(Number(item.precio_unitario_dca).toFixed(1))} c/u
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.cod_producto, item.cod_variante_producto)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                                                style={{ color: '#D1D5DB', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-sm font-semibold text-gray-500">
                                                Prenda única (Cant: 1)
                                            </div>
                                            <p style={{ fontSize: 16, fontWeight: 800, color: '#D77A61' }}>
                                                Bs. {Number(Number(item.subtotal_dca).toFixed(1))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white" style={{ border: '1px solid rgba(215,122,97,0.22)' }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FDF6F0', color: '#D77A61' }}>
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 800, color: '#2B221E' }}>
                                            Reserva del carrito: {tiempoReserva}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.45 }}>
                                            {reservaActiva
                                                ? `Tiempo configurado: ${reservas.ttl_minutos} min.`
                                                : `Al iniciar el checkout renovaremos la reserva si todavía hay stock.`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {checkoutError && (
                                <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                                    <AlertCircle size={15} style={{ color: '#DC2626', marginTop: 1, flexShrink: 0 }} />
                                    <p style={{ fontSize: 12.5, color: '#991B1B', fontWeight: 600, lineHeight: 1.45 }}>{checkoutError}</p>
                                </div>
                            )}

                            <div className="p-5 rounded-2xl bg-white" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2B221E', marginBottom: 14 }}>Resumen del pedido</h3>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal</span>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>Bs. {Number(subtotal.toFixed(1))}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 mt-1" style={{ borderTop: '1px solid #F3F4F6' }}>
                                        <span style={{ fontSize: 15, fontWeight: 800, color: '#2B221E' }}>Total</span>
                                        <span style={{ fontSize: 20, fontWeight: 900, color: '#D77A61' }}>Bs. {Number(total.toFixed(1))}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processingCheckout}
                                    className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                    style={{
                                        background: processingCheckout ? '#9CA3AF' : 'linear-gradient(135deg, #D77A61, #c56950)',
                                        color: 'white',
                                        fontSize: 14,
                                        fontWeight: 700,
                                        border: 'none',
                                        cursor: processingCheckout ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {processingCheckout ? 'Preparando checkout...' : (auth?.user ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar')}
                                </button>

                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <Shield size={11} style={{ color: '#9CA3AF' }} />
                                    <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>Pago seguro y encriptado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </StorefrontLayout>
    );
}
