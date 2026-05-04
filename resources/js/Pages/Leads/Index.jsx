import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ leads = [], estados = [] }) {
  const listaLeads = Array.isArray(leads) ? leads : leads?.data || [];
  const listaEstados = Array.isArray(estados) ? estados : [];

  const [updatingLead, setUpdatingLead] = useState(null);
  const [convertingLead, setConvertingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');

  const estadoOptions = useMemo(() => {
    if (listaEstados.length > 0) {
      return listaEstados;
    }

    return ['nuevo', 'contactado', 'interesado', 'convertido', 'descartado'];
  }, [listaEstados]);

  const leadsFiltrados = useMemo(() => {
    return listaLeads.filter((lead) => {
      const texto = [
        lead.nombre_lea,
        lead.alias_lea,
        lead.telefono_lea,
        lead.correo_lea,
        lead.producto_interes_lea,
        lead.canal_venta?.nombre_can,
        lead.tipo_flujo_comercial?.nombre_tip,
        lead.usuario_responsable?.name,
      ]
        .join(' ')
        .toLowerCase();

      const coincideBusqueda = texto.includes(searchTerm.trim().toLowerCase());

      const coincideEstado =
        estadoFiltro === 'todos' ||
        normalizarEstado(lead.estado_lea) === normalizarEstado(estadoFiltro);

      return coincideBusqueda && coincideEstado;
    });
  }, [listaLeads, searchTerm, estadoFiltro]);

  const totalLeads = listaLeads.length;

  const leadsNuevos = listaLeads.filter((lead) =>
    normalizarEstado(lead.estado_lea).includes('nuevo'),
  ).length;

  const leadsEnSeguimiento = listaLeads.filter((lead) => {
    const estado = normalizarEstado(lead.estado_lea);

    return (
      estado.includes('seguimiento') ||
      estado.includes('contactado') ||
      estado.includes('interesado')
    );
  }).length;

  const leadsConvertidos = listaLeads.filter((lead) =>
    normalizarEstado(lead.estado_lea).includes('convertido'),
  ).length;

  const leadsDescartados = listaLeads.filter((lead) => {
    const estado = normalizarEstado(lead.estado_lea);

    return estado.includes('descartado') || estado.includes('perdido');
  }).length;

  const leadsSinResponsable = listaLeads.filter(
    (lead) => !lead.usuario_responsable?.name,
  ).length;

  const leadsSinCanal = listaLeads.filter(
    (lead) => !lead.canal_venta?.nombre_can,
  ).length;

  const conversionRate =
    totalLeads > 0 ? Math.round((leadsConvertidos / totalLeads) * 100) : 0;

  const updateEstado = (lead, estado) => {
    if (!estado || estado === lead.estado_lea) {
      return;
    }

    setUpdatingLead(lead.cod_lead);

    router.patch(
      route('leads.update-estado', lead.cod_lead),
      { estado_lea: estado },
      {
        preserveScroll: true,
        onFinish: () => setUpdatingLead(null),
      },
    );
  };

  const convertirLead = (lead) => {
    const estado = normalizarEstado(lead.estado_lea);

    if (estado.includes('convertido')) {
      return;
    }

    setConvertingLead(lead.cod_lead);

    router.post(
      route('leads.convertir', lead.cod_lead),
      {},
      {
        preserveScroll: true,
        onFinish: () => setConvertingLead(null),
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Leads" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
                CRM comercial
              </p>

              <h1 className="mt-2 text-3xl font-black text-[#2B221E]">
                Leads
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-[#2B221E]/65">
                Gestiona prospectos, oportunidades de venta y seguimiento
                comercial. Esta pantalla permite controlar el pipeline:
                contacto inicial, interés, responsable, canal de captación y
                conversión a cliente.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={route('leads.create')}
                className="inline-flex items-center justify-center rounded-2xl bg-[#D77A61] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c96f58] focus:outline-none focus:ring-4 focus:ring-[#D77A61]/20"
              >
                Nuevo lead
              </Link>

              <Link
                href={route('clientes.index')}
                className="inline-flex items-center justify-center rounded-2xl border border-[#eadfd6] bg-[#FDF6F0] px-5 py-3 text-sm font-bold text-[#3C473A] transition hover:bg-[#3C473A] hover:text-white"
              >
                Ver clientes
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard
            title="Total"
            value={totalLeads}
            description="Leads registrados"
          />

          <MetricCard
            title="Nuevos"
            value={leadsNuevos}
            description="Primer contacto"
          />

          <MetricCard
            title="Seguimiento"
            value={leadsEnSeguimiento}
            description="En proceso comercial"
            alert={leadsEnSeguimiento > 0}
          />

          <MetricCard
            title="Convertidos"
            value={leadsConvertidos}
            description={`${conversionRate}% conversión`}
          />

          <MetricCard
            title="Descartados"
            value={leadsDescartados}
            description="Sin avance comercial"
          />

          <MetricCard
            title="Sin responsable"
            value={leadsSinResponsable}
            description="Riesgo de pérdida"
            danger={leadsSinResponsable > 0}
          />
        </section>

        {(leadsSinResponsable > 0 || leadsSinCanal > 0) && (
          <section className="grid gap-4 lg:grid-cols-2">
            {leadsSinResponsable > 0 && (
              <AlertCard
                title="Leads sin responsable"
                description="Hay oportunidades sin una persona asignada. Desde ventas, esto puede causar pérdida de seguimiento, demora de respuesta y baja conversión."
                tone="orange"
              />
            )}

            {leadsSinCanal > 0 && (
              <AlertCard
                title="Leads sin canal de captación"
                description="Hay leads sin canal registrado. Completar este dato ayuda a medir si llegan por redes sociales, WhatsApp, tienda, referidos u otros medios."
                tone="red"
              />
            )}
          </section>
        )}

        <section className="rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px_180px] lg:items-end">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#2B221E]">
                Buscar lead
              </label>

              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, alias, teléfono, correo, producto, canal o responsable..."
                className="w-full rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 text-sm text-[#2B221E] shadow-sm outline-none transition placeholder:text-[#2B221E]/35 focus:border-[#D77A61] focus:ring-4 focus:ring-[#D77A61]/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#2B221E]">
                Filtrar por estado
              </label>

              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full rounded-2xl border border-[#eadfd6] bg-white px-4 py-3 text-sm font-bold text-[#2B221E] shadow-sm outline-none transition focus:border-[#D77A61] focus:ring-4 focus:ring-[#D77A61]/15"
              >
                <option value="todos">Todos los estados</option>

                {estadoOptions.map((estado) => (
                  <option key={estado} value={estado}>
                    {formatearTexto(estado)}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-[#FDF6F0] px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2B221E]/45">
                Mostrando
              </p>

              <p className="mt-1 text-xl font-black text-[#2B221E]">
                {leadsFiltrados.length}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#eadfd6] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-[#2B221E]">
                Pipeline comercial
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#2B221E]/60">
                Cambia estados, revisa origen comercial, asignación y convierte
                leads calificados en clientes.
              </p>
            </div>

            <span className="rounded-full bg-[#FDF6F0] px-4 py-2 text-xs font-bold text-[#3C473A]">
              {leadsFiltrados.length} de {totalLeads} registros
            </span>
          </div>

          {leadsFiltrados.length === 0 ? (
            <EmptyState hasFilters={searchTerm || estadoFiltro !== 'todos'} />
          ) : (
            <>
              <div className="grid gap-4 p-4 lg:hidden">
                {leadsFiltrados.map((lead) => (
                  <LeadMobileCard
                    key={lead.cod_lead}
                    lead={lead}
                    estadoOptions={estadoOptions}
                    updatingLead={updatingLead}
                    convertingLead={convertingLead}
                    updateEstado={updateEstado}
                    convertirLead={convertirLead}
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-[#eadfd6]">
                  <thead className="bg-[#FDF6F0]">
                    <tr>
                      <TableHead>Lead</TableHead>
                      <TableHead>Estado y gestión</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Interés</TableHead>
                      <TableHead>Lectura comercial</TableHead>
                      <TableHead align="right">Acciones</TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#eadfd6] bg-white">
                    {leadsFiltrados.map((lead) => (
                      <LeadTableRow
                        key={lead.cod_lead}
                        lead={lead}
                        estadoOptions={estadoOptions}
                        updatingLead={updatingLead}
                        convertingLead={convertingLead}
                        updateEstado={updateEstado}
                        convertirLead={convertirLead}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </AuthenticatedLayout>
  );
}

function LeadTableRow({
  lead,
  estadoOptions,
  updatingLead,
  convertingLead,
  updateEstado,
  convertirLead,
}) {
  const estado = normalizarEstado(lead.estado_lea);
  const canal = lead.canal_venta?.nombre_can;
  const flujo = lead.tipo_flujo_comercial?.nombre_tip;
  const responsable = lead.usuario_responsable?.name;
  const isConverted = estado.includes('convertido');
  const isUpdating = updatingLead === lead.cod_lead;
  const isConverting = convertingLead === lead.cod_lead;

  return (
    <tr className="transition hover:bg-[#FDF6F0]/70">
      <td className="px-6 py-5 align-top">
        <LeadIdentity lead={lead} />
      </td>

      <td className="px-6 py-5 align-top">
        <div className="w-48 space-y-2">
          <EstadoBadge estado={estado} original={lead.estado_lea} />

          <select
            value={lead.estado_lea || ''}
            disabled={isUpdating}
            onChange={(e) => updateEstado(lead, e.target.value)}
            className="w-full rounded-xl border border-[#eadfd6] bg-white px-3 py-2 text-xs font-bold text-[#2B221E] outline-none transition focus:border-[#D77A61] focus:ring-4 focus:ring-[#D77A61]/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {estadoOptions.map((estadoItem) => (
              <option key={estadoItem} value={estadoItem}>
                {formatearTexto(estadoItem)}
              </option>
            ))}
          </select>

          {isUpdating && (
            <p className="text-xs font-semibold text-[#D77A61]">
              Actualizando estado...
            </p>
          )}
        </div>
      </td>

      <td className="px-6 py-5 align-top">
        <div className="space-y-2">
          <DataBadge value={canal || 'Sin canal'} warning={!canal} />
          <DataBadge value={flujo || 'Sin flujo'} muted={!flujo} />
        </div>
      </td>

      <td className="px-6 py-5 align-top">
        <p
          className={[
            'text-sm font-black',
            responsable ? 'text-[#2B221E]' : 'text-orange-700',
          ].join(' ')}
        >
          {responsable || 'Sin responsable'}
        </p>

        <p className="mt-1 text-xs text-[#2B221E]/45">
          Encargado comercial
        </p>
      </td>

      <td className="px-6 py-5 align-top">
        <p className="max-w-xs text-sm font-bold text-[#2B221E]">
          {lead.producto_interes_lea || 'Sin producto de interés'}
        </p>

        {lead.fecha_seguimiento_lea && (
          <p className="mt-2 text-xs font-semibold text-[#D77A61]">
            Seguimiento: {formatearFecha(lead.fecha_seguimiento_lea)}
          </p>
        )}
      </td>

      <td className="px-6 py-5 align-top">
        <p className="max-w-sm text-sm leading-6 text-[#2B221E]/65">
          {obtenerLecturaComercial({ estado, canal, flujo, responsable })}
        </p>
      </td>

      <td className="px-6 py-5 text-right align-top">
        <div className="flex justify-end gap-2">
          <Link
            href={route('leads.edit', lead.cod_lead)}
            className="inline-flex items-center justify-center rounded-xl border border-[#D77A61]/30 px-4 py-2 text-xs font-bold text-[#D77A61] transition hover:bg-[#D77A61] hover:text-white"
          >
            Editar
          </Link>

          <button
            type="button"
            disabled={isConverted || isConverting}
            onClick={() => convertirLead(lead)}
            className={[
              'inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition',
              isConverted
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : isConverting
                  ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                  : 'bg-[#3C473A] text-white hover:bg-[#2B221E]',
            ].join(' ')}
          >
            {isConverted
              ? 'Convertido'
              : isConverting
                ? 'Convirtiendo...'
                : 'Convertir'}
          </button>
        </div>
      </td>
    </tr>
  );
}

function LeadMobileCard({
  lead,
  estadoOptions,
  updatingLead,
  convertingLead,
  updateEstado,
  convertirLead,
}) {
  const estado = normalizarEstado(lead.estado_lea);
  const canal = lead.canal_venta?.nombre_can;
  const flujo = lead.tipo_flujo_comercial?.nombre_tip;
  const responsable = lead.usuario_responsable?.name;
  const isConverted = estado.includes('convertido');
  const isUpdating = updatingLead === lead.cod_lead;
  const isConverting = convertingLead === lead.cod_lead;

  return (
    <article className="rounded-3xl border border-[#eadfd6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <LeadIdentity lead={lead} />
        <EstadoBadge estado={estado} original={lead.estado_lea} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Canal" value={canal || 'Sin canal'} />
        <InfoBlock label="Flujo" value={flujo || 'Sin flujo'} />
        <InfoBlock label="Responsable" value={responsable || 'Sin responsable'} />
        <InfoBlock
          label="Seguimiento"
          value={
            lead.fecha_seguimiento_lea
              ? formatearFecha(lead.fecha_seguimiento_lea)
              : 'Sin fecha'
          }
        />
      </div>

      <div className="mt-4 rounded-2xl bg-[#FDF6F0] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2B221E]/45">
          Interés comercial
        </p>

        <p className="mt-1 text-sm font-bold text-[#2B221E]">
          {lead.producto_interes_lea || 'Sin producto de interés'}
        </p>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#2B221E]/65">
        {obtenerLecturaComercial({ estado, canal, flujo, responsable })}
      </p>

      <div className="mt-4">
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#2B221E]/45">
          Cambiar estado
        </label>

        <select
          value={lead.estado_lea || ''}
          disabled={isUpdating}
          onChange={(e) => updateEstado(lead, e.target.value)}
          className="w-full rounded-xl border border-[#eadfd6] bg-white px-3 py-2 text-xs font-bold text-[#2B221E] outline-none transition focus:border-[#D77A61] focus:ring-4 focus:ring-[#D77A61]/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {estadoOptions.map((estadoItem) => (
            <option key={estadoItem} value={estadoItem}>
              {formatearTexto(estadoItem)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
          href={route('leads.edit', lead.cod_lead)}
          className="inline-flex items-center justify-center rounded-xl border border-[#D77A61]/30 px-4 py-3 text-xs font-bold text-[#D77A61] transition hover:bg-[#D77A61] hover:text-white"
        >
          Editar
        </Link>

        <button
          type="button"
          disabled={isConverted || isConverting}
          onClick={() => convertirLead(lead)}
          className={[
            'inline-flex items-center justify-center rounded-xl px-4 py-3 text-xs font-bold transition',
            isConverted
              ? 'cursor-not-allowed bg-gray-200 text-gray-500'
              : isConverting
                ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                : 'bg-[#3C473A] text-white hover:bg-[#2B221E]',
          ].join(' ')}
        >
          {isConverted
            ? 'Convertido'
            : isConverting
              ? 'Convirtiendo...'
              : 'Convertir'}
        </button>
      </div>
    </article>
  );
}

function LeadIdentity({ lead }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDF6F0] text-base font-black text-[#D77A61]">
        {obtenerInicial(lead.nombre_lea)}
      </div>

      <div>
        <p className="font-black text-[#2B221E]">
          {lead.nombre_lea || 'Lead sin nombre'}
        </p>

        <p className="text-xs text-[#2B221E]/50">
          {lead.telefono_lea || lead.correo_lea || 'Sin contacto'}
        </p>

        <p className="mt-1 text-xs text-[#2B221E]/40">
          Código: {lead.cod_lead || 'N/D'}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, description, alert = false, danger = false }) {
  return (
    <div
      className={[
        'rounded-3xl border bg-white p-5 shadow-sm',
        danger
          ? 'border-red-200'
          : alert
            ? 'border-orange-200'
            : 'border-[#eadfd6]',
      ].join(' ')}
    >
      <p
        className={[
          'text-xs font-bold uppercase tracking-[0.18em]',
          danger
            ? 'text-red-600'
            : alert
              ? 'text-orange-600'
              : 'text-[#D77A61]',
        ].join(' ')}
      >
        {title}
      </p>

      <p className="mt-3 text-3xl font-black text-[#2B221E]">{value}</p>

      <p className="mt-1 text-sm text-[#2B221E]/60">{description}</p>
    </div>
  );
}

function AlertCard({ title, description, tone = 'orange' }) {
  const styles = {
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    red: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <div className={['rounded-3xl border p-5 shadow-sm', styles[tone]].join(' ')}>
      <h2 className="text-base font-black">{title}</h2>
      <p className="mt-1 text-sm leading-6">{description}</p>
    </div>
  );
}

function TableHead({ children, align = 'left' }) {
  return (
    <th
      className={[
        'px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#2B221E]/60',
        align === 'right' ? 'text-right' : 'text-left',
      ].join(' ')}
    >
      {children}
    </th>
  );
}

function EstadoBadge({ estado, original }) {
  if (estado.includes('convertido')) {
    return <Badge tone="green">{formatearTexto(original || 'Convertido')}</Badge>;
  }

  if (
    estado.includes('seguimiento') ||
    estado.includes('contactado') ||
    estado.includes('interesado')
  ) {
    return <Badge tone="blue">{formatearTexto(original || 'En seguimiento')}</Badge>;
  }

  if (estado.includes('descartado') || estado.includes('perdido')) {
    return <Badge tone="gray">{formatearTexto(original || 'Descartado')}</Badge>;
  }

  if (estado.includes('nuevo')) {
    return <Badge tone="orange">{formatearTexto(original || 'Nuevo')}</Badge>;
  }

  return <Badge tone="earth">{formatearTexto(original || 'Sin estado')}</Badge>;
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

function DataBadge({ value, warning = false, muted = false }) {
  return (
    <span
      className={[
        'inline-flex rounded-full border px-3 py-1 text-xs font-black',
        warning
          ? 'border-orange-200 bg-orange-100 text-orange-700'
          : muted
            ? 'border-gray-200 bg-gray-100 text-gray-700'
            : 'border-[#eadfd6] bg-[#FDF6F0] text-[#3C473A]',
      ].join(' ')}
    >
      {value}
    </span>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#FDF6F0] p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2B221E]/40">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[#2B221E]">{value}</p>
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FDF6F0] text-2xl font-black text-[#D77A61]">
        L
      </div>

      <h3 className="mt-5 text-xl font-black text-[#2B221E]">
        {hasFilters ? 'No se encontraron leads' : 'No hay leads registrados'}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#2B221E]/60">
        {hasFilters
          ? 'Ajusta la búsqueda o el filtro de estado para ver más resultados.'
          : 'Registra leads para iniciar seguimiento comercial, medir canales de captación y convertir oportunidades en clientes.'}
      </p>

      {!hasFilters && (
        <Link
          href={route('leads.create')}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#D77A61] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c96f58]"
        >
          Crear primer lead
        </Link>
      )}
    </div>
  );
}

function obtenerLecturaComercial({ estado, canal, flujo, responsable }) {
  if (estado.includes('convertido')) {
    return 'Lead convertido en cliente. El seguimiento principal debe continuar desde clientes.';
  }

  if (!responsable) {
    return 'Oportunidad sin responsable. Riesgo de pérdida por falta de seguimiento.';
  }

  if (!canal && !flujo) {
    return 'Falta canal y flujo. Completar datos mejora análisis comercial.';
  }

  if (!canal) {
    return 'Falta canal de captación. Este dato mide qué medio genera oportunidades.';
  }

  if (!flujo) {
    return 'Falta flujo comercial. Conviene segmentar para definir siguiente acción.';
  }

  if (estado.includes('nuevo')) {
    return 'Lead nuevo. Requiere primer contacto rápido para mejorar conversión.';
  }

  if (
    estado.includes('seguimiento') ||
    estado.includes('contactado') ||
    estado.includes('interesado')
  ) {
    return 'Lead en proceso. Mantener contacto, resolver dudas y evaluar conversión.';
  }

  if (estado.includes('descartado') || estado.includes('perdido')) {
    return 'Lead descartado. Revisar causa para aprendizaje comercial.';
  }

  return 'Lead registrado. Revisar información y definir siguiente acción.';
}

function normalizarEstado(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function formatearTexto(value) {
  return String(value || 'Sin dato')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatearFecha(value) {
  if (!value) return 'Sin fecha';

  try {
    return new Intl.DateTimeFormat('es-BO', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function obtenerInicial(nombre) {
  return String(nombre || 'L').trim().charAt(0).toUpperCase();
}