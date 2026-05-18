import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Salida({ productos }) {
    const form = useForm({
        cod_producto: '',
        cantidad_mov: 1,
        motivo_mov: '',
        observacion_mov: '',
    });

    const submit = () => {
        form.post(route('inventario.salida'));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title="Registrar Salida"
                    subtitle="Descarga mercancía del inventario"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Inventario', href: route('inventario.index') },
                        { label: 'Salida' },
                    ]}
                />
            }
        >
            <Head title="Registrar Salida" />

            <div className="max-w-2xl mx-auto">
                <FormCard
                    title="Datos de la Salida"
                    subtitle="Complete la información del movimiento de salida"
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
                            Cantidad <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={form.data.cantidad_mov ?? 1}
                            onChange={(e) => form.setData('cantidad_mov', e.target.value)}
                            className={`${inputClass} ${form.errors.cantidad_mov ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="Ingrese la cantidad"
                            required
                        />
                        {form.errors.cantidad_mov && (
                            <p className={errorClass}>{form.errors.cantidad_mov}</p>
                        )}
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
                            placeholder="Ej: Venta, Producto dañado, Muestra"
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
                            placeholder="Detalles adicionales sobre la salida"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                            }
                        >
                            Registrar Salida
                        </PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
