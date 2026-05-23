import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ plantillas = [], plantillasActivas = [] }) {
  const listaPlantillas = Array.isArray(plantillas)
    ? plantillas
    : plantillas?.data || [];

  const listaActivas = Array.isArray(plantillasActivas)
    ? plantillasActivas
    : plantillasActivas?.data || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [copiedId, setCopiedId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const tiposDisponibles = useMemo(() => {
    const tipos = listaPlantillas
      .map((plantilla) => plantilla.tipo_pla)
      .filter(Boolean);

    return [...new Set(tipos)];
  }, [listaPlantillas]);

  const plantillasFiltradas = useMemo(() => {
    return listaPlantillas.filter((plantilla) => {
      const texto = [
        plantilla.nombre_pla,
        plantilla.tipo_pla,
        plantilla.contenido_pla,
      ]
        .join(' ')
        .toLowerCase();

      const coincideBusqueda = texto.includes(searchTerm.trim().toLowerCase());

      const coincideTipo =
        tipoFiltro === 'todos' ||
        normalizarTexto(plantilla.tipo_pla) === normalizarTexto(tipoFiltro);

      const coincideEstado =
        estadoFiltro === 'todos' ||
        (estadoFiltro === 'activas' && plantilla.activo_pla) ||
        (estadoFiltro === 'inactivas' && !plantilla.activo_pla);

      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }, [listaPlantillas, searchTerm, tipoFiltro, estadoFiltro]);

  const totalPlantillas = listaPlantillas.length;
  const totalActivas = listaPlantillas.filter((plantilla) =>
    Boolean(plantilla.activo_pla),
  ).length;
  const totalInactivas = totalPlantillas - totalActivas;
  const totalTipos = tiposDisponibles.length;

  const plantillasLargas = listaPlantillas.filter(
    (plantilla) => String(plantilla.contenido_pla || '').length > 500,
  ).length;

  const copiarContenido = async (plantilla) => {
    const contenido = plantilla.contenido_pla || '';

    try {
      await navigator.clipboard.writeText(contenido);
      setCopiedId(plantilla.cod_plantilla_mensaje);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const togglePlantilla = (plantilla) => {
    setTogglingId(plantilla.cod_plantilla_mensaje);

    router.patch(
      route('plantillas-mensaje.toggle', plantilla.cod_plantilla_mensaje),
      {},
      {
        preserveScroll: true,
        onFinish: () => setTogglingId(null),
      },
    );
  };

  return (
    <DashboardLayout>
      <Head title="Plantillas de mensaje" />

      <div className="space-y-6">
        <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
                Comunicación comercial
              </p>

              <h1 className="mt-2 text-3xl font-black text-akin-text">
                Plantillas de mensaje
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-akin-muted">
                Administra mensajes reutilizables para responder leads,
                clientes y oportunidades comerciales con mayor rapidez,
                coherencia y calidad de atención.
              </p>
            </div>

            <Link
              href={route('plantillas-mensaje.create')}
              className="inline-flex items-center justify-center rounded-2xl bg-akin-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-akin-accentSoft focus:outline-none focus:ring-4 focus:ring-akin-accent/20"
            >
              Nueva plantilla
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total"
            value={totalPlantillas}
            description="Plantillas registradas"
          />

          <MetricCard
            title="Activas"
            value={totalActivas}
            description="Disponibles para uso"
          />

          <MetricCard
            title="Inactivas"
            value={totalInactivas}
            description="Fuera de uso temporal"
            alert={totalInactivas > 0}
          />

          <MetricCard
            title="Tipos"
            value={totalTipos}
            description="Categorías de mensaje"
          />

          <MetricCard
            title="Extensas"
            value={plantillasLargas}
            description="Revisar claridad"
            danger={plantillasLargas > 0}
          />
        </section>

        {listaActivas.length > 0 && (
          <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-akin-accent">
                  Sugeridas para uso rápido
                </p>

                <h2 className="mt-2 text-xl font-black text-akin-text">
                  Plantillas activas
                </h2>

                <p className="mt-1 text-sm leading-6 text-akin-muted">
                  Estas plantillas están disponibles para responder o adaptar
                  mensajes comerciales de forma inmediata.
                </p>
              </div>

              <span className="rounded-full bg-akin-bg px-4 py-2 text-xs font-bold text-akin-primary">
                {listaActivas.length} activa(s)
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {listaActivas.slice(0, 6).map((plantilla) => (
                <ActiveTemplateCard
                  key={`activa-${plantilla.cod_plantilla_mensaje}`}
                  plantilla={plantilla}
                  copied={copiedId === plantilla.cod_plantilla_mensaje}
                  onCopy={() => copiarContenido(plantilla)}
                />
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm">
          <div className="grid gap-4 xl:grid-cols-[1fr_240px_220px_160px] xl:items-end">
            <div>
              <label className="mb-2 block text-sm font-bold text-akin-text">
                Buscar plantilla
              </label>

              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, tipo o contenido..."
                className="w-full rounded-2xl border border-akin-border bg-akin-surface px-4 py-3 text-sm text-akin-text shadow-sm outline-none transition placeholder:text-akin-text/35 focus:border-akin-accent focus:ring-4 focus:ring-akin-accent/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-akin-text">
                Tipo de mensaje
              </label>

              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full rounded-2xl border border-akin-border bg-akin-surface px-4 py-3 text-sm font-bold text-akin-text shadow-sm outline-none transition focus:border-akin-accent focus:ring-4 focus:ring-akin-accent/15"
              >
                <option value="todos">Todos los tipos</option>

                {tiposDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {formatearTexto(tipo)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-akin-text">
                Estado
              </label>

              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="w-full rounded-2xl border border-akin-border bg-akin-surface px-4 py-3 text-sm font-bold text-akin-text shadow-sm outline-none transition focus:border-akin-accent focus:ring-4 focus:ring-akin-accent/15"
              >
                <option value="todos">Todas</option>
                <option value="activas">Solo activas</option>
                <option value="inactivas">Solo inactivas</option>
              </select>
            </div>

            <div className="rounded-2xl bg-akin-bg px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-akin-text/45">
                Mostrando
              </p>

              <p className="mt-1 text-xl font-black text-akin-text">
                {plantillasFiltradas.length}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-akin-border bg-akin-surface shadow-sm dark:shadow-black/20">
          <div className="flex flex-col gap-3 border-b border-akin-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-akin-text">
                Biblioteca de plantillas
              </h2>

              <p className="mt-1 text-sm leading-6 text-akin-muted">
                Revisa, copia, activa, desactiva o edita mensajes según su
                uso comercial.
              </p>
            </div>

            <span className="rounded-full bg-akin-bg px-4 py-2 text-xs font-bold text-akin-primary">
              {plantillasFiltradas.length} de {totalPlantillas} registros
            </span>
          </div>

          {plantillasFiltradas.length === 0 ? (
            <EmptyState hasFilters={searchTerm || tipoFiltro !== 'todos' || estadoFiltro !== 'todos'} />
          ) : (
            <>
              <div className="grid gap-4 p-4 lg:hidden">
                {plantillasFiltradas.map((plantilla) => (
                  <TemplateMobileCard
                    key={plantilla.cod_plantilla_mensaje}
                    plantilla={plantilla}
                    copied={copiedId === plantilla.cod_plantilla_mensaje}
                    toggling={togglingId === plantilla.cod_plantilla_mensaje}
                    onCopy={() => copiarContenido(plantilla)}
                    onToggle={() => togglePlantilla(plantilla)}
                  />
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full divide-y divide-akin-border">
                  <thead className="bg-akin-bg">
                    <tr>
                      <TableHead>Plantilla</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Vista previa</TableHead>
                      <TableHead>Lectura comercial</TableHead>
                      <TableHead align="right">Acciones</TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-akin-border bg-akin-surface">
                    {plantillasFiltradas.map((plantilla) => (
                      <TemplateTableRow
                        key={plantilla.cod_plantilla_mensaje}
                        plantilla={plantilla}
                        copied={
                          copiedId ===
                          plantilla.cod_plantilla_mensaje
                        }
                        toggling={
                          togglingId ===
                          plantilla.cod_plantilla_mensaje
                        }
                        onCopy={() => copiarContenido(plantilla)}
                        onToggle={() => togglePlantilla(plantilla)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

function TemplateTableRow({ plantilla, copied, toggling, onCopy, onToggle }) {
  return (
    <tr className="transition hover:bg-akin-bg/70">
      <td className="px-6 py-5 align-top">
        <TemplateIdentity plantilla={plantilla} />
      </td>

      <td className="whitespace-nowrap px-6 py-5 align-top">
        <TipoBadge tipo={plantilla.tipo_pla} />
      </td>

      <td className="whitespace-nowrap px-6 py-5 align-top">
        <EstadoBadge active={plantilla.activo_pla} />
      </td>

      <td className="px-6 py-5 align-top">
        <MessagePreview contenido={plantilla.contenido_pla} />
      </td>

      <td className="px-6 py-5 align-top">
        <p className="max-w-sm text-sm leading-6 text-akin-muted">
          {obtenerLecturaComercial(plantilla)}
        </p>
      </td>

      <td className="px-6 py-5 text-right align-top">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center rounded-xl border border-akin-border bg-akin-bg px-4 py-2 text-xs font-bold text-akin-primary transition hover:bg-akin-primary hover:text-white"
          >
            {copied ? 'Copiado' : 'Copiar'}
          </button>

          <Link
            href={route(
              'plantillas-mensaje.edit',
              plantilla.cod_plantilla_mensaje,
            )}
            className="inline-flex items-center justify-center rounded-xl border border-akin-accent/30 px-4 py-2 text-xs font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
          >
            Editar
          </Link>

          <button
            type="button"
            disabled={toggling}
            onClick={onToggle}
            className={[
              'inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition',
              plantilla.activo_pla
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-akin-primary text-white hover:bg-akin-text',
              toggling ? 'cursor-not-allowed opacity-60' : '',
            ].join(' ')}
          >
            {toggling
              ? 'Procesando...'
              : plantilla.activo_pla
                ? 'Desactivar'
                : 'Activar'}
          </button>
        </div>
      </td>
    </tr>
  );
}

function TemplateMobileCard({ plantilla, copied, toggling, onCopy, onToggle }) {
  return (
    <article className="rounded-3xl border border-akin-border bg-akin-surface p-5 shadow-sm dark:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <TemplateIdentity plantilla={plantilla} />
        <EstadoBadge active={plantilla.activo_pla} />
      </div>

      <div className="mt-4">
        <TipoBadge tipo={plantilla.tipo_pla} />
      </div>

      <div className="mt-4">
        <MessagePreview contenido={plantilla.contenido_pla} />
      </div>

      <p className="mt-4 text-sm leading-6 text-akin-muted">
        {obtenerLecturaComercial(plantilla)}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center rounded-xl border border-akin-border bg-akin-bg px-4 py-3 text-xs font-bold text-akin-primary transition hover:bg-akin-primary hover:text-white"
        >
          {copied ? 'Copiado' : 'Copiar'}
        </button>

        <Link
          href={route(
            'plantillas-mensaje.edit',
            plantilla.cod_plantilla_mensaje,
          )}
          className="inline-flex items-center justify-center rounded-xl border border-akin-accent/30 px-4 py-3 text-xs font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
        >
          Editar
        </Link>

        <button
          type="button"
          disabled={toggling}
          onClick={onToggle}
          className={[
            'inline-flex items-center justify-center rounded-xl px-4 py-3 text-xs font-bold transition',
            plantilla.activo_pla
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-akin-primary text-white hover:bg-akin-text',
            toggling ? 'cursor-not-allowed opacity-60' : '',
          ].join(' ')}
        >
          {toggling
            ? 'Procesando...'
            : plantilla.activo_pla
              ? 'Desactivar'
              : 'Activar'}
        </button>
      </div>
    </article>
  );
}

function ActiveTemplateCard({ plantilla, copied, onCopy }) {
  return (
    <article className="rounded-3xl border border-akin-border bg-akin-bg p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-akin-text">
            {plantilla.nombre_pla || 'Plantilla sin nombre'}
          </h3>

          <p className="mt-1 text-xs font-semibold text-akin-muted">
            {formatearTexto(plantilla.tipo_pla || 'general')}
          </p>
        </div>

        <EstadoBadge active />
      </div>

      <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-akin-muted">
        {plantilla.contenido_pla || 'Sin contenido'}
      </p>

      <button
        type="button"
        onClick={onCopy}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-akin-surface px-4 py-3 text-xs font-bold text-akin-primary transition hover:bg-akin-primary hover:text-white"
      >
        {copied ? 'Contenido copiado' : 'Copiar mensaje'}
      </button>
    </article>
  );
}

function TemplateIdentity({ plantilla }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-akin-bg text-base font-black text-akin-accent">
        {obtenerInicial(plantilla.nombre_pla)}
      </div>

      <div>
        <p className="font-black text-akin-text">
          {plantilla.nombre_pla || 'Plantilla sin nombre'}
        </p>

        <p className="mt-1 text-xs text-akin-muted">
          Código: {plantilla.cod_plantilla_mensaje || 'N/D'}
        </p>

        <p className="mt-1 text-xs text-akin-muted">
          {String(plantilla.contenido_pla || '').length} caracteres
        </p>
      </div>
    </div>
  );
}

function MessagePreview({ contenido }) {
  return (
    <div className="max-w-xl rounded-2xl border border-akin-border bg-akin-bg p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-akin-muted">
        Contenido
      </p>

      <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-6 text-akin-text/70">
        {contenido || 'Sin contenido registrado'}
      </pre>
    </div>
  );
}

function MetricCard({ title, value, description, alert = false, danger = false }) {
  return (
    <div
      className={[
        'rounded-3xl border bg-akin-surface p-5 shadow-sm dark:shadow-black/20',
        danger
          ? 'border-red-200'
          : alert
            ? 'border-orange-200'
            : 'border-akin-border',
      ].join(' ')}
    >
      <p
        className={[
          'text-xs font-bold uppercase tracking-[0.18em]',
          danger
            ? 'text-red-600'
            : alert
              ? 'text-orange-600'
              : 'text-akin-accent',
        ].join(' ')}
      >
        {title}
      </p>

      <p className="mt-3 text-3xl font-black text-akin-text">{value}</p>

      <p className="mt-1 text-sm text-akin-muted">{description}</p>
    </div>
  );
}

function TableHead({ children, align = 'left' }) {
  return (
    <th
      className={[
        'px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-akin-muted',
        align === 'right' ? 'text-right' : 'text-left',
      ].join(' ')}
    >
      {children}
    </th>
  );
}

function TipoBadge({ tipo }) {
  const tipoNormalizado = normalizarTexto(tipo);

  if (
    tipoNormalizado.includes('whatsapp') ||
    tipoNormalizado.includes('seguimiento')
  ) {
    return (
      <Badge tone="green">
        {formatearTexto(tipo || 'Seguimiento')}
      </Badge>
    );
  }

  if (
    tipoNormalizado.includes('promocion') ||
    tipoNormalizado.includes('promo') ||
    tipoNormalizado.includes('oferta')
  ) {
    return (
      <Badge tone="orange">
        {formatearTexto(tipo || 'Promoción')}
      </Badge>
    );
  }

  if (
    tipoNormalizado.includes('bienvenida') ||
    tipoNormalizado.includes('contacto')
  ) {
    return (
      <Badge tone="blue">
        {formatearTexto(tipo || 'Contacto')}
      </Badge>
    );
  }

  return (
    <Badge tone="earth">
      {formatearTexto(tipo || 'General')}
    </Badge>
  );
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
    orange: 'border-orange-200 bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    earth: 'border-akin-border bg-akin-bg text-akin-primary',
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

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-akin-bg text-2xl font-black text-akin-accent">
        P
      </div>

      <h3 className="mt-5 text-xl font-black text-akin-text">
        {hasFilters
          ? 'No se encontraron plantillas'
          : 'No hay plantillas registradas'}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-akin-muted">
        {hasFilters
          ? 'Ajusta la búsqueda, el tipo o el estado para ver más resultados.'
          : 'Crea plantillas para responder más rápido a clientes y leads sin improvisar mensajes comerciales.'}
      </p>

      {!hasFilters && (
        <Link
          href={route('plantillas-mensaje.create')}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-akin-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-akin-accentSoft"
        >
          Crear primera plantilla
        </Link>
      )}
    </div>
  );
}

function obtenerLecturaComercial(plantilla) {
  const contenido = String(plantilla.contenido_pla || '');
  const tipo = normalizarTexto(plantilla.tipo_pla);

  if (!plantilla.activo_pla) {
    return 'Plantilla inactiva. Puede conservarse como historial, pero no debería usarse en respuestas actuales.';
  }

  if (contenido.length === 0) {
    return 'Plantilla activa sin contenido. Debe completarse antes de usarse comercialmente.';
  }

  if (contenido.length > 500) {
    return 'Mensaje extenso. Conviene revisar si puede resumirse para mejorar respuesta rápida.';
  }

  if (tipo.includes('seguimiento')) {
    return 'Útil para mantener contacto con leads o clientes durante el proceso comercial.';
  }

  if (tipo.includes('promocion') || tipo.includes('oferta')) {
    return 'Útil para campañas, descuentos o comunicación de productos destacados.';
  }

  if (tipo.includes('bienvenida') || tipo.includes('contacto')) {
    return 'Útil para primer contacto y apertura de conversación comercial.';
  }

  return 'Plantilla disponible para estandarizar respuestas y mejorar velocidad de atención.';
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
  return String(nombre || 'P').trim().charAt(0).toUpperCase();
}