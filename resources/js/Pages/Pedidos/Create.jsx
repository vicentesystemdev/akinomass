import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create({ clientes = [], canales = [], tiposFlujo = [], productos = [] }) {
    const [touched, setTouched] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        cod_cliente: '',
        cod_canal_venta: '',
        cod_tipo_flujo_comercial: '',
        descuento_ped: 0,
        observacion_ped: '',
        detalles: [{ cod_producto: '', cantidad_det: 1, precio_unitario_det: 0 }],
    });

    const detail = data.detalles[0] || {};
    const clientErrors = useMemo(() => ({
        cod_cliente: !data.cod_cliente ? 'Selecciona un cliente.' : '',
        cod_canal_venta: !data.cod_canal_venta ? 'Selecciona un canal.' : '',
        cod_tipo_flujo_comercial: !data.cod_tipo_flujo_comercial ? 'Selecciona un tipo de flujo.' : '',
        cod_producto: !detail.cod_producto ? 'Selecciona un producto.' : '',
        cantidad_det: Number(detail.cantidad_det) <= 0 ? 'La cantidad debe ser positiva.' : '',
        precio_unitario_det: Number(detail.precio_unitario_det) <= 0 ? 'El precio debe ser positivo.' : '',
        descuento_ped: Number(data.descuento_ped) < 0 ? 'El descuento no puede ser negativo.' : '',
    }), [data, detail]);

    const isInvalid = Object.values(clientErrors).some(Boolean);

    const updateDetail = (field, value) => {
        setData('detalles', [{ ...detail, [field]: value }]);
    };

    const submit = (e) => {
        e.preventDefault();
        setTouched({ cod_cliente: true, cod_canal_venta: true, cod_tipo_flujo_comercial: true, cod_producto: true, cantidad_det: true, precio_unitario_det: true, descuento_ped: true });
        if (isInvalid) return;
        post(route('pedidos.store'));
    };

    return (
        <PedidoLayout title="Crear pedido" subtitle="Registra el pedido inicial con cliente, origen comercial y primer producto.">
            <Head title="Crear pedido" />
            <form onSubmit={submit} className="space-y-6" noValidate>
                <div className="grid gap-5 md:grid-cols-3">
                    <SelectField id="cod_cliente" label="Cliente" value={data.cod_cliente} error={(touched.cod_cliente && clientErrors.cod_cliente) || errors.cod_cliente} onChange={(value) => setData('cod_cliente', value)} onBlur={() => setTouched((value) => ({ ...value, cod_cliente: true }))}>
                        <option value="">Seleccionar cliente</option>
                        {clientes.map((cliente) => <option key={cliente.cod_cliente} value={cliente.cod_cliente}>{cliente.nombre_cli}</option>)}
                    </SelectField>
                    <SelectField id="cod_canal_venta" label="Canal" value={data.cod_canal_venta} error={(touched.cod_canal_venta && clientErrors.cod_canal_venta) || errors.cod_canal_venta} onChange={(value) => setData('cod_canal_venta', value)} onBlur={() => setTouched((value) => ({ ...value, cod_canal_venta: true }))}>
                        <option value="">Seleccionar canal</option>
                        {canales.map((canal) => <option key={canal.cod_canal_venta} value={canal.cod_canal_venta}>{canal.nombre_can}</option>)}
                    </SelectField>
                    <SelectField id="cod_tipo_flujo_comercial" label="Tipo de flujo" value={data.cod_tipo_flujo_comercial} error={(touched.cod_tipo_flujo_comercial && clientErrors.cod_tipo_flujo_comercial) || errors.cod_tipo_flujo_comercial} onChange={(value) => setData('cod_tipo_flujo_comercial', value)} onBlur={() => setTouched((value) => ({ ...value, cod_tipo_flujo_comercial: true }))}>
                        <option value="">Seleccionar flujo</option>
                        {tiposFlujo.map((tipo) => <option key={tipo.cod_tipo_flujo_comercial} value={tipo.cod_tipo_flujo_comercial}>{tipo.nombre_tip}</option>)}
                    </SelectField>
                </div>

                <div className="rounded-2xl border border-akin-border bg-akin-surfaceSoft p-5">
                    <h2 className="text-lg font-black text-akin-text">Detalle del pedido</h2>
                    <div className="mt-5 grid gap-5 md:grid-cols-3">
                        <SelectField id="cod_producto" label="Producto" value={detail.cod_producto} error={(touched.cod_producto && clientErrors.cod_producto) || errors['detalles.0.cod_producto']} onChange={(value) => updateDetail('cod_producto', value)} onBlur={() => setTouched((value) => ({ ...value, cod_producto: true }))}>
                            <option value="">Seleccionar producto</option>
                            {productos.map((producto) => <option key={producto.cod_producto} value={producto.cod_producto}>{producto.nombre_pro}</option>)}
                        </SelectField>
                        <InputField id="cantidad_det" label="Cantidad" type="number" min="1" value={detail.cantidad_det} error={(touched.cantidad_det && clientErrors.cantidad_det) || errors['detalles.0.cantidad_det']} onChange={(value) => updateDetail('cantidad_det', value)} onBlur={() => setTouched((value) => ({ ...value, cantidad_det: true }))} />
                        <InputField id="precio_unitario_det" label="Precio unitario" type="number" min="0" step="0.01" value={detail.precio_unitario_det} error={(touched.precio_unitario_det && clientErrors.precio_unitario_det) || errors['detalles.0.precio_unitario_det']} onChange={(value) => updateDetail('precio_unitario_det', value)} onBlur={() => setTouched((value) => ({ ...value, precio_unitario_det: true }))} />
                    </div>
                </div>

                <InputField id="descuento_ped" label="Descuento" type="number" min="0" step="0.01" value={data.descuento_ped} error={(touched.descuento_ped && clientErrors.descuento_ped) || errors.descuento_ped} onChange={(value) => setData('descuento_ped', value)} onBlur={() => setTouched((value) => ({ ...value, descuento_ped: true }))} />
                <TextAreaField id="observacion_ped" label="Observacion" value={data.observacion_ped} error={errors.observacion_ped} onChange={(value) => setData('observacion_ped', value)} />

                <div className="flex flex-col gap-3 border-t border-akin-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-akin-muted">{isInvalid ? 'Completa cliente, canal, flujo y producto para guardar.' : 'Listo para guardar.'}</p>
                    <div className="flex gap-3">
                        <Link href={route('pedidos.index')}><SecondaryButton>Cancelar</SecondaryButton></Link>
                        <PrimaryButton disabled={processing || isInvalid}>{processing ? 'Guardando...' : 'Guardar pedido'}</PrimaryButton>
                    </div>
                </div>
            </form>
        </PedidoLayout>
    );
}

export function PedidoLayout({ title, subtitle, children }) {
    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl space-y-6">
                <section className="akin-card p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Pedidos</p>
                    <h1 className="mt-2 text-3xl font-black text-akin-text">{title}</h1>
                    <p className="mt-2 text-sm leading-6 text-akin-muted">{subtitle}</p>
                </section>
                <section className="akin-card p-6">{children}</section>
            </div>
        </DashboardLayout>
    );
}

export function InputField({ id, label, value, error, onChange, onBlur, type = 'text', ...props }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required={Boolean(onBlur)} />
            <input id={id} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined} {...props} />
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export function SelectField({ id, label, value, error, onChange, onBlur, children }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required />
            <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined}>
                {children}
            </select>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

export function TextAreaField({ id, label, value, error, onChange }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <textarea id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows="4" className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined} />
            <InputError message={error} className="mt-2" />
        </div>
    );
}
