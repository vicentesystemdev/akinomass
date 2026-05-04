import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create({ tipos = [] }) {
  const listaTipos = Array.isArray(tipos) ? tipos : [];

  const { data, setData, post, processing, errors, clearErrors } = useForm({
    nombre_pla: '',
    tipo_pla: listaTipos[0] ?? '',
    contenido_pla: '',
    activo_pla: true,
  });

  const [clientErrors, setClientErrors] = useState({});
  const [wasValidated, setWasValidated] = useState(false);
  const [copiedVariable, setCopiedVariable] = useState(null);

  const allErrors = {
    ...errors,
    ...clientErrors,
  };

  const validationStatus = useMemo(() => {
    const validation = validarPlantilla(data, listaTipos);

    return {
      errors: validation,
      isValid: Object.keys(validation).length === 0,
    };
  }, [data, listaTipos]);

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

    const validation = validarPlantilla(data, listaTipos);
    setClientErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    post(route('plantillas-mensaje.store'), {
      preserveScroll: true,
    });
  };

  const insertVariable = (variable) => {
    const contenidoActual = data.contenido_pla || '';
    const separador =
      contenidoActual.length > 0 && !contenidoActual.endsWith(' ') ? ' ' : '';

    updateField('contenido_pla', `${contenidoActual}${separador}${variable}`);

    setCopiedVariable(variable);

    window.setTimeout(() => {
      setCopiedVariable(null);
    }, 1200);
  };

  const canSubmit = validationStatus.isValid && !processing;

  return (
    <AuthenticatedLayout>
      <Head title="Crear plantilla" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
            Comunicación comercial
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#2B221E]">
                Crear plantilla
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-[#2B221E]/65">
                Crea mensajes reutilizables para responder leads, clientes,
                promociones, seguimientos o confirmaciones. Una buena plantilla
                reduce tiempos de respuesta y mantiene coherencia comercial.
              </p>
            </div>

            <Link
              href={route('plantillas-mensaje.index')}
              className="inline-flex items-center justify-center rounded-2xl border border-[#D77A61]/30 px-5 py-3 text-sm font-bold text-[#D77A61] transition hover:bg-[#D77A61] hover:text-white"
            >
              Volver al listado
            </Link>
          </div>
        </section>

        {wasValidated && !validationStatus.isValid && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <h2 className="text-base font-black text-red-700">
              Revisa la plantilla
            </h2>

            <p className="mt-1 text-sm text-red-600">
              Hay campos obligatorios o contenido que debe ajustarse antes de guardar.
            </p>
          </section>
        )}

        <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-6 xl:col-span-2">
            <FormCard
              title="Identificación de la plantilla"
              description="Define un nombre claro y el tipo de mensaje para encontrarla rápidamente."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Nombre de la plantilla"
                  error={allErrors.nombre_pla}
                  helper="Entre 3 y 100 caracteres. Ejemplo: Primer contacto WhatsApp."
                  required
                >
                  <input
                    type="text"
                    value={data.nombre_pla}
                    onChange={(e) =>
                      updateField(
                        'nombre_pla',
                        normalizarNombre(e.target.value),
                      )
                    }
                    placeholder="Ej. Primer contacto WhatsApp"
                    maxLength="100"
                    className={inputClass(allErrors.nombre_pla)}
                  />
                </FormField>

                <FormField
                  label="Tipo de plantilla"
                  error={allErrors.tipo_pla}
                  helper="Clasifica el uso comercial del mensaje."
                  required
                >
                  <select
                    value={data.tipo_pla}
                    onChange={(e) =>
                      updateField('tipo_pla', e.target.value)
                    }
                    className={inputClass(allErrors.tipo_pla)}
                  >
                    {listaTipos.length === 0 && (
                      <option value="">Sin tipos disponibles</option>
                    )}

                    {listaTipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {formatearTexto(tipo)}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormCard>

            <FormCard
              title="Contenido del mensaje"
              description="Redacta el mensaje que el equipo comercial podrá copiar, adaptar y enviar."
            >
              <FormField
                label="Mensaje"
                error={allErrors.contenido_pla}
                helper={`${String(data.contenido_pla || '').length}/1500 caracteres. Recomendado: claro, breve y accionable.`}
                required
              >
                <textarea
                  value={data.contenido_pla}
                  onChange={(e) =>
                    updateField('contenido_pla', e.target.value)
                  }
                  placeholder="Ej. Hola {cliente}, gracias por escribirnos. Te comparto información sobre {producto}..."
                  rows="10"
                  maxLength="1500"
                  className={inputClass(allErrors.contenido_pla)}
                />
              </FormField>

              <div className="rounded-3xl border border-[#eadfd6] bg-[#FDF6F0] p-5">
                <h3 className="text-base font-black text-[#2B221E]">
                  Variables sugeridas
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#2B221E]/60">
                  Puedes insertar variables como referencia para personalizar
                  el mensaje antes de enviarlo.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {VARIABLES_SUGERIDAS.map((variable) => (
                    <button
                      key={variable}
                      type="button"
                      onClick={() => insertVariable(variable)}
                      className="rounded-xl border border-[#eadfd6] bg-white px-3 py-2 text-xs font-black text-[#3C473A] transition hover:bg-[#3C473A] hover:text-white"
                    >
                      {copiedVariable === variable
                        ? 'Insertada'
                        : variable}
                    </button>
                  ))}
                </div>
              </div>
            </FormCard>

            <FormCard
              title="Estado de uso"
              description="Controla si esta plantilla estará disponible para uso comercial inmediato."
            >
              <div className="rounded-3xl border border-[#eadfd6] bg-[#FDF6F0] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#2B221E]">
                      Plantilla activa
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[#2B221E]/65">
                      Si está activa, aparecerá como sugerida para uso rápido.
                      Si está inactiva, se conserva como borrador o historial.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField('activo_pla', !data.activo_pla)
                    }
                    className={[
                      'relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border transition',
                      data.activo_pla
                        ? 'border-green-300 bg-green-500'
                        : 'border-gray-300 bg-gray-300',
                    ].join(' ')}
                    aria-pressed={data.activo_pla}
                  >
                    <span
                      className={[
                        'inline-block h-6 w-6 transform rounded-full bg-white shadow transition',
                        data.activo_pla
                          ? 'translate-x-9'
                          : 'translate-x-1',
                      ].join(' ')}
                    />
                  </button>
                </div>

                <div className="mt-4">
                  <EstadoBadge active={data.activo_pla} />
                </div>
              </div>
            </FormCard>

            <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <h3 className="text-base font-black text-blue-800">
                Recomendación de ventas
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                Una plantilla efectiva debe ser breve, personalizada y tener una
                acción clara: responder, confirmar, cotizar, agendar seguimiento
                o invitar a comprar. Evita mensajes demasiado largos o ambiguos.
              </p>
            </section>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D77A61]">
                Vista previa
              </p>

              <h2 className="mt-2 text-xl font-black text-[#2B221E]">
                Mensaje comercial
              </h2>

              <div className="mt-6 rounded-3xl border border-[#eadfd6] bg-[#FDF6F0] p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-black text-[#D77A61] shadow-sm">
                  {obtenerInicial(data.nombre_pla)}
                </div>

                <h3 className="mt-5 text-lg font-black text-[#2B221E]">
                  {data.nombre_pla || 'Nombre de la plantilla'}
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  <TipoBadge tipo={data.tipo_pla} />
                  <EstadoBadge active={data.activo_pla} />
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B221E]/45">
                    Contenido
                  </p>

                  <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-6 text-[#2B221E]/70">
                    {data.contenido_pla ||
                      'Aquí aparecerá el mensaje de la plantilla.'}
                  </pre>
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B221E]/45">
                    Lectura comercial
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#2B221E]/65">
                    {obtenerLecturaComercial(data)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#2B221E]">
                Control de validación
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#2B221E]/60">
                La plantilla se puede guardar cuando tiene identificación,
                tipo y contenido útil.
              </p>

              <div className="mt-4 space-y-3">
                <ValidationItem
                  valid={String(data.nombre_pla).trim().length >= 3}
                  label="Nombre válido"
                />

                <ValidationItem
                  valid={Boolean(data.tipo_pla)}
                  label="Tipo seleccionado"
                />

                <ValidationItem
                  valid={String(data.contenido_pla).trim().length >= 10}
                  label="Contenido suficiente"
                />

                <ValidationItem
                  valid={String(data.contenido_pla).length <= 1500}
                  label="Contenido dentro del límite"
                />

                <ValidationItem
                  valid={validationStatus.isValid}
                  label="Plantilla lista para guardar"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#2B221E]">
                Acciones
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#2B221E]/60">
                Verifica que el mensaje sea claro y reutilizable antes de
                guardarlo.
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
                    ? 'Guardando...'
                    : validationStatus.isValid
                      ? 'Guardar plantilla'
                      : 'Completa los datos requeridos'}
                </button>

                {!validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-[#2B221E]/50">
                    Completa nombre, tipo y contenido mínimo.
                  </p>
                )}

                <Link
                  href={route('plantillas-mensaje.index')}
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

