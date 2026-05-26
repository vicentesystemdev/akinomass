import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { InputField, PaymentFormLayout, SelectField, TextAreaField } from './Create';

export default function Edit({ pago, metodosPago = [] }) {
    const [touched, setTouched] = useState({});
    const { data, setData, put, processing, errors } = useForm({
        metodo_pago_pag: pago.metodo_pago_pag ?? '',
        monto_pag: pago.monto_pag ?? '',
        referencia_pag: pago.referencia_pag ?? '',
        fecha_pago_pag: pago.fecha_pago_pag?.slice(0, 10) ?? '',
        observacion_pag: pago.observacion_pag ?? '',
    });

    const clientErrors = useMemo(() => ({
        metodo_pago_pag: !data.metodo_pago_pag ? 'Selecciona un metodo de pago.' : '',
        monto_pag: !data.monto_pag ? 'Ingresa el monto.' : Number(data.monto_pag) <= 0 ? 'El monto debe ser positivo.' : '',
        fecha_pago_pag: !data.fecha_pago_pag ? 'Selecciona la fecha de pago.' : '',
    }), [data]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ metodo_pago_pag: true, monto_pag: true, fecha_pago_pag: true });
        if (isInvalid) return;
        put(route('pagos.update', pago.cod_pago));
    };

    return (
        <PaymentFormLayout title={`Editar pago #${pago.cod_pago}`} subtitle="Actualiza los datos visuales del registro sin cambiar el flujo backend.">
            <Head title={`Editar pago #${pago.cod_pago}`} />
            <form className="space-y-5" onSubmit={submit} noValidate>
                <SelectField id="metodo_pago_pag" label="Metodo de pago" value={data.metodo_pago_pag} error={(touched.metodo_pago_pag && clientErrors.metodo_pago_pag) || errors.metodo_pago_pag} onChange={(value) => setData('metodo_pago_pag', value)} onBlur={() => setTouched((value) => ({ ...value, metodo_pago_pag: true }))}>
                    <option value="">Seleccionar metodo</option>
                    {metodosPago.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
                </SelectField>
                <InputField id="monto_pag" label="Monto" type="number" min="0" step="0.01" value={data.monto_pag} error={(touched.monto_pag && clientErrors.monto_pag) || errors.monto_pag} onChange={(value) => setData('monto_pag', value)} onBlur={() => setTouched((value) => ({ ...value, monto_pag: true }))} />
                <InputField id="referencia_pag" label="Referencia" value={data.referencia_pag} error={errors.referencia_pag} onChange={(value) => setData('referencia_pag', value)} />
                <InputField id="fecha_pago_pag" label="Fecha de pago" type="date" value={data.fecha_pago_pag} error={(touched.fecha_pago_pag && clientErrors.fecha_pago_pag) || errors.fecha_pago_pag} onChange={(value) => setData('fecha_pago_pag', value)} onBlur={() => setTouched((value) => ({ ...value, fecha_pago_pag: true }))} />
                <TextAreaField id="observacion_pag" label="Observacion" value={data.observacion_pag} error={errors.observacion_pag} onChange={(value) => setData('observacion_pag', value)} />

                <div className="flex flex-col gap-3 border-t border-akin-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-akin-muted">{isInvalid ? 'Completa metodo, monto y fecha para actualizar.' : 'Listo para actualizar.'}</p>
                    <div className="flex gap-3">
                        <Link href={route('pagos.show', pago.cod_pago)}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryButton disabled={processing || isInvalid}>{processing ? 'Actualizando...' : 'Actualizar pago'}</PrimaryButton>
                    </div>
                </div>
            </form>
        </PaymentFormLayout>
    );
}
