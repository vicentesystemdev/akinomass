import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ sesiones = [] }) {
  return (
    <AuthenticatedLayout header="Live Sales">
      <Head title="Sesiones Live" />
      <div className="p-6">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold">Sesiones Live</h1>
          <Link href={route('live-sales.create')} className="rounded bg-blue-600 px-3 py-2 text-white">Nueva sesión</Link>
        </div>
        <ul className="space-y-2">
          {sesiones.map((s) => (
            <li key={s.cod_sesion_live} className="p-4 border rounded hover:bg-gray-50">
              <Link href={route('live-sales.show', s.cod_sesion_live)} className="flex justify-between items-center">
                <span className="font-bold">{s.titulo_ses}</span>
                <span className="text-sm text-gray-500 uppercase">{s.estado_ses}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AuthenticatedLayout>
  );
}

