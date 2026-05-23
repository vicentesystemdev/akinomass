import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function Create() {
  const { data, setData, post, processing, errors, clearErrors } = useForm({
    nombre_cat: "",
    descripcion_cat: "",
    activo_cat: true,
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

    post(route("categorias-producto.store"), {
      preserveScroll: true,
    });
  };

  const canSubmit = validationStatus.isValid && !processing;

  return (
    <DashboardLayout>
      <Head title="Nueva categoría" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
            Organización del catálogo
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-akin-text">
                Nueva categoría
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                Crea una categoría comercial para ordenar
                productos por línea, estilo, temporada o tipo de
                prenda. Una buena categoría mejora la búsqueda
                interna, el control de inventario y la
                presentación del catálogo.
              </p>
            </div>

            <Link
              href={route("categorias-producto.index")}
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
              Hay campos obligatorios o valores que deben
              corregirse antes de guardar.
            </p>
          </section>
        )}

        <form
          onSubmit={submit}
          noValidate
          className="grid gap-6 xl:grid-cols-3"
        >
          <section className="space-y-6 xl:col-span-2">
            <FormCard
              title="Datos principales"
              description="Define una categoría clara y fácil de entender para quienes gestionan ventas, inventario y catálogo."
            >
              <FormField
                label="Nombre de la categoría"
                error={allErrors.nombre_cat}
                helper="Entre 3 y 80 caracteres. Ejemplo: Jeans, Poleras, Chamarras, Accesorios."
                required
              >
                <input
                  type="text"
                  value={data.nombre_cat}
                  onChange={(e) =>
                    updateField(
                      "nombre_cat",
                      normalizarNombre(e.target.value),
                    )
                  }
                  placeholder="Ej. Jeans"
                  maxLength="80"
                  className={inputClass(allErrors.nombre_cat)}
                />
              </FormField>

              <FormField
                label="Descripción"
                error={allErrors.descripcion_cat}
                helper={`${String(data.descripcion_cat || "").length}/500 caracteres. Opcional, pero recomendable para explicar el uso comercial de la categoría.`}
              >
                <textarea
                  value={data.descripcion_cat}
                  onChange={(e) =>
                    updateField(
                      "descripcion_cat",
                      e.target.value,
                    )
                  }
                  placeholder="Ej. Prendas de mezclilla para catálogo urbano, casual y promociones de temporada."
                  rows="5"
                  maxLength="500"
                  className={inputClass(
                    allErrors.descripcion_cat,
                  )}
                />
              </FormField>
            </FormCard>

            <FormCard
              title="Estado comercial"
              description="Controla si la categoría estará disponible para clasificar productos nuevos."
            >
              <div className="rounded-3xl border border-akin-border bg-akin-bg p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-black text-akin-text">
                      Categoría activa
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-akin-muted">
                      Si está activa, podrá utilizarse
                      para registrar o editar productos.
                      Si está inactiva, se conserva para
                      trazabilidad, pero no debería usarse
                      en nuevos registros.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "activo_cat",
                        !data.activo_cat,
                      )
                    }
                    className={[
                      "relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border transition",
                      data.activo_cat
                        ? "border-green-300 bg-green-500"
                        : "border-gray-300 bg-gray-300",
                    ].join(" ")}
                    aria-pressed={data.activo_cat}
                  >
                    <span
                      className={[
                        "inline-block h-6 w-6 transform rounded-full bg-akin-surface shadow transition",
                        data.activo_cat
                          ? "translate-x-9"
                          : "translate-x-1",
                      ].join(" ")}
                    />
                  </button>
                </div>

                <div className="mt-4">
                  <StatusBadge active={data.activo_cat} />
                </div>
              </div>
            </FormCard>
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
                  {data.nombre_cat ||
                    "Nombre de la categoría"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-akin-muted">
                  {data.descripcion_cat ||
                    "Aquí aparecerá la descripción comercial de la categoría."}
                </p>

                <div className="mt-5 border-t border-akin-border pt-5">
                  <StatusBadge active={data.activo_cat} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <h3 className="text-lg font-black text-akin-text">
                Control de calidad
              </h3>

              <p className="mt-2 text-sm leading-6 text-akin-muted">
                Antes de crear una categoría, verifica que sea
                clara, comercialmente útil y no demasiado
                genérica.
              </p>

              <div className="mt-4 space-y-3">
                <ValidationItem
                  valid={
                    String(data.nombre_cat).trim().length >=
                    3
                  }
                  label="Nombre suficientemente claro"
                />

                <ValidationItem
                  valid={
                    String(data.nombre_cat).trim().length <=
                    80
                  }
                  label="Nombre dentro del límite"
                />

                <ValidationItem
                  valid={
                    String(data.descripcion_cat || "")
                      .length <= 500
                  }
                  label="Descripción dentro del límite"
                />

                <ValidationItem
                  valid={validationStatus.isValid}
                  label="Formulario listo para guardar"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <h3 className="text-lg font-black text-akin-text">
                Acciones
              </h3>

              <p className="mt-2 text-sm leading-6 text-akin-muted">
                El botón se habilita solo cuando la categoría
                cumple las validaciones mínimas del catálogo.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={[
                    "w-full rounded-2xl px-5 py-3 text-sm font-bold shadow-sm transition",
                    canSubmit
                      ? "bg-akin-accent text-white hover:bg-akin-accentSoft"
                      : "cursor-not-allowed bg-gray-300 text-gray-500",
                  ].join(" ")}
                >
                  {processing
                    ? "Guardando..."
                    : validationStatus.isValid
                      ? "Guardar categoría"
                      : "Completa los datos requeridos"}
                </button>

                {!validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-akin-muted">
                    Ingresa un nombre válido de al menos 3
                    caracteres.
                  </p>
                )}

                <Link
                  href={route("categorias-producto.index")}
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

  const nombre = String(data.nombre_cat || "").trim();
  const descripcion = String(data.descripcion_cat || "").trim();

  if (!nombre) {
    errors.nombre_cat = "El nombre de la categoría es obligatorio.";
  } else if (nombre.length < 3) {
    errors.nombre_cat = "El nombre debe tener al menos 3 caracteres.";
  } else if (nombre.length > 80) {
    errors.nombre_cat = "El nombre no debe superar los 80 caracteres.";
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-_/&.]+$/.test(nombre)) {
    errors.nombre_cat =
      "El nombre contiene caracteres no permitidos para una categoría comercial.";
  }

  if (descripcion.length > 500) {
    errors.descripcion_cat =
      "La descripción no debe superar los 500 caracteres.";
  }

  return errors;
}

function normalizarNombre(value) {
  return value.replace(/\s+/g, " ").replace(/^\s/, "");
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
          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-black",
          valid
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
        ].join(" ")}
      >
        {valid ? "✓" : "!"}
      </span>

      <span
        className={[
          "text-sm font-semibold",
          valid ? "text-akin-text" : "text-akin-text/55",
        ].join(" ")}
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
    "w-full rounded-2xl border bg-akin-surface px-4 py-3 text-sm text-akin-text shadow-sm outline-none transition",
    "placeholder:text-akin-text/35 focus:ring-4",
    error
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-akin-border focus:border-akin-accent focus:ring-akin-accent/15",
  ].join(" ");
}

function obtenerInicial(nombre) {
  return String(nombre || "C")
    .trim()
    .charAt(0)
    .toUpperCase();
}
