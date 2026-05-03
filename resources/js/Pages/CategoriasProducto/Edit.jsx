import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ categoria }) {
  const { data, setData, put, processing, errors } = useForm({ nombre_cat: categoria.nombre_cat ?? '', descripcion_cat: categoria.descripcion_cat ?? '', activo_cat: Boolean(categoria.activo_cat) });
  const submit = (e) => { e.preventDefault(); put(route('categorias-producto.update', categoria.cod_categoria_producto)); };
  return (<><Head title="Editar categoría" /><div className="p-6"><h1 className="mb-4 text-xl font-bold">Editar categoría</h1><form onSubmit={submit} className="space-y-3"><input className="w-full" value={data.nombre_cat} onChange={(e)=>setData('nombre_cat', e.target.value)} />{errors.nombre_cat && <div>{errors.nombre_cat}</div>}<textarea className="w-full" value={data.descripcion_cat} onChange={(e)=>setData('descripcion_cat', e.target.value)} /><label><input type="checkbox" checked={data.activo_cat} onChange={(e)=>setData('activo_cat', e.target.checked)} /> Activa</label><div className="space-x-2"><button disabled={processing} className="rounded bg-blue-600 px-3 py-2 text-white">Actualizar</button><Link href={route('categorias-producto.index')}>Volver</Link></div></form></div></>);
}
