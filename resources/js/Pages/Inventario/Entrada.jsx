import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Entrada({ productos = [] }) {
    const listaProductos = Array.isArray(productos)
        ? productos
        : productos?.data || [];

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        cod_producto: '',
        cantidad_mov: 1,
        motivo_mov: '',
        observacion_mov: '',
    });

    const [clientErrors, setClientErrors] = useState({});
    const [wasValidated, setWasValidated] = useState(false);

    const allErrors = {
        ...errors,
        ...clientErrors,
    };

    const productoSeleccionado = useMemo(() => {
        return listaProductos.find(
            (producto) => String(producto.cod_producto) === String(data.cod_producto),
        );
    }, [listaProductos, data.cod_producto]);

    const validationStatus = useMemo(() => {
        const validation = validarEntrada(data, listaProductos);

        return {
            errors: validation,
            isValid: Object.keys(validation).length === 0,
        };
    }, [data, listaProductos]);

    const updateField = (field, value) => {
        setData(field, value);

        if (clientErrors[field]) {
            setClientErrors((current) => {
                const next = { ...current };
                delete next[field];
                return next;
            });
        }

        clearErrors(field);
    };

    const submit = (e) => {
        e.preventDefault();
        setWasValidated(true);

        const validation = validarEntrada(data, listaProductos);
        setClientErrors(validation);

        if (Object.keys(validation).length > 0) {
            return;
        }

        post(route('inventario.entrada'), {
            preserveScroll: true,
        });
    };

    const canSubmit = validationStatus.isValid && !processing;

    return (
        <DashboardLayout>
            <Head title="Registrar entrada de inventario" />

            <div className="space-y-6">
                <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
                        Movimiento positivo de stock
                    </p>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-akin-text">
                                Registrar entrada
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                                Registra ingresos de inventario por compra, producción,
                                devolución o regularización positiva. Este movimiento incrementa
                                el stock disponible y deja trazabilidad para control operativo.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('inventario.index')}
                                className="inline-flex items-center justify-center rounded-2xl border border-akin-accent/30 px-5 py-3 text-sm font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
                            >
                                Volver a inventario
                            </Link>

                            <Link
                                href={route('inventario.movimientos')}
                                className="inline-flex items-center justify-center rounded-2xl border border-akin-border bg-akin-bg px-5 py-3 text-sm font-bold text-akin-primary transition hover:bg-akin-primary hover:text-white"
                            >
                                Ver movimientos
                            </Link>
                        </div>
                    </div>
                </section>

                {wasValidated && !validationStatus.isValid && (
                    <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                        <h2 className="text-base font-black text-red-700">
                            Revisa la entrada de inventario
                        </h2>

                        <p className="mt-1 text-sm text-red-600">
                            Debes seleccionar un producto, ingresar una cantidad válida y
                            registrar un motivo claro antes de guardar.
                        </p>
                    </section>
                )}

                <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
                    <section className="space-y-6 xl:col-span-2">
                        <FormCard
                            title="Producto y cantidad"
                            description="Selecciona el producto que recibirá stock y define cuántas unidades ingresan."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    label="Producto"
                                    error={allErrors.cod_producto}
                                    helper="Selecciona el producto exacto para evitar diferencias de inventario."
                                    required
                                >
                                    <select
                                        value={data.cod_producto}
                                        onChange={(e) =>
                                            updateField('cod_producto', e.target.value)
                                        }
                                        className={inputClass(allErrors.cod_producto)}
                                    >
                                        <option value="">Seleccione producto</option>

                                        {listaProductos.map((producto) => (
                                            <option
                                                key={producto.cod_producto}
                                                value={producto.cod_producto}
                                            >
                                                {producto.nombre_pro}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Cantidad de entrada"
                                    error={allErrors.cantidad_mov}
                                    helper="Debe ser un número entero mayor a 0."
                                    required
                                >
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={data.cantidad_mov}
                                        onChange={(e) =>
                                            updateField('cantidad_mov', e.target.value)
                                        }
                                        placeholder="Ej. 12"
                                        className={inputClass(allErrors.cantidad_mov)}
                                    />
                                </FormField>
                            </div>
                        </FormCard>

                        <FormCard
                            title="Justificación del movimiento"
                            description="El motivo permite explicar por qué se incrementa el stock y ayuda a auditar operaciones."
                        >
                            <FormField
                                label="Motivo de entrada"
                                error={allErrors.motivo_mov}
                                helper="Entre 3 y 120 caracteres. Ejemplo: Compra a proveedor, producción nueva, devolución de cliente."
                                required
                            >
                                <input
                                    type="text"
                                    value={data.motivo_mov}
                                    onChange={(e) =>
                                        updateField('motivo_mov', normalizarTexto(e.target.value))
                                    }
                                    placeholder="Ej. Compra a proveedor"
                                    maxLength="120"
                                    className={inputClass(allErrors.motivo_mov)}
                                />
                            </FormField>

                            <FormField
                                label="Observación"
                                error={allErrors.observacion_mov}
                                helper={`${String(data.observacion_mov || '').length}/500 caracteres. Opcional: documento, proveedor, lote, responsable o detalle operativo.`}
                            >
                                <textarea
                                    value={data.observacion_mov}
                                    onChange={(e) =>
                                        updateField('observacion_mov', e.target.value)
                                    }
                                    placeholder="Ej. Ingreso según factura N° 001-245, proveedor local, revisión física completa."
                                    rows="5"
                                    maxLength="500"
                                    className={inputClass(allErrors.observacion_mov)}
                                />
                            </FormField>
                        </FormCard>

                        <section className="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
                            <h3 className="text-base font-black text-green-800">
                                Impacto operativo
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-green-700">
                                Esta acción aumentará la disponibilidad comercial del producto.
                                Es útil para reponer stock, habilitar ventas y reducir riesgo de
                                quiebre de inventario. Verifica físicamente la cantidad antes de
                                registrar.
                            </p>
                        </section>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-akin-accent">
                                Vista previa
                            </p>

                            <h2 className="mt-2 text-xl font-black text-akin-text">
                                Entrada a registrar
                            </h2>

                            <div className="mt-6 rounded-3xl border border-akin-border bg-akin-bg p-5">
                                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-akin-surface text-3xl font-black text-akin-accent shadow-sm">
                                    {obtenerInicial(productoSeleccionado?.nombre_pro)}
                                </div>

                                <h3 className="mt-5 text-lg font-black text-akin-text">
                                    {productoSeleccionado?.nombre_pro ||
                                        'Producto no seleccionado'}
                                </h3>

                                <p className="mt-1 text-sm text-akin-muted">
                                    Código:{' '}
                                    {productoSeleccionado?.cod_producto ||
                                        'Seleccione un producto'}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <PreviewBox
                                        label="Cantidad"
                                        value={`+${data.cantidad_mov || 0}`}
                                    />

                                    <PreviewBox
                                        label="Movimiento"
                                        value="Entrada"
                                    />
                                </div>

                                <div className="mt-5 border-t border-akin-border pt-5">
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-akin-text/45">
                                        Motivo
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-akin-text">
                                        {data.motivo_mov || 'Pendiente de registrar'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                            <h3 className="text-lg font-black text-akin-text">
                                Control de validación
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-akin-muted">
                                La entrada se habilita solo cuando el movimiento tiene
                                producto, cantidad y motivo válidos.
                            </p>

                            <div className="mt-4 space-y-3">
                                <ValidationItem
                                    valid={Boolean(data.cod_producto)}
                                    label="Producto seleccionado"
                                />

                                <ValidationItem
                                    valid={Number(data.cantidad_mov) > 0}
                                    label="Cantidad mayor a cero"
                                />

                                <ValidationItem
                                    valid={Number.isInteger(Number(data.cantidad_mov))}
                                    label="Cantidad entera"
                                />

                                <ValidationItem
                                    valid={String(data.motivo_mov).trim().length >= 3}
                                    label="Motivo registrado"
                                />

                                <ValidationItem
                                    valid={validationStatus.isValid}
                                    label="Movimiento listo para guardar"
                                />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                            <h3 className="text-lg font-black text-akin-text">
                                Acciones
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-akin-muted">
                                Confirma que el ingreso físico coincida con la cantidad
                                registrada.
                            </p>

                            <div className="mt-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className={[
                                        'w-full rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition',
                                        canSubmit
                                            ? 'bg-akin-accent text-white hover:bg-akin-accentSoft'
                                            : 'cursor-not-allowed bg-gray-300 text-gray-500',
                                    ].join(' ')}
                                >
                                    {processing
                                        ? 'Registrando...'
                                        : validationStatus.isValid
                                            ? 'Guardar entrada'
                                            : 'Completa los datos requeridos'}
                                </button>

                                {!validationStatus.isValid && (
                                    <p className="text-center text-xs font-semibold text-akin-muted">
                                        Selecciona producto, cantidad válida y motivo.
                                    </p>
                                )}

                                <Link
                                    href={route('inventario.index')}
                                    className="flex w-full items-center justify-center rounded-2xl border border-akin-border px-5 py-3 text-sm font-bold text-akin-text transition hover:border-akin-accent/40 hover:text-akin-accent"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </DashboardLayout>
    );
}

