import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ categorias }) {
  return (
    <AuthenticatedLayout header="Categorías de Producto">
      <Head title="Categorías de producto" />
      <div className="p-6">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">Categorías de producto</h1>
          <Link href={route('categorias-producto.create')} className="rounded bg-blue-600 px-3 py-2 text-white">Nueva categoría</Link>
        </div>
        <table className="w-full border">
          <thead><tr><th>Nombre</th><th>Activa</th><th></th></tr></thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.cod_categoria_producto}>
                <td>{categoria.nombre_cat}</td>
                <td>{categoria.activo_cat ? 'Sí' : 'No'}</td>
                <td><Link href={route('categorias-producto.edit', categoria.cod_categoria_producto)}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}

