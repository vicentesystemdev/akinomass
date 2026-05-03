import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ leads, estados }) {
  return <AuthenticatedLayout><Head title="Leads" /><div className="p-6"><div className="mb-4 flex justify-between"><h1 className="text-xl font-bold">Leads</h1><Link href={route('leads.create')}>Nuevo lead</Link></div>
  <table className="w-full text-sm"><thead><tr><th>Nombre</th><th>Estado</th><th>Canal</th><th>Flujo</th><th>Resp.</th><th></th></tr></thead><tbody>{leads.map((lead)=><tr key={lead.cod_lead}><td>{lead.nombre_lea}</td><td><select value={lead.estado_lea} onChange={(e)=>router.patch(route('leads.update-estado', lead.cod_lead), {estado_lea: e.target.value})}>{estados.map((estado)=><option key={estado}>{estado}</option>)}</select></td><td>{lead.canal_venta?.nombre_can}</td><td>{lead.tipo_flujo_comercial?.nombre_tip}</td><td>{lead.usuario_responsable?.name}</td><td><Link href={route('leads.edit', lead.cod_lead)}>Editar</Link> <button onClick={()=>router.post(route('leads.convertir', lead.cod_lead))}>Convertir</button></td></tr>)}</tbody></table></div></AuthenticatedLayout>;
}
