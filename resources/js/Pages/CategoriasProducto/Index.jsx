import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ categorias = [] }) {
  const listaCategorias = Array.isArray(categorias)
    ? categorias
    : categorias?.data || [];

  const totalCategorias = listaCategorias.length;

  const categoriasActivas = listaCategorias.filter(
    (categoria) => Boolean(categoria.activo_cat),
  ).length;

  const categoriasInactivas = totalCategorias - categoriasActivas;

  return (
    <AuthenticatedLayout>
      <Head title="Categorías de producto" />

      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-3xl border border-[#eadfd6] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D77A61]">
              Organización del catálogo
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#2B221E]">
              Categorías de producto
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#2B221E]/65">
              Administra las categorías comerciales que ordenan el catálogo
              de prendas. Una buena categorización mejora la búsqueda,
              presentación de productos y control del inventario.
            </p>
          </div>

          <Link
            href={route('categorias-producto.create')}
            className="inline-flex items-center justify-center rounded-2xl bg-[#D77A61] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c96f58] focus:outline-none focus:ring-4 focus:ring-[#D77A61]/20"
          >
            Nueva categoría
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total categorías"
            value={totalCategorias}
            description="Clasificaciones registradas"
          />

          <MetricCard
            title="Activas"
            value={categoriasActivas}
            description="Disponibles para productos"
          />

          <MetricCard
            title="Inactivas"
            value={categoriasInactivas}
            description="Fuera de uso comercial"
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#eadfd6] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#eadfd6] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black text-[#2B221E]">
                Listado de categorías
              </h2>

              <p className="mt-1 text-sm text-[#2B221E]/60">
                Revisa qué categorías están activas para organizar productos.
              </p>
            </div>

            <span className="rounded-full bg-[#FDF6F0] px-4 py-2 text-xs font-bold text-[#3C473A]">
              {totalCategorias} registros
            </span>
          </div>

          {listaCategorias.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#eadfd6]">
                <thead className="bg-[#FDF6F0]">
                  <tr>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado comercial</TableHead>
                    <TableHead>Uso recomendado</TableHead>
                    <TableHead align="right">Acciones</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eadfd6] bg-white">
                  {listaCategorias.map((categoria) => (
                    <tr
                      key={categoria.cod_categoria_producto}
                      className="transition hover:bg-[#FDF6F0]/70"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDF6F0] text-sm font-black text-[#D77A61]">
                            {obtenerInicial(categoria.nombre_cat)}
                          </div>

                          <div>
                            <p className="font-bold text-[#2B221E]">
                              {categoria.nombre_cat || 'Sin nombre'}
                            </p>

                            <p className="text-xs text-[#2B221E]/50">
                              Código:{' '}
                              {categoria.cod_categoria_producto ||
                                'N/D'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge active={categoria.activo_cat} />
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-md text-sm leading-6 text-[#2B221E]/65">
                          {categoria.activo_cat
                            ? 'Puede utilizarse para clasificar productos visibles dentro del catálogo.'
                            : 'No debería asignarse a nuevos productos hasta ser reactivada.'}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href={route(
                            'categorias-producto.edit',
                            categoria.cod_categoria_producto,
                          )}
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

function StatusBadge({ active }) {
  if (active) {
    return (
      <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-black text-green-700">
        Activa
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
      Inactiva
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FDF6F0] text-2xl font-black text-[#D77A61]">
        C
      </div>

      <h3 className="mt-5 text-xl font-black text-[#2B221E]">
        No hay categorías registradas
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#2B221E]/60">
        Crea categorías para ordenar productos por tipo, línea comercial,
        temporada o estilo de prenda.
      </p>

      <Link
        href={route('categorias-producto.create')}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#D77A61] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#c96f58]"
      >
        Crear primera categoría
      </Link>
    </div>
  );
}

function obtenerInicial(nombre) {
  return String(nombre || 'C')
    .trim()
    .charAt(0)
    .toUpperCase();
}