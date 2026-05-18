import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

const tipoLabels = {
    primer_contacto: 'Primer Contacto',
    seguimiento: 'Seguimiento',
    confirmacion_interes: 'Confirmación de Interés',
    confirmacion_pedido: 'Confirmación de Pedido',
    recordatorio_pago: 'Recordatorio de Pago',
    agradecimiento: 'Agradecimiento',
    cliente_inactivo: 'Cliente Inactivo',
    stock_disponible: 'Stock Disponible',
    respuesta_rapida_live: 'Respuesta Rápida Live',
};

export default function Edit({ plantilla, tipos }) {
    const form = useForm({
        nombre_pla: plantilla?.nombre_pla ?? '',
        tipo_pla: plantilla?.tipo_pla ?? '',
        contenido_pla: plantilla?.contenido_pla ?? '',
        activo_pla: plantilla?.activo_pla ?? true,
    });

    const submit = () => {
        form.put(route('plantillas-mensaje.update', plantilla.cod_plantilla_mensaje));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Editar Plantilla"
                    subtitle={`Modifique la plantilla "${plantilla.nombre_pla}"`}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Plantillas', href: route('plantillas-mensaje.index') },
                        { label: plantilla.nombre_pla },
                    ]}
                />
            }
        >
            <Head title="Editar Plantilla" />

            <div className="max-w-3xl mx-auto">
                <FormCard
                    title="Datos de la Plantilla"
                    subtitle="Modifique la información de la plantilla"
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                >
                    <FormCard.Section title="Información General">
                        <div>
                            <label className={labelClass}>
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre_pla"
                                value={form.data.nombre_pla ?? ''}
                                onChange={(e) => form.setData('nombre_pla', e.target.value)}
                                className={`${inputClass} ${form.errors.nombre_pla ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="Ej: Bienvenida nuevo cliente"
                                required
                            />
                            {form.errors.nombre_pla && (
                                <p className={errorClass}>{form.errors.nombre_pla}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>
                                Tipo <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="tipo_pla"
                                value={form.data.tipo_pla ?? ''}
                                onChange={(e) => form.setData('tipo_pla', e.target.value)}
                                className={`${inputClass} ${form.errors.tipo_pla ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            >
                                {tipos.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipoLabels[tipo] || tipo}
                                    </option>
                                ))}
                            </select>
                            {form.errors.tipo_pla && (
                                <p className={errorClass}>{form.errors.tipo_pla}</p>
                            )}
                        </div>
                    </FormCard.Section>

                    <FormCard.Section title="Contenido del Mensaje">
                        <div>
                            <label className={labelClass}>
                                Contenido <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="contenido_pla"
                                value={form.data.contenido_pla ?? ''}
                                onChange={(e) => form.setData('contenido_pla', e.target.value)}
                                rows={8}
                                className={`${inputClass} resize-y ${form.errors.contenido_pla ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="Escribe aquí el texto sugerido..."
                                required
                            />
                            {form.errors.contenido_pla && (
                                <p className={errorClass}>{form.errors.contenido_pla}</p>
                            )}
                            <p className="mt-1.5 text-xs text-gray-500">
                                Este texto será mostrado como sugerencia para copiar y usar manualmente.
                            </p>
                        </div>
                    </FormCard.Section>

                    <FormCard.Section title="Estado">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="activo_pla"
                                checked={!!form.data.activo_pla}
                                onChange={(e) => form.setData('activo_pla', e.target.checked)}
                                className="rounded border-gray-300 text-terracota-500 focus:ring-terracota-500"
                            />
                            <label htmlFor="activo_pla" className="text-sm font-medium text-cafe-700">
                                Plantilla activa
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Las plantillas inactivas no se mostrarán como sugerencias.
                        </p>
                    </FormCard.Section>

                    <FormCard.Actions>
                        <Link href={route('plantillas-mensaje.index')}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        <PrimaryActionButton
                            type="submit"
                            loading={form.processing}
                            disabled={form.processing}
                        >
                            Actualizar Plantilla
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
