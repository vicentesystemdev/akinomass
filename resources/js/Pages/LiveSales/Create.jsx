import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create({ canales = [], estados = [] }) {
    const [touched, setTouched] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        titulo_ses: '',
        fecha_inicio_ses: '',
        estado_ses: estados[0] ?? '',
        cod_canal_venta: canales[0]?.cod_canal_venta ?? '',
    });

    const clientErrors = useMemo(() => ({
        titulo_ses: !data.titulo_ses.trim() ? 'El titulo es obligatorio.' : '',
        fecha_inicio_ses: !data.fecha_inicio_ses ? 'Selecciona fecha y hora de inicio.' : '',
        estado_ses: !data.estado_ses ? 'Selecciona un estado.' : '',
        cod_canal_venta: !data.cod_canal_venta ? 'Selecciona un canal.' : '',
    }), [data]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched({ titulo_ses: true, fecha_inicio_ses: true, estado_ses: true, cod_canal_venta: true });
        if (isInvalid) return;
        post(route('live-sales.store'));
    };

    return (
        <LiveLayout title="Nueva sesion LiveSales" subtitle="Prepara una sesion manual para registrar interes y productos durante la venta en vivo.">
            <Head title="Nueva sesion LiveSales" />
            <form onSubmit={submit} className="space-y-5" noValidate>
                <InputField id="titulo_ses" label="Titulo" value={data.titulo_ses} error={(touched.titulo_ses && clientErrors.titulo_ses) || errors.titulo_ses} onChange={(value) => setData('titulo_ses', value)} onBlur={() => setTouched((value) => ({ ...value, titulo_ses: true }))} />
                <InputField id="fecha_inicio_ses" label="Fecha y hora de inicio" type="datetime-local" value={data.fecha_inicio_ses} error={(touched.fecha_inicio_ses && clientErrors.fecha_inicio_ses) || errors.fecha_inicio_ses} onChange={(value) => setData('fecha_inicio_ses', value)} onBlur={() => setTouched((value) => ({ ...value, fecha_inicio_ses: true }))} />
                <SelectField id="estado_ses" label="Estado" value={data.estado_ses} error={(touched.estado_ses && clientErrors.estado_ses) || errors.estado_ses} onChange={(value) => setData('estado_ses', value)} onBlur={() => setTouched((value) => ({ ...value, estado_ses: true }))}>
                    <option value="">Seleccionar estado</option>
                    {estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                </SelectField>
                <SelectField id="cod_canal_venta" label="Canal de venta" value={data.cod_canal_venta} error={(touched.cod_canal_venta && clientErrors.cod_canal_venta) || errors.cod_canal_venta} onChange={(value) => setData('cod_canal_venta', value)} onBlur={() => setTouched((value) => ({ ...value, cod_canal_venta: true }))}>
                    <option value="">Seleccionar canal</option>
                    {canales.map((canal) => <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>{canal.nombre_can}</option>)}
                </SelectField>

                <div className="flex flex-col gap-3 border-t border-akin-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-akin-muted">{isInvalid ? 'Completa los datos obligatorios para guardar.' : 'Listo para guardar.'}</p>
                    <div className="flex gap-3">
                        <Link href={route('live-sales.index')}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryButton disabled={processing || isInvalid}>{processing ? 'Guardando...' : 'Guardar sesion'}</PrimaryButton>
                    </div>
                </div>
            </form>
        </LiveLayout>
    );
}

export function LiveLayout({ title, subtitle, children }) {
    return (
        <DashboardLayout>
            <div className="mx-auto max-w-4xl space-y-6">
                <section className="akin-card p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">LiveSales</p>
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
