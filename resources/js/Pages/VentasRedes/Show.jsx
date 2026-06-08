import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageHeader from '@/Components/UI/PageHeader';
import SectionCard from '@/Components/UI/SectionCard';
import PrimaryActionButton from '@/Components/UI/PrimaryActionButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/UI/StatusBadge';
import { Head, Link, router, useForm } from '@inertiajs/react';
import VentaRedDetalleTable from './Components/VentaRedDetalleTable';
import VentaRedResumenTotales from './Components/VentaRedResumenTotales';
import { contactoNombre, estadoLabels, formatBOB, formatDate, tipoInteraccionLabels } from './Components/VentaRedHelpers';

export default function Show({ venta, productos = [], estados = [] }) {
    const detalleForm = useForm({ cod_producto: '', cod_variante_producto: '', cantidad: 1, precio_unitario: 0 });
    const selectedProducto = productos.find((producto) => String(producto.cod_producto) === String(detalleForm.data.cod_producto));
    const variantes = selectedProducto?.variantes ?? [];
    const editable = ['borrador', 'pendiente_confirmacion', 'confirmada'].includes(venta.estado_venta_red);

    const submitDetalle = (event) => {
        event.preventDefault();
        detalleForm.post(route('ventas-redes.detalles.store', venta.cod_venta_red), {
            preserveScroll: true,
            onSuccess: () => detalleForm.reset(),
        });
    };

    const updateProducto = (codProducto) => {
        const producto = productos.find((item) => String(item.cod_producto) === String(codProducto));
        detalleForm.setData({
            cod_producto: codProducto,
            cod_variante_producto: '',
            cantidad: 1,
            precio_unitario: parseFloat(producto?.precio_venta_pro ?? 0),
        });
    };

    const updateVariante = (codVariante) => {
        const variante = variantes.find((item) => String(item.cod_variante_producto) === String(codVariante));
        detalleForm.setData({
            ...detalleForm.data,
            cod_variante_producto: codVariante,
            precio_unitario: parseFloat(variante?.precio_venta_variante ?? selectedProducto?.precio_venta_pro ?? 0),
        });
    };

    const deleteDetalle = (detalle) => {
        if (confirm('Deseas eliminar este producto de la venta?')) {
            router.delete(route('ventas-redes.detalles.destroy', [venta.cod_venta_red, detalle.cod_venta_red_detalle]), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    title={venta.codigo_venta_red}
                    subtitle="Detalle y trazabilidad de la venta por redes"
                    breadcrumbs={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Ventas por Redes', href: route('ventas-redes.index') },
                        { label: venta.codigo_venta_red },
                    ]}
                    actions={
                        editable ? (
                            <Link href={route('ventas-redes.edit', venta.cod_venta_red)}>
                                <PrimaryActionButton>Editar</PrimaryActionButton>
                            </Link>
                        ) : null
                    }
                />
            }
        >
            <Head title={venta.codigo_venta_red} />

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <SectionCard title="Resumen" className="lg:col-span-2">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Info label="Contacto" value={contactoNombre(venta)} help={venta.cliente ? 'Cliente' : venta.lead ? 'Lead' : 'Borrador'} />
                            <Info label="Estado" value={<StatusBadge status={venta.estado_venta_red} label={estadoLabels[venta.estado_venta_red]} />} />
                            <Info label="Canal" value={venta.canal_venta?.nombre_can ?? '-'} />
                            <Info label="Interaccion" value={tipoInteraccionLabels[venta.tipo_interaccion] ?? '-'} />
                            <Info label="Responsable" value={venta.usuario_responsable?.name ?? '-'} />
                            <Info label="Fecha" value={formatDate(venta.created_at)} />
                            <Info label="Referencia" value={venta.referencia_origen ?? '-'} />
                            <Info label="Pedido" value={venta.pedido ? venta.pedido.numero_pedido_ped : '-'} />
                        </div>
                        {venta.observacion && <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-cafe-700">{venta.observacion}</p>}
                    </SectionCard>

                    <SectionCard title="Acciones">
                        <div className="space-y-3">
                            {venta.estado_venta_red !== 'confirmada' && editable && (
                                <PrimaryActionButton className="w-full justify-center" onClick={() => router.post(route('ventas-redes.confirmar', venta.cod_venta_red))}>
                                    Confirmar venta
                                </PrimaryActionButton>
                            )}
                            {venta.cod_lead && !venta.cod_cliente && (
                                <SecondaryButton className="w-full justify-center" onClick={() => router.post(route('ventas-redes.convertir-lead-cliente', venta.cod_venta_red))}>
                                    Convertir lead a cliente
                                </SecondaryButton>
                            )}
                            {!venta.cod_pedido && venta.estado_venta_red !== 'cancelada' && (
                                <PrimaryActionButton className="w-full justify-center" onClick={() => router.post(route('ventas-redes.convertir-pedido', venta.cod_venta_red))}>
                                    Convertir a pedido
                                </PrimaryActionButton>
                            )}
                            {venta.pedido && (
                                <Link href={route('pedidos.show', venta.pedido.cod_pedido)} className="block">
                                    <SecondaryButton className="w-full justify-center">Ver pedido generado</SecondaryButton>
                                </Link>
                            )}
                            {editable && (
                                <button
                                    type="button"
                                    onClick={() => confirm('Deseas cancelar esta venta por redes?') && router.delete(route('ventas-redes.destroy', venta.cod_venta_red))}
                                    className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                >
                                    Cancelar venta
                                </button>
                            )}
                        </div>
                    </SectionCard>
                </div>

                <SectionCard title="Productos" noPadding>
                    {editable && (
                        <form onSubmit={submitDetalle} className="border-b border-gray-100 p-4">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                                <select value={detalleForm.data.cod_producto} onChange={(event) => updateProducto(event.target.value)} className="rounded-xl border-gray-300 px-3 py-2.5 text-sm md:col-span-2">
                                    <option value="">Seleccionar producto</option>
                                    {productos.map((producto) => <option key={producto.cod_producto} value={producto.cod_producto}>{producto.nombre_pro}</option>)}
                                </select>
                                <select value={detalleForm.data.cod_variante_producto} onChange={(event) => updateVariante(event.target.value)} className="rounded-xl border-gray-300 px-3 py-2.5 text-sm">
                                    <option value="">Sin variante</option>
                                    {variantes.map((variante) => <option key={variante.cod_variante_producto} value={variante.cod_variante_producto}>{variante.talla?.nom_talla_producto ?? variante.sku_variante_producto}</option>)}
                                </select>
                                <input type="number" min="1" value={detalleForm.data.cantidad} onChange={(event) => detalleForm.setData('cantidad', event.target.value)} className="rounded-xl border-gray-300 px-3 py-2.5 text-sm" />
                                <div className="flex gap-2">
                                    <input type="number" min="0" step="0.01" value={detalleForm.data.precio_unitario} onChange={(event) => detalleForm.setData('precio_unitario', event.target.value)} className="min-w-0 flex-1 rounded-xl border-gray-300 px-3 py-2.5 text-sm" />
                                    <button type="submit" className="rounded-lg bg-oliva-50 px-3 py-2 text-sm font-medium text-oliva-700 hover:bg-oliva-100">Agregar</button>
                                </div>
                            </div>
                            {detalleForm.errors.cantidad && <p className="mt-2 text-xs text-red-600">{detalleForm.errors.cantidad}</p>}
                        </form>
                    )}
                    <VentaRedDetalleTable
                        detalles={venta.detalles ?? []}
                        onRemove={editable ? (index) => deleteDetalle(venta.detalles[index]) : null}
                    />
                </SectionCard>

                <SectionCard title="Totales">
                    <VentaRedResumenTotales subtotal={venta.subtotal} descuento={venta.descuento} total={venta.total} />
                </SectionCard>
            </div>
        </AuthenticatedLayout>
    );
}

function Info({ label, value, help = null }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <div className="mt-1 text-sm font-medium text-cafe-900">{value}</div>
            {help && <p className="mt-0.5 text-xs text-gray-500">{help}</p>}
        </div>
    );
}
