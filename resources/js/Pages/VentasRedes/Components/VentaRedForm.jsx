import FormCard from '@/Components/UI/FormCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import VentaRedDetalleTable from './VentaRedDetalleTable';
import VentaRedResumenTotales from './VentaRedResumenTotales';
import { estadoLabels, productoPrecio, tipoInteraccionLabels } from './VentaRedHelpers';
import Swal from 'sweetalert2';

const inputClass =
    'w-full rounded-xl border-gray-300 px-3 py-2.5 text-sm text-cafe-700 shadow-sm transition-all duration-200 focus:border-terracota-500 focus:ring-terracota-500';

const labelClass = 'mb-1.5 block text-sm font-medium text-cafe-700';

const errorClass = 'mt-1 text-xs text-red-600';

const emptyToNull = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    return value;
};

const toNumber = (value, fallback = 0) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
};

const getLeadName = (lead) => {
    return (
        lead?.nombre_lea ??
        lead?.nombre ??
        lead?.name ??
        lead?.razon_social ??
        lead?.telefono_lea ??
        lead?.cod_lead ??
        'Lead sin nombre'
    );
};

const getClienteName = (cliente) => {
    return (
        cliente?.nombre_cli ??
        cliente?.nombre ??
        cliente?.name ??
        cliente?.razon_social ??
        cliente?.telefono_cli ??
        cliente?.cod_cliente ??
        'Cliente sin nombre'
    );
};

const getCanalName = (canal) => {
    return canal?.nombre_can ?? canal?.nombre ?? canal?.name ?? canal?.cod_canal_venta ?? 'Canal sin nombre';
};

const getFlujoName = (flujo) => {
    return flujo?.nombre_tip ?? flujo?.nombre ?? flujo?.name ?? flujo?.cod_tipo_flujo_comercial ?? 'Flujo sin nombre';
};

const getCodCanalVenta = (contacto) => {
    return (
        contacto?.cod_canal_venta ??
        contacto?.canal_venta?.cod_canal_venta ??
        contacto?.canalVenta?.cod_canal_venta ??
        ''
    );
};

const getCodTipoFlujoComercial = (contacto) => {
    return (
        contacto?.cod_tipo_flujo_comercial ??
        contacto?.tipo_flujo_comercial?.cod_tipo_flujo_comercial ??
        contacto?.tipoFlujoComercial?.cod_tipo_flujo_comercial ??
        ''
    );
};

const getProductoName = (producto) => {
    return producto?.nombre_pro ?? producto?.nombre ?? producto?.name ?? producto?.sku_pro ?? 'Producto sin nombre';
};

const getVarianteName = (variante) => {
    return (
        variante?.talla?.nom_talla_producto ??
        variante?.nombre ??
        variante?.name ??
        variante?.sku_variante_producto ??
        variante?.cod_variante_producto ??
        'Variante'
    );
};

