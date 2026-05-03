import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ clientes }) {
  return (
    <AuthenticatedLayout>
      <Head title="Clientes" />
      <div className="p-6">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">Clientes</h1>
          <Link href={route('clientes.create')}>Nuevo cliente</Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead><tr><th>Nombre</th><th>Estado</th><th>Canal</th><th>Flujo</th><th></th></tr></thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.cod_cliente}>
                <td>{cliente.nombre_cli}</td><td>{cliente.estado_cli}</td>
                <td>{cliente.canal_venta?.nombre_can}</td><td>{cliente.tipo_flujo_comercial?.nombre_tip}</td>
                <td><Link href={route('clientes.edit', cliente.cod_cliente)}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
