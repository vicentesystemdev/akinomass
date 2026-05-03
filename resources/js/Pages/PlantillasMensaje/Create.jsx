import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ tipos }) {
  const form = useForm({ nombre_pla: '', tipo_pla: tipos[0] ?? '', contenido_pla: '', activo_pla: true });

  return (
    <AuthenticatedLayout>
      <Head title="Crear plantilla" />
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Crear plantilla</h1>
        <form onSubmit={(e) => { e.preventDefault(); form.post(route('plantillas-mensaje.store')); }} className="space-y-3">
          <input placeholder="Nombre" value={form.data.nombre_pla} onChange={(e) => form.setData('nombre_pla', e.target.value)} className="w-full" />
          <select value={form.data.tipo_pla} onChange={(e) => form.setData('tipo_pla', e.target.value)} className="w-full">
            {tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
          </select>
          <textarea placeholder="Contenido" value={form.data.contenido_pla} onChange={(e) => form.setData('contenido_pla', e.target.value)} className="w-full" rows="8" />
          <button type="submit">Guardar</button>
        </form>
        <Link href={route('plantillas-mensaje.index')}>Volver</Link>
      </div>
    </AuthenticatedLayout>
  );
}
