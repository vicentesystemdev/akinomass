import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import SectionCard from '@/Components/UI/SectionCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryActionButton from '@/Components/UI/SecondaryActionButton';
import PaymentImageUpload from '@/Components/UI/PaymentImageUpload';
import Badge from '@/Components/Badge';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Clock, CreditCard, RefreshCcw, RotateCcw, Save, ShoppingCart, QrCode, Building2, Wallet } from 'lucide-react';

const defaults = {
    carrito_reserva_minutos: 20,
    checkout_ttl_minutos: 30,
    checkout_pago_pendiente_minutos: 60,
    pago_observado_correccion_minutos: 1440,
    pago_rechazado_resubida_minutos: 1440,
    carrito_permitir_extension: true,
    carrito_max_extensiones: 1,
};

const numericSettings = [
    {
        key: 'carrito_reserva_minutos',
        title: 'Reserva de carrito',
        description: 'Tiempo que el stock queda reservado mientras el cliente decide su compra.',
        min: 5,
        max: 120,
        icon: ShoppingCart,
    },
    {
        key: 'checkout_ttl_minutos',
        title: 'Checkout activo',
        description: 'Tiempo disponible para completar datos y confirmar el pedido.',
        min: 10,
        max: 180,
        icon: Clock,
    },
    {
        key: 'checkout_pago_pendiente_minutos',
        title: 'Pago pendiente',
        description: 'Ventana para subir el comprobante despues de confirmar el pedido.',
        min: 10,
        max: 1440,
        icon: CreditCard,
    },
    {
        key: 'pago_observado_correccion_minutos',
        title: 'Correccion de pago observado',
        description: 'Tiempo para corregir un comprobante observado por administracion.',
        min: 30,
        max: 4320,
        icon: RefreshCcw,
    },
    {
        key: 'pago_rechazado_resubida_minutos',
        title: 'Resubida de pago rechazado',
        description: 'Tiempo para volver a subir comprobante cuando el pago fue rechazado.',
        min: 30,
        max: 4320,
        icon: RotateCcw,
    },
    {
        key: 'carrito_max_extensiones',
        title: 'Extensiones de reserva',
        description: 'Cantidad maxima de extensiones permitidas por carrito.',
        min: 0,
        max: 5,
        suffix: 'veces',
        icon: Clock,
    },
];

const paymentTabs = [
    { id: 'general', label: 'General', icon: Clock },
    { id: 'qr', label: 'QR', icon: QrCode },
    { id: 'transferencia', label: 'Transferencia', icon: Building2 },
    { id: 'deposito', label: 'Depósito', icon: Wallet },
];

const parseBoolean = (value) => value === true || value === 'true' || value === '1' || value === 1;

const toFormValue = (configuraciones, key) => configuraciones?.[key]?.valor ?? defaults[key] ?? '';

