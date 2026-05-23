import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ productos = [] }) {
  const listaProductos = Array.isArray(productos)
    ? productos
    : productos?.data || [];

  const totalProductos = listaProductos.length;

  const productosActivos = listaProductos.filter((producto) =>
    normalizarEstado(producto.estado_pro) === 'activo'
  ).length;

  const productosInactivos = listaProductos.filter((producto) =>
    normalizarEstado(producto.estado_pro) === 'inactivo'
  ).length;

  const productosAgotados = listaProductos.filter((producto) =>
    normalizarEstado(producto.estado_pro) === 'agotado'
  ).length;

  return (
    <DashboardLayout>
      <Head title="Productos" />

      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-3xl border border-akin-border bg-akin-surface p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-akin-accent">
              Catálogo comercial
            </p>

            <h1 className="mt-2 text-3xl font-black text-akin-text">
              Productos
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-akin-muted">
              Administra las prendas disponibles para la venta, su categoría,
              estado comercial y datos principales del catálogo AKINOMASS.
            </p>
          </div>

          <Link
            href={route('productos.create')}
            className="inline-flex items-center justify-center rounded-2xl bg-akin-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-akin-accentSoft focus:outline-none focus:ring-4 focus:ring-akin-accent/20"
          >
            Nuevo producto
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total productos"
            value={totalProductos}
            description="Productos registrados"
          />

          <MetricCard
            title="Activos"
            value={productosActivos}
            description="Disponibles comercialmente"
          />

          <MetricCard
            title="Inactivos"
            value={productosInactivos}
            description="Fuera de publicación"
          />

          <MetricCard
            title="Agotados"
            value={productosAgotados}
            description="Sin disponibilidad"
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-akin-border bg-akin-surface shadow-sm dark:shadow-black/20">
          <div className="flex flex-col gap-3 border-b border-akin-border px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black text-akin-text">
                Listado de productos
              </h2>

              <p className="mt-1 text-sm text-akin-muted">
                Revisa nombre, categoría, estado y acciones disponibles.
              </p>
            </div>

            <span className="rounded-full bg-akin-bg px-4 py-2 text-xs font-bold text-akin-primary">
              {totalProductos} registros
            </span>
          </div>

          {listaProductos.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-akin-border">
                <thead className="bg-akin-bg">
                  <tr>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead align="right">Acciones</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-akin-border bg-akin-surface">
                  {listaProductos.map((producto) => (
                    <tr
                      key={producto.cod_producto}
                      className="transition hover:bg-akin-bg/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-akin-bg text-sm font-black text-akin-accent">
                            {obtenerInicial(producto.nombre_pro)}
                          </div>

                          <div>
                            <p className="font-bold text-akin-text">
                              {producto.nombre_pro || 'Sin nombre'}
                            </p>

                            <p className="text-xs text-akin-muted">
                              Código: {producto.cod_producto || 'N/D'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-full bg-akin-bg px-3 py-1 text-xs font-bold text-akin-primary">
                          {producto.categoria?.nombre_cat || 'Sin categoría'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge estado={producto.estado_pro} />
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href={route('productos.edit', producto.cod_producto)}
                          className="inline-flex items-center justify-center rounded-xl border border-akin-accent/30 px-4 py-2 text-xs font-bold text-akin-accent transition hover:bg-akin-accent hover:text-white"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, description }) {
  return (
    <div className="rounded-3xl border border-akin-border bg-akin-surface p-5 shadow-sm dark:shadow-black/20">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-akin-accent">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black text-akin-text">
        {value}
      </p>

      <p className="mt-1 text-sm text-akin-muted">
        {description}
      </p>
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

function StatusBadge({ estado }) {
  const estadoNormalizado = normalizarEstado(estado);

  const estilos = {
    activo: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30',
    inactivo: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/30',
    agotado: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30',
    descontinuado: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/30',
    pendiente: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 border-orange-200',
  };

  const clase =
    estilos[estadoNormalizado] ||
    'bg-blue-100 text-blue-700 border-blue-200';

  return (
    <span
      className={[
        'inline-flex rounded-full border px-3 py-1 text-xs font-black capitalize',
        clase,
      ].join(' ')}
    >
      {estado || 'Sin estado'}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-akin-bg text-2xl font-black text-akin-accent">
        P
      </div>

      <h3 className="mt-5 text-xl font-black text-akin-text">
        No hay productos registrados
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-akin-muted">
        Cuando registres productos, aparecerán aquí con su categoría,
        estado y acciones administrativas.
      </p>

      <Link
        href={route('productos.create')}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-akin-accent px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-akin-accentSoft"
      >
        Crear primer producto
      </Link>
    </div>
  );
}

function normalizarEstado(estado) {
  return String(estado || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function obtenerInicial(nombre) {
  return String(nombre || 'P')
    .trim()
    .charAt(0)
    .toUpperCase();
}