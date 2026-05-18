import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Ajustar({ productos }) {
    const form = useForm({
        cod_producto: '',
        stock_nuevo_mov: 0,
        motivo_mov: '',
        observacion_mov: '',
    });

    const submit = () => {
        form.post(route('inventario.ajuste'));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Ajustar Inventario"
                    subtitle="Corrige el stock de un producto"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Inventario', href: route('inventario.index') },
                        { label: 'Ajustar' },
                    ]}
                />
            }
        >
            <Head title="Ajustar Inventario" />

            <div className="max-w-2xl mx-auto">
                <FormCard
                    title="Datos del Ajuste"
                    subtitle="Defina el stock nuevo y el motivo de la corrección"
                    onSubmit={(e) => { e.preventDefault(); submit(); }}
                >
                    <div>
                        <label className={labelClass}>
                            Producto <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.data.cod_producto ?? ''}
                            onChange={(e) => form.setData('cod_producto', e.target.value)}
                            className={`${inputClass} ${form.errors.cod_producto ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        >
                            <option value="">Seleccionar producto</option>
                            {productos.map((p) => (
                                <option key={p.cod_producto} value={p.cod_producto}>
                                    {p.nombre_pro}
                                </option>
                            ))}
                        </select>
                        {form.errors.cod_producto && (
                            <p className={errorClass}>{form.errors.cod_producto}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>
                            Stock Nuevo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.data.stock_nuevo_mov ?? 0}
                            onChange={(e) => form.setData('stock_nuevo_mov', e.target.value)}
                            className={`${inputClass} ${form.errors.stock_nuevo_mov ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Ingrese el stock real correcto"
                            required
                        />
                        {form.errors.stock_nuevo_mov && (
                            <p className={errorClass}>{form.errors.stock_nuevo_mov}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Ingrese el valor correcto de stock que debería tener el producto.
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>
                            Motivo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.data.motivo_mov ?? ''}
                            onChange={(e) => form.setData('motivo_mov', e.target.value)}
                            className={`${inputClass} ${form.errors.motivo_mov ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Ej: Conteo físico, Corrección de error, Producto dañado"
                            required
                        />
                        {form.errors.motivo_mov && (
                            <p className={errorClass}>{form.errors.motivo_mov}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Observación</label>
                        <textarea
                            value={form.data.observacion_mov ?? ''}
                            onChange={(e) => form.setData('observacion_mov', e.target.value)}
                            rows={3}
                            className={`${inputClass} resize-y ${form.errors.observacion_mov ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Detalles adicionales sobre el ajuste"
                        />
                        {form.errors.observacion_mov && (
                            <p className={errorClass}>{form.errors.observacion_mov}</p>
                        )}
                    </div>

                    <FormCard.Actions>
                        <Link href={route('inventario.index')}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        <PrimaryActionButton
                            type="submit"
                            loading={form.processing}
                            disabled={form.processing}
                            icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            }
                        >
                            Registrar Ajuste
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
