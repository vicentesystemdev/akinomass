import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ plantillas, plantillasActivas }) {
  return (
    <AuthenticatedLayout>
      <Head title="Plantillas de mensaje" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Plantillas de mensaje</h1>
          <Link href={route('plantillas-mensaje.create')}>Nueva plantilla</Link>
        </div>

        <div>
          <h2 className="font-semibold">Plantillas activas sugeridas</h2>
          <ul className="list-disc pl-6 mt-2">
            {plantillasActivas.map((plantilla) => (
              <li key={`activa-${plantilla.cod_plantilla_mensaje}`}>
                <strong>{plantilla.nombre_pla}</strong> ({plantilla.tipo_pla})
              </li>
            ))}
          </ul>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Nombre</th><th>Tipo</th><th>Activo</th><th>Contenido</th><th></th>
            </tr>
          </thead>
          <tbody>
            {plantillas.map((plantilla) => (
              <tr key={plantilla.cod_plantilla_mensaje}>
                <td>{plantilla.nombre_pla}</td>
                <td>{plantilla.tipo_pla}</td>
                <td>{plantilla.activo_pla ? 'Sí' : 'No'}</td>
                <td><pre className="whitespace-pre-wrap">{plantilla.contenido_pla}</pre></td>
                <td>
                  <Link href={route('plantillas-mensaje.edit', plantilla.cod_plantilla_mensaje)}>Editar</Link>{' '}
                  <button onClick={() => router.patch(route('plantillas-mensaje.toggle', plantilla.cod_plantilla_mensaje))}>
                    {plantilla.activo_pla ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
