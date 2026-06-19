import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import VentaRedDetalleTable from './VentaRedDetalleTable';
import VentaRedResumenTotales from './VentaRedResumenTotales';
import { estadoLabels, productoPrecio, tipoInteraccionLabels } from './VentaRedHelpers';

const inputClass = 'w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm text-cafe-700 shadow-sm transition-all duration-200 focus:border-terracota-500 focus:ring-terracota-500';
const labelClass = 'mb-1.5 block text-sm font-medium text-cafe-700';
const errorClass = 'mt-1 text-xs text-red-600';

export default function VentaRedForm({
    venta = null,
    leads = [],
    clientes = [],
    canales = [],
    tiposFlujo = [],
    usuarios = [],
    productos = [],
    estados = [],
    tiposInteraccion = [],
}) {
    const isEdit = Boolean(venta);
    const form = useForm({
        cod_lead: venta?.cod_lead ?? '',
        cod_cliente: venta?.cod_cliente ?? '',
        cod_canal_venta: venta?.cod_canal_venta ?? '',
        cod_tipo_flujo_comercial: venta?.cod_tipo_flujo_comercial ?? '',
        cod_usuario_responsable: venta?.cod_usuario_responsable ?? '',
        estado_venta_red: venta?.estado_venta_red ?? 'borrador',
        tipo_interaccion: venta?.tipo_interaccion ?? '',
        referencia_origen: venta?.referencia_origen ?? '',
        observacion: venta?.observacion ?? '',
        descuento: venta?.descuento ?? 0,
        detalles: (venta?.detalles ?? []).map((detalle) => ({
            cod_producto: detalle.cod_producto,
            cod_variante_producto: detalle.cod_variante_producto ?? '',
            cod_talla_producto: detalle.cod_talla_producto ?? '',
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal,
            producto: detalle.producto,
            variante: detalle.variante,
            nombre_producto: detalle.producto?.nombre_pro,
            sku_producto: detalle.producto?.sku_pro,
            talla_nombre: detalle.variante?.talla?.nom_talla_producto,
        })),
    });

    const [detalle, setDetalle] = useState({ cod_producto: '', cod_variante_producto: '', cantidad: 1, precio_unitario: 0 });

    const selectedProducto = productos.find((producto) => String(producto.cod_producto) === String(detalle.cod_producto));
    const variantes = selectedProducto?.variantes ?? [];

    const totales = useMemo(() => {
        const subtotal = form.data.detalles.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0);
        const descuento = parseFloat(form.data.descuento) || 0;
        return { subtotal, descuento, total: Math.max(0, subtotal - descuento) };
    }, [form.data.detalles, form.data.descuento]);

    const setContactoDesdeLead = (codLead) => {
        const lead = leads.find((item) => String(item.cod_lead) === String(codLead));
        form.setData({
            ...form.data,
            cod_lead: codLead,
            cod_cliente: '',
            cod_canal_venta: lead?.cod_canal_venta ?? form.data.cod_canal_venta,
            cod_tipo_flujo_comercial: lead?.cod_tipo_flujo_comercial ?? form.data.cod_tipo_flujo_comercial,
        });
    };

    const setContactoDesdeCliente = (codCliente) => {
        const cliente = clientes.find((item) => String(item.cod_cliente) === String(codCliente));
        form.setData({
            ...form.data,
            cod_cliente: codCliente,
            cod_lead: '',
            cod_canal_venta: cliente?.cod_canal_venta ?? form.data.cod_canal_venta,
            cod_tipo_flujo_comercial: cliente?.cod_tipo_flujo_comercial ?? form.data.cod_tipo_flujo_comercial,
        });
    };

    const updateDetalleProducto = (codProducto) => {
        const producto = productos.find((item) => String(item.cod_producto) === String(codProducto));
        setDetalle({
            cod_producto: codProducto,
            cod_variante_producto: '',
            cantidad: 1,
            precio_unitario: productoPrecio(producto),
        });
    };

    const updateDetalleVariante = (codVariante) => {
        setDetalle((current) => ({
            ...current,
            cod_variante_producto: codVariante,
            precio_unitario: productoPrecio(selectedProducto, codVariante),
        }));
    };

    const addDetalle = () => {
        if (!detalle.cod_producto) return;
        const variante = variantes.find((item) => String(item.cod_variante_producto) === String(detalle.cod_variante_producto));
        const cantidad = parseInt(detalle.cantidad || 1, 10);
        const precio = parseFloat(detalle.precio_unitario || 0);

        form.setData('detalles', [
            ...form.data.detalles,
            {
                ...detalle,
                cantidad,
                precio_unitario: precio,
                subtotal: cantidad * precio,
                nombre_producto: selectedProducto?.nombre_pro,
                sku_producto: variante?.sku_variante_producto ?? selectedProducto?.sku_pro,
                talla_nombre: variante?.talla?.nom_talla_producto,
            },
        ]);

        setDetalle({ cod_producto: '', cod_variante_producto: '', cantidad: 1, precio_unitario: 0 });
    };

    const removeDetalle = (index) => {
        form.setData('detalles', form.data.detalles.filter((_, itemIndex) => itemIndex !== index));
    };

    const submit = (event) => {
        event.preventDefault();
        const payload = {
            ...form.data,
            subtotal: totales.subtotal,
            total: totales.total,
        };

        if (isEdit) {
            form.transform(() => payload);
            form.put(route('ventas-redes.update', venta.cod_venta_red));
            return;
        }

        form.transform(() => payload);
        form.post(route('ventas-redes.store'));
    };

    return (
        <FormCard
            title={isEdit ? 'Editar venta por redes' : 'Nueva venta por redes'}
            subtitle="Registra manualmente ventas e intereses provenientes de canales digitales"
            onSubmit={submit}
        >
            <FormCard.Section title="Contacto y origen">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Lead</label>
                        <select value={form.data.cod_lead ?? ''} onChange={(event) => setContactoDesdeLead(event.target.value)} className={inputClass}>
                            <option value="">Seleccionar lead</option>
                            {leads.map((lead) => (
                                <option key={lead.cod_lead} value={lead.cod_lead}>{lead.nombre_lea}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Cliente</label>
                        <select value={form.data.cod_cliente ?? ''} onChange={(event) => setContactoDesdeCliente(event.target.value)} className={inputClass}>
                            <option value="">Seleccionar cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.cod_cliente} value={cliente.cod_cliente}>{cliente.nombre_cli}</option>
                            ))}
                        </select>
                        {form.errors.contacto && <p className={errorClass}>{form.errors.contacto}</p>}
                    </div>
                </FormCard.Row>

                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Canal de venta</label>
                        <select value={form.data.cod_canal_venta ?? ''} onChange={(event) => form.setData('cod_canal_venta', event.target.value)} className={inputClass}>
                            <option value="">Seleccionar canal</option>
                            {canales.map((canal) => (
                                <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>{canal.nombre_can}</option>
                            ))}
                        </select>
                        {form.errors.cod_canal_venta && <p className={errorClass}>{form.errors.cod_canal_venta}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>Tipo de flujo comercial</label>
                        <select value={form.data.cod_tipo_flujo_comercial ?? ''} onChange={(event) => form.setData('cod_tipo_flujo_comercial', event.target.value)} className={inputClass}>
                            <option value="">Seleccionar flujo</option>
                            {tiposFlujo.map((flujo) => (
                                <option key={flujo.cod_tipo_flujo_comercial} value={flujo.cod_tipo_flujo_comercial}>{flujo.nombre_tip}</option>
                            ))}
                        </select>
                    </div>
                </FormCard.Row>

                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Tipo de interaccion</label>
                        <select value={form.data.tipo_interaccion ?? ''} onChange={(event) => form.setData('tipo_interaccion', event.target.value)} className={inputClass}>
                            <option value="">Seleccionar tipo</option>
                            {tiposInteraccion.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipoInteraccionLabels[tipo] ?? tipo}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Responsable</label>
                        <select value={form.data.cod_usuario_responsable ?? ''} onChange={(event) => form.setData('cod_usuario_responsable', event.target.value)} className={inputClass}>
                            <option value="">Usuario actual</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>{usuario.name}</option>
                            ))}
                        </select>
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Estado y referencia">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Estado</label>
                        <select value={form.data.estado_venta_red ?? 'borrador'} onChange={(event) => form.setData('estado_venta_red', event.target.value)} className={inputClass}>
                            {estados.map((estado) => (
                                <option key={estado} value={estado}>{estadoLabels[estado] ?? estado}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Referencia de origen</label>
                        <input
                            value={form.data.referencia_origen ?? ''}
                            onChange={(event) => form.setData('referencia_origen', event.target.value)}
                            className={inputClass}
                            placeholder="URL, publicacion, mensaje o nota de origen"
                        />
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Productos">
                <div className="rounded-xl bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Producto</label>
                            <select value={detalle.cod_producto} onChange={(event) => updateDetalleProducto(event.target.value)} className={inputClass}>
                                <option value="">Seleccionar producto</option>
                                {productos.map((producto) => (
                                    <option key={producto.cod_producto} value={producto.cod_producto}>{producto.nombre_pro}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Variante</label>
                            <select value={detalle.cod_variante_producto} onChange={(event) => updateDetalleVariante(event.target.value)} className={inputClass}>
                                <option value="">Sin variante</option>
                                {variantes.map((variante) => (
                                    <option key={variante.cod_variante_producto} value={variante.cod_variante_producto}>
                                        {variante.talla?.nom_talla_producto ?? variante.sku_variante_producto}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Cantidad</label>
                            <input type="number" min="1" value={detalle.cantidad} onChange={(event) => setDetalle({ ...detalle, cantidad: event.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Precio</label>
                            <input type="number" min="0" step="0.01" value={detalle.precio_unitario} onChange={(event) => setDetalle({ ...detalle, precio_unitario: event.target.value })} className={inputClass} />
                        </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button type="button" onClick={addDetalle} className="rounded-lg bg-oliva-50 px-3 py-2 text-sm font-medium text-oliva-700 hover:bg-oliva-100">
                            Agregar producto
                        </button>
                    </div>
                </div>
                {form.errors.detalles && <p className={errorClass}>{form.errors.detalles}</p>}
                <VentaRedDetalleTable detalles={form.data.detalles} onRemove={removeDetalle} />
            </FormCard.Section>

            <FormCard.Section title="Totales y observaciones">
                <VentaRedResumenTotales subtotal={totales.subtotal} descuento={form.data.descuento} total={totales.total} editable onDescuentoChange={(value) => form.setData('descuento', value)} />
                <div>
                    <label className={labelClass}>Observacion</label>
                    <textarea value={form.data.observacion ?? ''} onChange={(event) => form.setData('observacion', event.target.value)} rows={3} className={`${inputClass} resize-y`} />
                </div>
            </FormCard.Section>

            <FormCard.Actions>
                <Link href={isEdit ? route('ventas-redes.show', venta.cod_venta_red) : route('ventas-redes.index')}>
                    <SecondaryButton>Cancelar</SecondaryButton>
                </Link>
                <PrimaryActionButton type="submit" loading={form.processing} disabled={form.processing}>
                    {isEdit ? 'Guardar cambios' : 'Registrar venta'}
                </PrimaryActionButton>
            </FormCard.Actions>
        </FormCard>
    );
}
