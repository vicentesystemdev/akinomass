import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create({ pedidos = [], metodosPago = [] }) {
    const [touched, setTouched] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        cod_pedido: '',
        metodo_pago_pag: '',
        monto_pag: '',
        referencia_pag: '',
        fecha_pago_pag: '',
        observacion_pag: '',
    });

    const clientErrors = useMemo(() => ({
        cod_pedido: !data.cod_pedido ? 'Selecciona un pedido.' : '',
        metodo_pago_pag: !data.metodo_pago_pag ? 'Selecciona un metodo de pago.' : '',
        monto_pag: !data.monto_pag ? 'Ingresa el monto.' : Number(data.monto_pag) <= 0 ? 'El monto debe ser positivo.' : '',
        fecha_pago_pag: !data.fecha_pago_pag ? 'Selecciona la fecha de pago.' : '',
    }), [data]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ cod_pedido: true, metodo_pago_pag: true, monto_pag: true, fecha_pago_pag: true });
        if (isInvalid) return;
        post(route('pagos.store'));
    };

    return (
        <PaymentFormLayout title="Registrar pago" subtitle="Completa la informacion del comprobante recibido.">
            <Head title="Registrar pago" />
            <form className="space-y-5" onSubmit={submit} noValidate>
                <SelectField id="cod_pedido" label="Pedido" value={data.cod_pedido} error={(touched.cod_pedido && clientErrors.cod_pedido) || errors.cod_pedido} onChange={(value) => setData('cod_pedido', value)} onBlur={() => setTouched((value) => ({ ...value, cod_pedido: true }))}>
                    <option value="">Seleccionar pedido</option>
                    {pedidos.map((pedido) => <option key={pedido.cod_pedido} value={pedido.cod_pedido}>{pedido.numero_pedido_ped}</option>)}
                </SelectField>
                <SelectField id="metodo_pago_pag" label="Metodo de pago" value={data.metodo_pago_pag} error={(touched.metodo_pago_pag && clientErrors.metodo_pago_pag) || errors.metodo_pago_pag} onChange={(value) => setData('metodo_pago_pag', value)} onBlur={() => setTouched((value) => ({ ...value, metodo_pago_pag: true }))}>
                    <option value="">Seleccionar metodo</option>
                    {metodosPago.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
                </SelectField>
                <InputField id="monto_pag" label="Monto" type="number" min="0" step="0.01" value={data.monto_pag} error={(touched.monto_pag && clientErrors.monto_pag) || errors.monto_pag} onChange={(value) => setData('monto_pag', value)} onBlur={() => setTouched((value) => ({ ...value, monto_pag: true }))} />
                <InputField id="referencia_pag" label="Referencia" value={data.referencia_pag} error={errors.referencia_pag} onChange={(value) => setData('referencia_pag', value)} />
                <InputField id="fecha_pago_pag" label="Fecha de pago" type="date" value={data.fecha_pago_pag} error={(touched.fecha_pago_pag && clientErrors.fecha_pago_pag) || errors.fecha_pago_pag} onChange={(value) => setData('fecha_pago_pag', value)} onBlur={() => setTouched((value) => ({ ...value, fecha_pago_pag: true }))} />
                <TextAreaField id="observacion_pag" label="Observacion" value={data.observacion_pag} error={errors.observacion_pag} onChange={(value) => setData('observacion_pag', value)} />

                <div className="flex flex-col gap-3 border-t border-akin-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-akin-muted">{isInvalid ? 'Completa pedido, metodo, monto y fecha para guardar.' : 'Listo para registrar.'}</p>
                    <div className="flex gap-3">
                        <Link href={route('pagos.index')}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryButton disabled={processing || isInvalid}>{processing ? 'Guardando...' : 'Guardar pago'}</PrimaryButton>
                    </div>
                </div>
            </form>
        </PaymentFormLayout>
    );
}

export function PaymentFormLayout({ title, subtitle, children }) {
    return (
        <DashboardLayout>
            <div className="mx-auto max-w-4xl space-y-6">
                <section className="akin-card p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Pagos</p>
                    <h1 className="mt-2 text-3xl font-black text-akin-text">{title}</h1>
                    <p className="mt-2 text-sm leading-6 text-akin-muted">{subtitle}</p>
                </section>
                <section className="akin-card p-6">{children}</section>
            </div>
        </DashboardLayout>
    );
}

export function InputField({ id, label, value, error, onChange, onBlur, type = 'text', ...props }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required={Boolean(onBlur)} />
            <input id={id} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined} {...props} />
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export function SelectField({ id, label, value, error, onChange, onBlur, children }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required />
            <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined}>
                {children}
            </select>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export function TextAreaField({ id, label, value, error, onChange }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows="4" className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined} />
            <InputError message={error} className="mt-2" />
        </div>
    );
}
