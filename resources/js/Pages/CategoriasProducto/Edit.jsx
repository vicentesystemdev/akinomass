import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Edit({ categoria }) {
  const { data, setData, put, processing, errors, clearErrors } = useForm({
    nombre_cat: categoria.nombre_cat ?? '',
    descripcion_cat: categoria.descripcion_cat ?? '',
    activo_cat: Boolean(categoria.activo_cat),
  });

  const [clientErrors, setClientErrors] = useState({});
  const [wasValidated, setWasValidated] = useState(false);

  const allErrors = {
    ...errors,
    ...clientErrors,
  };

  const validationStatus = useMemo(() => {
    const validation = validarCategoria(data);

    return {
      errors: validation,
      isValid: Object.keys(validation).length === 0,
    };
  }, [data]);

  const hasChanges = useMemo(() => {
    return (
      String(data.nombre_cat ?? '') !== String(categoria.nombre_cat ?? '') ||
      String(data.descripcion_cat ?? '') !== String(categoria.descripcion_cat ?? '') ||
      Boolean(data.activo_cat) !== Boolean(categoria.activo_cat)
    );
  }, [data, categoria]);

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

    const validation = validarCategoria(data);
    setClientErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    if (!hasChanges) {
      return;
    }

    put(route('categorias-producto.update', categoria.cod_categoria_producto), {
      preserveScroll: true,
    });
  };

  const canSubmit = validationStatus.isValid && hasChanges && !processing;

  return (
    <DashboardLayout>
      <Head title="Editar categoría" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
            Gestión del catálogo
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-akin-text">
                Editar categoría
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                Actualiza la categoría comercial cuidando que siga siendo
                clara, útil y coherente para ventas, inventario y clasificación
                de productos. Las categorías bien definidas facilitan el análisis
                del catálogo y la toma de decisiones comerciales.
              </p>
            </div>

            <Link
              href={route('categorias-producto.index')}
              className="inline-flex items-center justify-center rounded-2xl border border-akin-accent/30 px-5 py-3 text-sm font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
            >
              Volver al listado
            </Link>
          </div>
        </section>

        {wasValidated && !validationStatus.isValid && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <h2 className="text-base font-black text-red-700">
              Revisa los datos de la categoría
            </h2>

            <p className="mt-1 text-sm text-red-600">
              Hay campos obligatorios o valores inválidos antes de actualizar.
            </p>
          </section>
        )}

        <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-6 xl:col-span-2">
            <FormCard
              title="Datos principales"
              description="Mantén una categoría clara para que el equipo pueda clasificar productos sin confusión."
            >
              <FormField
                label="Nombre de la categoría"
                error={allErrors.nombre_cat}
                helper="Entre 3 y 80 caracteres. Usa nombres comerciales claros como Jeans, Poleras, Chamarras o Accesorios."
                required
              >
                <input
                  type="text"
                  value={data.nombre_cat}
                  onChange={(e) =>
                    updateField('nombre_cat', normalizarNombre(e.target.value))
                  }
                  placeholder="Ej. Jeans"
                  maxLength="80"
                  className={inputClass(allErrors.nombre_cat)}
                />
              </FormField>

              <FormField
                label="Descripción"
                error={allErrors.descripcion_cat}
                helper={`${String(data.descripcion_cat || '').length}/500 caracteres. Describe cuándo y para qué debe usarse esta categoría.`}
              >
                <textarea
                  value={data.descripcion_cat}
                  onChange={(e) =>
                    updateField('descripcion_cat', e.target.value)
                  }
                  placeholder="Ej. Prendas de mezclilla para catálogo urbano, casual y promociones de temporada."
                  rows="5"
                  maxLength="500"
                  className={inputClass(allErrors.descripcion_cat)}
                />
              </FormField>
            </FormCard>

            <FormCard
              title="Estado comercial"
              description="Define si esta categoría seguirá disponible para clasificar productos nuevos."
            >
              <div className="rounded-3xl border border-akin-border bg-akin-bg p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-black text-akin-text">
                      Disponibilidad de la categoría
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-akin-muted">
                      Una categoría activa puede ser utilizada en productos
                      nuevos o existentes. Una categoría inactiva se conserva
                      para trazabilidad histórica, pero no debería usarse para
                      nuevos registros comerciales.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField('activo_cat', !data.activo_cat)
                    }
                    className={[
                      'relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border transition',
                      data.activo_cat
                        ? 'border-green-300 bg-green-500'
                        : 'border-gray-300 bg-gray-300',
                    ].join(' ')}
                    aria-pressed={data.activo_cat}
                  >
                    <span
                      className={[
                        'inline-block h-6 w-6 transform rounded-full bg-akin-surface shadow transition',
                        data.activo_cat
                          ? 'translate-x-9'
                          : 'translate-x-1',
                      ].join(' ')}
                    />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge active={data.activo_cat} />

                  {Boolean(categoria.activo_cat) !== Boolean(data.activo_cat) && (
                    <span className="inline-flex rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300">
                      Estado modificado
                    </span>
                  )}
                </div>
              </div>
            </FormCard>

            {!data.activo_cat && (
              <section className="rounded-3xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-500/30 dark:bg-orange-500/10 shadow-sm">
                <h3 className="text-base font-black text-orange-800 dark:text-orange-300">
                  Atención comercial
                </h3>

                <p className="mt-1 text-sm leading-6 text-orange-700 dark:text-orange-300">
                  Al dejar esta categoría inactiva, se recomienda no asignarla
                  a nuevos productos. Esta acción es útil para categorías que
                  ya no forman parte de la estrategia comercial, temporadas
                  pasadas o líneas discontinuadas.
                </p>
              </section>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-akin-accent">
                Vista previa
              </p>

              <h2 className="mt-2 text-xl font-black text-akin-text">
                Categoría comercial
              </h2>

              <div className="mt-6 rounded-3xl border border-akin-border bg-akin-bg p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-akin-surface text-3xl font-black text-akin-accent shadow-sm">
                  {obtenerInicial(data.nombre_cat)}
                </div>

                <h3 className="mt-5 text-lg font-black text-akin-text">
                  {data.nombre_cat || 'Nombre de la categoría'}
                </h3>

                <p className="mt-2 text-sm leading-6 text-akin-muted">
                  {data.descripcion_cat ||
                    'Aquí aparecerá la descripción comercial de la categoría.'}
                </p>

                <div className="mt-5 border-t border-akin-border pt-5">
                  <StatusBadge active={data.activo_cat} />
                </div>

                <div className="mt-5 rounded-2xl bg-akin-surface p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-akin-muted">
                    Código interno
                  </p>

                  <p className="mt-1 text-sm font-black text-akin-text">
                    {categoria.cod_categoria_producto || 'N/D'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <h3 className="text-lg font-black text-akin-text">
                Control de actualización
              </h3>

              <p className="mt-2 text-sm leading-6 text-akin-muted">
                La actualización se habilita solo si existen cambios y los
                datos cumplen las reglas comerciales mínimas.
              </p>

              <div className="mt-4 space-y-3">
                <ValidationItem
                  valid={String(data.nombre_cat).trim().length >= 3}
                  label="Nombre suficientemente claro"
                />

                <ValidationItem
                  valid={String(data.nombre_cat).trim().length <= 80}
                  label="Nombre dentro del límite"
                />

                <ValidationItem
                  valid={String(data.descripcion_cat || '').length <= 500}
                  label="Descripción dentro del límite"
                />

                <ValidationItem
                  valid={validationStatus.isValid}
                  label="Formulario sin errores"
                />

                <ValidationItem
                  valid={hasChanges}
                  label="Existen cambios por guardar"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <h3 className="text-lg font-black text-akin-text">
                Acciones
              </h3>

              <p className="mt-2 text-sm leading-6 text-akin-muted">
                Verifica que la categoría mantenga sentido comercial antes
                de actualizar.
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
                    ? 'Actualizando...'
                    : !validationStatus.isValid
                      ? 'Corrige las validaciones'
                      : !hasChanges
                        ? 'Sin cambios por guardar'
                        : 'Actualizar categoría'}
                </button>

                {!validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-akin-muted">
                    Ingresa un nombre válido de al menos 3 caracteres.
                  </p>
                )}

                {!hasChanges && validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-akin-muted">
                    Modifica al menos un dato para habilitar la actualización.
                  </p>
                )}

                <Link
                  href={route('categorias-producto.index')}
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

