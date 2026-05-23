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

  const usuarios = normalizarLista(
    props.usuarios ||
    props.usuariosResponsables ||
    props.responsables ||
    props.vendedores,
  );

  const { data, setData, post, processing, errors, clearErrors } = useForm({
    nombre_lea: '',
    alias_lea: '',
    telefono_lea: '',
    correo_lea: '',
    producto_interes_lea: '',
    observacion_lea: '',
    estado_lea: estados[0] ?? 'nuevo',
    fecha_seguimiento_lea: '',
    cod_canal_venta: '',
    cod_tipo_flujo_comercial: '',
    cod_usuario_responsable: '',
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

  const responsableSeleccionado = useMemo(() => {
    return usuarios.find(
      (usuario) =>
        String(obtenerCodigo(usuario, ['id', 'cod_usuario', 'cod_user'])) ===
        String(data.cod_usuario_responsable),
    );
  }, [usuarios, data.cod_usuario_responsable]);

  const validationStatus = useMemo(() => {
    const validation = validarLead(data, estados, canales, tiposFlujo, usuarios);

    return {
      errors: validation,
      isValid: Object.keys(validation).length === 0,
    };
  }, [data, estados, canales, tiposFlujo, usuarios]);

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

    const validation = validarLead(data, estados, canales, tiposFlujo, usuarios);
    setClientErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    post(route('leads.store'), {
      preserveScroll: true,
    });
  };

  const canSubmit = validationStatus.isValid && !processing;

  return (
    <DashboardLayout>
      <Head title="Crear lead" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
            CRM comercial
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-akin-text">
                Crear lead
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-akin-muted">
                Registra una nueva oportunidad de venta. Un lead bien
                documentado permite dar seguimiento, priorizar atención,
                medir canales de captación y convertir prospectos en clientes.
              </p>
            </div>

            <Link
              href={route('leads.index')}
              className="inline-flex items-center justify-center rounded-2xl border border-akin-accent/30 px-5 py-3 text-sm font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
            >
              Volver al listado
            </Link>
          </div>
        </section>

        {wasValidated && !validationStatus.isValid && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <h2 className="text-base font-black text-red-700">
              Revisa los datos del lead
            </h2>

            <p className="mt-1 text-sm text-red-600">
              Hay datos obligatorios o información de contacto con formato inválido.
              Corrige los campos marcados antes de guardar.
            </p>
          </section>
        )}

        <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
          <section className="space-y-6 xl:col-span-2">
            <FormCard
              title="Datos principales"
              description="Identifica al prospecto y registra cómo reconocerlo durante el seguimiento comercial."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Nombre del lead"
                  error={allErrors.nombre_lea}
                  helper="Entre 3 y 120 caracteres."
                  required
                >
                  <input
                    type="text"
                    value={data.nombre_lea}
                    onChange={(e) =>
                      updateField(
                        'nombre_lea',
                        normalizarNombre(e.target.value),
                      )
                    }
                    placeholder="Ej. Camila Rojas"
                    maxLength="120"
                    className={inputClass(allErrors.nombre_lea)}
                  />
                </FormField>

                <FormField
                  label="Alias o referencia"
                  error={allErrors.alias_lea}
                  helper="Opcional. Útil si viene de redes sociales o WhatsApp."
                >
                  <input
                    type="text"
                    value={data.alias_lea}
                    onChange={(e) =>
                      updateField(
                        'alias_lea',
                        normalizarNombre(e.target.value),
                      )
                    }
                    placeholder="Ej. @camila.store"
                    maxLength="80"
                    className={inputClass(allErrors.alias_lea)}
                  />
                </FormField>
              </div>
            </FormCard>

            <FormCard
              title="Contacto"
              description="Datos mínimos para poder comunicarse y continuar el proceso comercial."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Teléfono"
                  error={allErrors.telefono_lea}
                  helper="Obligatorio. Entre 7 y 15 dígitos. Puede incluir + al inicio."
                  required
                >
                  <input
                    type="tel"
                    value={data.telefono_lea}
                    onChange={(e) =>
                      updateField(
                        'telefono_lea',
                        limpiarTelefono(e.target.value),
                      )
                    }
                    placeholder="Ej. 76543210"
                    maxLength="16"
                    className={inputClass(allErrors.telefono_lea)}
                  />
                </FormField>

                <FormField
                  label="Correo"
                  error={allErrors.correo_lea}
                  helper="Opcional. Útil para cotizaciones, confirmaciones o campañas."
                >
                  <input
                    type="email"
                    value={data.correo_lea}
                    onChange={(e) =>
                      updateField(
                        'correo_lea',
                        e.target.value.trim().toLowerCase(),
                      )
                    }
                    placeholder="lead@gmail.com"
                    maxLength="120"
                    className={inputClass(allErrors.correo_lea)}
                  />
                </FormField>
              </div>
            </FormCard>

            <FormCard
              title="Interés comercial"
              description="Registra qué producto, prenda, línea o promoción llamó la atención del lead."
            >
              <FormField
                label="Producto de interés"
                error={allErrors.producto_interes_lea}
                helper="Entre 3 y 180 caracteres. Ayuda a priorizar oferta y seguimiento."
                required
              >
                <input
                  type="text"
                  value={data.producto_interes_lea}
                  onChange={(e) =>
                    updateField(
                      'producto_interes_lea',
                      normalizarTexto(e.target.value),
                    )
                  }
                  placeholder="Ej. Poleras oversize, jeans cargo, promoción de temporada"
                  maxLength="180"
                  className={inputClass(allErrors.producto_interes_lea)}
                />
              </FormField>

              <FormField
                label="Observación"
                error={allErrors.observacion_lea}
                helper={`${String(data.observacion_lea || '').length}/800 caracteres. Opcional: necesidad, presupuesto, objeciones, preferencias o contexto de compra.`}
              >
                <textarea
                  value={data.observacion_lea}
                  onChange={(e) =>
                    updateField('observacion_lea', e.target.value)
                  }
                  placeholder="Ej. Consultó por tallas disponibles, desea ver colores y prefiere contacto por WhatsApp."
                  rows="5"
                  maxLength="800"
                  className={inputClass(allErrors.observacion_lea)}
                />
              </FormField>
            </FormCard>

            <FormCard
              title="Seguimiento y clasificación"
              description="Define etapa comercial, canal de captación, flujo de atención y responsable."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Estado del lead"
                  error={allErrors.estado_lea}
                  helper="Define en qué punto del pipeline comercial se encuentra."
                  required
                >
                  <select
                    value={data.estado_lea}
                    onChange={(e) =>
                      updateField('estado_lea', e.target.value)
                    }
                    className={inputClass(allErrors.estado_lea)}
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
                  label="Fecha de seguimiento"
                  error={allErrors.fecha_seguimiento_lea}
                  helper="Opcional, pero recomendado si requiere contacto futuro."
                >
                  <input
                    type="date"
                    value={data.fecha_seguimiento_lea}
                    onChange={(e) =>
                      updateField(
                        'fecha_seguimiento_lea',
                        e.target.value,
                      )
                    }
                    className={inputClass(
                      allErrors.fecha_seguimiento_lea,
                    )}
                  />
                </FormField>

                <FormField
                  label="Canal de venta"
                  error={allErrors.cod_canal_venta}
                  helper="Recomendado. Permite saber qué medio genera oportunidades."
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
                  helper="Recomendado. Ayuda a definir la estrategia de atención."
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

                <FormField
                  label="Responsable"
                  error={allErrors.cod_usuario_responsable}
                  helper="Recomendado. Evita oportunidades sin seguimiento."
                >
                  <select
                    value={data.cod_usuario_responsable}
                    onChange={(e) =>
                      updateField(
                        'cod_usuario_responsable',
                        e.target.value,
                      )
                    }
                    className={inputClass(
                      allErrors.cod_usuario_responsable,
                    )}
                  >
                    <option value="">Seleccione responsable</option>

                    {usuarios.map((usuario) => {
                      const codigo = obtenerCodigo(usuario, [
                        'id',
                        'cod_usuario',
                        'cod_user',
                      ]);

                      return (
                        <option key={codigo} value={codigo}>
                          {obtenerNombre(usuario, [
                            'name',
                            'nombre',
                            'nombre_usu',
                            'email',
                          ])}
                        </option>
                      );
                    })}
                  </select>
                </FormField>
              </div>
            </FormCard>

            <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <h3 className="text-base font-black text-blue-800">
                Recomendación comercial
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-700">
                Un lead debe registrarse apenas exista intención o consulta.
                Mientras más completo esté el registro, más fácil será decidir
                si conviene contactar, cotizar, ofrecer alternativa o convertirlo
                en cliente.
              </p>
            </section>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-akin-accent">
                Vista previa
              </p>

              <h2 className="mt-2 text-xl font-black text-akin-text">
                Oportunidad comercial
              </h2>

              <div className="mt-6 rounded-3xl border border-akin-border bg-akin-bg p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-akin-surface text-3xl font-black text-akin-accent shadow-sm">
                  {obtenerInicial(data.nombre_lea)}
                </div>

                <h3 className="mt-5 text-lg font-black text-akin-text">
                  {data.nombre_lea || 'Nombre del lead'}
                </h3>

                <p className="mt-1 text-sm text-akin-muted">
                  {data.telefono_lea || 'Teléfono pendiente'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{formatearTexto(data.estado_lea || 'Sin estado')}</Badge>

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
                    Producto de interés
                  </p>

                  <p className="mt-2 text-sm font-bold text-akin-text">
                    {data.producto_interes_lea ||
                      'Interés pendiente'}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-akin-surface p-4">
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
                El registro se habilita cuando el lead tiene datos mínimos
                para seguimiento comercial real.
              </p>

              <div className="mt-4 space-y-3">
                <ValidationItem
                  valid={String(data.nombre_lea).trim().length >= 3}
                  label="Nombre válido"
                />

                <ValidationItem
                  valid={telefonoValido(data.telefono_lea)}
                  label="Teléfono válido"
                />

                <ValidationItem
                  valid={
                    !data.correo_lea ||
                    correoValido(data.correo_lea)
                  }
                  label="Correo válido u omitido"
                />

                <ValidationItem
                  valid={
                    String(data.producto_interes_lea).trim().length >= 3
                  }
                  label="Interés comercial registrado"
                />

                <ValidationItem
                  valid={Boolean(data.estado_lea)}
                  label="Estado seleccionado"
                />

                <ValidationItem
                  valid={validationStatus.isValid}
                  label="Lead listo para guardar"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
              <h3 className="text-lg font-black text-akin-text">
                Acciones
              </h3>

              <p className="mt-2 text-sm leading-6 text-akin-muted">
                Verifica que el lead tenga información suficiente para ser
                contactado y trabajado por ventas.
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
                      ? 'Guardar lead'
                      : 'Completa los datos requeridos'}
                </button>

                {!validationStatus.isValid && (
                  <p className="text-center text-xs font-semibold text-akin-muted">
                    Completa nombre, teléfono, interés y estado.
                  </p>
                )}

                <Link
                  href={route('leads.index')}
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

function validarLead(data, estados, canales, tiposFlujo, usuarios) {
  const errors = {};

  const nombre = String(data.nombre_lea || '').trim();
  const alias = String(data.alias_lea || '').trim();
  const telefono = String(data.telefono_lea || '').trim();
  const correo = String(data.correo_lea || '').trim();
  const productoInteres = String(data.producto_interes_lea || '').trim();
  const observacion = String(data.observacion_lea || '').trim();
  const estado = String(data.estado_lea || '').trim();
  const fechaSeguimiento = String(data.fecha_seguimiento_lea || '').trim();

  if (!nombre) {
    errors.nombre_lea = 'El nombre del lead es obligatorio.';
  } else if (nombre.length < 3) {
    errors.nombre_lea = 'El nombre debe tener al menos 3 caracteres.';
  } else if (nombre.length > 120) {
    errors.nombre_lea = 'El nombre no debe superar los 120 caracteres.';
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.'-]+$/.test(nombre)) {
    errors.nombre_lea = 'El nombre contiene caracteres no permitidos.';
  }

  if (alias.length > 80) {
    errors.alias_lea = 'El alias no debe superar los 80 caracteres.';
  }

  if (!telefono) {
    errors.telefono_lea = 'El teléfono es obligatorio.';
  } else if (!telefonoValido(telefono)) {
    errors.telefono_lea = 'El teléfono debe tener entre 7 y 15 dígitos.';
  }

  if (correo && !correoValido(correo)) {
    errors.correo_lea = 'El correo no tiene un formato válido.';
  }

  if (!productoInteres) {
    errors.producto_interes_lea = 'El producto de interés es obligatorio.';
  } else if (productoInteres.length < 3) {
    errors.producto_interes_lea =
      'El producto de interés debe tener al menos 3 caracteres.';
  } else if (productoInteres.length > 180) {
    errors.producto_interes_lea =
      'El producto de interés no debe superar los 180 caracteres.';
  }

  if (observacion.length > 800) {
    errors.observacion_lea = 'La observación no debe superar los 800 caracteres.';
  }

  if (!estado) {
    errors.estado_lea = 'El estado del lead es obligatorio.';
  } else if (Array.isArray(estados) && estados.length > 0 && !estados.includes(estado)) {
    errors.estado_lea = 'El estado seleccionado no es válido.';
  }

  if (fechaSeguimiento && !fechaValida(fechaSeguimiento)) {
    errors.fecha_seguimiento_lea = 'La fecha de seguimiento no es válida.';
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

  if (
    data.cod_usuario_responsable &&
    !existeCodigo(usuarios, data.cod_usuario_responsable, [
      'id',
      'cod_usuario',
      'cod_user',
    ])
  ) {
    errors.cod_usuario_responsable =
      'El responsable seleccionado no es válido.';
  }

  return errors;
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

function fechaValida(value) {
  const fecha = new Date(value);
  return !Number.isNaN(fecha.getTime());
}

function limpiarTelefono(value) {
  return String(value || '')
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '');
}

function normalizarNombre(value) {
  return String(value || '').replace(/\s+/g, ' ').replace(/^\s/, '');
}

function normalizarTexto(value) {
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
  if (!data.nombre_lea || !data.telefono_lea) {
    return 'Ficha incompleta. Registra nombre y teléfono para poder contactar al prospecto.';
  }

  if (!data.producto_interes_lea) {
    return 'Falta producto de interés. Sin este dato es difícil preparar una oferta o respuesta comercial.';
  }

  if (!data.cod_usuario_responsable) {
    return 'Lead registrable, pero sin responsable. Conviene asignar a alguien para evitar pérdida de seguimiento.';
  }

  if (!data.cod_canal_venta && !data.cod_tipo_flujo_comercial) {
    return 'Falta canal y flujo. Completar estos datos ayuda a medir captación y estrategia comercial.';
  }

  if (!data.fecha_seguimiento_lea) {
    return 'Lead válido. Conviene definir fecha de seguimiento para no perder la oportunidad.';
  }

  return 'Lead completo para seguimiento comercial, priorización y posible conversión a cliente.';
}

function formatearTexto(value) {
  return String(value || 'Sin dato')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function obtenerInicial(nombre) {
  return String(nombre || 'L')
    .trim()
    .charAt(0)
    .toUpperCase();
}