const normalizeDetalle = (detalle) => {
    const cantidad = toNumber(detalle?.cantidad, 1);
    const precioUnitario = toNumber(detalle?.precio_unitario, 0);
    const subtotal = toNumber(detalle?.subtotal, cantidad * precioUnitario);

    return {
        cod_producto: detalle?.cod_producto ?? '',
        cod_variante_producto: detalle?.cod_variante_producto ?? '',
        cod_talla_producto:
            detalle?.cod_talla_producto ??
            detalle?.variante?.cod_talla_producto ??
            detalle?.variante?.talla?.cod_talla_producto ??
            '',
        cantidad,
        precio_unitario: precioUnitario,
        subtotal,
        producto: detalle?.producto,
        variante: detalle?.variante,
        nombre_producto: detalle?.producto?.nombre_pro ?? detalle?.nombre_producto ?? '',
        sku_producto: detalle?.variante?.sku_variante_producto ?? detalle?.producto?.sku_pro ?? detalle?.sku_producto ?? '',
        talla_nombre: detalle?.variante?.talla?.nom_talla_producto ?? detalle?.talla_nombre ?? '',
    };
};

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
        cod_lead: venta?.cod_lead ?? null,
        cod_cliente: venta?.cod_cliente ?? null,
        cod_canal_venta: venta?.cod_canal_venta ?? '',
        cod_tipo_flujo_comercial: venta?.cod_tipo_flujo_comercial ?? '',
        cod_usuario_responsable: venta?.cod_usuario_responsable ?? '',
        estado_venta_red: venta?.estado_venta_red ?? 'borrador',
        tipo_interaccion: venta?.tipo_interaccion ?? '',
        referencia_origen: venta?.referencia_origen ?? '',
        observacion: venta?.observacion ?? '',
        descuento: venta?.descuento ?? 0,
        detalles: (venta?.detalles ?? []).map(normalizeDetalle),
    });

    const [detalle, setDetalle] = useState({
        cod_producto: '',
        cod_variante_producto: '',
        cod_talla_producto: '',
        cantidad: 1,
        precio_unitario: 0,
    });

    const selectedProducto = useMemo(() => {
        return productos.find((producto) => String(producto.cod_producto) === String(detalle.cod_producto));
    }, [productos, detalle.cod_producto]);

    const variantes = selectedProducto?.variantes ?? [];

    const totales = useMemo(() => {
        const subtotal = form.data.detalles.reduce((acc, item) => {
            return acc + toNumber(item.subtotal, 0);
        }, 0);

        const descuento = Math.max(0, toNumber(form.data.descuento, 0));
        const total = Math.max(0, subtotal - descuento);

        return {
            subtotal,
            descuento,
            total,
        };
    }, [form.data.detalles, form.data.descuento]);

    const isFormValid = useMemo(() => {
        const hasContacto = (Boolean(form.data.cod_lead) || Boolean(form.data.cod_cliente)) && !(form.data.cod_lead && form.data.cod_cliente);
        const hasCanal = Boolean(form.data.cod_canal_venta);
        const hasDetalles = form.data.detalles.length > 0;
        const isDescuentoValid = totales.descuento <= totales.subtotal;
        
        return hasContacto && hasCanal && hasDetalles && isDescuentoValid;
    }, [form.data.cod_lead, form.data.cod_cliente, form.data.cod_canal_venta, form.data.detalles, totales]);

    const setContactoDesdeLead = (codLead) => {
        if (!codLead) {
            form.setData((data) => ({
                ...data,
                cod_lead: null,
                cod_cliente: null,
                cod_canal_venta: '',
                cod_tipo_flujo_comercial: '',
            }));
            form.clearErrors('contacto');
            return;
        }

        const lead = leads.find((item) => String(item.cod_lead) === String(codLead));

        if (!lead) {
            form.setData((data) => ({
                ...data,
                cod_lead: null,
                cod_cliente: null,
                cod_canal_venta: '',
                cod_tipo_flujo_comercial: '',
            }));
            form.setError('contacto', 'El lead seleccionado no existe.');
            return;
        }

        form.setData((data) => ({
            ...data,
            cod_lead: codLead,
            cod_cliente: null,
            cod_canal_venta: getCodCanalVenta(lead) || data.cod_canal_venta,
            cod_tipo_flujo_comercial: getCodTipoFlujoComercial(lead) || data.cod_tipo_flujo_comercial,
        }));

        form.clearErrors('contacto');
    };

    const setContactoDesdeCliente = (codCliente) => {
        if (!codCliente) {
            form.setData((data) => ({
                ...data,
                cod_cliente: null,
                cod_lead: null,
                cod_canal_venta: '',
                cod_tipo_flujo_comercial: '',
            }));
            form.clearErrors('contacto');
            return;
        }

        const cliente = clientes.find((item) => String(item.cod_cliente) === String(codCliente));

        if (!cliente) {
            form.setData((data) => ({
                ...data,
                cod_cliente: null,
                cod_lead: null,
                cod_canal_venta: '',
                cod_tipo_flujo_comercial: '',
            }));
            form.setError('contacto', 'El cliente seleccionado no existe.');
            return;
        }

        form.setData((data) => ({
            ...data,
            cod_cliente: codCliente,
            cod_lead: null,
            cod_canal_venta: getCodCanalVenta(cliente) || data.cod_canal_venta,
            cod_tipo_flujo_comercial: getCodTipoFlujoComercial(cliente) || data.cod_tipo_flujo_comercial,
        }));

        form.clearErrors('contacto');
    };

    const updateDetalleProducto = (codProducto) => {
        if (!codProducto) {
            setDetalle({
                cod_producto: '',
                cod_variante_producto: '',
                cod_talla_producto: '',
                cantidad: 1,
                precio_unitario: 0,
            });

            form.clearErrors('detalles');
            return;
        }

        const producto = productos.find((item) => String(item.cod_producto) === String(codProducto));

        setDetalle({
            cod_producto: codProducto,
            cod_variante_producto: '',
            cod_talla_producto: '',
            cantidad: 1,
            precio_unitario: productoPrecio(producto),
        });

        form.clearErrors('detalles');
    };

    const updateDetalleVariante = (codVariante) => {
        const variante = variantes.find((item) => String(item.cod_variante_producto) === String(codVariante));

        setDetalle((current) => ({
            ...current,
            cod_variante_producto: codVariante,
            cod_talla_producto: variante?.cod_talla_producto ?? variante?.talla?.cod_talla_producto ?? '',
            precio_unitario: productoPrecio(selectedProducto, codVariante),
        }));

        form.clearErrors('detalles');
    };

    const addDetalle = () => {
        if (!detalle.cod_producto) {
            form.setError('detalles', 'Debe seleccionar un producto.');
            return;
        }

        if (!selectedProducto) {
            form.setError('detalles', 'El producto seleccionado no existe o no fue cargado correctamente.');
            return;
        }

        const variante = variantes.find((item) => String(item.cod_variante_producto) === String(detalle.cod_variante_producto));

        const cantidad = parseInt(detalle.cantidad, 10);
        const precio = parseFloat(detalle.precio_unitario);

        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            form.setError('detalles', 'La cantidad debe ser mayor a 0.');
            return;
        }

        if (!Number.isFinite(precio) || precio < 0) {
            form.setError('detalles', 'El precio del producto debe ser mayor o igual a 0.');
            return;
        }

        const nuevoDetalle = {
            cod_producto: detalle.cod_producto,
            cod_variante_producto: detalle.cod_variante_producto || '',
            cod_talla_producto: variante?.cod_talla_producto ?? variante?.talla?.cod_talla_producto ?? detalle.cod_talla_producto ?? '',
            cantidad,
            precio_unitario: precio,
            subtotal: cantidad * precio,
            producto: selectedProducto,
            variante,
            nombre_producto: getProductoName(selectedProducto),
            sku_producto: variante?.sku_variante_producto ?? selectedProducto?.sku_pro ?? '',
            talla_nombre: variante?.talla?.nom_talla_producto ?? '',
        };

        form.setData('detalles', [...form.data.detalles, nuevoDetalle]);

        setDetalle({
            cod_producto: '',
            cod_variante_producto: '',
            cod_talla_producto: '',
            cantidad: 1,
            precio_unitario: 0,
        });

        form.clearErrors('detalles');
    };

    const removeDetalle = (index) => {
        form.setData(
            'detalles',
            form.data.detalles.filter((_, itemIndex) => itemIndex !== index),
        );

        form.clearErrors('detalles');
    };

    const buildPayload = () => {
        return {
            ...form.data,
            cod_lead: emptyToNull(form.data.cod_lead),
            cod_cliente: emptyToNull(form.data.cod_cliente),
            cod_canal_venta: emptyToNull(form.data.cod_canal_venta),
            cod_tipo_flujo_comercial: emptyToNull(form.data.cod_tipo_flujo_comercial),
            cod_usuario_responsable: emptyToNull(form.data.cod_usuario_responsable),
            tipo_interaccion: emptyToNull(form.data.tipo_interaccion),
            referencia_origen: form.data.referencia_origen?.trim() ?? '',
            observacion: form.data.observacion?.trim() ?? '',
            descuento: totales.descuento,
            subtotal: totales.subtotal,
            total: totales.total,
            detalles: form.data.detalles.map((item) => ({
                cod_producto: item.cod_producto,
                cod_variante_producto: emptyToNull(item.cod_variante_producto),
                cod_talla_producto: emptyToNull(item.cod_talla_producto),
                cantidad: toNumber(item.cantidad, 1),
                precio_unitario: toNumber(item.precio_unitario, 0),
                subtotal: toNumber(item.subtotal, 0),
            })),
        };
    };

    const submit = (event) => {
        event.preventDefault();

        form.clearErrors();

        let newErrors = {};

        if (form.data.cod_lead && form.data.cod_cliente) {
            newErrors.contacto = 'Debe seleccionar solo un contacto: lead o cliente, no ambos.';
        } else if (!form.data.cod_lead && !form.data.cod_cliente) {
            newErrors.contacto = 'Debe seleccionar un lead o un cliente obligatoriamente.';
        }

        if (!form.data.cod_canal_venta) {
            newErrors.cod_canal_venta = 'El canal de venta es obligatorio.';
        }

        if (form.data.detalles.length === 0) {
            newErrors.detalles = 'Debe agregar al menos un producto a la venta.';
        }

        if (totales.descuento > totales.subtotal) {
            newErrors.descuento = 'El descuento no puede ser mayor al subtotal.';
        }

        if (Object.keys(newErrors).length > 0) {
            form.setError(newErrors);
            return;
        }

        const payload = buildPayload();

        Swal.fire({
            title: 'Registrando venta...',
            text: 'Por favor, espera un momento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const options = {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: isEdit ? 'La venta se ha actualizado correctamente.' : 'La venta se ha registrado correctamente.',
                    confirmButtonColor: '#3085d6',
                });
            },
            onError: (errors) => {
                const errorMessages = Object.values(errors).join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Error de validación',
                    text: errorMessages || 'Ocurrió un error al procesar la solicitud. Revisa los campos.',
                    confirmButtonColor: '#d33',
                });
            },
            onFinish: () => {
                if (Swal.isLoading()) {
                    Swal.close();
                }
            },
        };

        form.transform(() => payload);

        if (isEdit) {
            form.put(route('ventas-redes.update', venta.cod_venta_red), options);
            return;
        }

        form.post(route('ventas-redes.store'), options);
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
                        <label className={labelClass}>Lead <span className="text-red-500">*</span></label>
                        <select
                            value={form.data.cod_lead ?? ''}
                            onChange={(event) => setContactoDesdeLead(event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Seleccionar lead</option>
                            {leads.map((lead) => (
                                <option key={lead.cod_lead} value={lead.cod_lead}>
                                    {getLeadName(lead)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Cliente <span className="text-red-500">*</span></label>
                        <select
                            value={form.data.cod_cliente ?? ''}
                            onChange={(event) => setContactoDesdeCliente(event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Seleccionar cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.cod_cliente} value={cliente.cod_cliente}>
                                    {getClienteName(cliente)}
                                </option>
                            ))}
                        </select>
                    </div>
                </FormCard.Row>

                {form.errors.contacto && <p className={errorClass}>{form.errors.contacto}</p>}

                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Canal de venta <span className="text-red-500">*</span></label>
                        <select
                            value={form.data.cod_canal_venta ?? ''}
                            onChange={(event) => {
                                form.setData('cod_canal_venta', event.target.value);
                                form.clearErrors('cod_canal_venta');
                            }}
                            className={inputClass}
                        >
                            <option value="">Seleccionar canal</option>
                            {canales.map((canal) => (
                                <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>
                                    {getCanalName(canal)}
                                </option>
                            ))}
                        </select>
                        {form.errors.cod_canal_venta && <p className={errorClass}>{form.errors.cod_canal_venta}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Tipo de flujo comercial</label>
                        <select
                            value={form.data.cod_tipo_flujo_comercial ?? ''}
                            onChange={(event) => form.setData('cod_tipo_flujo_comercial', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Seleccionar flujo</option>
                            {tiposFlujo.map((flujo) => (
                                <option key={flujo.cod_tipo_flujo_comercial} value={flujo.cod_tipo_flujo_comercial}>
                                    {getFlujoName(flujo)}
                                </option>
                            ))}
                        </select>
                    </div>
                </FormCard.Row>

                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Tipo de interacción</label>
                        <select
                            value={form.data.tipo_interaccion ?? ''}
                            onChange={(event) => form.setData('tipo_interaccion', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Seleccionar tipo</option>
                            {tiposInteraccion.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipoInteraccionLabels[tipo] ?? tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Responsable</label>
                        <select
                            value={form.data.cod_usuario_responsable ?? ''}
                            onChange={(event) => form.setData('cod_usuario_responsable', event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Usuario actual</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Estado y referencia">
                <FormCard.Row>
                    <div>
                        <label className={labelClass}>Estado</label>
                        <select
                            value={form.data.estado_venta_red ?? 'borrador'}
                            onChange={(event) => form.setData('estado_venta_red', event.target.value)}
                            className={inputClass}
                        >
                            {(estados.length > 0 ? estados : ['borrador']).map((estado) => (
                                <option key={estado} value={estado}>
                                    {estadoLabels[estado] ?? estado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Referencia de origen</label>
                        <input
                            value={form.data.referencia_origen ?? ''}
                            onChange={(event) => form.setData('referencia_origen', event.target.value)}
                            className={inputClass}
                            placeholder="URL, publicación, mensaje o nota de origen"
                        />
                    </div>
                </FormCard.Row>
            </FormCard.Section>

            <FormCard.Section title="Productos (Requerido al menos 1)">
                <div className="rounded-xl bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Producto <span className="text-red-500">*</span></label>
                            <select
                                value={detalle.cod_producto}
                                onChange={(event) => updateDetalleProducto(event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Seleccionar producto</option>
                                {productos.map((producto) => (
                                    <option key={producto.cod_producto} value={producto.cod_producto}>
                                        {getProductoName(producto)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Variante</label>
                            <select
                                value={detalle.cod_variante_producto}
                                onChange={(event) => updateDetalleVariante(event.target.value)}
                                className={inputClass}
                                disabled={!detalle.cod_producto}
                            >
                                <option value="">Sin variante</option>
                                {variantes.map((variante) => (
                                    <option key={variante.cod_variante_producto} value={variante.cod_variante_producto}>
                                        {getVarianteName(variante)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={detalle.cantidad}
                                onChange={(event) =>
                                    setDetalle((current) => ({
                                        ...current,
                                        cantidad: event.target.value,
                                    }))
                                }
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Precio</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={detalle.precio_unitario}
                                onChange={(event) =>
                                    setDetalle((current) => ({
                                        ...current,
                                        precio_unitario: event.target.value,
                                    }))
                                }
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            onClick={addDetalle}
                            className="rounded-lg bg-oliva-50 px-3 py-2 text-sm font-medium text-oliva-700 transition hover:bg-oliva-100"
                        >
                            Agregar producto
                        </button>
                    </div>
                </div>

                {form.errors.detalles && <p className={errorClass}>{form.errors.detalles}</p>}

                <VentaRedDetalleTable detalles={form.data.detalles} onRemove={removeDetalle} />
            </FormCard.Section>

            <FormCard.Section title="Totales y observaciones">
                <VentaRedResumenTotales
                    subtotal={totales.subtotal}
                    descuento={form.data.descuento}
                    total={totales.total}
                    editable
                    onDescuentoChange={(value) => {
                        form.setData('descuento', value);
                        form.clearErrors('descuento');
                    }}
                />

                {form.errors.descuento && <p className={errorClass}>{form.errors.descuento}</p>}

                <div>
                    <label className={labelClass}>Observación</label>
                    <textarea
                        value={form.data.observacion ?? ''}
                        onChange={(event) => form.setData('observacion', event.target.value)}
                        rows={3}
                        className={`${inputClass} resize-y`}
                    />
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