const VARIABLES_SUGERIDAS = [
  '{cliente}',
  '{producto}',
  '{precio}',
  '{fecha}',
  '{pedido}',
  '{asesor}',
  '{telefono}',
  '{tienda}',
];

function validarPlantilla(data, tipos) {
  const errors = {};

  const nombre = String(data.nombre_pla || '').trim();
  const tipo = String(data.tipo_pla || '').trim();
  const contenido = String(data.contenido_pla || '').trim();

  if (!nombre) {
    errors.nombre_pla = 'El nombre de la plantilla es obligatorio.';
  } else if (nombre.length < 3) {
    errors.nombre_pla = 'El nombre debe tener al menos 3 caracteres.';
  } else if (nombre.length > 100) {
    errors.nombre_pla = 'El nombre no debe superar los 100 caracteres.';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_/&().]+$/.test(nombre)) {
    errors.nombre_pla = 'El nombre contiene caracteres no permitidos.';
  }

  if (!tipo) {
    errors.tipo_pla = 'El tipo de plantilla es obligatorio.';
  } else if (Array.isArray(tipos) && tipos.length > 0 && !tipos.includes(tipo)) {
    errors.tipo_pla = 'El tipo seleccionado no es válido.';
  }

  if (!contenido) {
    errors.contenido_pla = 'El contenido de la plantilla es obligatorio.';
  } else if (contenido.length < 10) {
    errors.contenido_pla = 'El contenido debe tener al menos 10 caracteres.';
  } else if (contenido.length > 1500) {
    errors.contenido_pla = 'El contenido no debe superar los 1500 caracteres.';
  }

  return errors;
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

