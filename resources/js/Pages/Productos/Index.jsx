import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
    <AuthenticatedLayout>
      <Head title="Productos" />

      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
              Catálogo comercial
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#2B221E]">
              Productos
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#2B221E]/65">
              Administra las prendas disponibles para la venta, su categoría,
              estado comercial y datos principales del catálogo AKINOMASS.
            </p>
          </div>

          <Link
            href={route('productos.create')}
            className="inline-flex items-center justify-center rounded-2xl bg-[#D77A61] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c96f58] focus:outline-none focus:ring-4 focus:ring-[#D77A61]/20"
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

        <section className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#eadfd6] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black text-[#2B221E]">
                Listado de productos
              </h2>

              <p className="mt-1 text-sm text-[#2B221E]/60">
                Revisa nombre, categoría, estado y acciones disponibles.
              </p>
            </div>

            <span className="rounded-full bg-[#FDF6F0] px-4 py-2 text-xs font-bold text-[#3C473A]">
              {totalProductos} registros
            </span>
          </div>

          {listaProductos.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#eadfd6]">
                <thead className="bg-[#FDF6F0]">
                  <tr>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead align="right">Acciones</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eadfd6] bg-white">
                  {listaProductos.map((producto) => (
                    <tr
                      key={producto.cod_producto}
                      className="transition hover:bg-[#FDF6F0]/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF6F0] text-sm font-black text-[#D77A61]">
                            {obtenerInicial(producto.nombre_pro)}
                          </div>

                          <div>
                            <p className="font-bold text-[#2B221E]">
                              {producto.nombre_pro || 'Sin nombre'}
                            </p>

                            <p className="text-xs text-[#2B221E]/50">
                              Código: {producto.cod_producto || 'N/D'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-full bg-[#FDF6F0] px-3 py-1 text-xs font-bold text-[#3C473A]">
                          {producto.categoria?.nombre_cat || 'Sin categoría'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge estado={producto.estado_pro} />
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href={route('productos.edit', producto.cod_producto)}
                          className="inline-flex items-center justify-center rounded-xl border border-[#D77A61]/30 px-4 py-2 text-xs font-bold text-[#D77A61] transition hover:bg-[#D77A61] hover:text-white"
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
    </AuthenticatedLayout>
  );
}

function MetricCard({ title, value, description }) {
  return (
    <div className="rounded-3xl border border-[#eadfd6] bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D77A61]">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black text-[#2B221E]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#2B221E]/60">
        {description}
      </p>
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

function StatusBadge({ estado }) {
  const estadoNormalizado = normalizarEstado(estado);

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
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FDF6F0] text-2xl font-black text-[#D77A61]">
        P
      </div>

      <h3 className="mt-5 text-xl font-black text-[#2B221E]">
        No hay productos registrados
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#2B221E]/60">
        Cuando registres productos, aparecerán aquí con su categoría,
        estado y acciones administrativas.
      </p>

      <Link
        href={route('productos.create')}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#D77A61] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c96f58]"
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