function validarEntrada(data, productos) {
    const errors = {};

    const productoExiste = productos.some(
        (producto) => String(producto.cod_producto) === String(data.cod_producto),
    );

    const cantidadRaw = String(data.cantidad_mov || '').trim();
    const cantidad = Number(cantidadRaw);
    const motivo = String(data.motivo_mov || '').trim();
    const observacion = String(data.observacion_mov || '').trim();

    if (!data.cod_producto) {
        errors.cod_producto = 'El producto es obligatorio.';
    } else if (!productoExiste) {
        errors.cod_producto = 'El producto seleccionado no es válido.';
    }

    if (!cantidadRaw) {
        errors.cantidad_mov = 'La cantidad es obligatoria.';
    } else if (Number.isNaN(cantidad)) {
        errors.cantidad_mov = 'La cantidad debe ser numérica.';
    } else if (!Number.isInteger(cantidad)) {
        errors.cantidad_mov = 'La cantidad debe ser un número entero.';
    } else if (cantidad <= 0) {
        errors.cantidad_mov = 'La cantidad debe ser mayor a 0.';
    } else if (cantidad > 100000) {
        errors.cantidad_mov = 'La cantidad ingresada es demasiado alta.';
    }

    if (!motivo) {
        errors.motivo_mov = 'El motivo de entrada es obligatorio.';
    } else if (motivo.length < 3) {
        errors.motivo_mov = 'El motivo debe tener al menos 3 caracteres.';
    } else if (motivo.length > 120) {
        errors.motivo_mov = 'El motivo no debe superar los 120 caracteres.';
    }

    if (observacion.length > 500) {
        errors.observacion_mov = 'La observación no debe superar los 500 caracteres.';
    }

    return errors;
}

