import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ canales, estados }) {
    const form = useForm({
        titulo_ses: '',
        fecha_inicio_ses: '',
        fecha_fin_ses: '',
        estado_ses: estados?.[0] || 'programada',
        cod_canal_venta: '',
        resumen_ses: '',
    });

    const submit = () => {
        form.post(route('live-sales.store'));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    const estadoLabels = {
        programada: 'Programada',
        en_vivo: 'En Vivo',
        finalizada: 'Finalizada',
        cancelada: 'Cancelada',
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Nueva Sesión Live"
                    subtitle="Programa una nueva sesión de venta en vivo"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Live Sales', href: route('live-sales.index') },
                        { label: 'Nueva Sesión' },
                    ]}
                />
            }
        >
            <Head title="Nueva Sesión Live" />

            <div className="max-w-2xl mx-auto">
                <FormCard
                    title="Datos de la Sesión"
                    subtitle="Complete la información de la sesión de venta en vivo"
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                >
                    <div>
                        <label className={labelClass}>
                            Título <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.data.titulo_ses ?? ''}
                            onChange={(e) => form.setData('titulo_ses', e.target.value)}
                            className={`${inputClass} ${form.errors.titulo_ses ? 'border-red-500' : ''}`}
                            placeholder="Ej: LIVE TikTok - Colección Verano 2026"
                            required
                        />
                        {form.errors.titulo_ses && <p className={errorClass}>{form.errors.titulo_ses}</p>}
                    </div>

                    <FormCard.Row>
                        <div>
                            <label className={labelClass}>
                                Fecha y Hora de Inicio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={form.data.fecha_inicio_ses ?? ''}
                                onChange={(e) => form.setData('fecha_inicio_ses', e.target.value)}
                                className={`${inputClass} ${form.errors.fecha_inicio_ses ? 'border-red-500' : ''}`}
                                required
                            />
                            {form.errors.fecha_inicio_ses && <p className={errorClass}>{form.errors.fecha_inicio_ses}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Fecha y Hora de Fin</label>
                            <input
                                type="datetime-local"
                                value={form.data.fecha_fin_ses ?? ''}
                                onChange={(e) => form.setData('fecha_fin_ses', e.target.value)}
                                className={`${inputClass} ${form.errors.fecha_fin_ses ? 'border-red-500' : ''}`}
                            />
                            {form.errors.fecha_fin_ses && <p className={errorClass}>{form.errors.fecha_fin_ses}</p>}
                        </div>
                    </FormCard.Row>

                    <FormCard.Row>
                        <div>
                            <label className={labelClass}>
                                Canal de Venta <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.cod_canal_venta ?? ''}
                                onChange={(e) => form.setData('cod_canal_venta', e.target.value)}
                                className={`${inputClass} ${form.errors.cod_canal_venta ? 'border-red-500' : ''}`}
                            >
                                <option value="">Seleccionar canal</option>
                                {canales.map((c) => (
                                    <option key={c.cod_canal_venta} value={c.cod_canal_venta}>{c.nombre_can}</option>
                                ))}
                            </select>
                            {form.errors.cod_canal_venta && <p className={errorClass}>{form.errors.cod_canal_venta}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.estado_ses ?? ''}
                                onChange={(e) => form.setData('estado_ses', e.target.value)}
                                className={`${inputClass} ${form.errors.estado_ses ? 'border-red-500' : ''}`}
                            >
                                {estados.map((e) => (
                                    <option key={e} value={e}>{estadoLabels[e] || e}</option>
                                ))}
                            </select>
                            {form.errors.estado_ses && <p className={errorClass}>{form.errors.estado_ses}</p>}
                        </div>
                    </FormCard.Row>

                    <div>
                        <label className={labelClass}>Resumen</label>
                        <textarea
                            value={form.data.resumen_ses ?? ''}
                            onChange={(e) => form.setData('resumen_ses', e.target.value)}
                            rows={3}
                            className={`${inputClass} resize-y`}
                            placeholder="Resumen o notas sobre la sesión"
                        />
                    </div>

                    <FormCard.Actions>
                        <Link href={route('live-sales.index')}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        <PrimaryActionButton
                            type="submit"
                            loading={form.processing}
                            disabled={form.processing}
                        >
                            Crear Sesión
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
