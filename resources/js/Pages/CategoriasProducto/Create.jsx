import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({ nombre_cat: '', descripcion_cat: '', activo_cat: true });
  const submit = (e) => { e.preventDefault(); post(route('categorias-producto.store')); };
  return (<><Head title="Nueva categoría" /><div className="p-6"><h1 className="mb-4 text-xl font-bold">Nueva categoría</h1><form onSubmit={submit} className="space-y-3"><input className="w-full" placeholder="Nombre" value={data.nombre_cat} onChange={(e)=>setData('nombre_cat', e.target.value)} />{errors.nombre_cat && <div>{errors.nombre_cat}</div>}<textarea className="w-full" placeholder="Descripción" value={data.descripcion_cat} onChange={(e)=>setData('descripcion_cat', e.target.value)} /><label><input type="checkbox" checked={data.activo_cat} onChange={(e)=>setData('activo_cat', e.target.checked)} /> Activa</label><div className="space-x-2"><button disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Guardar</button><Link href={route('categorias-producto.index')}>Volver</Link></div></form></div></>);
}