function TipoBadge({ tipo }) {
  const tipoNormalizado = normalizarTexto(tipo);

  if (
    tipoNormalizado.includes('whatsapp') ||
    tipoNormalizado.includes('seguimiento')
  ) {
    return <Badge tone="green">{formatearTexto(tipo || 'Seguimiento')}</Badge>;
  }

  if (
    tipoNormalizado.includes('promocion') ||
    tipoNormalizado.includes('promo') ||
    tipoNormalizado.includes('oferta')
  ) {
    return <Badge tone="orange">{formatearTexto(tipo || 'Promoción')}</Badge>;
  }

  if (
    tipoNormalizado.includes('bienvenida') ||
    tipoNormalizado.includes('contacto')
  ) {
    return <Badge tone="blue">{formatearTexto(tipo || 'Contacto')}</Badge>;
  }

  return <Badge tone="earth">{formatearTexto(tipo || 'General')}</Badge>;
}

function EstadoBadge({ active }) {
  if (active) {
    return <Badge tone="green">Activa</Badge>;
  }

  return <Badge tone="gray">Inactiva</Badge>;
}

function Badge({ children, tone = 'earth' }) {
  const tones = {
    green: 'border-green-200 bg-green-100 text-green-700',
    blue: 'border-blue-200 bg-blue-100 text-blue-700',
    gray: 'border-gray-200 bg-gray-100 text-gray-700',
    orange: 'border-orange-200 bg-orange-100 text-orange-700',
    earth: 'border-[#eadfd6] bg-[#FDF6F0] text-[#3C473A]',
  };

  return (
    <span
      className={[
        'inline-flex rounded-full border px-3 py-1 text-xs font-black',
        tones[tone],
      ].join(' ')}
    >
      {children}
    </span>
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

function obtenerLecturaComercial(data) {
  const contenido = String(data.contenido_pla || '').trim();
  const tipo = normalizarTexto(data.tipo_pla);

  if (!data.nombre_pla || !data.tipo_pla || !contenido) {
    return 'La plantilla todavía está incompleta. Define nombre, tipo y contenido para que sea útil.';
  }

  if (contenido.length < 60) {
    return 'Mensaje breve y rápido. Útil para respuestas directas, pero verifica que incluya contexto suficiente.';
  }

  if (contenido.length > 500) {
    return 'Mensaje extenso. Conviene revisar si puede simplificarse para mejorar velocidad de atención.';
  }

  if (tipo.includes('seguimiento')) {
    return 'Ideal para retomar conversaciones con leads o clientes sin perder continuidad comercial.';
  }

  if (tipo.includes('promocion') || tipo.includes('oferta')) {
    return 'Útil para comunicar promociones, descuentos o productos destacados.';
  }

  if (tipo.includes('bienvenida') || tipo.includes('contacto')) {
    return 'Útil para primer contacto y apertura de conversación comercial.';
  }

  return 'Plantilla útil para estandarizar respuestas y mejorar la atención comercial.';
}

function normalizarNombre(value) {
  return String(value || '').replace(/\s+/g, ' ').replace(/^\s/, '');
}

function normalizarTexto(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function formatearTexto(value) {
  return String(value || 'Sin dato')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function obtenerInicial(nombre) {
  return String(nombre || 'P')
    .trim()
    .charAt(0)
    .toUpperCase();
}