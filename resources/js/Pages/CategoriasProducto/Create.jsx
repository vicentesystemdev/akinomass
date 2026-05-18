import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const form = useForm({
        nombre_cat: '',
        descripcion_cat: '',
        activo_cat: true,
    });

    const submit = () => {
        form.post(route('categorias-producto.store'));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Nueva Categoría"
                    subtitle="Crea una categoría para organizar tus productos"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Categorías', href: route('categorias-producto.index') },
                        { label: 'Nueva Categoría' },
                    ]}
                />
            }
        >
            <Head title="Nueva Categoría" />

            <div className="max-w-2xl mx-auto">
                <FormCard
                    title="Datos de la Categoría"
                    subtitle="Complete la información de la nueva categoría"
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                >
                    <div>
                        <label className={labelClass}>
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.data.nombre_cat ?? ''}
                            onChange={(e) => form.setData('nombre_cat', e.target.value)}
                            className={`${inputClass} ${form.errors.nombre_cat ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Ej: Remeras, Pantalones, Accesorios"
                            required
                        />
                        {form.errors.nombre_cat && (
                            <p className={errorClass}>{form.errors.nombre_cat}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Descripción</label>
                        <textarea
                            value={form.data.descripcion_cat ?? ''}
                            onChange={(e) => form.setData('descripcion_cat', e.target.value)}
                            rows={3}
                            className={`${inputClass} resize-y ${form.errors.descripcion_cat ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Descripción opcional de la categoría"
                        />
                        {form.errors.descripcion_cat && (
                            <p className={errorClass}>{form.errors.descripcion_cat}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="activo_cat"
                            checked={!!form.data.activo_cat}
                            onChange={(e) => form.setData('activo_cat', e.target.checked)}
                            className="rounded border-gray-300 text-terracota-500 focus:ring-terracota-500"
                        />
                        <label htmlFor="activo_cat" className="text-sm font-medium text-cafe-700">
                            Categoría activa
                        </label>
                    </div>

                    <FormCard.Actions>
                        <Link href={route('categorias-producto.index')}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        <PrimaryActionButton
                            type="submit"
                            loading={form.processing}
                            disabled={form.processing}
                        >
                            Crear Categoría
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