function validarCategoria(data) {
  const errors = {};

  const nombre = String(data.nombre_cat || '').trim();
  const descripcion = String(data.descripcion_cat || '').trim();

  if (!nombre) {
    errors.nombre_cat = 'El nombre de la categoría es obligatorio.';
  } else if (nombre.length < 3) {
    errors.nombre_cat = 'El nombre debe tener al menos 3 caracteres.';
  } else if (nombre.length > 80) {
    errors.nombre_cat = 'El nombre no debe superar los 80 caracteres.';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_/&.]+$/.test(nombre)) {
    errors.nombre_cat =
      'El nombre contiene caracteres no permitidos para una categoría comercial.';
  }

  if (descripcion.length > 500) {
    errors.descripcion_cat = 'La descripción no debe superar los 500 caracteres.';
  }

  return errors;
}

function normalizarNombre(value) {
  return value.replace(/\s+/g, ' ').replace(/^\s/, '');
}

function StatusBadge({ active }) {
  if (active) {
    return (
      <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300">
        Activa para catálogo
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-black text-gray-700 dark:border-gray-500/30 dark:bg-gray-500/10 dark:text-gray-300">
      Inactiva / solo histórica
    </span>
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

function obtenerInicial(nombre) {
  return String(nombre || 'C')
    .trim()
    .charAt(0)
    .toUpperCase();
}