function SettingField({ setting, value, error, disabled, onChange }) {
    const Icon = setting.icon;
    const suffix = setting.suffix ?? 'min';

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-terracota-50 text-terracota-600">
                    <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                    <label htmlFor={setting.key} className="block text-sm font-semibold text-cafe-900">
                        {setting.title}
                    </label>
                    <p className="mt-1 text-xs leading-5 text-gray-500">{setting.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                        <input
                            id={setting.key}
                            type="number"
                            min={setting.min}
                            max={setting.max}
                            value={value}
                            disabled={disabled}
                            onChange={(event) => onChange(setting.key, event.target.value)}
                            className="w-28 rounded-lg border-gray-300 text-sm font-semibold text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <span className="text-sm text-gray-500">{suffix}</span>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-gray-400">
                        Rango: {setting.min} - {setting.max} {suffix}
                    </p>
                    {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    );
}

function BooleanSetting({ checked, disabled, onChange, error }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-cafe-900">Permitir extension de reserva</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                        Controla si el cliente puede extender una reserva activa antes de que expire.
                    </p>
                    {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
                </div>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(!checked)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-terracota-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                        checked ? 'bg-terracota-500' : 'bg-gray-300'
                    }`}
                    aria-pressed={checked}
                >
                    <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        </div>
    );
}

function PaymentConfigTab({ method, form, canEdit, processing, fieldErrors }) {
    const prefix = `pago_${method}_`;
    const isQR = method === 'qr';

    const labelMap = {
        qr: 'Código QR',
        transferencia: 'Transferencia Bancaria',
        deposito: 'Depósito Bancario',
    };

    const colorMap = {
        qr: '#3C473A',
        transferencia: '#D77A61',
        deposito: '#059669',
    };

    return (
        <div className="space-y-5">
            <div className="rounded-xl p-4" style={{ background: `${colorMap[method]}08`, border: `1px solid ${colorMap[method]}20` }}>
                <p className="text-sm font-semibold" style={{ color: colorMap[method] }}>
                    Configuración de pago por {labelMap[method]}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    {isQR
                        ? 'Sube el código QR de tu empresa para que los clientes puedan escanearlo y realizar el pago.'
                        : 'Ingresa los datos bancarios donde los clientes realizarán el depósito o transferencia.'}
                </p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-cafe-900 mb-2">
                    {isQR ? 'Código QR' : 'Imagen de datos bancarios'}
                </label>
                <PaymentImageUpload
                    currentImage={form.data[prefix + 'imagen']}
                    error={fieldErrors[prefix + 'imagen']}
                    onChange={(file, error) => {
                        form.setData(prefix + 'imagen', file);
                        if (error) form.clearErrors(prefix + 'imagen');
                    }}
                    disabled={!canEdit || processing}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-cafe-900 mb-1.5">Título</label>
                <input
                    type="text"
                    value={form.data[prefix + 'titulo'] || ''}
                    onChange={(e) => form.setData(prefix + 'titulo', e.target.value)}
                    disabled={!canEdit || processing}
                    className="w-full rounded-lg border-gray-300 text-sm text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50"
                    style={{ padding: '10px 12px' }}
                />
                {fieldErrors[prefix + 'titulo'] && (
                    <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors[prefix + 'titulo']}</p>
                )}
            </div>

            {!isQR && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-semibold text-cafe-900 mb-1.5">Banco</label>
                        <input
                            type="text"
                            value={form.data[prefix + 'banco'] || ''}
                            onChange={(e) => form.setData(prefix + 'banco', e.target.value)}
                            disabled={!canEdit || processing}
                            className="w-full rounded-lg border-gray-300 text-sm text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50"
                            style={{ padding: '10px 12px' }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-cafe-900 mb-1.5">Número de cuenta</label>
                        <input
                            type="text"
                            value={form.data[prefix + 'cuenta'] || ''}
                            onChange={(e) => form.setData(prefix + 'cuenta', e.target.value)}
                            disabled={!canEdit || processing}
                            className="w-full rounded-lg border-gray-300 text-sm text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50"
                            style={{ padding: '10px 12px' }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-cafe-900 mb-1.5">Titular</label>
                        <input
                            type="text"
                            value={form.data[prefix + 'titular'] || ''}
                            onChange={(e) => form.setData(prefix + 'titular', e.target.value)}
                            disabled={!canEdit || processing}
                            className="w-full rounded-lg border-gray-300 text-sm text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50"
                            style={{ padding: '10px 12px' }}
                        />
                    </div>
                    {method === 'transferencia' && (
                        <div>
                            <label className="block text-sm font-semibold text-cafe-900 mb-1.5">CCI</label>
                            <input
                                type="text"
                                value={form.data[prefix + 'cci'] || ''}
                                onChange={(e) => form.setData(prefix + 'cci', e.target.value)}
                                disabled={!canEdit || processing}
                                className="w-full rounded-lg border-gray-300 text-sm text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50"
                                style={{ padding: '10px 12px' }}
                            />
                        </div>
                    )}
                </div>
            )}

            <div>
                <label className="block text-sm font-semibold text-cafe-900 mb-1.5">Instrucciones</label>
                <textarea
                    rows={3}
                    value={form.data[prefix + 'instrucciones'] || ''}
                    onChange={(e) => form.setData(prefix + 'instrucciones', e.target.value)}
                    disabled={!canEdit || processing}
                    className="w-full rounded-lg border-gray-300 text-sm text-cafe-900 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 disabled:bg-gray-50"
                    style={{ padding: '10px 12px', resize: 'vertical' }}
                />
                {fieldErrors[prefix + 'instrucciones'] && (
                    <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors[prefix + 'instrucciones']}</p>
                )}
            </div>
        </div>
    );
}

export default function Configuracion({ configuraciones = {} }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions ?? [];
    const canEdit = permissions.includes('configuracion_tienda.editar');
    const [activeTab, setActiveTab] = useState('general');

    const form = useForm({
        carrito_reserva_minutos: toFormValue(configuraciones, 'carrito_reserva_minutos'),
        checkout_ttl_minutos: toFormValue(configuraciones, 'checkout_ttl_minutos'),
        checkout_pago_pendiente_minutos: toFormValue(configuraciones, 'checkout_pago_pendiente_minutos'),
        pago_observado_correccion_minutos: toFormValue(configuraciones, 'pago_observado_correccion_minutos'),
        pago_rechazado_resubida_minutos: toFormValue(configuraciones, 'pago_rechazado_resubida_minutos'),
        carrito_permitir_extension: parseBoolean(toFormValue(configuraciones, 'carrito_permitir_extension')),
        carrito_max_extensiones: toFormValue(configuraciones, 'carrito_max_extensiones'),
        // QR
        pago_qr_titulo: configuraciones?.pago_qr_titulo?.valor ?? '',
        pago_qr_instrucciones: configuraciones?.pago_qr_instrucciones?.valor ?? '',
        pago_qr_imagen: configuraciones?.pago_qr_imagen?.valor ?? '',
        // Transferencia
        pago_transferencia_banco: configuraciones?.pago_transferencia_banco?.valor ?? '',
        pago_transferencia_cuenta: configuraciones?.pago_transferencia_cuenta?.valor ?? '',
        pago_transferencia_titular: configuraciones?.pago_transferencia_titular?.valor ?? '',
        pago_transferencia_cci: configuraciones?.pago_transferencia_cci?.valor ?? '',
        pago_transferencia_instrucciones: configuraciones?.pago_transferencia_instrucciones?.valor ?? '',
        pago_transferencia_imagen: configuraciones?.pago_transferencia_imagen?.valor ?? '',
        // Depósito
        pago_deposito_banco: configuraciones?.pago_deposito_banco?.valor ?? '',
        pago_deposito_cuenta: configuraciones?.pago_deposito_cuenta?.valor ?? '',
        pago_deposito_titular: configuraciones?.pago_deposito_titular?.valor ?? '',
        pago_deposito_instrucciones: configuraciones?.pago_deposito_instrucciones?.valor ?? '',
        pago_deposito_imagen: configuraciones?.pago_deposito_imagen?.valor ?? '',
    });

    const updateField = (key, value) => {
        form.setData(key, value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = new FormData();

        Object.keys(form.data).forEach((key) => {
            const value = form.data[key];
            if (value instanceof File) {
                payload.append(key, value);
            } else if (value !== null && value !== undefined) {
                payload.append(key, value);
            }
        });

        form.patch(route('configuracion.tienda.actualizar'), {
            data: payload,
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Configuracion de tienda"
                    subtitle="Tiempos, reservas y medios de pago"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Configuracion de tienda' },
                    ]}
                    actions={
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-cafe-700 shadow-sm transition-all duration-200 ease-in-out hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-oliva-500 focus:ring-offset-2"
                        >
                            Volver
                        </Link>
                    }
                />
            }
        >
            <Head title="Configuracion de tienda" />

            <div className="space-y-6">
                <SectionCard
                    title="Estado del modulo"
                    subtitle="Parametros activos para la tienda online"
                    headerActions={
                        <Badge variant={canEdit ? 'green' : 'amber'}>
                            {canEdit ? 'Edicion habilitada' : 'Solo lectura'}
                        </Badge>
                    }
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Carrito</p>
                            <p className="mt-1 text-2xl font-bold text-cafe-900">{form.data.carrito_reserva_minutos} min</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Checkout</p>
                            <p className="mt-1 text-2xl font-bold text-cafe-900">{form.data.checkout_ttl_minutos} min</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pago pendiente</p>
                            <p className="mt-1 text-2xl font-bold text-cafe-900">{form.data.checkout_pago_pendiente_minutos} min</p>
                        </div>
                    </div>
                </SectionCard>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex border-b border-gray-100" style={{ overflowX: 'auto' }}>
                        {paymentTabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap"
                                    style={{
                                        borderBottom: `2px solid ${activeTab === tab.id ? '#D77A61' : 'transparent'}`,
                                        color: activeTab === tab.id ? '#D77A61' : '#6B7280',
                                        background: activeTab === tab.id ? '#FDF5F2' : 'transparent',
                                    }}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            {activeTab === 'general' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        {numericSettings.map((setting) => (
                                            <SettingField
                                                key={setting.key}
                                                setting={setting}
                                                value={form.data[setting.key]}
                                                error={form.errors[setting.key]}
                                                disabled={!canEdit || form.processing}
                                                onChange={updateField}
                                            />
                                        ))}
                                        <BooleanSetting
                                            checked={form.data.carrito_permitir_extension}
                                            error={form.errors.carrito_permitir_extension}
                                            disabled={!canEdit || form.processing}
                                            onChange={(value) => form.setData('carrito_permitir_extension', value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'general' && (
                                <PaymentConfigTab
                                    method={activeTab}
                                    form={form}
                                    canEdit={canEdit}
                                    processing={form.processing}
                                    fieldErrors={form.errors}
                                />
                            )}

                            {form.wasSuccessful && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                                    Configuracion actualizada correctamente.
                                </div>
                            )}

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <SecondaryActionButton
                                    type="button"
                                    disabled={form.processing}
                                    onClick={() => form.reset()}
                                >
                                    Restaurar cambios
                                </SecondaryActionButton>
                                <PrimaryActionButton
                                    type="submit"
                                    loading={form.processing}
                                    disabled={!canEdit || form.processing}
                                    icon={<Save className="h-4 w-4" />}
                                >
                                    Guardar configuracion
                                </PrimaryActionButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
