import { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import CountdownTimer from '@/Components/Tienda/CountdownTimer';
import ProgressStepper from '@/Components/Tienda/Checkout/ProgressStepper';
import CartStep from '@/Components/Tienda/Checkout/CartStep';
import ShippingStep from '@/Components/Tienda/Checkout/ShippingStep';
import PaymentStep from '@/Components/Tienda/Checkout/PaymentStep';
import ConfirmationStep from '@/Components/Tienda/Checkout/ConfirmationStep';
import { AlertCircle, ChevronLeft, Clock, XCircle } from 'lucide-react';

function extractFirstError(errors) {
    const first = Object.values(errors || {})[0];
    return Array.isArray(first) ? first[0] : first;
}

function buildShippingPayload(data) {
    const direccionCompleta = [
        data.direccion_entrega,
        data.ciudad_entrega,
        data.departamento_entrega,
        data.referencia_entrega ? `Ref: ${data.referencia_entrega}` : null,
    ].filter(Boolean).join(', ');

    return {
        email_contacto: data.email_contacto,
        telefono_contacto: data.telefono_contacto,
        direccion_entrega: direccionCompleta,
        documento_facturacion: data.documento_facturacion,
        razon_social: data.razon_social,
    };
}

export default function CheckoutIndex({ checkout, pedido: pedidoProp, auth }) {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('transferencia');
    const [shippingData, setShippingData] = useState({
        email_contacto: auth?.user?.email || '',
        telefono_contacto: '',
        direccion_entrega: '',
        ciudad_entrega: '',
        departamento_entrega: 'La Paz',
        referencia_entrega: '',
        documento_facturacion: '',
        razon_social: '',
    });
    const [paymentData, setPaymentData] = useState({
        referencia_pago: '',
        comprobante: null,
    });
    const [comprobanteError, setComprobanteError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [pedido, setPedido] = useState(pedidoProp || null);
    const [processing, setProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const token = checkout?.token_che;
    const checkoutEstado = checkout?.estado_che;
    const tiempoCheckout = checkout?.tiempo_checkout;
    const reservas = checkout?.reservas;

    useEffect(() => {
        if (pedidoProp) {
            setPedido(pedidoProp);
            if (
                checkoutEstado === 'pago_registrado'
                || checkoutEstado === 'pago_confirmado'
                || checkoutEstado === 'completado'
            ) {
                setStep(4);
            } else if (checkoutEstado === 'pedido_generado') {
                setStep(3);
            }
        }
    }, [pedidoProp, checkoutEstado]);

    function updateShipping(d) {
        setShippingData((prev) => ({ ...prev, ...d }));
        setServerError(null);
    }

    function updatePayment(d) {
        setPaymentData((prev) => ({ ...prev, ...d }));
        setServerError(null);
        if (d.comprobante) {
            setComprobanteError(null);
        }
    }

    function handleShippingNext() {
        setServerError(null);
        setProcessing(true);
        router.patch(`/tienda/checkout/${token}/datos`, buildShippingPayload(shippingData), {
            preserveScroll: true,
            onSuccess: () => setStep(3),
            onError: (errors) => setServerError(extractFirstError(errors) || 'No se pudieron guardar los datos de entrega.'),
            onFinish: () => setProcessing(false),
        });
    }

    function handlePaymentNext() {
        if (!paymentData.comprobante) {
            setComprobanteError('Debes adjuntar el comprobante de pago para continuar.');
            return;
        }

        setComprobanteError(null);
        setServerError(null);
        setProcessing(true);

        const submitPayment = () => {
            const formData = new FormData();
            formData.append('cod_checkout_sesion', checkout.cod_checkout_sesion);
            formData.append('metodo_pago_pag', paymentMethod);
            if (paymentData.referencia_pago) formData.append('referencia_pag', paymentData.referencia_pago);
            if (paymentData.comprobante) formData.append('comprobante', paymentData.comprobante);

            router.post(`/tienda/checkout/${token}/pago`, formData, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: (pagoPage) => {
                    if (pagoPage.props.pedido) {
                        setPedido(pagoPage.props.pedido);
                    }
                    setStep(4);
                },
                onError: (errors) => {
                    if (errors.comprobante) {
                        setComprobanteError(
                            Array.isArray(errors.comprobante) ? errors.comprobante[0] : errors.comprobante,
                        );
                    }
                    setServerError(extractFirstError(errors) || 'No se pudo registrar el pago.');
                },
                onFinish: () => setProcessing(false),
            });
        };

        if (checkoutEstado === 'pedido_generado' || pedido) {
            submitPayment();
            return;
        }

        router.post(`/tienda/checkout/${token}/generar-pedido`, {
            cod_checkout_sesion: checkout.cod_checkout_sesion,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const pedidoGenerado = page.props.pedido || null;
                setPedido(pedidoGenerado);
                submitPayment();
            },
            onError: (errors) => {
                setServerError(extractFirstError(errors) || 'No se pudo generar el pedido.');
                setProcessing(false);
            },
        });
    }

    function handleCancelCheckout() {
        setCancelling(true);
        router.post(`/tienda/checkout/${token}/cancelar`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/tienda/carrito');
            },
            onError: () => {
                setServerError('No se pudo cancelar el checkout. Intenta de nuevo.');
                setCancelling(false);
                setShowCancelModal(false);
            },
        });
    }

    function handleVolverAlCarrito() {
        router.post(`/tienda/checkout/${token}/volver-carrito`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/tienda/carrito');
            },
            onError: () => {
                setServerError('No se pudo volver al carrito. Intenta de nuevo.');
            },
        });
    }

    return (
        <StorefrontLayout auth={auth}>
            <Head title="Checkout - AKINOMASS" />

            {/* Nav */}
            <div className="bg-white" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between" style={{ height: 48 }}>
                        <button
                            onClick={() => {
                                if (step > 1 && step < 4) {
                                    setStep(step - 1);
                                } else if (step === 1) {
                                    handleVolverAlCarrito();
                                }
                            }}
                            className="flex items-center gap-1.5 hover:text-terracota-500 transition-colors"
                            style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, background: 'none', border: 'none', cursor: step === 4 ? 'default' : 'pointer', visibility: step === 4 ? 'hidden' : 'visible' }}
                        >
                            <ChevronLeft size={16} />
                            {step > 1 ? 'Paso anterior' : 'Volver al carrito'}
                        </button>
                        <div className="flex items-center gap-3">
                            {step < 4 && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="flex items-center gap-1.5 transition-colors"
                                    style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
                                >
                                    <XCircle size={14} />
                                    Cancelar
                                </button>
                            )}
                            <span style={{ fontSize: 12, color: '#6B7280' }}>Pago seguro</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <ProgressStepper current={step} />
            </div>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                {step < 4 && tiempoCheckout && (
                    <div className="mb-5 rounded-2xl bg-white p-4" style={{ border: '1px solid rgba(215,122,97,0.22)' }}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FDF6F0', color: '#D77A61' }}>
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 800, color: '#2B221E' }}>
                                        Checkout activo:{' '}
                                        <CountdownTimer
                                            seconds={tiempoCheckout.tiempo_restante_segundos}
                                            expiredLabel="expirado"
                                            onExpire={() => {
                                                setServerError('El tiempo de checkout ha expirado. Volviendo al carrito...');
                                                setTimeout(() => router.visit('/tienda/carrito'), 2000);
                                            }}
                                        />
                                    </p>
                                    <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                                        Tiempo configurado: {tiempoCheckout.ttl_minutos} min
                                        {reservas?.tiempo_restante_segundos > 0
                                            ? ' · reserva de stock: '
                                            : ''}
                                        {reservas?.tiempo_restante_segundos > 0 && (
                                            <CountdownTimer
                                                seconds={reservas.tiempo_restante_segundos}
                                                expiredLabel="expirada"
                                            />
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {serverError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl mb-5" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                        <AlertCircle size={15} style={{ color: '#DC2626', marginTop: 1, flexShrink: 0 }} />
                        <p style={{ fontSize: 12.5, color: '#991B1B', fontWeight: 600, lineHeight: 1.45 }}>{serverError}</p>
                    </div>
                )}

                {step === 1 && (
                    <CartStep
                        checkout={checkout}
                        onNext={() => setStep(2)}
                        onExpireReserva={() => {
                            setServerError('La reserva de stock ha expirado. Volviendo al carrito...');
                            setTimeout(() => router.visit('/tienda/carrito'), 2000);
                        }}
                    />
                )}
                {step === 2 && (
                    <ShippingStep
                        data={shippingData}
                        onChange={updateShipping}
                        onNext={handleShippingNext}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && (
                    <PaymentStep
                        method={paymentMethod}
                        onMethod={setPaymentMethod}
                        data={paymentData}
                        onChange={updatePayment}
                        onNext={handlePaymentNext}
                        onBack={() => setStep(2)}
                        processing={processing}
                        comprobanteError={comprobanteError}
                        onComprobanteError={setComprobanteError}
                        mediosPago={checkout.medios_pago || {}}
                    />
                )}
                {step === 4 && <ConfirmationStep checkout={checkout} pedido={pedido} />}
            </main>

            {/* Cancel Checkout Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEF2F2' }}>
                                <XCircle size={20} style={{ color: '#DC2626' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2B221E' }}>Cancelar checkout</h3>
                                <p style={{ fontSize: 12.5, color: '#6B7280', marginTop: 2 }}>Esta acción no se puede deshacer</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 13.5, color: '#544a45', lineHeight: 1.55, marginBottom: 20 }}>
                            Si cancelas, se liberarán todos los productos reservados en tu carrito y perderás el progreso de este checkout.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                disabled={cancelling}
                                className="px-4 py-2.5 rounded-xl transition-colors"
                                style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', border: '1px solid #E5E7EB', background: 'white', cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.5 : 1 }}
                            >
                                Continuar comprando
                            </button>
                            <button
                                onClick={handleCancelCheckout}
                                disabled={cancelling}
                                className="px-4 py-2.5 rounded-xl transition-colors"
                                style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#DC2626', border: 'none', cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.7 : 1 }}
                            >
                                {cancelling ? 'Cancelando...' : 'Sí, cancelar checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StorefrontLayout>
    );
}