function PreviewBox({ label, value }) {
    return (
        <div className="rounded-2xl bg-akin-surface p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-akin-muted">
                {label}
            </p>

            <p className="mt-1 text-lg font-black text-akin-text">
                {value}
            </p>
        </div>
    );
}

function ValidationItem({ valid, label }) {
    return (
        <div className="flex items-center gap-3">
            <span
                className={[
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-black',
                    valid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
                ].join(' ')}
            >
                {valid ? '✓' : '!'}
            </span>

            <span
                className={[
                    'text-sm font-semibold',
                    valid ? 'text-akin-text' : 'text-akin-text/55',
                ].join(' ')}
            >
                {label}
            </span>
        </div>
    );
}

function FormCard({ title, description, children }) {
    return (
        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-black text-akin-text">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm leading-6 text-akin-muted">
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-5">{children}</div>
        </div>
    );
}

function FormField({ label, error, helper, required = false, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-bold text-akin-text">
                {label}
                {required && <span className="ml-1 text-akin-accent">*</span>}
            </span>

            {children}

            {error ? (
                <p className="mt-2 text-sm font-semibold text-red-600">
                    {error}
                </p>
            ) : (
                helper && (
                    <p className="mt-2 text-xs font-medium text-akin-text/45">
                        {helper}
                    </p>
                )
            )}
        </label>
    );
}

function inputClass(error) {
    return [
        'w-full rounded-2xl border bg-akin-surface px-4 py-3 text-sm text-akin-text shadow-sm outline-none transition',
        'placeholder:text-akin-text/35 focus:ring-4',
        error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-akin-border focus:border-akin-accent focus:ring-akin-accent/15',
    ].join(' ');
}

function normalizarTexto(value) {
    return value.replace(/\s+/g, ' ').replace(/^\s/, '');
}

function obtenerInicial(nombre) {
    return String(nombre || 'E')
        .trim()
        .charAt(0)
        .toUpperCase();
}