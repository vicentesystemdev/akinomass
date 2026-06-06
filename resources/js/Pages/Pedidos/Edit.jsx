import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import FormCard from '@/Components/UI/FormCard';
import SectionCard from '@/Components/UI/SectionCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';
import { filterNumeric, filterInteger } from '@/utils/formatters';

const formatBOB = (value) => {
    const num = parseFloat(value) || 0;
    return `Bs ${num.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Edit({ pedido, estadoBorrador, clientes, canales, tiposFlujo, productos }) {
    const isEditable = pedido.estado_ped === estadoBorrador;

    const form = useForm({
        cod_cliente: pedido?.cod_cliente ?? '',
        cod_canal_venta: pedido?.cod_canal_venta ?? '',
        cod_tipo_flujo_comercial: pedido?.cod_tipo_flujo_comercial ?? '',
        descuento_ped: pedido?.descuento_ped ?? 0,
        observacion_ped: pedido?.observacion_ped ?? '',
        detalles: pedido?.detalles?.map((d) => ({
            cod_producto: d.cod_producto ?? '',
            cantidad_det: d.cantidad_det ?? 1,
            precio_unitario_det: d.precio_unitario_det ?? 0,
        })) || [{ cod_producto: '', cantidad_det: 1, precio_unitario_det: 0 }],
    });

    const submit = () => {
        form.put(route('pedidos.update', pedido.cod_pedido));
    };

    const inputClass = "w-full rounded-xl border-gray-300 shadow-sm focus:border-terracota-500 focus:ring-terracota-500 py-2.5 px-3 text-sm text-cafe-700 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-cafe-700 mb-1.5";
    const errorClass = "mt-1 text-xs text-red-600";

    const addDetalle = useCallback(() => {
        form.setData('detalles', [
            ...form.data.detalles,
            { cod_producto: '', cantidad_det: 1, precio_unitario_det: 0 },
        ]);
    }, [form]);

    const removeDetalle = useCallback((index) => {
        const newDetalles = form.data.detalles.filter((_, i) => i !== index);
        form.setData('detalles', newDetalles.length > 0 ? newDetalles : [{ cod_producto: '', cantidad_det: 1, precio_unitario_det: 0 }]);
    }, [form]);

    const updateDetalle = useCallback((index, field, value) => {
        const newDetalles = [...form.data.detalles];
        newDetalles[index] = { ...newDetalles[index], [field]: value };
        if (field === 'cod_producto') {
            const producto = productos.find((p) => p.cod_producto == value);
            if (producto) {
                newDetalles[index].precio_unitario_det = parseFloat(producto.precio_venta_pro) || 0;
            }
        }
        form.setData('detalles', newDetalles);
    }, [form, productos]);

    const totales = useMemo(() => {
        const subtotal = form.data.detalles.reduce((acc, d) => {
            return acc + (parseFloat(d.cantidad_det) || 0) * (parseFloat(d.precio_unitario_det) || 0);
        }, 0);
        const descuento = parseFloat(form.data.descuento_ped) || 0;
        const total = subtotal - descuento;
        return { subtotal, descuento, total: Math.max(total, 0) };
    }, [form.data.detalles, form.data.descuento_ped]);

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={`Pedido ${pedido.numero_pedido_ped}`}
                    subtitle={isEditable ? 'Modifique los datos del pedido' : 'Este pedido no es editable en su estado actual'}
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Pedidos', href: route('pedidos.index') },
                        { label: pedido.numero_pedido_ped },
                    ]}
                />
            }
        >
            <Head title={`Editar Pedido ${pedido.numero_pedido_ped}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {!isEditable && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-amber-800">Pedido no editable</p>
                            <p className="text-xs text-amber-600 mt-0.5">
                                Solo se pueden editar pedidos en estado "Borrador". Este pedido ya ha sido procesado.
                            </p>
                        </div>
                    </div>
                )}

                <FormCard
                    title="Datos del Pedido"
                    subtitle="Información general del pedido"
                    onSubmit={(e) => { e.preventDefault(); if (isEditable) submit(); }}
                >
                    <FormCard.Section title="Cliente y Canal">
                        <FormCard.Row>
                            <div>
                                <label className={labelClass}>Cliente</label>
                                <select
                                    value={form.data.cod_cliente ?? ''}
                                    onChange={(e) => form.setData('cod_cliente', e.target.value)}
                                    disabled={!isEditable}
                                    className={`${inputClass} ${!isEditable ? 'bg-gray-50 opacity-75' : ''}`}
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {clientes.map((c) => (
                                        <option key={c.cod_cliente} value={c.cod_cliente}>{c.nombre_cli}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Canal de Venta</label>
                                <select
                                    value={form.data.cod_canal_venta ?? ''}
                                    onChange={(e) => form.setData('cod_canal_venta', e.target.value)}
                                    disabled={!isEditable}
                                    className={`${inputClass} ${!isEditable ? 'bg-gray-50 opacity-75' : ''}`}
                                >
                                    <option value="">Seleccionar canal</option>
                                    {canales.map((c) => (
                                        <option key={c.cod_canal_venta} value={c.cod_canal_venta}>{c.nombre_can}</option>
                                    ))}
                                </select>
                            </div>
                        </FormCard.Row>

                        <div>
                            <label className={labelClass}>Tipo de Flujo</label>
                            <select
                                value={form.data.cod_tipo_flujo_comercial ?? ''}
                                onChange={(e) => form.setData('cod_tipo_flujo_comercial', e.target.value)}
                                disabled={!isEditable}
                                className={`${inputClass} ${!isEditable ? 'bg-gray-50 opacity-75' : ''} max-w-md`}
                            >
                                <option value="">Seleccionar flujo</option>
                                {tiposFlujo.map((t) => (
                                    <option key={t.cod_tipo_flujo_comercial} value={t.cod_tipo_flujo_comercial}>{t.nombre_tip}</option>
                                ))}
                            </select>
                        </div>
                    </FormCard.Section>

                    <FormCard.Section title="Productos">
                        <div className="space-y-3">
                            {form.data.detalles.map((detalle, index) => (
                                <div key={index} className={`flex items-start gap-3 p-3 rounded-xl ${isEditable ? 'bg-gray-50' : 'bg-gray-50 opacity-75'}`}>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">Producto</label>
                                            <select
                                                value={detalle.cod_producto ?? ''}
                                                onChange={(e) => updateDetalle(index, 'cod_producto', e.target.value)}
                                                disabled={!isEditable}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 px-2.5 focus:border-terracota-500 focus:ring-terracota-500"
                                            >
                                                <option value="">Seleccionar</option>
                                                {productos.map((p) => (
                                                    <option key={p.cod_producto} value={p.cod_producto}>{p.nombre_pro}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">Cantidad</label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                min="1"
                                                value={detalle.cantidad_det ?? 1}
                                                onChange={(e) => updateDetalle(index, 'cantidad_det', filterInteger(e.target.value))}
                                                disabled={!isEditable}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 px-2.5 focus:border-terracota-500 focus:ring-terracota-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 mb-1 block">Precio Unit.</label>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                step="0.01"
                                                min="0"
                                                value={detalle.precio_unitario_det ?? 0}
                                                onChange={(e) => updateDetalle(index, 'precio_unitario_det', filterNumeric(e.target.value))}
                                                disabled={!isEditable}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 px-2.5 focus:border-terracota-500 focus:ring-terracota-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 pt-5">
                                        <p className="text-sm font-bold text-cafe-700">
                                            {formatBOB((parseFloat(detalle.cantidad_det) || 0) * (parseFloat(detalle.precio_unitario_det) || 0))}
                                        </p>
                                        {isEditable && form.data.detalles.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDetalle(index)}
                                                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isEditable && (
                            <button
                                type="button"
                                onClick={addDetalle}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-oliva-700 bg-oliva-50 rounded-lg hover:bg-oliva-100 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Agregar Producto
                            </button>
                        )}
                    </FormCard.Section>

                    <FormCard.Section title="Resumen">
                        <div className="flex justify-end">
                            <div className="w-full max-w-xs space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal:</span>
                                    <span className="font-medium text-cafe-700">{formatBOB(totales.subtotal)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Descuento:</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        step="0.01"
                                        min="0"
                                        value={form.data.descuento_ped ?? 0}
                                        onChange={(e) => form.setData('descuento_ped', filterNumeric(e.target.value))}
                                        disabled={!isEditable}
                                        className="flex-1 rounded-lg border-gray-300 text-sm py-1.5 px-2 text-right focus:border-terracota-500 focus:ring-terracota-500"
                                    />
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="font-semibold text-cafe-900">Total:</span>
                                    <span className="text-lg font-bold text-terracota-600">{formatBOB(totales.total)}</span>
                                </div>
                            </div>
                        </div>
                    </FormCard.Section>

                    <FormCard.Section title="Observaciones">
                        <div>
                            <label className={labelClass}>Observaciones</label>
                            <textarea
                                value={form.data.observacion_ped ?? ''}
                                onChange={(e) => form.setData('observacion_ped', e.target.value)}
                                rows={2}
                                disabled={!isEditable}
                                className={`${inputClass} resize-y ${!isEditable ? 'bg-gray-50 opacity-75' : ''}`}
                                placeholder="Notas adicionales sobre el pedido"
                            />
                        </div>
                    </FormCard.Section>

                    <FormCard.Actions>
                        <Link href={route('pedidos.show', pedido.cod_pedido)}>
                            <SecondaryButton>Cancelar</SecondaryButton>
                        </Link>
                        {isEditable && (
                            <PrimaryActionButton
                                type="submit"
                                loading={form.processing}
                                disabled={form.processing}
                            >
                                Actualizar Pedido
                            </PrimaryActionButton>
                        )}
                    </FormCard.Actions>
                </FormCard>
            </div>
        </AuthenticatedLayout>
    );
}
