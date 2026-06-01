import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProgressStepper from '@/Components/Tienda/Checkout/ProgressStepper';
import CartStep from '@/Components/Tienda/Checkout/CartStep';
import ShippingStep from '@/Components/Tienda/Checkout/ShippingStep';
import PaymentStep from '@/Components/Tienda/Checkout/PaymentStep';
import ConfirmationStep from '@/Components/Tienda/Checkout/ConfirmationStep';
import { ChevronLeft } from 'lucide-react';

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
    const [pedido, setPedido] = useState(pedidoProp || null);
    const [processing, setProcessing] = useState(false);

    const token = checkout?.token_che;
    const checkoutEstado = checkout?.estado_che;

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
    }

    function updatePayment(d) {
        setPaymentData((prev) => ({ ...prev, ...d }));
        if (d.comprobante) {
            setComprobanteError(null);
        }
    }

    function handleShippingNext() {
        setProcessing(true);
        router.patch(`/tienda/checkout/${token}/datos`, shippingData, {
            preserveScroll: true,
            onSuccess: () => setStep(3),
            onFinish: () => setProcessing(false),
        });
    }

    function handlePaymentNext() {
        if (!paymentData.comprobante) {
            setComprobanteError('Debes adjuntar el comprobante de pago para continuar.');
            return;
        }

        setComprobanteError(null);
        setProcessing(true);

        // PASO 1: Generar el pedido PRIMERO
        router.post(`/tienda/checkout/${token}/generar-pedido`, {
            cod_checkout_sesion: checkout.cod_checkout_sesion,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const pedidoGenerado = page.props.pedido || null;
                setPedido(pedidoGenerado);

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
                    },
                    onFinish: () => setProcessing(false),
                });
            },
            onError: () => setProcessing(false),
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
                            onClick={() => step > 1 && step < 4 ? setStep(step - 1) : router.visit('/tienda/carrito')}
                            className="flex items-center gap-1.5 hover:text-terracota-500 transition-colors"
                            style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, background: 'none', border: 'none', cursor: step === 4 ? 'default' : 'pointer', visibility: step === 4 ? 'hidden' : 'visible' }}
                        >
                            <ChevronLeft size={16} />
                            {step > 1 ? 'Paso anterior' : 'Volver al carrito'}
                        </button>
                        <div className="flex items-center gap-1.5">
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
                {step === 1 && <CartStep checkout={checkout} onNext={() => setStep(2)} />}
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
                    />
                )}
                {step === 4 && <ConfirmationStep checkout={checkout} pedido={pedido} />}
            </main>
        </StorefrontLayout>
    );
}
