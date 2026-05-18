import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

const metodoLabels = {
    qr: 'QR',
    transferencia: 'Transferencia',
    efectivo: 'Efectivo',
    deposito: 'Depósito',
    otro: 'Otro',
};

export default function Create({ pedidos, metodosPago }) {
    const form = useForm({
        cod_pedido: '',
        metodo_pago_pag: '',
        monto_pag: '',
        referencia_pag: '',
        fecha_pago_pag: new Date().toISOString().split('T')[0],
        observacion_pag: '',
    });

    const submit = () => {
        form.post(route('pagos.store'));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Registrar Pago"
                    subtitle="Registra un nuevo pago asociado a un pedido"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Pagos', href: route('pagos.index') },
                        { label: 'Registrar Pago' },
                    ]}
                />
            }
        >
            <Head title="Registrar Pago" />

            <div className="max-w-2xl mx-auto">
                <FormCard
                    title="Datos del Pago"
                    subtitle="Complete la información del pago"
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                >
                    <FormCard.Section title="Pago">
                        <div>
                            <label className={labelClass}>
                                Pedido <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.cod_pedido ?? ''}
                                onChange={(e) => form.setData('cod_pedido', e.target.value)}
                                className={`${inputClass} ${form.errors.cod_pedido ? 'border-red-500' : ''}`}
                            >
                                <option value="">Seleccionar pedido</option>
                                {pedidos.map((p) => (
                                    <option key={p.cod_pedido} value={p.cod_pedido}>
                                        {p.numero_pedido_ped}
                                    </option>
                                ))}
                            </select>
                            {form.errors.cod_pedido && <p className={errorClass}>{form.errors.cod_pedido}</p>}
                        </div>

                        <FormCard.Row>
                            <div>
                                <label className={labelClass}>
                                    Método de Pago <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.metodo_pago_pag ?? ''}
                                    onChange={(e) => form.setData('metodo_pago_pag', e.target.value)}
                                    className={`${inputClass} ${form.errors.metodo_pago_pag ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar método</option>
                                    {metodosPago.map((m) => (
                                        <option key={m} value={m}>{metodoLabels[m] || m}</option>
                                    ))}
                                </select>
                                {form.errors.metodo_pago_pag && <p className={errorClass}>{form.errors.metodo_pago_pag}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Monto <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Bs</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={form.data.monto_pag ?? ''}
                                        onChange={(e) => form.setData('monto_pag', e.target.value)}
                                        className={`${inputClass} pl-10 ${form.errors.monto_pag ? 'border-red-500' : ''}`}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {form.errors.monto_pag && <p className={errorClass}>{form.errors.monto_pag}</p>}
                            </div>
                        </FormCard.Row>

                        <FormCard.Row>
                            <div>
                                <label className={labelClass}>Referencia</label>
                                <input
                                    type="text"
                                    value={form.data.referencia_pag ?? ''}
                                    onChange={(e) => form.setData('referencia_pag', e.target.value)}
                                    className={`${inputClass} ${form.errors.referencia_pag ? 'border-red-500' : ''}`}
                                    placeholder="Nro. de comprobante, transferencia, etc."
                                />
                                {form.errors.referencia_pag && <p className={errorClass}>{form.errors.referencia_pag}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Fecha de Pago</label>
                                <input
                                    type="date"
                                    value={form.data.fecha_pago_pag ?? ''}
                                    onChange={(e) => form.setData('fecha_pago_pag', e.target.value)}
                                    className={`${inputClass} ${form.errors.fecha_pago_pag ? 'border-red-500' : ''}`}
                                />
                                {form.errors.fecha_pago_pag && <p className={errorClass}>{form.errors.fecha_pago_pag}</p>}
                            </div>
                        </FormCard.Row>
                    </FormCard.Section>

                    <FormCard.Section title="Observaciones">
                        <div>
                            <label className={labelClass}>Observaciones</label>
                            <textarea
                                value={form.data.observacion_pag ?? ''}
                                onChange={(e) => form.setData('observacion_pag', e.target.value)}
                                rows={3}
                                className={`${inputClass} resize-y`}
                                placeholder="Detalles adicionales sobre el pago"
                            />
                        </div>
                    </FormCard.Section>

                    <FormCard.Actions>
                        <Link href={route('pagos.index')}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        <PrimaryActionButton
                            type="submit"
                            loading={form.processing}
                            disabled={form.processing}
                        >
                            Registrar Pago
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
