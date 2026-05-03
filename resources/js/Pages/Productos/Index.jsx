import { Head, Link } from '@inertiajs/react';

export default function Index({ productos }) {
  return (
    <>
      <Head title="Productos" />
      <div className="p-6">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">Productos</h1>
          <Link href={route('productos.create')} className="rounded bg-blue-600 px-3 py-2 text-white">Nuevo producto</Link>
        </div>
        <table className="w-full border">
          <thead><tr><th>Nombre</th><th>Categoría</th><th>Estado</th><th></th></tr></thead>
          <tbody>{productos.map((producto) => (<tr key={producto.cod_producto}><td>{producto.nombre_pro}</td><td>{producto.categoria?.nombre_cat}</td><td>{producto.estado_pro}</td><td><Link href={route('productos.edit', producto.cod_producto)}>Editar</Link></td></tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
