import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ plantilla, tipos }) {
  const form = useForm({ ...plantilla });

  return (
    <AuthenticatedLayout>
      <Head title="Editar plantilla" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Editar plantilla</h1>
        <form onSubmit={(e) => { e.preventDefault(); form.put(route('plantillas-mensaje.update', plantilla.cod_plantilla_mensaje)); }} className="space-y-3">
          <input placeholder="Nombre" value={form.data.nombre_pla} onChange={(e) => form.setData('nombre_pla', e.target.value)} className="w-full" />
          <select value={form.data.tipo_pla} onChange={(e) => form.setData('tipo_pla', e.target.value)} className="w-full">
            {tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
          </select>
          <textarea placeholder="Contenido" value={form.data.contenido_pla} onChange={(e) => form.setData('contenido_pla', e.target.value)} className="w-full" rows="8" />
          <label>
            <input type="checkbox" checked={!!form.data.activo_pla} onChange={(e) => form.setData('activo_pla', e.target.checked)} /> Activa
          </label>
          <button type="submit">Actualizar</button>
        </form>
        <Link href={route('plantillas-mensaje.index')}>Volver</Link>
      </div>
    </AuthenticatedLayout>
  );
}
