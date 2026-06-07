import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FormCard from '@/Components/UI/FormCard';
import PageHeader from '@/Components/UI/PageHeader';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { filterInteger, toUpper } from '@/utils/formatters';

export default function Ajustar({ productos, codProductoSeleccionado = null, codVarianteSeleccionada = null }) {
    const form = useForm({
        cod_producto: codProductoSeleccionado ?? '',
        cod_variante_producto: codVarianteSeleccionada ?? '',
        stock_nuevo_mov: 0,
        motivo_mov: '',
        observacion_mov: '',
    });

    const producto = productos.find((item) => String(item.cod_producto) === String(form.data.cod_producto));
    const variante = producto?.variantes?.find(
        (item) => String(item.cod_variante_producto) === String(form.data.cod_variante_producto),
    );
    const inventario = variante?.inventario || producto?.inventario;
    const inputClass = 'w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm text-cafe-700 shadow-sm focus:border-terracota-500 focus:ring-terracota-500';
    const labelClass = 'mb-1.5 block text-sm font-medium text-cafe-700';
    const errorClass = 'mt-1 text-xs text-red-600';

    return (
        <AuthenticatedLayout
            header={<PageHeader title="Ajustar Inventario" subtitle="Corrige el stock base o de una variante" breadcrumbs={[
                { label: 'Dashboard', href: route('dashboard') },
                { label: 'Inventario', href: route('inventario.index') },
                { label: 'Ajustar' },
            ]} />}
        >
            <Head title="Ajustar Inventario" />
            <div className="mx-auto max-w-2xl">
                <FormCard title="Datos del ajuste" subtitle="Selecciona exactamente qué inventario deseas ajustar" onSubmit={(event) => {
                    event.preventDefault();
                    form.post(route('inventario.ajuste'));
                }}>
                    <div>
                        <label className={labelClass}>Producto <span className="text-red-500">*</span></label>
                        <select
                            value={form.data.cod_producto}
                            onChange={(event) => form.setData((data) => ({ ...data, cod_producto: event.target.value, cod_variante_producto: '' }))}
                            className={inputClass}
                        >
                            <option value="">Seleccionar producto</option>
                            {productos.map((item) => <option key={item.cod_producto} value={item.cod_producto}>{item.nombre_pro}</option>)}
                        </select>
                        {form.errors.cod_producto && <p className={errorClass}>{form.errors.cod_producto}</p>}
                    </div>

                    {producto?.variantes?.length > 0 && (
                        <div>
                            <label className={labelClass}>Inventario a ajustar</label>
                            <select value={form.data.cod_variante_producto} onChange={(event) => form.setData('cod_variante_producto', event.target.value)} className={inputClass}>
                                <option value="">Producto base</option>
                                {producto.variantes.map((item) => (
                                    <option key={item.cod_variante_producto} value={item.cod_variante_producto}>
                                        Talla {item.talla?.codigo_talla_producto || 'sin talla'} · {item.sku_variante_producto || 'Sin SKU'}
                                    </option>
                                ))}
                            </select>
                            {form.errors.cod_variante_producto && <p className={errorClass}>{form.errors.cod_variante_producto}</p>}
                            {!form.data.cod_variante_producto && (
                                <p className="mt-3 rounded-lg border border-terracota-200 bg-terracota-50 p-3 text-sm text-terracota-900">
                                    Estás ajustando el inventario base. Su stock permanece separado de las variantes.
                                </p>
                            )}
                            {form.data.cod_variante_producto && !variante?.inventario && (
                                <p className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900">
                                    Esta variante aún no tiene inventario. Se creará con stock inicial 0 antes del ajuste.
                                </p>
                            )}
                        </div>
                    )}

                    {producto && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Stock actual seleccionado</p>
                            <p className="mt-1 text-2xl font-bold text-cafe-900">{inventario?.stock_actual_inv ?? 0}</p>
                            <p className="text-xs text-gray-500">{form.data.cod_variante_producto ? 'Inventario de variante' : 'Inventario base'}</p>
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Stock nuevo <span className="text-red-500">*</span></label>
                        <input type="text" inputMode="numeric" min="0" value={form.data.stock_nuevo_mov} onChange={(event) => form.setData('stock_nuevo_mov', filterInteger(event.target.value))} className={inputClass} required />
                        {form.errors.stock_nuevo_mov && <p className={errorClass}>{form.errors.stock_nuevo_mov}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Motivo <span className="text-red-500">*</span></label>
                        <input type="text" value={form.data.motivo_mov} onChange={(event) => form.setData('motivo_mov', toUpper(event.target.value))} className={inputClass} required />
                        {form.errors.motivo_mov && <p className={errorClass}>{form.errors.motivo_mov}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Observación</label>
                        <textarea value={form.data.observacion_mov} onChange={(event) => form.setData('observacion_mov', event.target.value)} rows={3} className={inputClass} />
                        {form.errors.observacion_mov && <p className={errorClass}>{form.errors.observacion_mov}</p>}
                    </div>
                    <FormCard.Actions>
                        <Link href={route('inventario.index')}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryActionButton type="submit" loading={form.processing} disabled={form.processing}>Registrar ajuste</PrimaryActionButton>
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
