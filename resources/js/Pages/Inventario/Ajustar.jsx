import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Ajustar({ productos = [] }) {
    const listaProductos = Array.isArray(productos)
        ? productos
        : productos?.data || [];

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        cod_producto: '',
        stock_nuevo_mov: 0,
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
        const validation = validarAjuste(data, listaProductos);

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

        const validation = validarAjuste(data, listaProductos);
        setClientErrors(validation);

        if (Object.keys(validation).length > 0) {
            return;
        }

        post(route('inventario.ajuste'), {
            preserveScroll: true,
        });
    };

    const canSubmit = validationStatus.isValid && !processing;

    return (
        <AuthenticatedLayout>
            <Head title="Ajustar inventario" />

            <div className="space-y-6">
                <section className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
                        Corrección controlada de stock
                    </p>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-[#2B221E]">
                                Ajustar inventario
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#2B221E]/65">
                                Registra una corrección directa del stock final de un producto.
                                Este movimiento debe utilizarse después de conteos físicos,
                                auditorías, diferencias operativas o regularizaciones internas.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={route('inventario.index')}
                                className="inline-flex items-center justify-center rounded-2xl border border-[#D77A61]/30 px-5 py-3 text-sm font-bold text-[#D77A61] transition hover:bg-[#D77A61] hover:text-white"
                            >
                                Volver a inventario
                            </Link>

                            <Link
                                href={route('inventario.movimientos')}
                                className="inline-flex items-center justify-center rounded-2xl border border-[#eadfd6] bg-[#FDF6F0] px-5 py-3 text-sm font-bold text-[#3C473A] transition hover:bg-[#3C473A] hover:text-white"
                            >
                                Ver movimientos
                            </Link>
                        </div>
                    </div>
                </section>

                {wasValidated && !validationStatus.isValid && (
                    <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                        <h2 className="text-base font-black text-red-700">
                            Revisa el ajuste de inventario
                        </h2>

                        <p className="mt-1 text-sm text-red-600">
                            Selecciona un producto, define un stock final válido y registra
                            un motivo claro antes de guardar.
                        </p>
                    </section>
                )}

                <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
                    <section className="space-y-6 xl:col-span-2">
                        <FormCard
                            title="Producto y stock final"
                            description="Selecciona el producto y define el stock real que debe quedar registrado después del ajuste."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    label="Producto"
                                    error={allErrors.cod_producto}
                                    helper="Selecciona exactamente el producto que será ajustado."
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
                                    label="Nuevo stock final"
                                    error={allErrors.stock_nuevo_mov}
                                    helper="Debe ser un número entero mayor o igual a 0."
                                    required
                                >
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.stock_nuevo_mov}
                                        onChange={(e) =>
                                            updateField('stock_nuevo_mov', e.target.value)
                                        }
                                        placeholder="Ej. 15"
                                        className={inputClass(allErrors.stock_nuevo_mov)}
                                    />
                                </FormField>
                            </div>
                        </FormCard>

                        <FormCard
                            title="Justificación del ajuste"
                            description="El ajuste cambia directamente el stock final, por eso el motivo debe explicar claramente la causa."
                        >
                            <FormField
                                label="Motivo del ajuste"
                                error={allErrors.motivo_mov}
                                helper="Entre 5 y 150 caracteres. Ejemplo: Conteo físico, diferencia de inventario, corrección por auditoría."
                                required
                            >
                                <input
                                    type="text"
                                    value={data.motivo_mov}
                                    onChange={(e) =>
                                        updateField(
                                            'motivo_mov',
                                            normalizarTexto(e.target.value),
                                        )
                                    }
                                    placeholder="Ej. Conteo físico de inventario"
                                    maxLength="150"
                                    className={inputClass(allErrors.motivo_mov)}
                                />
                            </FormField>

                            <FormField
                                label="Observación"
                                error={allErrors.observacion_mov}
                                helper={`${String(data.observacion_mov || '').length}/700 caracteres. Opcional: evidencia, conteo anterior, responsable, ubicación o detalle operativo.`}
                            >
                                <textarea
                                    value={data.observacion_mov}
                                    onChange={(e) =>
                                        updateField('observacion_mov', e.target.value)
                                    }
                                    placeholder="Ej. Ajuste realizado después de conteo físico en almacén principal. Se verificó diferencia con registro anterior."
                                    rows="5"
                                    maxLength="700"
                                    className={inputClass(allErrors.observacion_mov)}
                                />
                            </FormField>
                        </FormCard>

                        <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                            <h3 className="text-base font-black text-red-800">
                                Ajuste sensible
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-red-700">
                                Un ajuste modifica el stock final sin depender de una entrada
                                o salida normal. Debe usarse únicamente cuando exista una
                                verificación física, documental o administrativa. En gestión
                                comercial, este movimiento ayuda a corregir diferencias, pero
                                también debe quedar bien documentado.
                            </p>
                        </section>

                        <section className="rounded-3xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
                            <h3 className="text-base font-black text-orange-800">
                                Recomendación de control interno
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-orange-700">
                                Si el ajuste se realiza por pérdida, merma o diferencia recurrente,
                                registra una observación detallada. Esto permite detectar problemas
                                de rotación, almacenamiento, conteo, registro de ventas o recepción
                                de productos.
                            </p>
                        </section>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D77A61]">
                                Vista previa
                            </p>

                            <h2 className="mt-2 text-xl font-black text-[#2B221E]">
                                Ajuste a registrar
                            </h2>

                            <div className="mt-6 rounded-3xl border border-[#eadfd6] bg-[#FDF6F0] p-5">
                                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-black text-[#D77A61] shadow-sm">
                                    {obtenerInicial(productoSeleccionado?.nombre_pro)}
                                </div>

                                <h3 className="mt-5 text-lg font-black text-[#2B221E]">
                                    {productoSeleccionado?.nombre_pro ||
                                        'Producto no seleccionado'}
                                </h3>

                                <p className="mt-1 text-sm text-[#2B221E]/60">
                                    Código:{' '}
                                    {productoSeleccionado?.cod_producto ||
                                        'Seleccione un producto'}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <PreviewBox
                                        label="Stock final"
                                        value={data.stock_nuevo_mov || 0}
                                        highlight
                                    />

                                    <PreviewBox
                                        label="Movimiento"
                                        value="Ajuste"
                                    />
                                </div>

                                <div className="mt-5 border-t border-[#eadfd6] pt-5">
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B221E]/45">
                                        Motivo
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#2B221E]">
                                        {data.motivo_mov || 'Pendiente de registrar'}
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl bg-white p-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2B221E]/40">
                                        Lectura empresarial
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-[#2B221E]/65">
                                        {obtenerLecturaAjuste(data.stock_nuevo_mov)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-black text-[#2B221E]">
                                Control de validación
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#2B221E]/60">
                                El ajuste se habilita solo cuando cumple las reglas mínimas
                                de control, auditoría y trazabilidad.
                            </p>

                            <div className="mt-4 space-y-3">
                                <ValidationItem
                                    valid={Boolean(data.cod_producto)}
                                    label="Producto seleccionado"
                                />

                                <ValidationItem
                                    valid={Number(data.stock_nuevo_mov) >= 0}
                                    label="Stock no negativo"
                                />

                                <ValidationItem
                                    valid={Number.isInteger(Number(data.stock_nuevo_mov))}
                                    label="Stock entero"
                                />

                                <ValidationItem
                                    valid={String(data.motivo_mov).trim().length >= 5}
                                    label="Motivo suficientemente claro"
                                />

                                <ValidationItem
                                    valid={String(data.observacion_mov || '').length <= 700}
                                    label="Observación dentro del límite"
                                />

                                <ValidationItem
                                    valid={validationStatus.isValid}
                                    label="Ajuste listo para guardar"
                                />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-black text-[#2B221E]">
                                Acciones
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#2B221E]/60">
                                Guarda este ajuste solo si el stock final fue verificado.
                                Esta acción modificará directamente el inventario registrado.
                            </p>

                            <div className="mt-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className={[
                                        'w-full rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition',
                                        canSubmit
                                            ? 'bg-[#D77A61] text-white hover:bg-[#c96f58]'
                                            : 'cursor-not-allowed bg-gray-300 text-gray-500',
                                    ].join(' ')}
                                >
                                    {processing
                                        ? 'Registrando ajuste...'
                                        : validationStatus.isValid
                                            ? 'Guardar ajuste'
                                            : 'Completa los datos requeridos'}
                                </button>

                                {!validationStatus.isValid && (
                                    <p className="text-center text-xs font-semibold text-[#2B221E]/50">
                                        Selecciona producto, stock final válido y motivo claro.
                                    </p>
                                )}

                                <Link
                                    href={route('inventario.index')}
                                    className="flex w-full items-center justify-center rounded-2xl border border-[#eadfd6] px-5 py-3 text-sm font-bold text-[#2B221E] transition hover:border-[#D77A61]/40 hover:text-[#D77A61]"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

function validarAjuste(data, productos) {
    const errors = {};

    const productoExiste = productos.some(
        (producto) => String(producto.cod_producto) === String(data.cod_producto),
    );

    const stockRaw = String(data.stock_nuevo_mov ?? '').trim();
    const stockNuevo = Number(stockRaw);
    const motivo = String(data.motivo_mov || '').trim();
    const observacion = String(data.observacion_mov || '').trim();

    if (!data.cod_producto) {
        errors.cod_producto = 'El producto es obligatorio.';
    } else if (!productoExiste) {
        errors.cod_producto = 'El producto seleccionado no es válido.';
    }

    if (stockRaw === '') {
        errors.stock_nuevo_mov = 'El nuevo stock es obligatorio.';
    } else if (Number.isNaN(stockNuevo)) {
        errors.stock_nuevo_mov = 'El nuevo stock debe ser numérico.';
    } else if (!Number.isInteger(stockNuevo)) {
        errors.stock_nuevo_mov = 'El nuevo stock debe ser un número entero.';
    } else if (stockNuevo < 0) {
        errors.stock_nuevo_mov = 'El nuevo stock no puede ser negativo.';
    } else if (stockNuevo > 100000) {
        errors.stock_nuevo_mov = 'El nuevo stock ingresado es demasiado alto.';
    }

    if (!motivo) {
        errors.motivo_mov = 'El motivo del ajuste es obligatorio.';
    } else if (motivo.length < 5) {
        errors.motivo_mov = 'El motivo debe tener al menos 5 caracteres.';
    } else if (motivo.length > 150) {
        errors.motivo_mov = 'El motivo no debe superar los 150 caracteres.';
    }

    if (observacion.length > 700) {
        errors.observacion_mov = 'La observación no debe superar los 700 caracteres.';
    }

    return errors;
}

function obtenerLecturaAjuste(stockNuevo) {
    const stock = Number(stockNuevo);

    if (Number.isNaN(stock)) {
        return 'El stock final todavía no es válido. Ingresa un número entero para evaluar el impacto.';
    }

    if (stock === 0) {
        return 'El producto quedará sin disponibilidad. Verifica si debe pausarse su venta o priorizar reposición.';
    }

    if (stock > 0 && stock <= 5) {
        return 'El producto quedará con stock reducido. Conviene monitorear rotación y considerar reposición si tiene demanda.';
    }

    return 'El producto quedará con disponibilidad operativa. Mantén seguimiento según ventas y rotación.';
}

function PreviewBox({ label, value, highlight = false }) {
    return (
        <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2B221E]/40">
                {label}
            </p>

            <p
                className={[
                    'mt-1 text-lg font-black',
                    highlight ? 'text-[#D77A61]' : 'text-[#2B221E]',
                ].join(' ')}
            >
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
                        : 'bg-orange-100 text-orange-700',
                ].join(' ')}
            >
                {valid ? '✓' : '!'}
            </span>

            <span
                className={[
                    'text-sm font-semibold',
                    valid ? 'text-[#2B221E]' : 'text-[#2B221E]/55',
                ].join(' ')}
            >
                {label}
            </span>
        </div>
    );
}

function FormCard({ title, description, children }) {
    return (
        <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-black text-[#2B221E]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm leading-6 text-[#2B221E]/60">
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
            <span className="mb-2 block text-sm font-bold text-[#2B221E]">
                {label}
                {required && <span className="ml-1 text-[#D77A61]">*</span>}
            </span>

            {children}

            {error ? (
                <p className="mt-2 text-sm font-semibold text-red-600">
                    {error}
                </p>
            ) : (
                helper && (
                    <p className="mt-2 text-xs font-medium text-[#2B221E]/45">
                        {helper}
                    </p>
                )
            )}
        </label>
    );
}

function inputClass(error) {
    return [
        'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[#2B221E] shadow-sm outline-none transition',
        'placeholder:text-[#2B221E]/35 focus:ring-4',
        error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-[#eadfd6] focus:border-[#D77A61] focus:ring-[#D77A61]/15',
    ].join(' ');
}

function normalizarTexto(value) {
    return value.replace(/\s+/g, ' ').replace(/^\s/, '');
}

function obtenerInicial(nombre) {
    return String(nombre || 'A')
        .trim()
        .charAt(0)
        .toUpperCase();
}