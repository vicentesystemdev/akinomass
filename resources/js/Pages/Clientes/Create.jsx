import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create(props) {
    const estados = normalizarLista(props.estados);
    const canales = normalizarLista(
        props.canales ||
            props.canalesVenta ||
            props.canales_venta ||
            props.canalVentas,
    );
    const tiposFlujo = normalizarLista(
        props.tiposFlujoComercial ||
            props.tipos_flujo_comercial ||
            props.tiposFlujo ||
            props.flujos,
    );

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        nombre_cli: '',
        telefono_cli: '',
        correo_cli: '',
        direccion_cli: '',
        documento_cli: '',
        observacion_cli: '',
        estado_cli: estados[0] ?? 'activo',
        cod_canal_venta: '',
        cod_tipo_flujo_comercial: '',
    });

    const [clientErrors, setClientErrors] = useState({});
    const [wasValidated, setWasValidated] = useState(false);

    const allErrors = {
        ...errors,
        ...clientErrors,
    };

    const canalSeleccionado = useMemo(() => {
        return canales.find(
            (canal) =>
                String(obtenerCodigo(canal, ['cod_canal_venta', 'cod_can', 'id'])) ===
                String(data.cod_canal_venta),
        );
    }, [canales, data.cod_canal_venta]);

    const flujoSeleccionado = useMemo(() => {
        return tiposFlujo.find(
            (flujo) =>
                String(
                    obtenerCodigo(flujo, [
                        'cod_tipo_flujo_comercial',
                        'cod_tip',
                        'id',
                    ]),
                ) === String(data.cod_tipo_flujo_comercial),
        );
    }, [tiposFlujo, data.cod_tipo_flujo_comercial]);

    const validationStatus = useMemo(() => {
        const validation = validarCliente(data, estados, canales, tiposFlujo);

        return {
            errors: validation,
            isValid: Object.keys(validation).length === 0,
        };
    }, [data, estados, canales, tiposFlujo]);

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

        const validation = validarCliente(data, estados, canales, tiposFlujo);
        setClientErrors(validation);

        if (Object.keys(validation).length > 0) {
            return;
        }

        post(route('clientes.store'), {
            preserveScroll: true,
        });
    };

    const canSubmit = validationStatus.isValid && !processing;

    return (
        <DashboardLayout>
            <Head title="Crear cliente" />

            <div className="space-y-6">
                <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
                        CRM comercial
                    </p>

                    <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-akin-text">
                                Crear cliente
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                                Registra un cliente con datos de contacto, canal de origen,
                                flujo comercial y estado. Una ficha completa permite mejorar
                                seguimiento, segmentación, ventas y atención posterior.
                            </p>
                        </div>

                        <Link
                            href={route('clientes.index')}
                            className="inline-flex items-center justify-center rounded-2xl border border-akin-accent/30 px-5 py-3 text-sm font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
                        >
                            Volver al listado
                        </Link>
                    </div>
                </section>

                {wasValidated && !validationStatus.isValid && (
                    <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
                        <h2 className="text-base font-black text-red-700">
                            Revisa los datos del cliente
                        </h2>

                        <p className="mt-1 text-sm text-red-600">
                            Hay campos obligatorios o datos de contacto con formato inválido.
                        </p>
                    </section>
                )}

                <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
                    <section className="space-y-6 xl:col-span-2">
                        <FormCard
                            title="Datos principales"
                            description="Información base para identificar al cliente dentro del CRM."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    label="Nombre del cliente"
                                    error={allErrors.nombre_cli}
                                    helper="Entre 3 y 120 caracteres."
                                    required
                                >
                                    <input
                                        type="text"
                                        value={data.nombre_cli}
                                        onChange={(e) =>
                                            updateField(
                                                'nombre_cli',
                                                normalizarNombre(e.target.value),
                                            )
                                        }
                                        placeholder="Ej. Andrea Mamani"
                                        maxLength="120"
                                        className={inputClass(allErrors.nombre_cli)}
                                    />
                                </FormField>

                                <FormField
                                    label="Documento"
                                    error={allErrors.documento_cli}
                                    helper="Opcional. CI, NIT u otro identificador comercial."
                                >
                                    <input
                                        type="text"
                                        value={data.documento_cli}
                                        onChange={(e) =>
                                            updateField(
                                                'documento_cli',
                                                limpiarDocumento(e.target.value),
                                            )
                                        }
                                        placeholder="Ej. 12345678"
                                        maxLength="30"
                                        className={inputClass(allErrors.documento_cli)}
                                    />
                                </FormField>
                            </div>
                        </FormCard>

                        <FormCard
                            title="Contacto"
                            description="Datos necesarios para seguimiento, confirmaciones y comunicación comercial."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    label="Teléfono"
                                    error={allErrors.telefono_cli}
                                    helper="Obligatorio. Entre 7 y 15 dígitos. Puede incluir + al inicio."
                                    required
                                >
                                    <input
                                        type="tel"
                                        value={data.telefono_cli}
                                        onChange={(e) =>
                                            updateField(
                                                'telefono_cli',
                                                limpiarTelefono(e.target.value),
                                            )
                                        }
                                        placeholder="Ej. 76543210"
                                        maxLength="16"
                                        className={inputClass(allErrors.telefono_cli)}
                                    />
                                </FormField>

                                <FormField
                                    label="Correo"
                                    error={allErrors.correo_cli}
                                    helper="Opcional. Ejemplo: cliente@gmail.com"
                                >
                                    <input
                                        type="email"
                                        value={data.correo_cli}
                                        onChange={(e) =>
                                            updateField(
                                                'correo_cli',
                                                e.target.value.trim().toLowerCase(),
                                            )
                                        }
                                        placeholder="cliente@gmail.com"
                                        maxLength="120"
                                        className={inputClass(allErrors.correo_cli)}
                                    />
                                </FormField>
                            </div>

                            <FormField
                                label="Dirección"
                                error={allErrors.direccion_cli}
                                helper={`${String(data.direccion_cli || '').length}/180 caracteres. Opcional, útil para entregas o segmentación por zona.`}
                            >
                                <input
                                    type="text"
                                    value={data.direccion_cli}
                                    onChange={(e) =>
                                        updateField('direccion_cli', e.target.value)
                                    }
                                    placeholder="Ej. Zona Sopocachi, La Paz"
                                    maxLength="180"
                                    className={inputClass(allErrors.direccion_cli)}
                                />
                            </FormField>
                        </FormCard>

                        <FormCard
                            title="Clasificación comercial"
                            description="Permite conocer el origen del cliente y cómo será atendido dentro del proceso de ventas."
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    label="Estado"
                                    error={allErrors.estado_cli}
                                    helper="Define si el cliente está activo, inactivo u otro estado disponible."
                                    required
                                >
                                    <select
                                        value={data.estado_cli}
                                        onChange={(e) =>
                                            updateField('estado_cli', e.target.value)
                                        }
                                        className={inputClass(allErrors.estado_cli)}
                                    >
                                        {estados.length === 0 && (
                                            <option value="">Sin estados disponibles</option>
                                        )}

                                        {estados.map((estado) => (
                                            <option key={estado} value={estado}>
                                                {formatearTexto(estado)}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Canal de venta"
                                    error={allErrors.cod_canal_venta}
                                    helper="Recomendado. Ayuda a medir de dónde llegan los clientes."
                                >
                                    <select
                                        value={data.cod_canal_venta}
                                        onChange={(e) =>
                                            updateField('cod_canal_venta', e.target.value)
                                        }
                                        className={inputClass(allErrors.cod_canal_venta)}
                                    >
                                        <option value="">Seleccione canal</option>

                                        {canales.map((canal) => {
                                            const codigo = obtenerCodigo(canal, [
                                                'cod_canal_venta',
                                                'cod_can',
                                                'id',
                                            ]);

                                            return (
                                                <option key={codigo} value={codigo}>
                                                    {obtenerNombre(canal, [
                                                        'nombre_can',
                                                        'nombre_canal',
                                                        'nom_can',
                                                        'name',
                                                    ])}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </FormField>

                                <FormField
                                    label="Flujo comercial"
                                    error={allErrors.cod_tipo_flujo_comercial}
                                    helper="Recomendado. Segmenta el tipo de atención o proceso comercial."
                                >
                                    <select
                                        value={data.cod_tipo_flujo_comercial}
                                        onChange={(e) =>
                                            updateField(
                                                'cod_tipo_flujo_comercial',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass(
                                            allErrors.cod_tipo_flujo_comercial,
                                        )}
                                    >
                                        <option value="">Seleccione flujo</option>

                                        {tiposFlujo.map((flujo) => {
                                            const codigo = obtenerCodigo(flujo, [
                                                'cod_tipo_flujo_comercial',
                                                'cod_tip',
                                                'id',
                                            ]);

                                            return (
                                                <option key={codigo} value={codigo}>
                                                    {obtenerNombre(flujo, [
                                                        'nombre_tip',
                                                        'nombre_tipo',
                                                        'nombre_flujo',
                                                        'nom_tip',
                                                        'name',
                                                    ])}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </FormField>
                            </div>
                        </FormCard>

                        <FormCard
                            title="Observación comercial"
                            description="Registra información relevante para atención futura, preferencias o contexto del cliente."
                        >
                            <FormField
                                label="Observación"
                                error={allErrors.observacion_cli}
                                helper={`${String(data.observacion_cli || '').length}/700 caracteres. Opcional: preferencias, interés, historial, notas comerciales.`}
                            >
                                <textarea
                                    value={data.observacion_cli}
                                    onChange={(e) =>
                                        updateField('observacion_cli', e.target.value)
                                    }
                                    placeholder="Ej. Cliente interesado en productos por temporada, prefiere contacto por WhatsApp."
                                    rows="5"
                                    maxLength="700"
                                    className={inputClass(allErrors.observacion_cli)}
                                />
                            </FormField>
                        </FormCard>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-akin-accent">
                                Vista previa
                            </p>

                            <h2 className="mt-2 text-xl font-black text-akin-text">
                                Ficha comercial
                            </h2>

                            <div className="mt-6 rounded-3xl border border-akin-border bg-akin-bg p-5">
                                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-akin-surface text-3xl font-black text-akin-accent shadow-sm">
                                    {obtenerInicial(data.nombre_cli)}
                                </div>

                                <h3 className="mt-5 text-lg font-black text-akin-text">
                                    {data.nombre_cli || 'Nombre del cliente'}
                                </h3>

                                <p className="mt-1 text-sm text-akin-muted">
                                    {data.telefono_cli || 'Teléfono pendiente'}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge>
                                        {formatearTexto(data.estado_cli || 'Sin estado')}
                                    </Badge>

                                    <Badge>
                                        {obtenerNombre(canalSeleccionado, [
                                            'nombre_can',
                                            'nombre_canal',
                                            'nom_can',
                                            'name',
                                        ]) || 'Sin canal'}
                                    </Badge>

                                    <Badge>
                                        {obtenerNombre(flujoSeleccionado, [
                                            'nombre_tip',
                                            'nombre_tipo',
                                            'nombre_flujo',
                                            'nom_tip',
                                            'name',
                                        ]) || 'Sin flujo'}
                                    </Badge>
                                </div>

                                <div className="mt-5 border-t border-akin-border pt-5">
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-akin-text/45">
                                        Lectura comercial
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-akin-muted">
                                        {obtenerLecturaComercial(data)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                            <h3 className="text-lg font-black text-akin-text">
                                Control de validación
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-akin-muted">
                                El registro se habilita cuando los datos mínimos de cliente
                                y contacto son correctos.
                            </p>

                            <div className="mt-4 space-y-3">
                                <ValidationItem
                                    valid={String(data.nombre_cli).trim().length >= 3}
                                    label="Nombre válido"
                                />

                                <ValidationItem
                                    valid={telefonoValido(data.telefono_cli)}
                                    label="Teléfono válido"
                                />

                                <ValidationItem
                                    valid={
                                        !data.correo_cli ||
                                        correoValido(data.correo_cli)
                                    }
                                    label="Correo válido u omitido"
                                />

                                <ValidationItem
                                    valid={Boolean(data.estado_cli)}
                                    label="Estado seleccionado"
                                />

                                <ValidationItem
                                    valid={validationStatus.isValid}
                                    label="Cliente listo para guardar"
                                />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
                            <h3 className="text-lg font-black text-akin-text">
                                Acciones
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-akin-muted">
                                Verifica que el teléfono y nombre correspondan al cliente
                                antes de guardar.
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
                                        ? 'Guardando...'
                                        : validationStatus.isValid
                                            ? 'Guardar cliente'
                                            : 'Completa los datos requeridos'}
                                </button>

                                {!validationStatus.isValid && (
                                    <p className="text-center text-xs font-semibold text-akin-muted">
                                        Completa nombre, teléfono válido y estado.
                                    </p>
                                )}

                                <Link
                                    href={route('clientes.index')}
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

function validarCliente(data, estados, canales, tiposFlujo) {
    const errors = {};

    const nombre = String(data.nombre_cli || '').trim();
    const telefono = String(data.telefono_cli || '').trim();
    const correo = String(data.correo_cli || '').trim();
    const direccion = String(data.direccion_cli || '').trim();
    const documento = String(data.documento_cli || '').trim();
    const observacion = String(data.observacion_cli || '').trim();
    const estado = String(data.estado_cli || '').trim();

    if (!nombre) {
        errors.nombre_cli = 'El nombre del cliente es obligatorio.';
    } else if (nombre.length < 3) {
        errors.nombre_cli = 'El nombre debe tener al menos 3 caracteres.';
    } else if (nombre.length > 120) {
        errors.nombre_cli = 'El nombre no debe superar los 120 caracteres.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.'-]+$/.test(nombre)) {
        errors.nombre_cli = 'El nombre contiene caracteres no permitidos.';
    }

    if (!telefono) {
        errors.telefono_cli = 'El teléfono es obligatorio.';
    } else if (!telefonoValido(telefono)) {
        errors.telefono_cli = 'El teléfono debe tener entre 7 y 15 dígitos.';
    }

    if (correo && !correoValido(correo)) {
        errors.correo_cli = 'El correo no tiene un formato válido.';
    }

    if (direccion.length > 180) {
        errors.direccion_cli = 'La dirección no debe superar los 180 caracteres.';
    }

    if (documento.length > 30) {
        errors.documento_cli = 'El documento no debe superar los 30 caracteres.';
    }

    if (observacion.length > 700) {
        errors.observacion_cli = 'La observación no debe superar los 700 caracteres.';
    }

    if (!estado) {
        errors.estado_cli = 'El estado del cliente es obligatorio.';
    } else if (Array.isArray(estados) && estados.length > 0 && !estados.includes(estado)) {
        errors.estado_cli = 'El estado seleccionado no es válido.';
    }

    if (
        data.cod_canal_venta &&
        !existeCodigo(canales, data.cod_canal_venta, [
            'cod_canal_venta',
            'cod_can',
            'id',
        ])
    ) {
        errors.cod_canal_venta = 'El canal seleccionado no es válido.';
    }

    if (
        data.cod_tipo_flujo_comercial &&
        !existeCodigo(tiposFlujo, data.cod_tipo_flujo_comercial, [
            'cod_tipo_flujo_comercial',
            'cod_tip',
            'id',
        ])
    ) {
        errors.cod_tipo_flujo_comercial =
            'El flujo comercial seleccionado no es válido.';
    }

    return errors;
}

function FormCard({ title, description, children }) {
    return (
        <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-black text-akin-text">{title}</h2>

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
                <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
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

function Badge({ children }) {
    return (
        <span className="inline-flex rounded-full border border-akin-border bg-akin-surface px-3 py-1 text-xs font-black text-akin-primary">
            {children}
        </span>
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

function telefonoValido(value) {
    const limpio = String(value || '').replace(/[^\d]/g, '');
    return limpio.length >= 7 && limpio.length <= 15;
}

function correoValido(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function limpiarTelefono(value) {
    return String(value || '')
        .replace(/[^\d+]/g, '')
        .replace(/(?!^)\+/g, '');
}

function limpiarDocumento(value) {
    return String(value || '').replace(/[^A-Za-z0-9\-]/g, '');
}

function normalizarNombre(value) {
    return String(value || '').replace(/\s+/g, ' ').replace(/^\s/, '');
}

function normalizarLista(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    return [];
}

function obtenerCodigo(item, keys) {
    if (!item) return '';

    for (const key of keys) {
        if (item[key] !== undefined && item[key] !== null) {
            return item[key];
        }
    }

    return '';
}

function obtenerNombre(item, keys) {
    if (!item) return '';

    for (const key of keys) {
        if (item[key] !== undefined && item[key] !== null) {
            return item[key];
        }
    }

    return '';
}

function existeCodigo(lista, codigo, keys) {
    return lista.some((item) => String(obtenerCodigo(item, keys)) === String(codigo));
}

function obtenerLecturaComercial(data) {
    if (!data.nombre_cli || !data.telefono_cli) {
        return 'Ficha incompleta. Registra nombre y teléfono para iniciar seguimiento comercial.';
    }

    if (!data.cod_canal_venta && !data.cod_tipo_flujo_comercial) {
        return 'Cliente registrable, pero falta canal y flujo. Completar estos datos mejora análisis de ventas.';
    }

    if (!data.cod_canal_venta) {
        return 'Cliente con contacto válido, pero falta canal de origen para medir adquisición.';
    }

    if (!data.cod_tipo_flujo_comercial) {
        return 'Cliente con canal identificado, pero falta flujo comercial para segmentar atención.';
    }

    return 'Ficha completa para seguimiento comercial, segmentación y análisis de clientes.';
}

function formatearTexto(value) {
    return String(value || 'Sin dato')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function obtenerInicial(nombre) {
    return String(nombre || 'C').trim().charAt(0).toUpperCase();
}