import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Edit({ producto, categorias = [], estados = [] }) {
  const estadoInicial = producto.estado_pro ?? estados[0] ?? 'activo';

  const { data, setData, put, processing, errors, clearErrors } = useForm({
    cod_categoria_producto: producto.cod_categoria_producto ?? '',
    nombre_pro: producto.nombre_pro ?? '',
    descripcion_pro: producto.descripcion_pro ?? '',
    precio_venta_pro: producto.precio_venta_pro ?? '',
    precio_costo_pro: producto.precio_costo_pro ?? '',
    sku_pro: producto.sku_pro ?? '',
    imagen_pro: producto.imagen_pro ?? '',
    estado_pro: estadoInicial,
  });

  const [clientErrors, setClientErrors] = useState({});
  const [wasValidated, setWasValidated] = useState(false);

  const allErrors = {
    ...errors,
    ...clientErrors,
  };

  const validationStatus = useMemo(() => {
    const validation = validarProducto(data, estados);

    return {
      errors: validation,
      isValid: Object.keys(validation).length === 0,
    };
  }, [data, estados]);

  const selectedCategoriaName = useMemo(() => {
    return obtenerNombreCategoria(categorias, data.cod_categoria_producto);
  }, [categorias, data.cod_categoria_producto]);

  const hasChanges = useMemo(() => {
    return (
      String(data.cod_categoria_producto ?? '') !== String(producto.cod_categoria_producto ?? '') ||
      String(data.nombre_pro ?? '') !== String(producto.nombre_pro ?? '') ||
      String(data.descripcion_pro ?? '') !== String(producto.descripcion_pro ?? '') ||
      String(data.precio_venta_pro ?? '') !== String(producto.precio_venta_pro ?? '') ||
      String(data.precio_costo_pro ?? '') !== String(producto.precio_costo_pro ?? '') ||
      String(data.sku_pro ?? '') !== String(producto.sku_pro ?? '') ||
      String(data.imagen_pro ?? '') !== String(producto.imagen_pro ?? '') ||
      String(data.estado_pro ?? '') !== String(producto.estado_pro ?? '')
    );
  }, [data, producto]);

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

    const validation = validarProducto(data, estados);
    setClientErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    if (!hasChanges) {
      return;
    }

    put(route('productos.update', producto.cod_producto), {
      preserveScroll: true,
    });
  };

  const canSubmit = validationStatus.isValid && hasChanges && !processing;

  return (
    <AuthenticatedLayout>
      <Head title="Editar producto" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
            Gestión de catálogo
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#2B221E]">
                Editar producto
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#2B221E]/65">
                Actualiza la información comercial del producto. Mantén precios,
                categoría, SKU y estado coherentes para evitar errores en ventas,
                inventario y seguimiento comercial.
              </p>
            </div>

            <Link
              href={route('productos.index')}
              className="inline-flex items-center justify-center rounded-2xl border border-[#D77A61]/30 px-5 py-3 text-sm font-bold text-[#D77A61] transition hover:bg-[#D77A61] hover:text-white"
            >
              Volver al listado
            </Link>
          </div>
        </section>

        {wasValidated && !validationStatus.isValid && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <h2 className="text-base font-black text-red-700">
              Revisa los datos antes de actualizar
            </h2>

            <p className="mt-1 text-sm text-red-600">
              Hay campos obligatorios o valores comerciales inválidos.
            </p>
          </section>
        )}

        <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-6 xl:col-span-2">
            <FormCard
              title="Información principal"
              description="Datos que identifican la prenda dentro del catálogo comercial."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Nombre del producto"
                  error={allErrors.nombre_pro}
                  helper="Entre 3 y 150 caracteres. Usa un nombre claro para venta."
                  required
                >
                  <input
                    type="text"
                    value={data.nombre_pro}
                    onChange={(e) => updateField('nombre_pro', e.target.value)}
                    placeholder="Ej. Jean cargo urbano"
                    maxLength="150"
                    className={inputClass(allErrors.nombre_pro)}
                  />
                </FormField>

                <FormField
                  label="Categoría"
                  error={allErrors.cod_categoria_producto}
                  helper="Selecciona la categoría comercial correcta."
                  required
                >
                  <select
                    value={data.cod_categoria_producto}
                    onChange={(e) =>
                      updateField('cod_categoria_producto', e.target.value)
                    }
                    className={inputClass(allErrors.cod_categoria_producto)}
                  >
                    <option value="">Seleccione categoría</option>

                    {categorias.map((categoria) => (
                      <option
                        key={categoria.cod_categoria_producto}
                        value={categoria.cod_categoria_producto}
                      >
                        {categoria.nombre_cat}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField
                label="Descripción"
                error={allErrors.descripcion_pro}
                helper={`${String(data.descripcion_pro || '').length}/1000 caracteres. Describe material, estilo, talla, color o detalles de venta.`}
              >
                <textarea
                  value={data.descripcion_pro}
                  onChange={(e) => updateField('descripcion_pro', e.target.value)}
                  placeholder="Describe el producto con enfoque comercial."
                  rows="5"
                  maxLength="1000"
                  className={inputClass(allErrors.descripcion_pro)}
                />
              </FormField>
            </FormCard>

            <FormCard
              title="Datos comerciales"
              description="Controla precios, SKU y estado para mantener el catálogo consistente."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Precio de venta"
                  error={allErrors.precio_venta_pro}
                  helper="Debe ser mayor a 0. Este precio impacta directamente en ventas."
                  required
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#2B221E]/40">
                      Bs
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.precio_venta_pro}
                      onChange={(e) =>
                        updateField('precio_venta_pro', e.target.value)
                      }
                      placeholder="0.00"
                      className={`${inputClass(allErrors.precio_venta_pro)} pl-12`}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Precio de costo"
                  error={allErrors.precio_costo_pro}
                  helper="Opcional. No debe superar el precio de venta."
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#2B221E]/40">
                      Bs
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={data.precio_costo_pro}
                      onChange={(e) =>
                        updateField('precio_costo_pro', e.target.value)
                      }
                      placeholder="0.00"
                      className={`${inputClass(allErrors.precio_costo_pro)} pl-12`}
                    />
                  </div>
                </FormField>

                <FormField
                  label="SKU"
                  error={allErrors.sku_pro}
                  helper="Opcional. Solo letras, números, guion y guion bajo."
                >
                  <input
                    type="text"
                    value={data.sku_pro}
                    onChange={(e) =>
                      updateField('sku_pro', e.target.value.toUpperCase())
                    }
                    placeholder="Ej. JEAN-CARGO-001"
                    maxLength="80"
                    className={inputClass(allErrors.sku_pro)}
                  />
                </FormField>

                <FormField
                  label="Estado del producto"
                  error={allErrors.estado_pro}
                  helper="Define si el producto puede venderse o debe mantenerse fuera del catálogo."
                  required
                >
                  <select
                    value={data.estado_pro}
                    onChange={(e) => updateField('estado_pro', e.target.value)}
                    className={inputClass(allErrors.estado_pro)}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {formatearTexto(estado)}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormCard>

            <FormCard
              title="Imagen referencial"
              description="Usa una URL válida para apoyar la identificación visual del producto."
            >
              <FormField
                label="Imagen URL"
                error={allErrors.imagen_pro}
                helper="Opcional. Debe iniciar con http:// o https://."
              >
                <input
                  type="url"
                  value={data.imagen_pro}
                  onChange={(e) => updateField('imagen_pro', e.target.value)}
                  placeholder="https://ejemplo.com/imagen-producto.jpg"
                  className={inputClass(allErrors.imagen_pro)}
                />
              </FormField>
            </FormCard>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D77A61]">
                Producto actual
              </p>

              <h2 className="mt-2 text-xl font-black text-[#2B221E]">
                Vista comercial
              </h2>

              <div className="mt-6 rounded-3xl border border-[#eadfd6] bg-[#FDF6F0] p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-3xl font-black text-[#D77A61] shadow-sm">
                  {obtenerInicial(data.nombre_pro)}
                </div>

                <h3 className="mt-5 text-lg font-black text-[#2B221E]">
                  {data.nombre_pro || 'Nombre del producto'}
                </h3>

                <p className="mt-1 text-sm text-[#2B221E]/60">
                  {selectedCategoriaName}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#3C473A]">
                    {data.sku_pro || 'Sin SKU'}
                  </span>

                  <StatusBadge estado={data.estado_pro} />
                </div>

                <div className="mt-5 border-t border-[#eadfd6] pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B221E]/45">
                    Precio de venta
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#2B221E]">
                    Bs {data.precio_venta_pro || '0.00'}
                  </p>

                  {data.precio_costo_pro && (
                    <p className="mt-1 text-sm text-[#2B221E]/55">
                      Costo registrado: Bs {data.precio_costo_pro}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#2B221E]">
                Control de actualización
              </h3>

              <div className="mt-4 space-y-3">
                <ValidationItem
                  valid={Boolean(data.cod_categoria_producto)}
                  label="Categoría seleccionada"
                />

                <ValidationItem
                  valid={String(data.nombre_pro).trim().length >= 3}
                  label="Nombre comercial válido"
                />

                <ValidationItem
                  valid={Number(data.precio_venta_pro) > 0}
                  label="Precio de venta válido"
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

            <div className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#2B221E]">
                Acciones
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#2B221E]/60">
                Solo se habilita la actualización cuando existen cambios y
                todos los datos son válidos.
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
                    ? 'Actualizando...'
                    : !validationStatus.isValid
                      ? 'Corrige las validaciones'
                      : !hasChanges
                        ? 'Sin cambios por guardar'
                        : 'Actualizar producto'}
                </button>

                {!validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-[#2B221E]/50">
                    Completa categoría, nombre válido y precio de venta mayor a 0.
                  </p>
                )}

                {!hasChanges && validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-[#2B221E]/50">
                    Modifica al menos un dato para habilitar la actualización.
                  </p>
                )}

                <Link
                  href={route('productos.index')}
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

function validarProducto(data, estados) {
  const errors = {};

  const nombre = String(data.nombre_pro || '').trim();
  const descripcion = String(data.descripcion_pro || '').trim();
  const precioVentaRaw = String(data.precio_venta_pro || '').trim();
  const precioCostoRaw = String(data.precio_costo_pro || '').trim();
  const sku = String(data.sku_pro || '').trim();
  const imagen = String(data.imagen_pro || '').trim();
  const estado = String(data.estado_pro || '').trim();

  const precioVenta = Number(precioVentaRaw);
  const precioCosto = precioCostoRaw === '' ? null : Number(precioCostoRaw);

  if (!data.cod_categoria_producto) {
    errors.cod_categoria_producto = 'La categoría es obligatoria.';
  }

  if (!nombre) {
    errors.nombre_pro = 'El nombre del producto es obligatorio.';
  } else if (nombre.length < 3) {
    errors.nombre_pro = 'El nombre debe tener al menos 3 caracteres.';
  } else if (nombre.length > 150) {
    errors.nombre_pro = 'El nombre no debe superar los 150 caracteres.';
  }

  if (descripcion.length > 1000) {
    errors.descripcion_pro = 'La descripción no debe superar los 1000 caracteres.';
  }

  if (!precioVentaRaw) {
    errors.precio_venta_pro = 'El precio de venta es obligatorio.';
  } else if (Number.isNaN(precioVenta)) {
    errors.precio_venta_pro = 'El precio de venta debe ser numérico.';
  } else if (precioVenta <= 0) {
    errors.precio_venta_pro = 'El precio de venta debe ser mayor a 0.';
  } else if (precioVenta > 999999.99) {
    errors.precio_venta_pro = 'El precio de venta es demasiado alto.';
  }

  if (precioCostoRaw !== '') {
    if (Number.isNaN(precioCosto)) {
      errors.precio_costo_pro = 'El precio de costo debe ser numérico.';
    } else if (precioCosto < 0) {
      errors.precio_costo_pro = 'El precio de costo no puede ser negativo.';
    } else if (precioVentaRaw && precioCosto > precioVenta) {
      errors.precio_costo_pro =
        'El precio de costo no puede ser mayor al precio de venta.';
    } else if (precioCosto > 999999.99) {
      errors.precio_costo_pro = 'El precio de costo es demasiado alto.';
    }
  }

  if (sku.length > 80) {
    errors.sku_pro = 'El SKU no debe superar los 80 caracteres.';
  } else if (sku && !/^[A-Z0-9_-]+$/.test(sku)) {
    errors.sku_pro =
      'El SKU solo puede contener letras, números, guion y guion bajo.';
  }

  if (imagen && !esUrlValida(imagen)) {
    errors.imagen_pro = 'La imagen debe ser una URL válida.';
  }

  if (!estado) {
    errors.estado_pro = 'El estado del producto es obligatorio.';
  } else if (Array.isArray(estados) && estados.length > 0 && !estados.includes(estado)) {
    errors.estado_pro = 'El estado seleccionado no es válido.';
  }

  return errors;
}

function esUrlValida(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function StatusBadge({ estado }) {
  const estadoNormalizado = String(estado || '').trim().toLowerCase();

  const estilos = {
    activo: 'bg-green-100 text-green-700 border-green-200',
    inactivo: 'bg-gray-100 text-gray-700 border-gray-200',
    agotado: 'bg-red-100 text-red-700 border-red-200',
    descontinuado: 'bg-gray-100 text-gray-700 border-gray-200',
    pendiente: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  const clase =
    estilos[estadoNormalizado] ||
    'bg-blue-100 text-blue-700 border-blue-200';

  return (
    <span
      className={[
        'inline-flex rounded-full border px-3 py-1 text-xs font-black',
        clase,
      ].join(' ')}
    >
      {formatearTexto(estado)}
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

function obtenerNombreCategoria(categorias, codCategoria) {
  const categoria = categorias.find(
    (item) => String(item.cod_categoria_producto) === String(codCategoria),
  );

  return categoria?.nombre_cat || 'Sin categoría seleccionada';
}

function obtenerInicial(nombre) {
  return String(nombre || 'P')
    .trim()
    .charAt(0)
    .toUpperCase();
}

function formatearTexto(value) {
  return String(value || 'Sin estado')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}