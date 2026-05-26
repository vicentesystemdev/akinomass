import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import StatusBadge from '@/Components/UI/StatusBadge';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Show({ sesion, productos = [], estadosInteraccion = [] }) {
    const [productTouched, setProductTouched] = useState({});
    const [interactionTouched, setInteractionTouched] = useState({});
    const productForm = useForm({ cod_producto: '', orden_proliv: 1 });
    const interactionForm = useForm({ alias_int: '', nombre_int: '', telefono_int: '', cod_producto: '', estado_int: estadosInteraccion[0] ?? '' });

    const productErrors = useMemo(() => ({
        cod_producto: !productForm.data.cod_producto ? 'Selecciona un producto.' : '',
        orden_proliv: Number(productForm.data.orden_proliv) <= 0 ? 'El orden debe ser positivo.' : '',
    }), [productForm.data]);

    const interactionErrors = useMemo(() => ({
        alias_int: !interactionForm.data.alias_int.trim() ? 'El alias es obligatorio.' : '',
        estado_int: !interactionForm.data.estado_int ? 'Selecciona un estado.' : '',
    }), [interactionForm.data]);

    const productInvalid = Object.values(productErrors).some(Boolean);
    const interactionInvalid = Object.values(interactionErrors).some(Boolean);

    const submitProduct = (e) => {
        e.preventDefault();
        setProductTouched({ cod_producto: true, orden_proliv: true });
        if (productInvalid) return;
        productForm.post(route('live-sales.agregar-producto', sesion.cod_sesion_live));
    };

    const submitInteraction = (e) => {
        e.preventDefault();
        setInteractionTouched({ alias_int: true, estado_int: true });
        if (interactionInvalid) return;
        interactionForm.post(route('live-sales.registrar-interaccion', sesion.cod_sesion_live));
    };

    return (
        <DashboardLayout>
            <Head title={sesion.titulo_ses} />

            <div className="space-y-6">
                <section className="akin-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-akin-accent">Sesion LiveSales</p>
                            <h1 className="mt-2 text-3xl font-black text-akin-text">{sesion.titulo_ses}</h1>
                            <p className="mt-2 text-sm text-akin-muted">Registro manual rapido para venta en vivo.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <StatusBadge>{formatStatus(sesion.estado_ses)}</StatusBadge>
                            <Link href={route('live-sales.edit', sesion.cod_sesion_live)}><SecondaryButton>Editar</SecondaryButton></Link>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="akin-card p-6">
                        <h2 className="text-lg font-black text-akin-text">Agregar producto ofrecido</h2>
                        <form onSubmit={submitProduct} className="mt-5 space-y-4" noValidate>
                            <SelectField id="cod_producto" label="Producto" value={productForm.data.cod_producto} error={(productTouched.cod_producto && productErrors.cod_producto) || productForm.errors.cod_producto} onChange={(value) => productForm.setData('cod_producto', value)} onBlur={() => setProductTouched((value) => ({ ...value, cod_producto: true }))}>
                                <option value="">Seleccionar producto</option>
                                {productos.map((producto) => <option key={producto.cod_producto} value={producto.cod_producto}>{producto.nombre_pro}</option>)}
                            </SelectField>
                            <InputField id="orden_proliv" label="Orden" type="number" min="1" value={productForm.data.orden_proliv} error={(productTouched.orden_proliv && productErrors.orden_proliv) || productForm.errors.orden_proliv} onChange={(value) => productForm.setData('orden_proliv', value)} onBlur={() => setProductTouched((value) => ({ ...value, orden_proliv: true }))} />
                            <PrimaryButton disabled={productForm.processing || productInvalid}>{productForm.processing ? 'Agregando...' : 'Agregar producto'}</PrimaryButton>
                        </form>
                    </section>

                    <section className="akin-card p-6">
                        <h2 className="text-lg font-black text-akin-text">Registrar interaccion</h2>
                        <form onSubmit={submitInteraction} className="mt-5 space-y-4" noValidate>
                            <InputField id="alias_int" label="Alias o referencia" value={interactionForm.data.alias_int} error={(interactionTouched.alias_int && interactionErrors.alias_int) || interactionForm.errors.alias_int} onChange={(value) => interactionForm.setData('alias_int', value)} onBlur={() => setInteractionTouched((value) => ({ ...value, alias_int: true }))} />
                            <InputField id="nombre_int" label="Nombre" value={interactionForm.data.nombre_int} error={interactionForm.errors.nombre_int} onChange={(value) => interactionForm.setData('nombre_int', value)} />
                            <InputField id="telefono_int" label="Telefono" value={interactionForm.data.telefono_int} error={interactionForm.errors.telefono_int} onChange={(value) => interactionForm.setData('telefono_int', value)} />
                            <SelectField id="interaccion_producto" label="Producto de interes" value={interactionForm.data.cod_producto} error={interactionForm.errors.cod_producto} onChange={(value) => interactionForm.setData('cod_producto', value)}>
                                <option value="">Sin producto definido</option>
                                {productos.map((producto) => <option key={producto.cod_producto} value={producto.cod_producto}>{producto.nombre_pro}</option>)}
                            </SelectField>
                            <SelectField id="estado_int" label="Estado" value={interactionForm.data.estado_int} error={(interactionTouched.estado_int && interactionErrors.estado_int) || interactionForm.errors.estado_int} onChange={(value) => interactionForm.setData('estado_int', value)} onBlur={() => setInteractionTouched((value) => ({ ...value, estado_int: true }))}>
                                <option value="">Seleccionar estado</option>
                                {estadosInteraccion.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                            </SelectField>
                            <PrimaryButton disabled={interactionForm.processing || interactionInvalid}>{interactionForm.processing ? 'Registrando...' : 'Registrar interaccion'}</PrimaryButton>
                        </form>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

function InputField({ id, label, value, error, onChange, onBlur, type = 'text', ...props }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required={Boolean(onBlur)} />
            <input id={id} type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined} {...props} />
            <InputError message={error} className="mt-2" />
        </div>
    );
}

function SelectField({ id, label, value, error, onChange, onBlur, children }) {
    return (
        <div>
            <InputLabel htmlFor={id} value={label} required={Boolean(onBlur)} />
            <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className="akin-input mt-1 block w-full px-4 py-3 shadow-sm focus:ring-4" aria-invalid={error ? 'true' : undefined}>
                {children}
            </select>
            <InputError message={error} className="mt-2" />
        </div>
    );
}

function formatStatus(value) {
    if (!value) return 'Borrador';
    return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
